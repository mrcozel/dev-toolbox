(function(root){
 'use strict';
 function parse(value){let url;try{url=new URL(value.trim());}catch{throw Error('Enter a complete URL, starting with https:// or http://.');}if(!['http:','https:'].includes(url.protocol))throw Error('Use an http:// or https:// URL.');if(url.username||url.password)throw Error('URLs containing usernames or passwords are not supported.');return url;}
 function inspect(value){const u=parse(value);return {href:u.href,protocol:u.protocol,host:u.host,path:u.pathname,hash:u.hash,entries:Array.from(u.searchParams.entries())};}
 function rebuild(value,entries){const u=parse(value);u.search='';for(const [key,val] of entries)u.searchParams.append(key,val);return u.href;}
 function transform(text,action,mode){try{return mode==='url'?(action==='encode'?encodeURI(text):decodeURI(text)):(action==='encode'?encodeURIComponent(text):decodeURIComponent(text));}catch{throw Error(action==='decode'?'The text contains invalid percent-encoding or an incomplete UTF-8 sequence.':'The text contains an invalid Unicode character.');}}
 function createQR(value,factory){const url=parse(value).href;if(url.length>2000)throw Error('This URL is too long for a practical QR code. Use 2,000 characters or fewer.');const code=factory(0,'M');code.addData(url,'Byte');code.make();return {code,url};}
 root.UrlUtils={parse,inspect,rebuild,transform,createQR};
})(typeof module==='object'?module.exports:globalThis);
