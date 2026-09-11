const parts=await Promise.all([0,1,2,3].map(i=>fetch(new URL(`main-CiPoXCTF.p${i}.txt`, import.meta.url)).then(r=>r.text())));
let code=parts.join('');
code=code.replaceAll('./prompts-COg7M83J.js', new URL('./prompts-COg7M83J.js', import.meta.url).href);
const blob=new Blob([code],{type:'text/javascript'});
await import(/* @vite-ignore */ URL.createObjectURL(blob));
