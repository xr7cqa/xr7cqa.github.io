/* empty css               */import{C as I,W as h,P as f}from"./prompts-COg7M83J.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))r(s);new MutationObserver(s=>{for(const a of s)if(a.type==="childList")for(const l of a.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&r(l)}).observe(document,{childList:!0,subtree:!0});function o(s){const a={};return s.integrity&&(a.integrity=s.integrity),s.referrerPolicy&&(a.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?a.credentials="include":s.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function r(s){if(s.ep)return;s.ep=!0;const a=o(s);fetch(s.href,a)}})();const c={query:"",category:"الكل",activePrompt:null},n={searchInput:document.getElementById("searchInput"),categoryChips:document.getElementById("categoryChips"),promptsGrid:document.getElementById("promptsGrid"),weeklyGrid:document.getElementById("weeklyGrid"),resultsMeta:document.getElementById("resultsMeta"),emptyState:document.getElementById("emptyState"),modal:document.getElementById("modal"),modalTitle:document.getElementById("modalTitle"),modalCategory:document.getElementById("modalCategory"),modalNeed:document.getElementById("modalNeed"),modalWhen:document.getElementById("modalWhen"),modalWhenWrap:document.getElementById("modalWhenWrap"),modalPlaceholders:document.getElementById("modalPlaceholders"),modalApps:document.getElementById("modalApps"),modalAppsWrap:document.getElementById("modalAppsWrap"),modalPrompt:document.getElementById("modalPrompt"),modalNote:document.getElementById("modalNote"),copyPromptBtn:document.getElementById("copyPromptBtn"),toast:document.getElementById("toast"),converterInput:document.getElementById("converterInput"),convertBtn:document.getElementById("convertBtn"),converterOutput:document.getElementById("converterOutput"),converterResult:document.getElementById("converterResult"),copyConverterBtn:document.getElementById("copyConverterBtn"),editRequestBtn:document.getElementById("editRequestBtn"),rephraseBtn:document.getElementById("rephraseBtn"),resetConverterBtn:document.getElementById("resetConverterBtn")};let y=null;function g(e){return(e||"").toString().toLowerCase().replace(/[ًٌٍَُِّْ]/g,"").trim()}function d(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function b(){const e=g(c.query);return f.filter(t=>c.category==="الكل"||t.category===c.category?e?g([t.title,t.needSummary,t.category,t.whenUseful||"",...t.tags||[]].join(" ")).includes(e):!0:!1)}function B(){n.categoryChips.innerHTML="",I.forEach(e=>{const t=document.createElement("button");t.type="button",t.className="chip"+(c.category===e?" active":""),t.textContent=e,t.setAttribute("role","listitem"),t.addEventListener("click",()=>{c.category=e,B(),m()}),n.categoryChips.appendChild(t)})}function L(e){return`
    <div class="card-actions">
      <button type="button" class="btn btn-sm btn-primary" data-view="${e.id}">عرض البرومبت</button>
      <button type="button" class="btn btn-sm btn-secondary" data-copy="${e.id}">نسخ البرومبت</button>
    </div>
  `}function C(e,{compact:t=!1}={}){const o=document.createElement("article");return o.className="prompt-card"+(t?" prompt-card--compact":""),o.innerHTML=`
    <span class="badge">${d(e.category)}</span>
    <h3>${d(e.title)}</h3>
    <p class="need">${d(e.needSummary)}</p>
    ${e.whenUseful&&!t?`<p class="when-useful">${d(e.whenUseful)}</p>`:""}
    ${L(e)}
  `,o.querySelector("[data-view]").addEventListener("click",r=>{r.stopPropagation(),w(e)}),o.querySelector("[data-copy]").addEventListener("click",r=>{r.stopPropagation(),p(e.fullPrompt)}),o}function m(){const e=b();n.promptsGrid.innerHTML="",n.resultsMeta.textContent=e.length?`عرض ${e.length} من ${f.length} برومبت`:"",n.emptyState.classList.toggle("hidden",e.length>0),e.forEach(t=>{n.promptsGrid.appendChild(C(t))})}function P(){if(!n.weeklyGrid)return;const t=(h&&h.promptIds||[]).map(o=>f.find(r=>r.id===o)).filter(Boolean).slice(0,5);if(n.weeklyGrid.innerHTML="",!t.length){n.weeklyGrid.innerHTML='<p class="muted">لا مقترحات لهذا الأسبوع.</p>';return}t.forEach(o=>{n.weeklyGrid.appendChild(C(o,{compact:!0}))})}function w(e){if(c.activePrompt=e,n.modalTitle.textContent=e.title,n.modalCategory.textContent=e.category,n.modalNeed.textContent=e.needSummary,e.whenUseful?(n.modalWhen.textContent=e.whenUseful,n.modalWhenWrap.classList.remove("hidden")):n.modalWhenWrap.classList.add("hidden"),n.modalPlaceholders.innerHTML="",(e.placeholders||[]).forEach(t=>{const o=document.createElement("li");o.textContent=t.replace(/^\{\{|\}\}$/g,"").replace(/_/g," "),n.modalPlaceholders.appendChild(o)}),!(e.placeholders||[]).length){const t=document.createElement("li");t.textContent="لا حقول إضافية محددة",n.modalPlaceholders.appendChild(t)}e.appsNote?(n.modalApps.textContent=e.appsNote,n.modalAppsWrap.classList.remove("hidden")):n.modalAppsWrap.classList.add("hidden"),n.modalPrompt.textContent=e.fullPrompt,e.note?(n.modalNote.textContent=e.note,n.modalNote.classList.remove("hidden")):n.modalNote.classList.add("hidden"),n.modal.classList.remove("hidden"),document.body.style.overflow="hidden"}function v(){n.modal.classList.add("hidden"),c.activePrompt=null,document.body.style.overflow=""}async function p(e){try{await navigator.clipboard.writeText(e)}catch{const t=document.createElement("textarea");t.value=e,t.style.position="fixed",t.style.left="-9999px",document.body.appendChild(t),t.select(),document.execCommand("copy"),document.body.removeChild(t)}q("تم النسخ")}function q(e){n.toast.textContent=e,n.toast.classList.remove("hidden"),clearTimeout(y),y=setTimeout(()=>{n.toast.classList.add("hidden")},1800)}function $(e){const t=[{type:"visit",keys:["زيارة صفية","زيارة تبادلية","تبادلية","زيارة مشرف","زيارة قائد"],role:"مساعد توثيق زيارات صفية مهنية دون اختلاق أسماء أو أحكام"},{type:"shawahid",keys:["شواهد","شاهد إنجاز","ملف إنجاز","خطة شواهد","نمو مهني","تقويم ذاتي"],role:"مساعد تنظيم شواهد ملف الإنجاز والنمو المهني"},{type:"madrasati",keys:["مدرستي","تقرير أسبوعي","تقرير إنجاز","خطة أسبوعية","إنجاز أسبوعي"],role:"مساعد صياغة خطة وتقرير إنجاز أسبوعي لمنصة مدرستي بأسلوب غير رسمي"},{type:"performance",keys:["مهمة أدائية","تكليف أدائي","أداء عملي","سلم تقدير","مهمة تسليم"],role:"مصمم مهام أدائية جاهزة للتسليم بمعايير واضحة"},{type:"absence",keys:["غياب متكرر","غياب","متغيب","تكرار الغياب"],role:"مساعد متابعة غياب متكرر برسالة أو محضر مهني — وقائع فقط"},{type:"toolchoice",keys:["أداة التعلم","اختيار أداة","لعبة صفية","تنويع أدوات","بدل ورقة"],role:"مستشار اختيار أداة التعلم المناسبة للدرس"},{type:"grades",keys:["نتائج","تحليل","درجات","درجة","ضعف","علاج","إحصاء","متوسط"],role:"محلل نتائج صفية يعتمد على الأرقام المذكورة فقط"},{type:"parent",keys:["ولي أمر","واتساب","رسالة","تواصل","محضر","أهل","ولي"],role:"صائغ رسائل تواصل مهنية مع أولياء الأمور — وقائع ونبرة مهذبة فقط"},{type:"lesson",keys:["تحضير","خطة درس","درس يومي","أهداف","حصة","نواتج"],role:"مساعد تربوي لإعداد خطط وتحضير دروس"},{type:"worksheet",keys:["ورقة عمل","متدرجة","تمارين","نشاط صف","تفريق","مستويات"],role:"مصمم أوراق عمل وتمارين متدرجة"},{type:"exam",keys:["اختبار","أسئلة","تقويم","بلوم","نموذج إجابة","جدول مواصفات"],role:"خبير بناء اختبارات ونماذج إجابة"},{type:"tracking",keys:["رصد","نور","واجبات","متابعة"],role:"مساعد صياغة ملاحظات رصد ومتابعة"},{type:"portfolio",keys:["توثيق","مشرف","تقرير ذاتي"],role:"مساعد توثيق مهني وملفات إنجاز"},{type:"enrichment",keys:["إذاعة","لاصفية","إثراء","نشاط لاصفي"],role:"منسق أنشطة وإثراء مدرسي"},{type:"termstart",keys:["تهيئة","بداية الترم","بداية الفصل","توزيع زمني","أول أسبوع"],role:"منسق تهيئة وبداية الفصل الدراسي"},{type:"support",keys:["صعوبات","فردية","IEP","دعم","خطة فردية"],role:"مساعد دعم تعليمي بحذر غير تشخيصي"}];for(const o of t)if(o.keys.some(r=>e.includes(r)))return o;return{type:"general",role:"مساعد تربوي عام للمعلمين في السياق المدرسي السعودي"}}function T(e){const t={},o=e.match(/(?:مادة|في)\s+([^\s،,]{2,20})/);o&&(t.subject=o[1]);const r=e.match(/الصف\s+([^\s،,]{1,20})/);r&&(t.grade=r[1]);const s=e.match(/(\d+)\s*(?:دقيقة|دقائق|د\b)/);s&&(t.duration=s[1]+" دقيقة");const a=e.match(/(?:عن|عنوان(?:ه|ها)?|درس)\s+([^\n،.]{3,40})/);a&&(t.lesson=a[1].trim());const l=e.match(/(\d+)\s*(?:سؤال|أسئلة|تمرين|تمارين|مهمة|مهام)/);return l&&(t.count=l[1]),t}function O(e,t,o){const r=[];return e==="lesson"?(!o.subject&&!/مادة|رياضيات|عربي|علوم|إنجليز|قرآن|حاسوب/.test(t)&&r.push("ما المادة؟"),!o.grade&&!/الصف|ثاني|ثالث|رابع|خامس|سادس|متوسط|أول/.test(t)&&r.push("ما الصف؟"),!o.lesson&&t.length<40&&r.push("ما عنوان الدرس أو الموضوع؟")):e==="grades"?(/درجة|درجات|نتيجة|نتائج|٪|%|\d+/.test(t)||r.push("ما ملخص الدرجات أو النتائج المتوفرة (أرقام فقط إن وُجدت)؟"),/موضوع|وحدة|مهارة|مهارات/.test(t)||r.push("ما الموضوعات أو المهارات المقاسة؟")):e==="parent"?(/طالب|طالبة|ابن|ابنة|اسم/.test(t)||r.push("ما اسم أو رمز الطالب/الطالبة؟"),/مشكلة|سبب|ملاحظة|تدني|تأخر|سلوك|إنجاز/.test(t)||r.push("ما الوقائع المراد ذكرها فقط (بدون تخمين أسباب)؟")):e==="worksheet"?(!o.subject&&!/مادة|رياضيات|عربي|علوم/.test(t)&&r.push("ما المادة وعنوان الدرس؟"),!o.count&&!/عدد|مستوى|أساسي|متوسط|متقدم/.test(t)&&r.push("كم مهمة تقريبًا لكل مستوى؟")):e==="exam"?(!o.subject&&!/مادة|موضوع|وحدة/.test(t)&&r.push("ما المادة والموضوعات؟"),!o.count&&!/عدد|سؤال/.test(t)&&r.push("ما عدد الأسئلة والدرجة الكلية؟")):e==="visit"?(/تبادلية|مشرف|قائد|زيارة/.test(t)||r.push("ما نوع الزيارة (تبادلية / مشرف / قائد)؟"),/هدف|ملاحظات|رصد|مرصود/.test(t)||r.push("ما هدف الزيارة وماذا رُصد فعليًا؟")):e==="shawahid"?(!o.subject&&!/مادة/.test(t)&&r.push("ما المادة والصفوف؟"),/أسبوع|نفّذ|منفّذ|شاهد/.test(t)||r.push("كم أسبوعًا تريد التخطيط له وما نُفّذ فعليًا إن وُجد؟")):e==="madrasati"?/أسبوع|دروس|أنجز|مخطط/.test(t)||r.push("ما رقم الأسبوع وما المخطط وما الذي أُنجز فعليًا؟"):e==="performance"?/تكليف|مهمة|موضوع|ناتج/.test(t)||r.push("ما وصف التكليف ونواتج التعلم المستهدفة؟"):e==="absence"?(/طالب|طالبة|رمز|اسم/.test(t)||r.push("ما اسم أو رمز الطالب/الطالبة؟"),/\d+|أيام|فترة/.test(t)||r.push("كم يوم غياب وفي أي فترة؟")):e==="toolchoice"&&!o.lesson&&!/درس|هدف/.test(t)&&r.push("ما عنوان الدرس والهدف الأساسي؟"),r.slice(0,3)}function S(e,t,o){const r=`- لا تخمّن أسماء طلاب أو معلمين أو مدارس.
