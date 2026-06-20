/* ===== 1. time-aware atmosphere ===== */
(function(){
  const now = new Date();
  const h = now.getHours();
  const m = now.getMinutes();
  const minuteOfDay = h * 60 + m;
  let period;
  if(minuteOfDay < 720)        period = 'blue';       // before 12:00
  else if(minuteOfDay < 1350)  period = 'pink';       // 12:00–22:29
  else                         period = 'deepblue';   // 22:30+

  document.body.classList.add('time-' + period);
  const ov = document.getElementById('timeOverlay');
  requestAnimationFrame(()=> ov.classList.add('active'));

  if(h >= 14 && h < 18){
    document.documentElement.style.setProperty('--shadow-opacity','0.12');
  } else if(h >= 18 && h < 20){
    document.documentElement.style.setProperty('--shadow-opacity','0.06');
  }

  const hintMap = {
    blue:{
      zh:'晨光里，轻触信封',
      fr:'Lumière du matin — touchez l\'enveloppe',
      en:'In the morning light — tap the envelope'
    },
    pink:{
      zh:'轻触信封，展开这封信',
      fr:'Touchez l\'enveloppe pour ouvrir la lettre',
      en:'Tap the envelope to open the letter'
    },
    deepblue:{
      zh:'夜深了，轻触信封',
      fr:'Il est tard — touchez l\'enveloppe',
      en:'It\'s late — tap the envelope'
    }
  };
  const hintEl = document.getElementById('hint');
  const spans = hintEl.querySelectorAll('span');
  const hm = hintMap[period];
  spans[0].textContent = hm[lang==='zh'?'zh':(lang==='fr'?'fr':'en')];
  if(spans[1]) spans[1].textContent = lang==='zh' ? '' : hm.zh;
})();

/* ===== 2. aging letter paper ===== */
(function(){
  const key = 'mimi-reads';
  let reads = parseInt(localStorage.getItem(key) || '0', 10);
  reads++;
  localStorage.setItem(key, String(reads));

  const age = Math.min(reads, 30);
  const darken = age * 0.006;
  const warm   = age * 0.4;

  const r = 239 - Math.round(warm * 0.8);
  const g = 231 - Math.round(warm * 1.2);
  const b = 214 - Math.round(warm * 1.6);
  document.documentElement.style.setProperty('--paper',  `rgb(${r},${g},${b})`);
  document.documentElement.style.setProperty('--paper-edge', `rgb(${r-12},${g-15},${b-22})`);

  const letter = document.getElementById('letter');
  letter.style.filter = `brightness(${1 - darken})`;
})();
