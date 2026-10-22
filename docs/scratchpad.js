'use strict';
(function(){
 const panel=document.querySelector('#scratchpad'),toggle=document.querySelector('#notes-toggle'),editor=document.querySelector('#note-editor'),preview=document.querySelector('#note-preview'),status=document.querySelector('#note-status'),confirmDialog=document.querySelector('#clear-note-dialog');
 const store=Notes.createStore(()=>localStorage),mobile=matchMedia('(max-width:760px)');let open=false,mode='edit';
 editor.value=store.read().text;
 function showStatus(result){status.textContent=result.saved?'Saved in this browser':'Not saved · browser storage is unavailable. Download a backup.';status.classList.toggle('error',!result.saved);}
 function update(){showStatus(store.write(editor.value));if(mode==='preview')preview.innerHTML=Toolbox.markdown(editor.value);}
 function mobileMode(){const modal=open&&mobile.matches;document.querySelector('main').inert=modal;document.querySelector('.sidebar').inert=modal;if(modal){panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','true');}else{panel.removeAttribute('role');panel.removeAttribute('aria-modal');}}
 function setOpen(value){open=value;panel.hidden=!open;document.body.classList.toggle('notes-open',open);toggle.setAttribute('aria-expanded',String(open));mobileMode();if(open)(mode==='edit'?editor:document.querySelector('#note-edit')).focus();else toggle.focus();}
 function setMode(value){mode=value;editor.hidden=value!=='edit';preview.hidden=value!=='preview';document.querySelector('#note-edit').setAttribute('aria-pressed',String(value==='edit'));document.querySelector('#note-render').setAttribute('aria-pressed',String(value==='preview'));if(value==='preview')preview.innerHTML=Toolbox.markdown(editor.value);}
 toggle.onclick=()=>setOpen(!open);document.querySelector('#notes-close').onclick=()=>setOpen(false);editor.oninput=update;
 document.querySelector('#note-edit').onclick=()=>setMode('edit');document.querySelector('#note-render').onclick=()=>setMode('preview');
 document.querySelector('#note-copy').onclick=async()=>{try{await navigator.clipboard.writeText(editor.value);status.textContent='Note copied';}catch{status.textContent='Could not copy. Select the note and copy it manually.';}};
 function downloadNote(extension){const url=URL.createObjectURL(new Blob([editor.value],{type:extension==='md'?'text/markdown;charset=utf-8':'text/plain;charset=utf-8'})),link=document.createElement('a');link.href=url;link.download='developer-notes.'+extension;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
 document.querySelector('#note-txt').onclick=()=>downloadNote('txt');document.querySelector('#note-md').onclick=()=>downloadNote('md');
 document.querySelector('#note-clear').onclick=()=>confirmDialog.showModal();document.querySelector('#clear-note-cancel').onclick=()=>confirmDialog.close();
 document.querySelector('#clear-note-confirm').onclick=()=>{const result=store.clear();showStatus(result);if(result.saved){editor.value='';preview.innerHTML='';}else{status.textContent='Could not clear the saved note. Your text has been kept; download a backup.';}confirmDialog.close();};
 confirmDialog.addEventListener('close',()=>document.querySelector('#note-clear').focus());
 panel.addEventListener('keydown',e=>{if(e.key==='Escape'&&!confirmDialog.open){e.preventDefault();setOpen(false);}if(e.key==='Tab'&&mobile.matches&&!confirmDialog.open){const items=Array.from(panel.querySelectorAll('button,textarea,a[href]')).filter(el=>!el.hidden&&el.getClientRects().length);const first=items[0],last=items[items.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});
 mobile.addEventListener('change',mobileMode);
 window.addEventListener('storage',event=>{if(event.key===Notes.KEY||event.key===null){status.textContent='Notes changed in another tab. Download this copy before reloading to load those changes.';}});
 showStatus(store.read());
})();
