const _u=["./prompts-VFSCrMWn.p0.txt","./prompts-VFSCrMWn.p1.txt","./prompts-VFSCrMWn.p2.txt","./prompts-VFSCrMWn.p3.txt","./prompts-VFSCrMWn.p4.txt","./prompts-VFSCrMWn.p5.txt","./prompts-VFSCrMWn.p6.txt","./prompts-VFSCrMWn.p7.txt","./prompts-VFSCrMWn.p8.txt"];
const _parts=await Promise.all(_u.map(async u=>{
  const r=await fetch(new URL(u,import.meta.url));
  if(!r.ok) throw new Error("prompts chunk missing: "+u+" "+r.status);
  return r.text();
}));
const _code=_parts.join("").replace(/export\{t as F,l as P,e as W\};?\s*$/,"return {F:t,P:l,W:e};");
const _m=(new Function(_code))();
export const F=_m.F;
export const P=_m.P;
export const W=_m.W;
