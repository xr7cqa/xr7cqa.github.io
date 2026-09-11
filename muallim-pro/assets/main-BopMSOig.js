const n=4;
const parts=await Promise.all(
  Array.from({length:n},(_,i)=>fetch(new URL(`./main-BopMSOig.part${i}.txt`, import.meta.url)).then(r=>{
    if(!r.ok) throw new Error('part '+i+' '+r.status);
    return r.text();
  }))
);
const code=parts.join('');
await import(URL.createObjectURL(new Blob([code],{type:'text/javascript'})));
