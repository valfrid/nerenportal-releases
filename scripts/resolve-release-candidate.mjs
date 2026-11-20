#!/usr/bin/env node
// Resolve the next patch version and exact private-source commit.
// VERIFY records an immutable Actions artifact. PUBLISH must promote only that
// previously verified tuple; a changed main or a newer release fails closed.
// This script never publishes tags/releases or accesses Cloudflare.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';

export const SEMVER=/^v(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;
export function nextPatch(version) {
 const m=SEMVER.exec(version||'');
 if(!m)throw Error('Latest stable release is not a valid SemVer');
 const p=Number(m[3]);
 if(!Number.isSafeInteger(p)||p===Number.MAX_SAFE_INTEGER)throw Error('Version overflow');
 return 'v'+m[1]+'.'+m[2]+'.'+(p+1);
}
export function validateCandidate(candidate,{nextVersion,baseVersion,sourceSha,verifyRunId}){
 if(!candidate||Object.keys(candidate).sort().join(',')!==
   'baseVersion,sourceSha,verifyRunId,version'||
   candidate.version!==nextVersion||candidate.baseVersion!==baseVersion||
   candidate.sourceSha!==sourceSha||!(/^[a-f0-9]{40}$/.test(sourceSha))||
   !Number.isSafeInteger(candidate.verifyRunId)||candidate.verifyRunId<1||
   candidate.verifyRunId!==verifyRunId)
   throw Error('Verified candidate provenance mismatch; re-run VERIFY');
 return candidate;
}
function gh(args,token){
 const result=execFileSync('gh',args,{encoding:'utf8',timeout:30000,
   maxBuffer:2*1024*1024,env:{...process.env,GH_TOKEN:token}});
 return result.trim();
}
function ghJson(args,token){return JSON.parse(gh(args,token));}
function out(value) {
 const output=process.env.GITHUB_OUTPUT,env=process.env.GITHUB_ENV;
 if(!output||!env)throw Error('Must run inside trusted GitHub Actions');
 const lines='version='+value.version+'\nsource_sha='+(value.sourceSha||'')+'\nbase_version='+
   (value.baseVersion||'')+'\n';
 fs.appendFileSync(output,lines);
 fs.appendFileSync(env,'RELEASE_TAG='+value.version+'\nPINNED_SOURCE_INPUT='+
   (value.sourceSha||'')+'\n');
 fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,
   'Resolved **'+value.version+'** / source **'+(value.sourceSha||'published release')+
   '** (base '+(value.baseVersion||'n/a')+').\n');
}
function main() {
 const operation=process.env.OPERATION;
 if(!['VERIFY','PUBLISH','RETRY-INSTALLER'].includes(operation))throw Error('Unknown operation');
 const repo='valfrid/nerenportal-releases';
 const token=process.env.GH_TOKEN;
 if(!token||!process.env.GITHUB_RUN_ID)throw Error('Missing GitHub identity');
 const requestedVersion=process.env.MANUAL_VERSION||'';
 const requestedSha=process.env.MANUAL_SOURCE_SHA||'';
 const release=ghJson(['api','repos/'+repo+'/releases/latest'],token);
 const baseVersion=release.tag_name;
 if(!SEMVER.test(baseVersion)||release.draft||release.prerelease)throw Error('Invalid latest stable release');
 if(operation==='RETRY-INSTALLER'){
   const version=requestedVersion||baseVersion;
   if(!SEMVER.test(version))throw Error('Invalid retry tag');
   const published=ghJson(['api','repos/'+repo+'/releases/tags/'+version],token);
   if(published.draft||published.prerelease||published.tag_name!==version)
     throw Error('Retry requires published stable release');
   out({version,baseVersion});
   return;
 }
 if(!process.env.PRIVATE_SOURCE_TOKEN)throw Error('Private source reader missing');
 const sourceSha=ghJson(['api','repos/valfrid/nerenportal/commits/main'],
    process.env.PRIVATE_SOURCE_TOKEN).sha;
 if(!/^[a-f0-9]{40}$/.test(sourceSha))throw Error('Invalid source HEAD');
 const nextVersion=nextPatch(baseVersion);
 if(requestedVersion&&requestedVersion!==nextVersion)
   throw Error('Version override does not equal next patch: '+nextVersion);
 if(requestedSha&&requestedSha!==sourceSha)
   throw Error('Source override does not equal private main HEAD; re-VERIFY');
 if(operation==='VERIFY'){
   out({version:nextVersion,sourceSha,baseVersion});
   return;
 }
 // Only a completed, successful VERIFY run on public-releases/main can supply
 // a publish candidate. An arbitrary string entered by a user cannot.
 const workflow=ghJson(['api','repos/'+repo+'/actions/workflows/portal-release.yml'],token);
 const runList=ghJson(['api','repos/'+repo+'/actions/workflows/'+workflow.id+
   '/runs?event=workflow_dispatch&branch=main&per_page=100'],token);
 const checks=(runList.workflow_runs||[]).filter(r=>
   /^Family Portal (?:AUTO|v\d+\.\d+\.\d+) \/ VERIFY$/.test(r.display_title||'')&&
   r.actor?.login==='valfrid'&&r.head_branch==='main');
 if(!checks.length)throw Error('No matching VERIFY run; run VERIFY first');
 const verified=checks[0]; // latest VERIFY, even if red -> refuse older candidate
 if(verified.status!=='completed'||verified.conclusion!=='success')
   throw Error('Latest VERIFY is not green');
 if(Date.parse(verified.created_at)<=Date.parse(release.published_at))
   throw Error('No VERIFY after last published release');
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'fp-candidate-'));
 try{
   gh(['run','download',String(verified.id),'--repo',repo,
       '-n','family-portal-verified-candidate','-D',dir],token);
   const raw=fs.readFileSync(path.join(dir,'candidate.json'),'utf8');
   if(raw.length>1024)throw Error('Candidate too large');
   validateCandidate(JSON.parse(raw),{nextVersion,baseVersion,sourceSha,
      verifyRunId:verified.id});
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
 out({version:nextVersion,sourceSha,baseVersion});
 console.log('Promoting reviewed VERIFY run '+verified.id+
   ' / '+nextVersion+' / '+sourceSha);
}
if(process.argv[1]&&import.meta.url.endsWith('/'+path.basename(process.argv[1]))){
 try{main();}catch(error){console.error('::error::'+String(error?.message||error));process.exitCode=1;}
}
