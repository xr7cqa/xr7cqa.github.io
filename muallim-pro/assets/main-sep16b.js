import{F as b,W as f,P as p}from"./prompts-VFSCrMWn.js";
function _b64(s){const bin=atob(s.replace(/\s+/g,""));const bytes=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)bytes[i]=bin.charCodeAt(i);return new TextDecoder().decode(bytes)}
const _u=["./main-sep16b.p0.b64","./main-sep16b.p1.b64","./main-sep16b.p2.b64","./main-sep16b.p3.b64"];
const _parts=await Promise.all(_u.map(async u=>{
  const r=await fetch(new URL(u,import.meta.url));
  if(!r.ok) throw new Error("main chunk missing: "+u+" "+r.status);
  return _b64(await r.text());
}));
(new Function("b","f","p",_parts.join("")))(b,f,p);
