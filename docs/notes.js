(function(root){
 'use strict';
 const KEY='dev-toolbox-scratchpad-v1';
 // Keep a memory copy even when browser storage is disabled or full.
 function createStore(getStorage){
  let text='',saved=false;
  try{const value=getStorage().getItem(KEY);text=value===null?'':value;saved=true;}catch{}
  return {
   read:()=>({text,saved}),
   write(value){text=value;try{getStorage().setItem(KEY,value);saved=true;}catch{saved=false;}return {text,saved};},
   clear(){try{getStorage().removeItem(KEY);text='';saved=true;}catch{saved=false;}return {text,saved};}
  };
 }
 root.Notes={KEY,createStore};
})(typeof module==='object'?module.exports:globalThis);
