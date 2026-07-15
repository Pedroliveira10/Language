import { readFile, writeFile } from 'node:fs/promises';

const file = new URL('../public/index.html', import.meta.url);
let html = await readFile(file, 'utf8');

if (html.includes('id="learningPanel"')) {
  console.log('Local learning features are already installed.');
  process.exit(0);
}

const css = `
.studio-toolbar{display:flex;justify-content:center;gap:10px;flex-wrap:wrap;margin:0 0 22px}
.toolbar-button{border:1px solid var(--border);background:rgba(255,255,255,.82);color:var(--text);border-radius:13px;padding:10px 14px;cursor:pointer;font-weight:800;box-shadow:0 8px 24px rgba(23,32,51,.07)}
.toolbar-button:hover{transform:translateY(-1px);box-shadow:0 12px 28px rgba(23,32,51,.11)}
.toolbar-button span{color:var(--muted);font-weight:650;margin-left:5px}
.studio-panel{margin:0 0 22px;padding:22px;border:1px solid var(--border);border-radius:22px;background:rgba(255,255,255,.9);box-shadow:var(--shadow);backdrop-filter:blur(18px)}
.studio-panel[hidden]{display:none!important}
.panel-heading{display:flex;align-items:flex-start;justify-content:space-between;gap:18px;margin-bottom:18px}
.panel-heading h2{font-size:24px;margin:0 0 4px}.panel-heading p{color:var(--muted);margin:0;line-height:1.5}
.close-panel{border:0;background:transparent;color:var(--muted);cursor:pointer;font-size:22px;line-height:1;padding:5px}
.stats-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin-bottom:20px}
.stat-card{padding:15px;border:1px solid var(--border);border-radius:15px;background:rgba(248,250,252,.85)}
.stat-card strong{display:block;font-size:25px;letter-spacing:-.03em}.stat-card span{font-size:12px;color:var(--muted)}
.goal-row{display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:10px;margin:0 0 20px}
.goal-track{height:9px;border-radius:99px;background:#e5e7eb;overflow:hidden}.goal-fill{height:100%;width:0;background:linear-gradient(90deg,#2563eb,#0f766e);transition:width .25s}
.panel-section{border-top:1px solid var(--border);padding-top:18px;margin-top:18px}.panel-section h3{margin:0 0 12px;font-size:17px}
.course-controls{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
.course-toggle{display:flex;align-items:center;gap:10px;padding:12px;border:1px solid var(--border);border-radius:13px;cursor:pointer}
.course-toggle input{width:18px;height:18px;accent-color:#2563eb}.course-toggle span{font-weight:750}
.achievement-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
.achievement{display:flex;gap:10px;align-items:flex-start;padding:13px;border:1px solid var(--border);border-radius:13px;background:#f8fafc}
.achievement.locked{filter:grayscale(1);opacity:.5}.achievement-icon{font-size:24px}.achievement strong{display:block;font-size:14px}.achievement small{display:block;color:var(--muted);margin-top:3px;line-height:1.35}
.preference-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}
.preference-field{display:grid;gap:7px;color:var(--muted);font-size:13px;font-weight:700}
.preference-field select,.preference-field input[type=number]{width:100%;min-height:44px;border:1px solid var(--border);border-radius:11px;background:#fff;color:var(--text);padding:9px 11px;font:inherit}
.preference-check{display:flex;align-items:center;gap:10px;min-height:44px;padding:9px 11px;border:1px solid var(--border);border-radius:11px;background:#fff;color:var(--text);font-size:14px}
.preference-check input{width:18px;height:18px;accent-color:#2563eb}
.enrollment-badge{position:absolute;top:20px;right:20px;z-index:1;padding:6px 9px;border-radius:999px;background:#eef2f6;color:var(--muted);font-size:11px;font-weight:850}
.enrollment-badge.active{background:#dcfce7;color:#166534}
html[data-theme=dark]{--bg:#111827;--card:rgba(31,41,55,.9);--text:#f8fafc;--muted:#cbd5e1;--border:#374151;--shadow:0 24px 70px rgba(0,0,0,.35)}
html[data-theme=dark] body{background:radial-gradient(circle at 12% 8%,rgba(220,38,38,.13),transparent 27rem),radial-gradient(circle at 88% 12%,rgba(15,118,110,.18),transparent 27rem),#111827}
html[data-theme=dark] .studio-panel,html[data-theme=dark] .toolbar-button{background:rgba(31,41,55,.94)}
html[data-theme=dark] .stat-card,html[data-theme=dark] .achievement{background:#182233}
html[data-theme=dark] .preference-field select,html[data-theme=dark] .preference-field input,html[data-theme=dark] .preference-check{background:#111827;color:var(--text)}
@media(max-width:1050px){.stats-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:760px){
  .studio-toolbar{margin-bottom:14px}.toolbar-button{flex:1;min-width:140px}
  .studio-panel{padding:17px;border-radius:18px}.stats-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
  .course-controls,.achievement-grid,.preference-grid{grid-template-columns:1fr}
  .goal-row{grid-template-columns:1fr auto}.goal-row strong:first-child{grid-column:1/-1}
  .enrollment-badge{top:15px;right:15px}
}`;

