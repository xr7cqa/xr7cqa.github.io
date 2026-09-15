import{F as b,W as f,P as p}from"./prompts-VFSCrMWn.js";
const n={
searchInput:document.getElementById("searchInput"),
categoryChips:document.getElementById("categoryChips"),
promptsGrid:document.getElementById("promptsGrid"),
weeklyGrid:document.getElementById("weeklyGrid"),
resultsMeta:document.getElementById("resultsMeta"),
emptyState:document.getElementById("emptyState"),
emptyMessage:document.getElementById("emptyMessage"),
nearSuggestions:document.getElementById("nearSuggestions"),
modal:document.getElementById("modal"),
modalTitle:document.getElementById("modalTitle"),
modalCategory:document.getElementById("modalCategory"),
modalNeed:document.getElementById("modalNeed"),
modalWhen:document.getElementById("modalWhen"),
modalWhenWrap:document.getElementById("modalWhenWrap"),
modalPlaceholders:document.getElementById("modalPlaceholders"),
modalApps:document.getElementById("modalApps"),
modalAppsWrap:document.getElementById("modalAppsWrap"),
modalPrompt:document.getElementById("modalPrompt"),
modalNote:document.getElementById("modalNote"),
modalExample:document.getElementById("modalExample"),
modalExampleWrap:document.getElementById("modalExampleWrap"),
copyPromptBtn:document.getElementById("copyPromptBtn"),
toast:document.getElementById("toast"),
copyHelperLine:document.getElementById("copyHelperLine"),
converterInput:document.getElementById("converterInput"),
convertBtn:document.getElementById("convertBtn"),
converterOutput:document.getElementById("converterOutput"),
converterResult:document.getElementById("converterResult"),
copyConverterBtn:document.getElementById("copyConverterBtn"),
editRequestBtn:document.getElementById("editRequestBtn"),
rephraseBtn:document.getElementById("rephraseBtn"),
resetConverterBtn:document.getElementById("resetConverterBtn")
};
const state={query:"",facet:"الكل",active:null};
let toastTimer=null;
function norm(s){return(s||"").toString().toLowerCase().replace(/[\u064B-\u0652]/g,"").trim()}
function esc(s){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}
function hay(e){return norm([e.title,e.needSummary,e.category,e.facet||"",e.whenUseful||"",e.exampleResult||"",...(e.tags||[])].join(" "))}
function filtered(){const q=norm(state.query);return p.filter(e=>(state.facet==="الكل"||e.facet===state.facet)&&(!q||hay(e).includes(q)))}
function toast(msg){n.toast.textContent=msg;n.toast.classList.remove("hidden");if(n.copyHelperLine){n.copyHelperLine.hidden=false;n.copyHelperLine.textContent="الصق في ChatGPT أو Gemini. عبّئ الأقواس من درسك. لا ترفع الناتج كملف رسمي."}clearTimeout(toastTimer);toastTimer=setTimeout(()=>n.toast.classList.add("hidden"),1800)}
async function copyText(t){try{await navigator.clipboard.writeText(t)}catch{const a=document.createElement("textarea");a.value=t;a.style.position="fixed";a.style.left="-9999px";document.body.appendChild(a);a.select();document.execCommand("copy");document.body.removeChild(a)}toast("تم النسخ")}
function exampleHtml(e,compact){const r=(e.exampleResult||"").trim();if(!r)return"";const lines=r.split("\n").filter(Boolean).slice(0,compact?3:6);return `<pre class="card-example">${esc(lines.join("\n"))}</pre>`}
function card(e,compact){const el=document.createElement("article");el.className="prompt-card"+(compact?" prompt-card--compact":"");el.innerHTML=`<span class="badge">${esc(e.category)}</span><h3>${esc(e.title)}</h3><p class="need">${esc(e.needSummary)}</p>${e.whenUseful&&!compact?`<p class="when-useful">${esc(e.whenUseful)}</p>`:""}${exampleHtml(e,compact)}<div class="card-actions"><button type="button" class="btn btn-sm btn-primary" data-view>عرض البرومبت</button><button type="button" class="btn btn-sm btn-secondary" data-copy>نسخ البرومبت</button></div>`;el.querySelector("[data-view]").onclick=ev=>{ev.stopPropagation();openModal(e)};el.querySelector("[data-copy]").onclick=ev=>{ev.stopPropagation();copyText(e.fullPrompt)};return el}
function renderChips(){n.categoryChips.innerHTML="";b.forEach(facet=>{const btn=document.createElement("button");btn.type="button";btn.className="chip"+(state.facet===facet?" active":"");btn.textContent=facet;btn.setAttribute("role","listitem");btn.onclick=()=>{state.facet=facet;renderChips();renderGrid()};n.categoryChips.appendChild(btn)})}
function renderGrid(){const list=filtered();n.promptsGrid.innerHTML="";n.resultsMeta.textContent=list.length?`عرض ${list.length} من ${p.length} برومبت`:"";const empty=list.length===0;n.emptyState.classList.toggle("hidden",!empty);if(empty){if(n.emptyMessage)n.emptyMessage.textContent="لا توجد مطابقة مباشرة";if(n.nearSuggestions){n.nearSuggestions.hidden=false;n.nearSuggestions.innerHTML='<p class="near-label">اقتراحات قريبة:</p>';p.slice(0,3).forEach(e=>n.nearSuggestions.appendChild(card(e,true)))}}else if(n.nearSuggestions){n.nearSuggestions.hidden=true;n.nearSuggestions.innerHTML=""}list.forEach(e=>n.promptsGrid.appendChild(card(e,false)))}
function renderWeekly(){if(!n.weeklyGrid)return;const ids=(f&&f.promptIds)||[];const list=ids.map(id=>p.find(e=>e.id===id)).filter(Boolean).slice(0,5);n.weeklyGrid.innerHTML="";if(!list.length){n.weeklyGrid.innerHTML='<p class="muted">لا مقترحات لهذا الأسبوع.</p>';return}list.forEach(e=>n.weeklyGrid.appendChild(card(e,true)))}
function openModal(e){state.active=e;n.modalTitle.textContent=e.title;n.modalCategory.textContent=e.category;n.modalNeed.textContent=e.needSummary;if(e.whenUseful){n.modalWhen.textContent=e.whenUseful;n.modalWhenWrap.classList.remove("hidden")}else n.modalWhenWrap.classList.add("hidden");n.modalPlaceholders.innerHTML="";(e.placeholders||[]).forEach(ph=>{const li=document.createElement("li");li.textContent=ph.replace(/^\{\{|\}\}$/g,"").replace(/_/g," ");n.modalPlaceholders.appendChild(li)});if(!(e.placeholders||[]).length){const li=document.createElement("li");li.textContent="لا حقول إضافية محددة";n.modalPlaceholders.appendChild(li)}if(e.appsNote){n.modalApps.textContent=e.appsNote;n.modalAppsWrap.classList.remove("hidden")}else n.modalAppsWrap.classList.add("hidden");if(n.modalExample){const t=(e.exampleResult||"").trim();if(t){n.modalExample.textContent=t.split("\n").filter(Boolean).slice(0,6).join("\n");n.modalExampleWrap&&n.modalExampleWrap.classList.remove("hidden")}else n.modalExampleWrap&&n.modalExampleWrap.classList.add("hidden")}n.modalPrompt.textContent=e.fullPrompt;if(e.note){n.modalNote.textContent=e.note;n.modalNote.classList.remove("hidden")}else n.modalNote.classList.add("hidden");n.modal.classList.remove("hidden");document.body.style.overflow="hidden"}
function closeModal(){n.modal.classList.add("hidden");state.active=null;document.body.style.overflow=""}
function wireConverter(){const note=()=>{const t=(n.converterInput.value||"").trim();if(!t){n.converterResult.textContent="يرجى كتابة طلبك أولاً.";n.converterOutput.classList.remove("hidden");return}n.converterResult.textContent=`الدور:\nأنت مساعد تربوي للمعلمين في السياق المدرسي السعودي.\n\nالمدخلات:\n"""\n${t}\n"""\n\nالمطلوب:\nحوّل الطلب إلى مخرج عملي جاهز للاستخدام بهيكل واضح.\n\nالقيود:\n- لا تخمّن أسماء أو درجات أو تعاميم غير مذكورة.\n- لا تنسب المخرج لوزارة التعليم.\n- إذا نقصت معلومة، اكتب غير متوفر واسأل عنها.` ;n.converterOutput.classList.remove("hidden")};n.convertBtn&&(n.convertBtn.onclick=note);n.rephraseBtn&&(n.rephraseBtn.onclick=note);n.copyConverterBtn&&(n.copyConverterBtn.onclick=()=>copyText(n.converterResult.textContent||""));n.editRequestBtn&&(n.editRequestBtn.onclick=()=>{n.converterInput.focus();n.converterInput.scrollIntoView({behavior:"smooth",block:"center"})});n.resetConverterBtn&&(n.resetConverterBtn.onclick=()=>{n.converterInput.value="";n.converterResult.textContent="";n.converterOutput.classList.add("hidden");n.converterInput.focus()})}
function init(){renderChips();renderWeekly();renderGrid();n.searchInput.addEventListener("input",e=>{state.query=e.target.value;renderGrid()});document.querySelectorAll("[data-close-modal]").forEach(el=>el.addEventListener("click",closeModal));document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!n.modal.classList.contains("hidden"))closeModal()});n.copyPromptBtn.addEventListener("click",()=>{state.active&&copyText(state.active.fullPrompt)});wireConverter()}
init();
