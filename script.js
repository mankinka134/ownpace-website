"use strict";

/*
  OWNPACE DROP 001 — browser-only demo.
  No accounts, orders, payments, newsletter collection, or external analytics.
  Product visuals are CSS concept sketches and editorial imagery is illustrative.
*/
const products = [
  {id:"n01",line:"noir",type:"zip",title:"NOIR ZIP / 01",ua:"Зип-худі з об'ємним рукавом",desc:"Концепт важкої зипки з широким силуетом і контрастною блискавкою. Для міста, шарів і свободи руху.",tone:"black",art:"art-black",fit:"Oversized / drop shoulder",color:"Графітовий чорний"},
  {id:"n02",line:"noir",type:"pants",title:"WIDE FORM / 02",ua:"Широкі спортивні штани",desc:"Широкий низ, м'яка посадка, чиста лінія. Без обіцянок складу тканини до тестування зразків.",tone:"charcoal",art:"art-black",fit:"Baggy / straight hem",color:"Вицвілий графіт"},
  {id:"n03",line:"noir",type:"denim",title:"WASHED DENIM / 03",ua:"Baggy-джинси з ефектом прання",desc:"Глибока посадка, об'ємні штанини та тонкі конструктивні деталі. Візуальний прототип моделі.",tone:"denim",art:"art-slate",fit:"Baggy / wide leg",color:"Темний washed denim"},
  {id:"n04",line:"noir",type:"outer",title:"SHELL / 04",ua:"Куртка міського силуету",desc:"Компактна форма в плечах і вільний об'єм унизу. Фурнітура та матеріал будуть визначені окремо.",tone:"burgundy",art:"art-wine",fit:"Relaxed / boxy",color:"Глибокий бордовий"},
  {id:"a01",line:"atelier",type:"denim",title:"BOOTCUT / 01",ua:"Джинси bootcut",desc:"Помірне розширення донизу, чистий профіль і акцент на пропорціях. Один із головних напрямів жіночої та унісекс лінійки.",tone:"denim",art:"art-denim",fit:"Bootcut / mid rise concept",color:"Вицвілий синій"},
  {id:"a02",line:"atelier",type:"pants",title:"TWILL WIDE / 02",ua:"Широкі штани з твіловим характером",desc:"Широкий низ без резинки, витягнута форма й м'які складки. Матеріал і щільність ще не затверджені.",tone:"stone",art:"art-stone",fit:"Wide / open hem",color:"Теплий камінь"},
  {id:"a03",line:"atelier",type:"zip",title:"STUDIO ZIP / 03",ua:"Бордова зипка",desc:"М'який оверсайз і лаконічне брендування. Силует задуманий для багатошарових образів.",tone:"burgundy",art:"art-wine",fit:"Relaxed / cropped option",color:"Вино / бордо"},
  {id:"a04",line:"atelier",type:"tee",title:"CLEAN TEE / 04",ua:"Футболка з чистою лінією",desc:"Лаконічна модель з акцентом на комірі, фактурі й довжині. Форма буде допрацьована за зразками.",tone:"cream",art:"art-cream",fit:"Regular / relaxed",color:"Молочний"},
  {id:"t01",line:"terrain",type:"outer",title:"FIELD JACKET / 01",ua:"Структурована куртка",desc:"Робоча концепція куртки з утилітарними лініями та продуманим розташуванням кишень.",tone:"olive",art:"art-olive",fit:"Relaxed / layered",color:"Темна олива"},
  {id:"t02",line:"terrain",type:"pants",title:"TRAIL WIDE / 02",ua:"Широкі штани для руху",desc:"Прямий широкий низ, акцент на мобільності та силуеті. Стійкість матеріалу ще не перевірена.",tone:"olive",art:"art-olive",fit:"Wide utility / open hem",color:"Оливковий"},
  {id:"t03",line:"terrain",type:"zip",title:"FLEECE STUDY / 03",ua:"Об'ємне худі для шарів",desc:"Концепт багатошарового худі з м'якою фактурою та спокійною геометрією.",tone:"stone",art:"art-stone",fit:"Oversized / unisex",color:"Пісочно-сірий"},
  {id:"t04",line:"terrain",type:"outer",title:"URBAN OUTER / 04",ua:"Куртка в технічному стилі",desc:"Темний верхній шар з утилітарною естетикою. Жодних заяв про водостійкість без лабораторних випробувань.",tone:"navy",art:"art-slate",fit:"Boxy / relaxed",color:"Сланцево-синій"}
];
const $ = (sel,root=document)=>root.querySelector(sel);
const $$ = (sel,root=document)=>Array.from(root.querySelectorAll(sel));
const validViews = new Set(["home","noir","atelier","terrain","catalog"]);
let favorites = new Set();
try {const saved=JSON.parse(localStorage.getItem("ownpace.demo.favorites")||"[]");if(Array.isArray(saved))favorites=new Set(saved.filter(v=>products.some(p=>p.id===v)));}catch(_){}
let lineFilter="all", typeFilter="all", searchTerm="", onlyFavs=false;
let openProductId=null;
const lineLabels={noir:"01 / NOIR",atelier:"02 / ATELIER",terrain:"03 / TERRAIN"};
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
const conceptImageById = {
 n01:"noir-black",n02:"noir-pants",n03:"noir-denim",n04:"noir-jacket",
 a01:"atelier-bootcut",a02:"atelier-wide",a03:"atelier-zip",a04:"atelier-tee",
 t01:"terrain-jacket",t02:"terrain-pants",t03:"terrain-fleece",t04:"terrain-outer"
};
function imageElement(p) {
 const imageName=conceptImageById[p.id];
 return imageName ? '<img class="source-image" alt="Візуалізація майбутнього виробу: '+escapeHtml(p.ua)+'" src="assets/'+imageName+'.jpg" loading="lazy" decoding="async">' : "";
}
function enhanceImages(scope=document) {
 $(".source-image",scope).forEach(im=>{
  if(im.complete){if(im.naturalWidth>0)im.classList.add("is-loaded");return;}
  im.addEventListener("load",()=>im.classList.add("is-loaded"),{once:true});
  im.addEventListener("error",()=>im.remove(),{once:true});
 });
}
function enhancePackages(){
 const map=[["noir","pack-noir"],["atelier","pack-atelier"],["terrain","pack-terrain"]];
 map.forEach(([line,file])=>{
  const scene=$(".package-"+line+" .package-scene");
  if(!scene)return;
  const probe=new Image();
  probe.onload=()=>{scene.style.setProperty("--package-image",'url("assets/'+file+'.jpg")');scene.classList.add("has-package-photo");};
  probe.src="assets/"+file+".jpg";
 });
}