const panels = `
    <div class="studio-toolbar">
      <button class="toolbar-button" type="button" onclick="toggleStudioPanel('learningPanel')">My learning <span id="toolbarSummary">0 courses</span></button>
      <button class="toolbar-button" type="button" onclick="toggleStudioPanel('preferencesPanel')">Preferences</button>
    </div>

    <section class="studio-panel" id="learningPanel" hidden>
      <div class="panel-heading">
        <div><h2>My learning</h2><p>Your courses, progress, achievements and activity on this device.</p></div>
        <button class="close-panel" type="button" aria-label="Close My learning" onclick="toggleStudioPanel('learningPanel')">&times;</button>
      </div>
      <div class="stats-grid">
        <div class="stat-card"><strong id="statCourses">0</strong><span>Courses enrolled</span></div>
        <div class="stat-card"><strong id="statModules">0</strong><span>Modules completed</span></div>
        <div class="stat-card"><strong id="statSessions">0</strong><span>Study sessions</span></div>
        <div class="stat-card"><strong id="statMinutes">0</strong><span>Minutes studied</span></div>
      </div>
      <div class="goal-row">
        <strong>Today's goal</strong>
        <div class="goal-track" aria-hidden="true"><div class="goal-fill" id="dailyGoalFill"></div></div>
        <span id="dailyGoalText">0 / 10 min</span>
      </div>
      <div class="panel-section">
        <h3>Course enrolment</h3>
        <div class="course-controls">
          <label class="course-toggle"><input type="checkbox" data-course="pl" onchange="setCourseEnrollment('pl',this.checked)"><span>Polish</span></label>
          <label class="course-toggle"><input type="checkbox" data-course="nl" onchange="setCourseEnrollment('nl',this.checked)"><span>Dutch</span></label>
          <label class="course-toggle"><input type="checkbox" data-course="pt" onchange="setCourseEnrollment('pt',this.checked)"><span>Portuguese (PT)</span></label>
        </div>
      </div>
      <div class="panel-section">
        <h3>Achievements</h3>
        <div class="achievement-grid" id="achievementGrid"></div>
      </div>
    </section>

    <section class="studio-panel" id="preferencesPanel" hidden>
      <div class="panel-heading">
        <div><h2>Preferences</h2><p>These choices are saved automatically in this browser.</p></div>
        <button class="close-panel" type="button" aria-label="Close Preferences" onclick="toggleStudioPanel('preferencesPanel')">&times;</button>
      </div>
      <div class="preference-grid">
        <label class="preference-field">Appearance
          <select id="themePreference" onchange="updateStudioPreference('theme',this.value)">
            <option value="system">Use device setting</option><option value="light">Light</option><option value="dark">Dark</option>
          </select>
        </label>
        <label class="preference-field">Daily goal (minutes)
          <input id="goalPreference" type="number" min="5" max="180" step="5" oninput="updateStudioPreference('dailyGoal',Number(this.value))">
        </label>
        <label class="preference-field">Audio
          <span class="preference-check"><input id="soundPreference" type="checkbox" onchange="updateStudioPreference('soundEnabled',this.checked)"> Enable pronunciation audio</span>
        </label>
      </div>
    </section>`;

