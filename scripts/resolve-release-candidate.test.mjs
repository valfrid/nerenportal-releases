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