function garmentHtml(p){
 const cls=p.type==="zip"?"zip":p.type==="pants"?"pants":p.type==="denim"?"denim":p.type==="outer"?"outer":"tee";
 return '<div class="garment '+cls+'" data-tone="'+escapeHtml(p.tone)+'">'+(p.type==="zip"||p.type==="outer"?'<span class="zipline"></span>':"")+'<span class="mini-logo">OP.</span></div>';
}
function artHtml(p){return '<div class="product-art '+p.art+'" role="img" aria-label="Схематична ілюстрація: '+escapeHtml(p.ua)+'"><span class="product-badge">СКОРО У ПРОДАЖУ</span>'+garmentHtml(p)+imageElement(p)+'</div>';}
function cardHtml(p){return '<article class="product-card" data-id="'+p.id+'" tabindex="0" aria-label="Відкрити '+escapeHtml(p.ua)+'">'+artHtml(p)+'<div class="product-meta"><div><h3>'+escapeHtml(p.title)+'</h3><p>'+escapeHtml(p.ua)+'</p></div><button class="wish-btn '+(favorites.has(p.id)?"is-saved":"")+'" type="button" data-wish="'+p.id+'" aria-label="'+(favorites.has(p.id)?"Прибрати з обраного":"Додати в обране")+'">'+(favorites.has(p.id)?"♥":"♡")+'</button></div><div class="card-bottom">'+lineLabels[p.line]+' / CONCEPT ONLY</div></article>';}
function renderLine(line){const target=$("#"+line+"Grid");if(target)target.innerHTML=products.filter(p=>p.line===line).map(cardHtml).join("");}
function filteredProducts(){return products.filter(p=>(lineFilter==="all"||p.line===lineFilter)&&(typeFilter==="all"||p.type===typeFilter)&&(!onlyFavs||favorites.has(p.id))&&(!searchTerm||(p.title+" "+p.ua+" "+p.desc+" "+p.color).toLowerCase().includes(searchTerm)));}
function renderCatalog(){const filtered=filteredProducts();$("#catalogGrid").innerHTML=filtered.map(cardHtml).join("");$("#resultCount").textContent=filtered.length+" / 12 концептів"+(onlyFavs?" · ОБРАНЕ":"");$("#emptyState").hidden=filtered.length!==0;$$(".filter[data-filter]").forEach(b=>b.classList.toggle("active",b.dataset.filter===lineFilter));$$(".filter[data-type]").forEach(b=>b.classList.toggle("active",b.dataset.type===typeFilter));}
function renderAll(){for(const line of ["noir","atelier","terrain"])renderLine(line);renderCatalog();$("#favCount").textContent=String(favorites.size);enhanceImages();}
function saveFavorites(){try{localStorage.setItem("ownpace.demo.favorites",JSON.stringify([...favorites]));}catch(_){}renderAll();}
function toggleFavorite(id){if(favorites.has(id))favorites.delete(id);else favorites.add(id);saveFavorites();if(openProductId===id)updateDialogWish();}
function openProduct(id){const p=products.find(x=>x.id===id);if(!p)return;openProductId=id;$("#dialogLine").textContent="OWNPACE / "+lineLabels[p.line];$("#dialogTitle").textContent=p.title;$("#dialogDesc").textContent=p.ua+". "+p.desc;$("#dialogColor").textContent=p.color;$("#dialogFit").textContent=p.fit;$("#dialogVisual").innerHTML=artHtml(p);enhanceImages($("#dialogVisual"));updateDialogWish();const d=$("#productDialog");if(typeof d.showModal==="function")d.showModal();}
function updateDialogWish(){const b=$("#dialogWish");if(!b||!openProductId)return;const on=favorites.has(openProductId);b.textContent=on?"♥ У ОБРАНОМУ":"♡ ЗБЕРЕГТИ В ОБРАНЕ";}
function viewFromHash(){const key=location.hash.replace(/^#/,"").split("?")[0];return validViews.has(key)?key:"home";}
function showView(view){
 $$(".view").forEach(panel=>panel.classList.toggle("is-current",panel.dataset.panel===view));
 $$(".nav-link").forEach(link=>link.classList.toggle("is-active",link.dataset.nav===view));
 document.body.dataset.view=view;$("#mobileMenu").classList.remove("open");$("#mobileToggle").setAttribute("aria-expanded","false");
 window.scrollTo({top:0,behavior:"instant"});
 document.title=(view==="home"?"OWNPACE — Wear Your Pace":view.toUpperCase()+" / OWNPACE")+" | DROP 001";
}
window.addEventListener("hashchange",()=>{
 const hash=location.hash.replace(/^#/,"");
 if(validViews.has(hash))showView(hash);
 else if(["collections","noir-items","atelier-items","terrain-items"].includes(hash)){
 const owner=hash.includes("noir")?"noir":hash.includes("atelier")?"atelier":hash.includes("terrain")?"terrain":"home";showView(owner);
 requestAnimationFrame(()=>document.getElementById(hash)?.scrollIntoView({behavior:"smooth"}));
 } else showView("home");
});
document.addEventListener("click",e=>{
 const wish=e.target.closest("[data-wish]");if(wish){e.preventDefault();e.stopPropagation();toggleFavorite(wish.dataset.wish);return;}
 const card=e.target.closest(".product-card");if(card){openProduct(card.dataset.id);return;}
 const filter=e.target.closest("[data-filter]");if(filter){lineFilter=filter.dataset.filter;onlyFavs=false;renderCatalog();return;}
 const type=e.target.closest("[data-type]");if(type){typeFilter=type.dataset.type;onlyFavs=false;renderCatalog();return;}
});
document.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){const card=e.target.closest(".product-card");if(card && e.target===card){e.preventDefault();openProduct(card.dataset.id);}}});
$("#dialogWish").addEventListener("click",()=>{if(openProductId)toggleFavorite(openProductId);});
$("#closeProduct").addEventListener("click",()=>$("#productDialog").close());
$("#productDialog").addEventListener("click",e=>{if(e.target.id==="productDialog")e.target.close();});
$("#mobileToggle").addEventListener("click",()=>{const m=$("#mobileMenu");const open=m.classList.toggle("open");$("#mobileToggle").setAttribute("aria-expanded",String(open));});
$("#favToggle").addEventListener("click",()=>{onlyFavs=!onlyFavs;lineFilter="all";typeFilter="all";searchTerm="";$("#searchInput").value="";renderCatalog();location.hash="#catalog";});
const layer=$("#searchLayer");$("#searchToggle").addEventListener("click",()=>{layer.hidden=false;$("#searchInput").focus();});$("#searchClose").addEventListener("click",()=>{layer.hidden=true;});layer.addEventListener("click",e=>{if(e.target===layer)layer.hidden=true;});
$("#searchInput").addEventListener("keydown",e=>{if(e.key==="Enter"){searchTerm=e.target.value.trim().toLowerCase();lineFilter="all";typeFilter="all";onlyFavs=false;renderCatalog();layer.hidden=true;location.hash="#catalog";}});
document.addEventListener("keydown",e=>{if(e.key==="Escape")layer.hidden=true;});
for(const id of ["notifyButton","aboutPreview"]){$("#"+id).addEventListener("click",()=>$("#noticeDialog").showModal());}
for(const id of ["closeNotice","closeNoticeButton"]){$("#"+id).addEventListener("click",()=>$("#noticeDialog").close());}
$("#noticeDialog").addEventListener("click",e=>{if(e.target.id==="noticeDialog")e.target.close();});
renderAll();enhancePackages();showView(viewFromHash());
if(["collections","noir-items","atelier-items","terrain-items"].includes(location.hash.slice(1)))window.dispatchEvent(new Event("hashchange"));