const script = `
const LOCAL_PROFILE_KEY = 'language-studio-local-profile-v1';
const LANGUAGE_NAMES = {pl:'Polish',nl:'Dutch',pt:'Portuguese (PT)'};
const DEFAULT_LOCAL_PROFILE = {
  enrolled:[],
  preferences:{theme:'system',soundEnabled:true,dailyGoal:10},
  stats:{sessions:0,seconds:0,studyDates:[],today:{date:'',seconds:0},byLanguage:{}},
  achievements:{}
};
const ACHIEVEMENTS = [
  {id:'first-course',icon:'🎓',title:'First course',description:'Enrol in your first course.',test:x=>x.enrolled.length>=1},
  {id:'first-module',icon:'✅',title:'First module',description:'Complete your first learning module.',test:(x,p)=>p.done>=1},
  {id:'getting-started',icon:'🚀',title:'Getting started',description:'Begin three study sessions.',test:x=>x.stats.sessions>=3},
  {id:'three-courses',icon:'🌍',title:'Language explorer',description:'Enrol in all three courses.',test:x=>x.enrolled.length>=3},
  {id:'three-days',icon:'🔥',title:'Study habit',description:'Study on three different days.',test:x=>x.stats.studyDates.length>=3},
  {id:'half-hour',icon:'⏱️',title:'Focused learner',description:'Study for at least 30 minutes.',test:(x,p)=>p.seconds>=1800}
];

function readStoredJson(key,fallback){try{return JSON.parse(localStorage.getItem(key)||JSON.stringify(fallback))}catch{return fallback}}
function loadLocalProfile(){
  const saved=readStoredJson(LOCAL_PROFILE_KEY,{});
  return {...DEFAULT_LOCAL_PROFILE,...saved,preferences:{...DEFAULT_LOCAL_PROFILE.preferences,...saved.preferences},stats:{...DEFAULT_LOCAL_PROFILE.stats,...saved.stats,today:{...DEFAULT_LOCAL_PROFILE.stats.today,...saved.stats?.today},byLanguage:{...saved.stats?.byLanguage}},achievements:{...saved.achievements}};
}
let localProfile=loadLocalProfile();
let activeStudySession=null;

function saveLocalProfile(render=true){
  localStorage.setItem(LOCAL_PROFILE_KEY,JSON.stringify(localProfile));
  if(render)renderLocalDashboard();
}
function todayKey(){return new Date().toISOString().slice(0,10)}
function normalizeToday(){
  if(localProfile.stats.today.date!==todayKey())localProfile.stats.today={date:todayKey(),seconds:0};
}
function progressSnapshot(){
  const dutch=readStoredJson('englishPathState',{});
  const polish=readStoredJson('language-studio-pl',{completed:[]});
  const portuguese=readStoredJson('language-studio-pt-PT',{completed:[]});
  const rows=[
    {code:'nl',done:Object.values(dutch).filter(Boolean).length,total:6},
    {code:'pl',done:Array.isArray(polish.completed)?polish.completed.length:0,total:104},
    {code:'pt',done:Array.isArray(portuguese.completed)?portuguese.completed.length:0,total:104}
  ];
  return {rows,done:rows.reduce((sum,row)=>sum+row.done,0),total:rows.reduce((sum,row)=>sum+row.total,0)};
}
function currentSessionSeconds(){
  return activeStudySession?.started&&!document.hidden?Math.max(0,Math.floor((Date.now()-activeStudySession.started)/1000)):0;
}
function totalStudySeconds(){return localProfile.stats.seconds+currentSessionSeconds()}
function unlockLocalAchievements(progress){
  const view={...progress,seconds:totalStudySeconds()};let changed=false;
  ACHIEVEMENTS.forEach(item=>{if(!localProfile.achievements[item.id]&&item.test(localProfile,view)){localProfile.achievements[item.id]=new Date().toISOString();changed=true}});
  if(changed)localStorage.setItem(LOCAL_PROFILE_KEY,JSON.stringify(localProfile));
}
function renderLocalDashboard(){
  normalizeToday();const progress=progressSnapshot();unlockLocalAchievements(progress);
  const seconds=totalStudySeconds();const minutes=Math.floor(seconds/60);const todaySeconds=localProfile.stats.today.seconds+currentSessionSeconds();
  const goal=Math.max(5,Number(localProfile.preferences.dailyGoal)||10);const todayMinutes=Math.floor(todaySeconds/60);
  document.getElementById('statCourses').textContent=localProfile.enrolled.length;
  document.getElementById('statModules').textContent=progress.done;
  document.getElementById('statSessions').textContent=localProfile.stats.sessions;
  document.getElementById('statMinutes').textContent=minutes;
  document.getElementById('toolbarSummary').textContent=localProfile.enrolled.length+' '+(localProfile.enrolled.length===1?'course':'courses');
  document.getElementById('dailyGoalText').textContent=todayMinutes+' / '+goal+' min';
  document.getElementById('dailyGoalFill').style.width=Math.min(100,Math.round(todayMinutes/goal*100))+'%';
  document.querySelectorAll('[data-course]').forEach(input=>input.checked=localProfile.enrolled.includes(input.dataset.course));
  Object.keys(LANGUAGE_NAMES).forEach(code=>{const badge=document.getElementById('badge-'+code);const active=localProfile.enrolled.includes(code);badge.textContent=active?'Enrolled':'Not enrolled';badge.classList.toggle('active',active)});
  document.getElementById('achievementGrid').innerHTML=ACHIEVEMENTS.map(item=>{const earned=localProfile.achievements[item.id];return '<div class="achievement '+(earned?'':'locked')+'"><span class="achievement-icon">'+item.icon+'</span><div><strong>'+item.title+'</strong><small>'+item.description+(earned?'<br>Unlocked '+new Date(earned).toLocaleDateString():'')+'</small></div></div>'}).join('');
  document.getElementById('themePreference').value=localProfile.preferences.theme;
  document.getElementById('goalPreference').value=goal;
  document.getElementById('soundPreference').checked=Boolean(localProfile.preferences.soundEnabled);
}
function applyLocalPreferences(){
  const choice=localProfile.preferences.theme;const dark=choice==='dark'||(choice==='system'&&matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.dataset.theme=dark?'dark':'light';
}
function updateStudioPreference(key,value){
  if(key==='dailyGoal')value=Math.min(180,Math.max(5,Number(value)||10));
  localProfile.preferences[key]=value;saveLocalProfile();applyLocalPreferences();
}
function setCourseEnrollment(code,enrolled){
  const courses=new Set(localProfile.enrolled);enrolled?courses.add(code):courses.delete(code);localProfile.enrolled=[...courses];saveLocalProfile();
}
function toggleStudioPanel(id){
  const panel=document.getElementById(id);const willOpen=panel.hidden;
  document.querySelectorAll('.studio-panel').forEach(item=>item.hidden=true);panel.hidden=!willOpen;
  if(willOpen){renderLocalDashboard();panel.scrollIntoView({behavior:'smooth',block:'start'})}
}
function enrolOnStart(code){if(!localProfile.enrolled.includes(code)){localProfile.enrolled.push(code)}}
function startStudySession(code){
  stopStudySession(false);normalizeToday();enrolOnStart(code);const date=todayKey();
  if(!localProfile.stats.studyDates.includes(date))localProfile.stats.studyDates.push(date);
  localProfile.stats.sessions+=1;
  const language=localProfile.stats.byLanguage[code]||{sessions:0,seconds:0};language.sessions+=1;localProfile.stats.byLanguage[code]=language;
  activeStudySession={code,started:Date.now()};saveLocalProfile();
}
function pauseStudySession(){
  if(!activeStudySession?.started)return;normalizeToday();const elapsed=Math.max(0,Math.floor((Date.now()-activeStudySession.started)/1000));
  localProfile.stats.seconds+=elapsed;localProfile.stats.today.seconds+=elapsed;
  localProfile.stats.byLanguage[activeStudySession.code].seconds=(localProfile.stats.byLanguage[activeStudySession.code].seconds||0)+elapsed;
  activeStudySession.started=null;saveLocalProfile(false);
}
function resumeStudySession(){if(activeStudySession&&!activeStudySession.started)activeStudySession.started=Date.now()}
function stopStudySession(render=true){if(activeStudySession){pauseStudySession();activeStudySession=null;if(render)saveLocalProfile()}}
function initializeLocalStudio(){
  normalizeToday();applyLocalPreferences();renderLocalDashboard();
  matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change',()=>{if(localProfile.preferences.theme==='system')applyLocalPreferences()});
  window.addEventListener('storage',renderLocalDashboard);
  document.addEventListener('visibilitychange',()=>{document.hidden?pauseStudySession():resumeStudySession()});
  window.addEventListener('pagehide',()=>stopStudySession(false));
  setInterval(()=>{if(activeStudySession)renderLocalDashboard()},30000);
}
`;