- لا تخمّن درجات أو نسب أو نتائج غير مذكورة صراحة.
- لا تختلق أرقام تعاميم أو نماذج وزارية أو سياسات رسمية.
- لا تنسب المخرج لوزارة التعليم أو أي جهة حكومية.
- إذا نقصت معلومة ضرورية، اكتب «غير متوفر في المدخلات» واسأل عنها بدل اختراعها.`,s=`- طلب المعلم (نص خام):
"""
${t}
"""
- تفاصيل مستخرجة إن وُجدت: ${Object.keys(o).length?JSON.stringify(o,null,0):"لا شيء مؤكد"}`;return e==="grades"?{required:`حلّل النتائج اعتمادًا على الأرقام والوصف المذكور فقط.
قيود رقمية:
- لا تكمل جداول ناقصة بالتخمين.
- احسب المتوسط/النسب فقط مما هو مذكور صراحة.
- ميّز بين «مستند إلى بيانات» و«اقتراح عام».`,shape:`1) ملخص كمي/وصفي من المتاح فقط
2) نقاط القوة والضعف
3) أولويات علاجية قصيرة
4) أسئلة استكمال إن نقصت بيانات أساسية (1–3 كحد أقصى)`}:e==="parent"?{required:`صغ رسالة تواصل مهنية:
- نبرة مهذبة وهادئة.
- حقائق/وقائع فقط مما ذكره المعلم.
- لا أسباب منزلية مخمّنة، لا تهديد، لا مقارنات.
- راعِ صياغة طالب/طالبة أو ابنكم/ابنتكم حسب المتاح.`,shape:`1) رسالة جاهزة للنسخ (واتساب أو قصيرة)
2) بديل أقصر إن ناسب
3) عناصر ناقصة للسؤال عنها (إن وُجدت)`}:e==="lesson"?{required:`أعد مخرج تحضير/تخطيط يشمل ما يتوفر من:
المادة، الصف، عنوان الدرس، المدة/عدد الحصص، النواتج إن ذُكرت.
إن نقص الأساسيات، اسأل 1–3 أسئلة فقط ثم قدّم هيكلًا بأفضل المتاح.`,shape:`1) بيانات الدرس (من المتاح)
2) الأهداف
3) التمهيد والعرض
4) نشاط وتقويم
5) أسئلة استكمال قصيرة إن لزم`}:e==="worksheet"?{required:`صمّم ورقة عمل أو تمارين:
- وضّح المستوى (أساسي/متوسط/متقدم إن طُلب التدرج).
- نوّع المهام.
- اربطها بنفس ناتج التعلم إن ذُكر.
- لا تصنّف طلابًا بأسماء.`,shape:`1) تعليمات قصيرة
2) المهام حسب المستوى أو التنوع
3) معيار نجاح مبسط
4) أسئلة استكمال إن نقص المستوى أو العدد`}:e==="exam"?{required:`ابنِ أسئلة/اختبارًا وفق المتاح: موضوعات، عدد، درجة كلية، مستويات إن ذُكرت.
صرّح بأي توزيع مواصفات مقترح أنه غير رسمي.`,shape:`1) هيكل الاختبار أو الأسئلة
2) توزيع درجات إن أمكن
3) مفتاح مختصر
4) أسئلة استكمال إن لزم`}:e==="visit"?{required:`وثّق زيارة صفية بالعناصر: الهدف، الممارسات، نقاط القوة، التحسينات، التوصيات، الشواهد.
لا تخترع أسماء طلاب أو نسبًا أو أحكامًا غير مرصودة.`,shape:`1) بيانات الزيارة
2) ممارسات مرصودة
3) قوة / تحسين / توصيات
4) شواهد
5) عناصر ناقصة`}:e==="shawahid"?{required:`نظّم شواهد ملف الإنجاز و/أو خطة شواهد أسبوعية.
ميّز المنفَّذ عن المقترح، ولا تنسب الهيكل لنموذج وزاري.`,shape:`1) هيكل الأقسام
2) خطة أسبوعية للشواهد
3) بطاقة شاهد فارغة
4) أسئلة استكمال إن لزم`}:e==="madrasati"?{required:`صغ خطة أسبوعية + تقرير إنجاز أسبوعي بصياغة جاهزة للنسخ.
صرّح أن الصيغة غير رسمية، وميّز المخطط عن المنفَّذ دون تخمين نسب.`,shape:`1) بيانات الأسبوع
2) الخطة
3) الإنجاز مقابل المخطط
4) مسودة جاهزة للنسخ
5) عناصر ناقصة`}:e==="performance"?{required:"حوّل التكليف إلى مهمة أدائية: تعليمات، مخرج تسليم، معايير نجاح، سلم تقدير مبسّط غير رسمي.",shape:`1) عنوان وسياق
2) تعليمات
3) مخرج التسليم
4) معايير / سلم تقدير
5) أسئلة استكمال إن لزم`}:e==="absence"?{required:`أعد رسالة لولي الأمر و/أو محضرًا للإرشاد حول الغياب المتكرر — وقائع فقط بلا تشخيص.
أضف خانة متابعة للتوثيق.`,shape:`1) بيانات موجزة
2) رسالة و/أو محضر
3) خانة متابعة
4) عناصر ناقصة`}:e==="toolchoice"?{required:`رشّح أداة التعلم الأنسب للهدف (لعبة/ورقة/مهمة/تقويم…) مع مقارنة قصيرة وبديل منخفض التجهيز.
لا تفترض ورقة العمل خيارًا وحيدًا.`,shape:`1) مقارنة أدوات
2) الترشيح والمبرر
3) بديل
4) خطوات تنفيذ مختصرة`}:{required:"حوّل طلب المعلم إلى مخرج عملي جاهز للاستخدام، بهيكل واضح وخطوات قابلة للتنفيذ.",shape:`1) ملخص فهم الطلب
2) المخرج المطلوب مفصّلاً
3) عناصر تحتاج استكمالًا (1–3 كحد أقصى)
4) نسخة مختصرة جاهزة للنسخ إن ناسب`,sharedConstraints:r,inputBlock:s}}function W(e){const t=(e||"").trim();if(!t)return"يرجى كتابة طلبك أولاً.";const o=$(t),r=T(t),s=O(o.type,t,r),a=S(o.type,t,r),l=`- لا تخمّن أسماء طلاب أو معلمين أو مدارس.
- لا تخمّن درجات أو نسب أو نتائج غير مذكورة صراحة.
- لا تختلق أرقام تعاميم أو نماذج وزارية أو سياسات رسمية.
- لا تنسب المخرج لوزارة التعليم أو أي جهة حكومية.
- إذا نقصت معلومة ضرورية، اكتب «غير متوفر في المدخلات» واسأل عنها بدل اختراعها.`,k=s.length>0?`
أسئلة للمعلم قبل الإكمال (أجب عليها إن استطعت — 1 إلى ${s.length}):
`+s.map((i,u)=>`${u+1}) ${i}`).join(`
`)+`
`:"";return`الدور:
أنت ${o.role}.

