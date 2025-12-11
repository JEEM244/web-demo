/* Contador sencillo con historial en localStorage y export CSV */
const el = id => document.getElementById(id);
const countEl = el('count');
const historyEl = el('history');
const INC = el('inc'), DEC = el('dec'), RESET = el('reset'), EXPORT = el('export');

let state = {
  count: 0,
  history: []
};

function load(){
  try{
    const raw = localStorage.getItem('webdemo_state');
    if(raw){ state = JSON.parse(raw); }
  }catch(e){ console.error('load error',e); }
  render();
}

function save(){
  localStorage.setItem('webdemo_state', JSON.stringify(state));
}

function pushHistory(action){
  state.history.unshift({t: new Date().toISOString(), action, value: state.count});
  if(state.history.length>50) state.history.pop();
  save();
  renderHistory();
}

function render(){
  countEl.textContent = state.count;
  renderHistory();
}

function renderHistory(){
  historyEl.innerHTML = '';
  if(state.history.length===0){ historyEl.innerHTML = '<li>(vacío)</li>'; return; }
  for(const it of state.history){
    const li = document.createElement('li');
    li.textContent = `${it.t.replace('T',' ').slice(0,19)} — ${it.action} → ${it.value}`;
    historyEl.appendChild(li);
  }
}

/* acciones */
INC.onclick = () => { state.count++; save(); pushHistory('increment'); render(); }
DEC.onclick = () => { state.count--; save(); pushHistory('decrement'); render(); }
RESET.onclick = () => { state.count = 0; save(); pushHistory('reset'); render(); }

/* exportar CSV */
EXPORT.onclick = () => {
  const rows = ['timestamp,action,value', ...state.history.map(h => `${h.t},${h.action},${h.value}`)];
  const csv = rows.join('\\n');
  const blob = new Blob([csv], {type:'text/csv'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'webdemo_history.csv';
  a.click();
  URL.revokeObjectURL(url);
};

load();