function replaceOrFail(source, search, replacement, label) {
  if (!source.includes(search)) throw new Error(`Could not find ${label} insertion point.`);
  return source.replace(search, replacement);
}

html = replaceOrFail(html,
  'footer{text-align:center;color:var(--muted);font-size:13px;margin-top:26px}',
  'footer{text-align:center;color:var(--muted);font-size:13px;margin-top:26px}' + css,
  'CSS');

html = replaceOrFail(html,
  '    <div class="languages">',
  panels + '\n\n    <div class="languages">',
  'dashboard');

for (const code of ['pl', 'nl', 'pt']) {
  const className = code === 'pl' ? 'polish' : code === 'nl' ? 'dutch' : 'portuguese';
  html = replaceOrFail(html,
    `<button class="language-card ${className}" onclick="openLanguage('${code}')">`,
    `<button class="language-card ${className}" id="course-card-${code}" onclick="openLanguage('${code}')">\n        <span class="enrollment-badge" id="badge-${code}">Not enrolled</span>`,
    `${code} course badge`);
}

html = replaceOrFail(html,
  'function openLanguage(code) {',
  script + '\nfunction openLanguage(code) {\n  startStudySession(code);',
  'profile script');

html = replaceOrFail(html,
  "  appHtml = appHtml.replace('</head>', `${MOBILE_INNER_CSS}</head>`);",
  "  appHtml = appHtml.replace('</head>', `${MOBILE_INNER_CSS}</head>`);\n  if (!localProfile.preferences.soundEnabled) {\n    appHtml = appHtml.replace('</body>', '<script>window.speak=function(){};window.speechSynthesis?.cancel();<\\/script></body>');\n  }",
  'audio preference');

html = replaceOrFail(html,
  "function backToLanguages() {\n  const frame = document.getElementById('appFrame');",
  "function backToLanguages() {\n  stopStudySession();\n  const frame = document.getElementById('appFrame');",
  'session stop');

html = replaceOrFail(html,
  "const last = localStorage.getItem('last-language-studio');",
  "initializeLocalStudio();\n\nconst last = localStorage.getItem('last-language-studio');",
  'initialization');

await writeFile(file, html, 'utf8');
console.log('Added local preferences, achievements, statistics, and course enrolment.');
