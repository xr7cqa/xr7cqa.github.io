import{F as b,W as f,P as p}from"./prompts-VFSCrMWn.js";
const _u=["./main-sep16b.p0.txt","./main-sep16b.p1.txt","./main-sep16b.p2.txt","./main-sep16b.p3.txt"];
const _parts=await Promise.all(_u.map(async u=>{
  const r=await fetch(new URL(u,import.meta.url));
  if(!r.ok) throw new Error("main chunk missing: "+u+" "+r.status);
  return r.text();
}));
(new Function("b","f","p",_parts.join("")))(b,f,p);
