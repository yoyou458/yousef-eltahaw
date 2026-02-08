const items = ["سبحان الله","الحمد لله","الله أكبر","لا إله إلا الله","أستغفر الله"];
const root = document.getElementById('tasbihList');
const keyPrefix = "tasbih_";

function getCount(name){ return Number(localStorage.getItem(keyPrefix + name) || 0); }
function setCount(name, v){ localStorage.setItem(keyPrefix + name, String(v)); }

function render(){
  root.innerHTML = '';
  items.forEach(name => {
    const count = getCount(name);

    const div = document.createElement('div');
    div.className = 'item';
    div.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap">
        <div>
          <div class="tag">${name}</div>
          <div style="font-size:22px;color:var(--gold2);margin-top:6px">${count}</div>
        </div>
        <div style="display:flex;gap:8px">
          <button class="btn" data-act="plus">+1</button>
          <button class="btn" data-act="minus">-1</button>
          <button class="btn" data-act="reset">تصفير</button>
        </div>
      </div>
    `;

    div.querySelector('[data-act="plus"]').onclick = () => { setCount(name, count + 1); render(); };
    div.querySelector('[data-act="minus"]').onclick = () => { setCount(name, Math.max(0, count - 1)); render(); };
    div.querySelector('[data-act="reset"]').onclick = () => { setCount(name, 0); render(); };

    root.appendChild(div);
  });
}
render();
