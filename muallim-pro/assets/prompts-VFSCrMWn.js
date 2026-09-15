const _u=["./prompts-VFSCrMWn.p0.txt","./prompts-VFSCrMWn.p1.txt","./prompts-VFSCrMWn.p2.txt","./prompts-VFSCrMWn.p3.txt","./prompts-VFSCrMWn.p4.txt","./prompts-VFSCrMWn.p5.txt","./prompts-VFSCrMWn.p6.txt","./prompts-VFSCrMWn.p7.txt","./prompts-VFSCrMWn.p8.txt"];
const _parts=await Promise.all(_u.map(async u=>{
  const r=await fetch(new URL(u,import.meta.url));
  if(!r.ok) throw new Error("prompts chunk missing: "+u+" "+r.status);
  return r.text();
}));
const _blob=new Blob([_parts.join("")],{type:"text/javascript"});
const _url=URL.createObjectURL(_blob);
const _m=await import(/* @vite-ignore */ _url);
URL.revokeObjectURL(_url);
export const F=_m.F;
export const P=_m.P;
export const W=_m.W;
