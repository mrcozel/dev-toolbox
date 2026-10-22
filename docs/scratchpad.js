'use strict';
(function(){
 const editor=document.querySelector('#note-editor'),status=document.querySelector('#note-status'),tabs=document.querySelector('#note-tabs'),name=document.querySelector('#note-name'),dialog=document.querySelector('#clear-note-dialog');
 const store=Notes.createStore(()=>localStorage);let action='clear';
 const active=()=>{const state=store.read();return state.tabs.find(t=>t.id===state.activeId);};
 function showStatus(state){status.textContent=state.saved?'All tabs saved in this browser':state.error;status.classList.toggle('error',!state.saved);}
 function render(state=store.read(),focus=false){
  const note=state.tabs.find(t=>t.id===state.activeId);editor.value=note.text;name.value=note.title;editor.setAttribute('aria-label','Developer notes — '+note.title);tabs.replaceChildren();
  for(const tab of state.tabs){const button=document.createElement('button');button.type='button';button.className='note-tab';button.setAttribute('role','tab');button.id='tab-'+tab.id;button.setAttribute('aria-selected',String(tab.id===state.activeId));button.setAttribute('aria-controls','note-page');button.tabIndex=tab.id===state.activeId?0:-1;button.textContent=tab.title;button.onclick=()=>{render(store.select(tab.id));document.getElementById('tab-'+tab.id).focus();};tabs.append(button);}
  document.querySelector('#note-page').setAttribute('aria-labelledby','tab-'+note.id);showStatus(state);if(focus)editor.focus();
 }
 editor.oninput=()=>showStatus(store.write(editor.value));
 function rename(){const state=store.rename(name.value),note=state.tabs.find(t=>t.id===state.activeId);name.value=note.title;document.getElementById('tab-'+note.id).textContent=note.title;editor.setAttribute('aria-label','Developer notes — '+note.title);showStatus(state);}
 name.onchange=rename;name.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();rename();editor.focus();}};
 document.querySelector('#note-add').onclick=()=>render(store.add(),true);
 tabs.onkeydown=e=>{const state=store.read(),i=state.tabs.findIndex(t=>t.id===state.activeId);let next;if(e.key==='ArrowRight')next=(i+1)%state.tabs.length;if(e.key==='ArrowLeft')next=(i-1+state.tabs.length)%state.tabs.length;if(e.key==='Home')next=0;if(e.key==='End')next=state.tabs.length-1;if(next!==undefined){e.preventDefault();render(store.select(state.tabs[next].id));document.getElementById('tab-'+state.tabs[next].id).focus();}};
 document.querySelector('#note-copy').onclick=async()=>{try{await navigator.clipboard.writeText(editor.value);status.textContent='Note copied';}catch{status.textContent='Could not copy. Select the note and copy it manually.';}};
 function downloadNote(extension){const url=URL.createObjectURL(new Blob([editor.value],{type:'text/plain;charset=utf-8'})),link=document.createElement('a');link.href=url;link.download=(active().title.replace(/[<>:"/\\|?*\x00-\x1f]/g,'-').slice(0,80)||'developer-notes')+'.'+extension;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
 document.querySelector('#note-txt').onclick=()=>downloadNote('txt');document.querySelector('#note-md').onclick=()=>downloadNote('md');
 function confirm(value){action=value;document.querySelector('#clear-note-title').textContent=value==='close'?'Close this tab?':'Clear this note?';document.querySelector('#clear-note-description').textContent=value==='close'?'This removes the tab and its saved text. Download a copy first if you need it.':'This clears the text in the current tab. Your other notes stay saved.';document.querySelector('#clear-note-confirm').textContent=value==='close'?'Yes, close tab':'Yes, clear note';dialog.showModal();}
 document.querySelector('#note-clear').onclick=()=>confirm('clear');document.querySelector('#note-close').onclick=()=>confirm('close');document.querySelector('#clear-note-cancel').onclick=()=>dialog.close();
 document.querySelector('#clear-note-confirm').onclick=()=>{const result=action==='close'?store.close():store.clear();render(result);if(!result.saved)status.textContent='Could not '+action+' the saved note. Your tabs have been kept. '+result.error;dialog.close();};
 dialog.addEventListener('close',()=>document.querySelector(action==='close'?'#note-close':'#note-clear').focus());
 window.addEventListener('storage',event=>{if(event.key===Notes.KEY||event.key===null){status.textContent='Notes changed in another browser tab. Download this copy, then reload to load those changes.';}});
 render();
})();
