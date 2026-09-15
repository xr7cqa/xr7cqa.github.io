import{F as b,W as f,P as p}from"./prompts-VFSCrMWn.js";
const _u=["./main-lite.p0.txt","./main-lite.p1.txt"];
const _parts=await Promise.all(_u.map(async u=>{
  const r=await fetch(new URL(u,import.meta.url));
  if(!r.ok) throw new Error("lite chunk missing: "+u+" "+r.status);
  return r.text();
}));
(new Function("b","f","p",_parts.join("")))(b,f,p);
