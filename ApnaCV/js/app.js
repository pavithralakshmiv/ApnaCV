const templateNames=[
"Classic ATS","Clean Professional","Modern ATS","Corporate","Executive","Simple One-Column","Minimal Professional","Formal","Standard Business","Elegant ATS",
"Fresher Classic","Engineering Student","College Placement","Internship","Student Projects","Academic","Skills Focus","Achievement Focus","Modern Fresher","First Resume",
"Modern Blue","Modern Sidebar","Modern Split","Modern Timeline","Modern Minimal","Bold Header","Clean Grid","Contemporary","Professional Sidebar","Modern Corporate",
"Developer","Software Engineer","Full Stack","Data Science","AI / ML","Cybersecurity","Cloud Engineer","DevOps","Data Analyst","Tech Minimal",
"Creative Portfolio","Designer","Visual Minimal","Elegant","Portfolio Style","Timeline Creative","Magazine Style","Bold Creative","Artistic","Personal Brand",
"Research","Academic CV","Business Analyst","Product Manager","Marketing","Finance","Management","International","Experienced Professional","Career Change"
];
let selectedTemplate=0;
let data={education:[],skills:[],projects:[],experience:[],custom:[]};

function qs(id){return document.getElementById(id)}
function showOnly(id){document.querySelectorAll('.screen,.builder').forEach(x=>x.classList.add('hidden'));qs(id).classList.remove('hidden')}
function showQuestions(){showOnly('questions')}
function showTemplates(){showOnly('templates'); renderTemplates()}
function showBuilder(index=0){selectedTemplate=index;showOnly('builder');qs('templateLabel').textContent=templateNames[selectedTemplate];renderFields();update()}
function renderTemplates(){
 const grid=qs('templateGrid');grid.innerHTML='';
 templateNames.forEach((name,i)=>{
  const card=document.createElement('div');card.className='template-card';
  const patterns=['classic','center','sidebar','timeline','bold','minimal','split','boxed'];
  const p=patterns[i%patterns.length];
  card.innerHTML=`<div class="mini mini-${p}"><div class="title"></div><div class="line"></div><div class="line short"></div><div class="line"></div><div class="line medium"></div><div class="line"></div></div><strong>${name}</strong><small>Template ${i+1}</small>`;
  card.onclick=()=>showBuilder(i);grid.appendChild(card);
 });
}
function addItem(type){
 data[type].push({});
 renderFields();update();
}
function removeItem(type,i){data[type].splice(i,1);renderFields();update()}
function field(type,i,key,placeholder){
 return `<input placeholder="${placeholder}" value="${escapeAttr(data[type][i][key]||'')}" oninput="data.${type}[${i}].${key}=this.value;update()">`
}
function renderFields(){
 ['education','skills','projects','experience'].forEach(type=>{
  const box=qs(type+'Fields');box.innerHTML='';
  data[type].forEach((item,i)=>{
   const div=document.createElement('div');div.className='item';
   div.innerHTML=`<button class="remove" onclick="removeItem('${type}',${i})">Delete</button>`;
   if(type==='education') div.innerHTML+=field(type,i,'school','College / University')+field(type,i,'degree','Degree / Course')+field(type,i,'year','Year');
   if(type==='skills') div.innerHTML+=field(type,i,'name','Skill');
   if(type==='projects') div.innerHTML+=field(type,i,'name','Project name')+`<textarea placeholder="Description" oninput="data.projects[${i}].desc=this.value;update()">${escapeHtml(item.desc||'')}</textarea>`;
   if(type==='experience') div.innerHTML+=field(type,i,'company','Company / Organization')+field(type,i,'role','Role')+field(type,i,'year','Duration')+`<textarea placeholder="What did you do?" oninput="data.experience[${i}].desc=this.value;update()">${escapeHtml(item.desc||'')}</textarea>`;
   box.appendChild(div);
  });
 });
 renderCustomFields();
}
function renderCustomFields(){
 const box=qs('customSections');box.innerHTML='';
 data.custom.forEach((s,i)=>{
  const wrap=document.createElement('div');wrap.className='form-section';
  wrap.innerHTML=`<div class="section-title"><h3>${escapeHtml(s.name)}</h3><button class="small" onclick="deleteCustom(${i})">Delete Section</button></div>
  <textarea placeholder="Add information..." oninput="data.custom[${i}].content=this.value;update()">${escapeHtml(s.content||'')}</textarea>`;
  box.appendChild(wrap);
 });
}
function createSection(){
 const name=prompt('Section name (e.g. Achievements, Publications, Volunteer Experience):');
 if(!name||!name.trim())return;
 data.custom.push({name:name.trim(),content:''});renderFields();update();
}
function deleteCustom(i){data.custom.splice(i,1);renderFields();update()}
function val(id){return qs(id)?.value?.trim()||''}
function update(){
 const name=val('name')||'Your Name',role=val('role')||'Professional Title';
 const links=[val('email'),val('phone'),val('location'),val('links')].filter(Boolean).join(' • ');
 let html=`<h1>${escapeHtml(name)}</h1><div class="role">${escapeHtml(role)}</div><div class="contact">${escapeHtml(links||'email@example.com • Phone • Location')}</div>`;
 if(val('summary'))html+=section('PROFILE',`<p>${escapeHtml(val('summary'))}</p>`);
 if(data.education.length)html+=section('EDUCATION',data.education.map(x=>`<div class="entry"><b>${escapeHtml(x.degree||'Degree / Course')}</b> — ${escapeHtml(x.school||'College / University')} ${x.year?`(${escapeHtml(x.year)})`:''}</div>`).join(''));
 if(data.skills.length)html+=section('SKILLS',`<p>${data.skills.map(x=>escapeHtml(x.name||'Skill')).join(' • ')}</p>`);
 if(data.projects.length)html+=section('PROJECTS',data.projects.map(x=>`<div class="entry"><b>${escapeHtml(x.name||'Project')}</b><p>${escapeHtml(x.desc||'Project description')}</p></div>`).join(''));
 if(data.experience.length)html+=section('EXPERIENCE',data.experience.map(x=>`<div class="entry"><b>${escapeHtml(x.role||'Role')} — ${escapeHtml(x.company||'Company')}</b> ${x.year?`<small>(${escapeHtml(x.year)})</small>`:''}<p>${escapeHtml(x.desc||'Experience description')}</p></div>`).join(''));
 data.custom.forEach(s=>{if(s.content)html+=section(s.name.toUpperCase(),`<p>${escapeHtml(s.content)}</p>`)});
 qs('resumePreview').innerHTML=html;
 qs('templateLabel').textContent=templateNames[selectedTemplate];
 const r=qs('resumePreview');r.className='resume '+templateClass(selectedTemplate);
}
function section(title,content){return `<div class="resume-section"><h2>${escapeHtml(title)}</h2>${content}</div>`}
function templateClass(i){return 't'+(i+1)}
function saveResume(){localStorage.setItem('apnaCVResume',JSON.stringify({data,fields:{name:val('name'),role:val('role'),email:val('email'),phone:val('phone'),location:val('location'),links:val('links'),summary:val('summary')},template:selectedTemplate}));toast('Resume saved in this browser.')}
function loadResume(){
 const raw=localStorage.getItem('apnaCVResume');if(!raw)return;
 try{const x=JSON.parse(raw);data=x.data||data;selectedTemplate=x.template||0;Object.entries(x.fields||{}).forEach(([k,v])=>{if(qs(k))qs(k).value=v});}catch(e){}
}
function downloadPDF(){
 update();
 const clone=qs('resumePreview').cloneNode(true);
 const w=window.open('','_blank');
 w.document.write(`<html><head><title>${safeFilename(val('name')||'My')}_Resume</title><style>body{margin:0;background:#fff;font-family:Arial}.resume{width:794px;min-height:1123px;padding:55px;box-sizing:border-box;margin:auto}.resume h1{margin:0;font-size:30px}.role{font-size:15px;color:#666;margin:5px 0 12px}.contact{font-size:11px;color:#666;border-bottom:1px solid #ddd;padding-bottom:13px}.resume-section{margin-top:22px}.resume-section h2{font-size:13px;letter-spacing:1.2px;border-bottom:1px solid #bbb;padding-bottom:5px}.resume-section p,.entry{font-size:12px;line-height:1.55}.modern h1{color:#6c63ff}.modern .resume-section h2{color:#6c63ff}.creative{border-top:10px solid #6c63ff}</style></head><body>${clone.outerHTML}</body></html>`);
 w.document.close();w.focus();setTimeout(()=>w.print(),400);
 toast('PDF print dialog opened. Choose "Save as PDF".');
}
function safeFilename(s){return s.replace(/[^a-z0-9]+/gi,'_').replace(/^_|_$/g,'')||'My'}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
function escapeAttr(s){return escapeHtml(s)}
function toast(t){const x=qs('toast');x.textContent=t;x.classList.add('show');setTimeout(()=>x.classList.remove('show'),2500)}
window.addEventListener('load',()=>{loadResume();addItem('education');addItem('skills');addItem('projects')});
