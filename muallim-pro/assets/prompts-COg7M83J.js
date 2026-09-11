const parts=await Promise.all([0,1,2,3,4,5,6,7,8].map(i=>fetch(new URL(`prompts-COg7M83J.p${i}.txt`, import.meta.url)).then(r=>r.text())));
const mod=await import(/* @vite-ignore */ URL.createObjectURL(new Blob([parts.join("")],{type:"text/javascript"})));
export const C=mod.C;
export const W=mod.W;
export const P=mod.P;