المدخلات:
- طلب المعلم (نص خام):
"""
${t}
"""
- تفاصيل مستخرجة إن وُجدت: ${Object.keys(r).length?Object.entries(r).map(([i,u])=>`${i}=${u}`).join("، "):"لا شيء مؤكد"}
${k}
المطلوب:
${a.required}

القيود:
${l}

شكل المخرج:
${a.shape}

قاعدة عدم التخمين:
اعتمد فقط على نص طلب المعلم أعلاه. أي اسم أو رقم أو تعميم أو درجة غير واردة صراحة يجب عدم اختراعها.`}function E(){const e=W(n.converterInput.value);n.converterResult.textContent=e,n.converterOutput.classList.remove("hidden")}function N(){B(),P(),m(),n.searchInput.addEventListener("input",e=>{c.query=e.target.value,m()}),document.querySelectorAll("[data-close-modal]").forEach(e=>{e.addEventListener("click",v)}),document.addEventListener("keydown",e=>{e.key==="Escape"&&!n.modal.classList.contains("hidden")&&v()}),n.copyPromptBtn.addEventListener("click",()=>{c.activePrompt&&p(c.activePrompt.fullPrompt)}),n.convertBtn.addEventListener("click",E),n.copyConverterBtn.addEventListener("click",()=>{p(n.converterResult.textContent||"")}),n.editRequestBtn.addEventListener("click",()=>{n.converterInput.focus(),n.converterInput.scrollIntoView({behavior:"smooth",block:"center"})}),n.rephraseBtn.addEventListener("click",E),n.resetConverterBtn.addEventListener("click",()=>{n.converterInput.value="",n.converterResult.textContent="",n.converterOutput.classList.add("hidden"),n.converterInput.focus()})}N();
