const juzSel = document.getElementById('juz');
const markBtn = document.getElementById('markDone');
const resetBtn = document.getElementById('resetAll');
const progressEl = document.getElementById('progress');
const listEl = document.getElementById('doneList');

const key = "khatma_done_juz";
const done = new Set(JSON.parse(localStorage.getItem(key) || "[]"));

for(let i=1;i<=30;i++){
  const o = document.createElement('option');
  o.value = String(i);
  o.textContent = `الجزء ${i}`;
  juzSel.appendChild(o);
}

function save(){ localStorage.setItem(key, JSON.stringify([...done].sort((a,b)=>a-b))); }
function render(){
  const arr = [...done].sort((a,b)=>a-b);
  progressEl.textContent = `تم إنجاز: ${arr.length} / 30 جزء`;
  listEl.innerHTML = '';

  if(arr.length===0){
    const empty = document.createElement('div');
    empty.className = 'item';
    empty.textContent = "ابدأ من الجزء 1 وسجّل الإنجاز هنا.";
    listEl.appendChild(empty);
    return;
  }

  arr.forEach(n=>{
    const d = document.createElement('div');
    d.className = 'item';
    d.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap">
        <div><span class="tag">منجز</span> الجزء ${n}</div>
        <button class="btn">إزالة</button>
      </div>
    `;
    d.querySelector('button').onclick = ()=>{ done.delete(n); save(); render(); };
    listEl.appendChild(d);
  });
}

markBtn.onclick = ()=>{ done.add(Number(juzSel.value)); save(); render(); };
resetBtn.onclick = ()=>{ localStorage.removeItem(key); done.clear(); render(); };
render();
