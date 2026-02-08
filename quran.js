const surahSelect = document.getElementById('surahSelect');
const searchInput = document.getElementById('search');
const loadBtn = document.getElementById('loadBtn');
const statusEl = document.getElementById('status');
const ayahsEl = document.getElementById('ayahs');
const audioEl = document.getElementById('audio');

let surahs = [];
let audioQueue = [];
let currentIndex = 0;

async function fetchJSON(url){
  const r = await fetch(url);
  if(!r.ok) throw new Error("Network error");
  return await r.json();
}

function renderSurahOptions(list){
  surahSelect.innerHTML = '';
  list.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s.number;
    opt.textContent = `${s.number}. ${s.name}`;
    surahSelect.appendChild(opt);
  });
}

function applySearch(){
  const q = searchInput.value.trim();
  if(!q){
    renderSurahOptions(surahs);
    return;
  }
  const qNum = Number(q);
  const filtered = surahs.filter(s => {
    if(!Number.isNaN(qNum) && qNum > 0) return s.number === qNum;
    return (s.name || '').includes(q);
  });
  renderSurahOptions(filtered.length ? filtered : surahs);
}

async function loadSurah(num){
  ayahsEl.innerHTML = '';
  statusEl.textContent = "جارٍ تحميل السورة…";

  const data = await fetchJSON(`https://api.alquran.cloud/v1/surah/${num}/ar.alafasy`);
  const surah = data?.data;

  audioQueue = (surah.ayahs || []).map(a => a.audio);
  currentIndex = 0;

  statusEl.textContent = `تم تحميل: ${surah.name} (${surah.numberOfAyahs} آية)`;

  (surah.ayahs || []).forEach(a => {
    const box = document.createElement('div');
    box.className = 'quran-ayah';
    box.innerHTML = `
      <div class="n">آية ${a.numberInSurah}</div>
      <div class="t">${a.text}</div>
    `;
    ayahsEl.appendChild(box);
  });

  playCurrent();
}

function playCurrent(){
  if(currentIndex >= audioQueue.length) return;
  audioEl.src = audioQueue[currentIndex];
  audioEl.play().catch(()=>{});
}

audioEl.addEventListener("ended", () => {
  currentIndex++;
  if(currentIndex < audioQueue.length){
    playCurrent();
  }
});

(async function init(){
  try{
    const res = await fetchJSON('https://api.alquran.cloud/v1/surah');
    surahs = res?.data || [];
    renderSurahOptions(surahs);
    statusEl.textContent = "اختر سورة للقراءة والاستماع.";
    surahSelect.value = "1";
    await loadSurah(1);
  }catch(e){
    statusEl.textContent = "خطأ في تحميل السور. تأكد من الإنترنت.";
  }
})();

searchInput.addEventListener('input', applySearch);
loadBtn.addEventListener('click', () => loadSurah(Number(surahSelect.value)));
surahSelect.addEventListener('change', () => loadSurah(Number(surahSelect.value)));
