/* ===== 3. music playlist ===== */
(function(){
  const playlist = [
    { src:'wanfeng.mp3',           name:'晚风 — 陈婧霏' },
    { src:'paul-cavetown.mp3',     name:'Paul — Cavetown' }
  ];
  let idx = 0;
  let audio = null;
  let playing = false;

  const btn       = document.getElementById('playerBtn');
  const infoPanel = document.getElementById('playerInfo');
  const trackName = document.getElementById('trackName');
  const prevBtn   = document.getElementById('prevBtn');
  const nextBtn   = document.getElementById('nextBtn');

  function updateIcon(){
    btn.innerHTML = playing
      ? '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect class="icon-pause" x="6" y="4" width="4" height="16" rx="1"/><rect class="icon-pause" x="14" y="4" width="4" height="16" rx="1"/></svg>'
      : '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><polygon class="icon-play" points="7,4 20,12 7,20"/></svg>';
  }

  function loadTrack(i){
    idx = ((i % playlist.length) + playlist.length) % playlist.length;
    const wasPlaying = playing;
    if(audio){ audio.pause(); audio.removeEventListener('ended', onEnded); }
    audio = new Audio(encodeURI(playlist[idx].src));
    audio.addEventListener('ended', onEnded);
    trackName.textContent = playlist[idx].name;
    if(wasPlaying){ audio.play(); }
  }

  function onEnded(){
    loadTrack(idx + 1);
    audio.play();
  }

  function toggle(){
    if(!audio) loadTrack(0);
    if(playing){
      audio.pause();
      playing = false;
    } else {
      audio.play();
      playing = true;
    }
    btn.classList.toggle('playing', playing);
    infoPanel.classList.toggle('show', playing);
    updateIcon();
  }

  btn.addEventListener('click', toggle);
  prevBtn.addEventListener('click', ()=>{ loadTrack(idx - 1); if(playing) audio.play(); });
  nextBtn.addEventListener('click', ()=>{ loadTrack(idx + 1); if(playing) audio.play(); });

  trackName.textContent = playlist[0].name;
  updateIcon();
})();
