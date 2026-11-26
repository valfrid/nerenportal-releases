#!/usr/bin/env node
// Resolve the next patch version and exact private-source commit.
// VERIFY is an optional dry-run. PUBLISH pins exactly one source commit and
// then performs tests, release-build checks, signing and signature verification
// inside the SAME workflow run, before publishing any GitHub Release.
// No prior workflow run is required; this script never publishes or deploys.
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
export function nextReviewedRelease(baseVersion,registry){
 const base=SEMVER.exec(baseVersion||'');
 if(!base||base[1]!=='1'||Number(base[2])<1)throw Error('Unsupported release baseline');
 if(registry?.format!==1||registry.baseline?.revision!==2||!Array.isArray(registry.steps)||registry.targetRevision!==2+registry.steps.length)
   throw Error('Invalid reviewed source schema registry');
 let priorMinor=1;
 for(const [i,step] of registry.steps.entries()){
   const m=SEMVER.exec(step.introducedIn||'');
   if(step.revision!==i+3||!m||m[1]!=='1'||m[3]!=='0'||Number(m[2])<=priorMinor||!(/^[a-f0-9]{64}$/.test(step.sha256||'')))
     throw Error('Invalid schema migration release order');
   priorMinor=Number(m[2]);
 }
 const future=registry.steps.filter(step=>Number(step.introducedIn.split('.')[1])>Number(base[2]));
 if(future.length){
   if(future.length!==1||Number(future[0].introducedIn.split('.')[1])!==Number(base[2])+1)
     throw Error('Schema revision requires one reviewed next minor release');
   return future[0].introducedIn;
 }
 return nextPatch(baseVersion);
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
 const registryFile=ghJson(['api','repos/valfrid/nerenportal/contents/schema/upgrade-registry.json?ref='+sourceSha],process.env.PRIVATE_SOURCE_TOKEN);
 if(registryFile?.encoding!=='base64'||typeof registryFile.content!=='string'||registryFile.content.length>200000)throw Error('Cannot read frozen source schema registry');
 const registry=JSON.parse(Buffer.from(registryFile.content,'base64').toString('utf8'));
 const nextVersion=nextReviewedRelease(baseVersion,registry);
 if(requestedVersion&&requestedVersion!==nextVersion)
   throw Error('Version override does not equal next reviewed release: '+nextVersion);
 if(requestedSha&&requestedSha!==sourceSha)
   throw Error('Source override does not equal private main HEAD; re-VERIFY');
 // VERIFY and PUBLISH now resolve the same immutable source snapshot.
 // PUBLISH uses the exact same job's complete offline test/build/sign/audit
 // stages before GitHub release creation; prior VERIFY is optional only.
 out({version:nextVersion,sourceSha,baseVersion});
 console.log(operation==='PUBLISH'?
   'One-click PUBLISH: frozen source '+sourceSha+' / '+nextVersion+
   '; local tests, signature verification and artifact audit must pass before publication.':
   'Dry-run VERIFY: frozen source '+sourceSha+' / '+nextVersion);

}
if(process.argv[1]&&import.meta.url.endsWith('/'+path.basename(process.argv[1]))){
 try{main();}catch(error){console.error('::error::'+String(error?.message||error));process.exitCode=1;}
}
