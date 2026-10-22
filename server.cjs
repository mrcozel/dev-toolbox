const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'docs');
http.createServer((req,res)=>{const route=new URL(req.url,'http://localhost').pathname;const name=route==='/'?'index.html':route.slice(1);if(!['index.html','style.css','core.js','app.js'].includes(name)){res.writeHead(404);return res.end('Not found');}fs.readFile(path.join(root,name),(err,data)=>{if(err){res.writeHead(404);return res.end('Not found');}res.setHeader('Content-Type',name.endsWith('.css')?'text/css':name.endsWith('.js')?'text/javascript':'text/html');res.end(data);});}).listen(4173,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:4173'));

