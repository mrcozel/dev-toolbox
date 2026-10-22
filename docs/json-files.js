(function(root){
 'use strict';
 const MAX_BYTES=5*1024*1024;
 async function readJSONFile(file,indent=2){
  if(!file||!file.name||!file.name.toLowerCase().endsWith('.json'))throw Error('Choose a file with a .json extension.');
  if(file.size>MAX_BYTES)throw Error('This file is too large. Choose a JSON file up to 5 MB.');
  if(file.size===0)throw Error('This file is empty. Choose a JSON file with content.');
  let text;
  try{text=await file.text();}catch{throw Error('Could not read this file. Try selecting it again.');}
  text=text.replace(/^\uFEFF/,'');
  if(!text.trim())throw Error('This file is empty. Choose a JSON file with content.');
  let value;
  try{value=JSON.parse(text);}catch(e){throw Error('This file contains invalid JSON. '+e.message);}
  return {name:file.name,text,formatted:JSON.stringify(value,null,Number(indent))};
 }
 // Only the latest read may update the current editor. Edits cancel pending reads.
 function createImporter({onSuccess,onStatus,canApply=()=>true}){
  let revision=0;
  return {
   cancel(){revision++;},
   async importFiles(files,indent=2){
    const current=++revision;
    const active=()=>current===revision&&canApply();
    if(files.length!==1){if(active())onStatus('Choose one JSON file at a time.',true);return;}
    onStatus('Reading your file locally…',false);
    try{const result=await readJSONFile(files[0],indent);if(!active())return;onSuccess(result);onStatus('Imported '+result.name+' · valid JSON · formatted locally',false);}
    catch(e){if(active())onStatus(e.message,true);}
   }
  };
 }
 root.JsonFiles={MAX_BYTES,readJSONFile,createImporter};
})(typeof module==='object'?module.exports:globalThis);
