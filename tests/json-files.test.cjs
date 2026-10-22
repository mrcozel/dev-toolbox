const {test}=require('node:test');
const assert=require('node:assert/strict');
const {JsonFiles:J}=require('../docs/json-files.js');
const file=(text,name='sample.json',size=Buffer.byteLength(text))=>({name,size,text:async()=>text});
test('imports Unicode, BOM and primitive JSON, using the chosen indentation',async()=>{
 const result=await J.readJSONFile(file('\uFEFF{"name":"世界 🌍","items":[1,true,null]}','SAMPLE.JSON'),4);
 assert.equal(result.name,'SAMPLE.JSON');assert.ok(result.formatted.includes('\n    "name"'));assert.equal(JSON.parse(result.formatted).name,'世界 🌍');assert.ok(!result.text.startsWith('\uFEFF'));
 assert.equal((await J.readJSONFile(file('null'))).formatted,'null');assert.equal((await J.readJSONFile(file('42'))).formatted,'42');
});
test('rejects unsupported, empty, whitespace, invalid, oversized and unreadable files',async()=>{
 await assert.rejects(J.readJSONFile(file('{}','data.txt')),/extension/);
 await assert.rejects(J.readJSONFile(file('')),/empty/);
 await assert.rejects(J.readJSONFile(file(' \n ')),/empty/);
 await assert.rejects(J.readJSONFile(file('{oops}')),/invalid JSON/);
 let read=false;await assert.rejects(J.readJSONFile({name:'big.json',size:J.MAX_BYTES+1,text:async()=>{read=true;return '{}';}}),/too large/);assert.equal(read,false);
 await assert.rejects(J.readJSONFile({name:'file.json',size:2,text:async()=>{throw Error('disk');}}),/Could not read/);
 assert.equal((await J.readJSONFile(file('{}','limit.json',J.MAX_BYTES))).formatted,'{}');
});
test('failure preserves prior content; multiple files explain the restriction',async()=>{
 let current='existing content',lastStatus;const importer=J.createImporter({onSuccess:r=>current=r.text,onStatus:(text,error)=>lastStatus={text,error}});
 await importer.importFiles([file('{broken}')]);assert.equal(current,'existing content');assert.equal(lastStatus.error,true);
 await importer.importFiles([file('{}'),file('[]')]);assert.match(lastStatus.text,/one JSON file/);assert.equal(current,'existing content');
 await importer.importFiles([file('{}')]);assert.equal(current,'{}');assert.equal(lastStatus.error,false);
});
test('late reads cannot overwrite newer imports or user edits',async()=>{
 let resolveOld,current;const importer=J.createImporter({onSuccess:r=>current=r.text,onStatus:()=>{}});
 const old=importer.importFiles([{name:'old.json',size:2,text:()=>new Promise(resolve=>resolveOld=resolve)}]);
 await importer.importFiles([file('[2]')]);resolveOld('{}');await old;assert.equal(current,'[2]');
 let resolvePending;const pending=importer.importFiles([{name:'pending.json',size:2,text:()=>new Promise(resolve=>resolvePending=resolve)}]);importer.cancel();current='user edit';resolvePending('{}');await pending;assert.equal(current,'user edit');
});
test('leaving the editor prevents a pending import applying to a detached view',async()=>{
 let finish,applied=false,attached=true;const importer=J.createImporter({onSuccess:()=>applied=true,onStatus:()=>{},canApply:()=>attached});
 const pending=importer.importFiles([{name:'wait.json',size:2,text:()=>new Promise(resolve=>finish=resolve)}]);attached=false;finish('{}');await pending;assert.equal(applied,false);
});
