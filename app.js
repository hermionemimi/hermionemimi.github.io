const letterEl = document.getElementById('letter');
const envelope = document.getElementById('envelope');
const envWrap  = document.getElementById('envWrap');
const hint     = document.getElementById('hint');
const reseal   = document.getElementById('reseal');
const langs    = document.getElementById('langs');
const seal     = envelope.querySelector('.seal');

let lang = 'zh';
let opened = false;

function renderLetter(){
  const d = T[lang];
  document.title = d.title;
  document.documentElement.lang = (lang==='zh'?'zh':lang);
  reseal.textContent = d.reseal;

  let html = `<div class="letter-head">
      <div class="letter-title">${d.title}</div>
      <div class="rule"></div>
    </div><div class="body">`;
  d.body.forEach(b=>{
    const cls = b.t==='refrain' ? ' class="refrain"' : (b.t==='ps' ? ' class="ps"' : '');
    html += `<p${cls}>${b.x}</p>`;
  });
  html += `</div>
    <div class="sig">
      <div class="name">${d.name}</div>
      <div class="date">${d.date}</div>
    </div>`;
  letterEl.innerHTML = html;
  letterEl.setAttribute('data-lang', lang);
}

function openEnvelope(){
  if(opened) return;
  opened = true;
  envelope.classList.add('opened');
  envWrap.classList.add('opened');
  // bring in the letter after the flap lifts
  setTimeout(()=>{
    envWrap.style.display='none';
    letterEl.classList.add('show');
    reseal.classList.add('show');
    requestAnimationFrame(()=> requestAnimationFrame(()=> letterEl.classList.add('reveal')));
  }, 620);
}

function closeEnvelope(){
  opened = false;
  letterEl.classList.remove('reveal');
  setTimeout(()=>{
    letterEl.classList.remove('show');
    reseal.classList.remove('show');
    envWrap.style.display='flex';
    envelope.classList.remove('opened');
    envWrap.classList.remove('opened');
    // reset the gate
    gateShown = false;
    lock.classList.remove('show');
    hint.style.display = '';
    pw.value = '';
    if (typeof paintCells === 'function') paintCells();
    window.scrollTo({top:0, behavior:'smooth'});
  }, 500);
}

/* ===== password gate ===== */
const PASS = "20070110";
const lock  = document.getElementById('lock');
const pin   = document.getElementById('pin');
const pw    = document.getElementById('pw');
const cells = Array.from(document.getElementById('pinCells').children);
let gateShown = false;

function paintCells(){
  const n = pw.value.length;
  const focused = (document.activeElement === pw);
  cells.forEach((c,i)=>{
    c.classList.toggle('filled', i < n);
    c.classList.toggle('active', focused && i === n && n < cells.length);
  });
}

function showGate(){
  if(gateShown || opened) return;
  gateShown = true;
  hint.style.display = 'none';
  lock.classList.add('show');
  setTimeout(()=>{ pw.focus(); paintCells(); }, 80);
}

function reject(){
  pin.classList.remove('shake');
  void pin.offsetWidth;            // restart animation
  pin.classList.add('shake');
  setTimeout(()=>{ pw.value=''; paintCells(); pw.focus(); }, 430);
}

function tryOpen(){
  if(pw.value === PASS){
    lock.classList.remove('show');
    openEnvelope();
  } else {
    reject();
  }
}

envelope.addEventListener('click', showGate);
envelope.addEventListener('keydown', e=>{
  if(e.key==='Enter' || e.key===' '){ e.preventDefault(); showGate(); }
});
pw.addEventListener('input', ()=>{
  pw.value = pw.value.replace(/\D/g,'').slice(0, PASS.length);
  paintCells();
  if(pw.value.length === PASS.length) tryOpen();
});
pw.addEventListener('keydown', e=>{ if(e.key==='Enter'){ e.preventDefault(); tryOpen(); } });
pw.addEventListener('focus', paintCells);
pw.addEventListener('blur', paintCells);
pin.addEventListener('click', ()=> pw.focus());

reseal.addEventListener('click', closeEnvelope);

langs.addEventListener('click', e=>{
  const btn = e.target.closest('.stamp');
  if(!btn) return;
  lang = btn.dataset.lang;
  langs.querySelectorAll('.stamp').forEach(s=>s.classList.toggle('active', s===btn));
  renderLetter();
});

renderLetter();
