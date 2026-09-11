const n=10;
const chunks=await Promise.all(
  Array.from({length:n},(_,i)=>fetch(new URL(`./main-BopMSOig.p${i}.b64`, import.meta.url)).then(r=>{
    if(!r.ok) throw new Error('b64 part '+i+' '+r.status);
    return r.text();
  }))
);
const b64=chunks.join('').replace(/\s+/g,'');
const bin=atob(b64);
const bytes=new Uint8Array(bin.length);
for(let i=0;i<bin.length;i++) bytes[i]=bin.charCodeAt(i);
const code=new TextDecoder('utf-8').decode(bytes);
await import(URL.createObjectURL(new Blob([code],{type:'text/javascript'})));
