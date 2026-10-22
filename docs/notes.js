(function(root){
'use strict';
const KEY='dev-toolbox-scratchpad-v2',LEGACY_KEY='dev-toolbox-scratchpad-v1';
const blank=()=>({version:2,activeId:'note-1',tabs:[{id:'note-1',title:'Note 1',text:''}]});
function valid(d){return d&&d.version===2&&Array.isArray(d.tabs)&&d.tabs.length>0&&d.tabs.every(t=>t&&typeof t.id==='string'&&typeof t.title==='string'&&typeof t.text==='string')&&new Set(d.tabs.map(t=>t.id)).size===d.tabs.length&&d.tabs.some(t=>t.id===d.activeId);}
function createStore(getStorage){
 let doc=blank(),saved=false,error='',lastRaw=null,corrupt=false;
 try{const disk=getStorage();lastRaw=disk.getItem(KEY);if(lastRaw!==null){const parsed=JSON.parse(lastRaw);if(!valid(parsed))throw Error('invalid');doc=parsed;}else{const legacy=disk.getItem(LEGACY_KEY);if(legacy!==null)doc.tabs[0].text=legacy;disk.setItem(KEY,JSON.stringify(doc));lastRaw=JSON.stringify(doc);}saved=true;}
 catch{if(lastRaw!==null){corrupt=true;error='Saved notes could not be opened. Existing browser data has been preserved.';}else error='Browser storage is unavailable. Download a backup before leaving.';}
 const snapshot=()=>({...JSON.parse(JSON.stringify(doc)),saved,error});
 function persist(next,destructive=false){
  try{if(corrupt)throw Error('corrupt');const disk=getStorage();if(disk.getItem(KEY)!==lastRaw)throw Error('conflict');const raw=JSON.stringify(next);disk.setItem(KEY,raw);lastRaw=raw;doc=next;saved=true;error='';}
  catch(e){if(!destructive)doc=next;saved=false;error=e.message==='conflict'?'Notes changed in another browser tab. Download this copy, then reload before editing further.':corrupt?'Saved notes could not be opened. Existing browser data has been preserved.':'Not saved · browser storage is unavailable. Download a backup before leaving.';}
  return snapshot();
 }
 function changeActive(fn,destructive=false){return persist({...doc,tabs:doc.tabs.map(t=>t.id===doc.activeId?fn({...t}):t)},destructive);}
 return {read:snapshot,
  write(text){return changeActive(t=>({...t,text}));},
  rename(title){title=title.trim();return title?changeActive(t=>({...t,title})):snapshot();},
  select(id){return doc.tabs.some(t=>t.id===id)?persist({...doc,activeId:id}):snapshot();},
  add(){let n=1;while(doc.tabs.some(t=>t.id==='note-'+n||t.title==='Note '+n))n++;const tab={id:'note-'+n,title:'Note '+n,text:''};return persist({...doc,activeId:tab.id,tabs:[...doc.tabs,tab]});},
  clear(){return changeActive(t=>({...t,text:''}),true);},
  close(){const i=doc.tabs.findIndex(t=>t.id===doc.activeId),tabs=doc.tabs.filter(t=>t.id!==doc.activeId);return persist(tabs.length?{...doc,tabs,activeId:tabs[Math.min(i,tabs.length-1)].id}:blank(),true);}
 };
}
root.Notes={KEY,LEGACY_KEY,createStore};
})(typeof module==='object'?module.exports:globalThis);
