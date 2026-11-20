import test from 'node:test';
import assert from 'node:assert/strict';
import {nextPatch,validateCandidate} from './resolve-release-candidate.mjs';
const sha='a'.repeat(40);
test('next stable patch release increments only patch',()=>{
 assert.equal(nextPatch('v1.1.1'),'v1.1.2');
 assert.equal(nextPatch('v12.25.9'),'v12.25.10');
 assert.throws(()=>nextPatch('v1.1.1-beta'),/SemVer/);
 assert.throws(()=>nextPatch('v1.01.1'),/SemVer/);
});
test('PUBLISH demands exact prior VERIFY version, SHA, base and workflow run',()=>{
 const input={version:'v1.1.2',sourceSha:sha,baseVersion:'v1.1.1',verifyRunId:501};
 const expected={nextVersion:'v1.1.2',baseVersion:'v1.1.1',sourceSha:sha,verifyRunId:501};
 assert.deepEqual(validateCandidate(input,expected),input);
 for(const changed of [{version:'v1.1.3'},{sourceSha:'b'.repeat(40)},
   {baseVersion:'v1.1.0'},{verifyRunId:502},{unexpected:true}]){
   assert.throws(()=>validateCandidate({...input,...changed},expected),/provenance/);
 }
});


import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';

function runResolver(operation,{requestedVersion='',requestedSha='',currentSha='a'.repeat(40)}={}) {
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'portal-release-one-click-'));
 try {
   const ghStub=path.join(dir,'gh');
   const stub=[
     '#!/usr/bin/env node',
     'const args=process.argv.slice(2);',
     'if(args[0]!=="api")process.exit(51);',
     'if(args[1]==="repos/valfrid/nerenportal-releases/releases/latest")',
     ' console.log(JSON.stringify({tag_name:"v1.1.4",draft:false,prerelease:false}));',
     'else if(args[1]==="repos/valfrid/nerenportal/commits/main")',
     ' console.log(JSON.stringify({sha:process.env.MOCK_SOURCE_SHA}));',
     'else if(args[1]==="repos/valfrid/nerenportal-releases/releases/tags/v1.1.4")',
     ' console.log(JSON.stringify({tag_name:"v1.1.4",draft:false,prerelease:false}));',
     'else {console.error("Unexpected request: "+args.join(" "));process.exit(51);}'
   ].join('\n')+'\n';
   fs.writeFileSync(ghStub,stub,{mode:0o755});
   const outputs=path.join(dir,'outputs');
   const result=spawnSync(process.execPath,
     [new URL('./resolve-release-candidate.mjs',import.meta.url).pathname],{
       encoding:'utf8',env:{...process.env,
         PATH:dir+path.delimiter+process.env.PATH,
         GH_TOKEN:'test-public-token',
         PRIVATE_SOURCE_TOKEN:'test-private-token',
         GITHUB_RUN_ID:'602',
         GITHUB_OUTPUT:outputs,
         GITHUB_ENV:path.join(dir,'env'),
         GITHUB_STEP_SUMMARY:path.join(dir,'summary'),
         OPERATION:operation,MOCK_SOURCE_SHA:currentSha,
         MANUAL_VERSION:requestedVersion,MANUAL_SOURCE_SHA:requestedSha
       }
     });
   return {...result,output:fs.existsSync(outputs)?fs.readFileSync(outputs,'utf8'):''};
 }finally {fs.rmSync(dir,{force:true,recursive:true});}
}
test('one-click PUBLISH derives new version and freezes exact private main SHA without a prior VERIFY',()=>{
 const result=runResolver('PUBLISH');
 assert.equal(result.status,0,result.stderr);
 assert.match(result.output,/version=v1\.1\.5/);
 assert.match(result.output,/source_sha=a{40}/);
 assert.match(result.stdout,/One-click PUBLISH: frozen source/);
});
test('optional VERIFY gives the same version/source without publishing',()=>{
 const result=runResolver('VERIFY');
 assert.equal(result.status,0,result.stderr);
 assert.match(result.output,/version=v1\.1\.5/);
 assert.match(result.output,/source_sha=a{40}/);
 assert.match(result.stdout,/Dry-run VERIFY/);
});
test('manual version/SHA cannot override automatic source or version',()=>{
 for(const input of [{requestedVersion:'v1.1.6'},{requestedSha:'b'.repeat(40)}]){
   const result=runResolver('PUBLISH',input);
   assert.notEqual(result.status,0);
   assert.equal(result.output,'');
   assert.match(result.stderr,/error/);
 }
});
test('RETRY-INSTALLER stays pinned to an existing published release',()=>{
 const result=runResolver('RETRY-INSTALLER');
 assert.equal(result.status,0,result.stderr);
 assert.match(result.output,/version=v1\.1\.4/);
 assert.match(result.output,/source_sha=\n/);
});
