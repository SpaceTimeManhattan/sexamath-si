// SEXAMATH.si dissertation viewer: PDF.js lazy pages + live-synced table of contents.
const PDF_URL = 'assets/pdf/McClain_Dissertation_Books_I-XIV.pdf';
const GAP = 10;
const box = document.getElementById('dpages'), msg = document.getElementById('dmsg');
const tocs = document.getElementById('dtocs'), cur = document.getElementById('dcur'), tot = document.getElementById('dtot');
const jump = document.getElementById('djump'), go = document.getElementById('dgo'), filt = document.getElementById('dfilter');
const links = Array.from(tocs.querySelectorAll('a[data-p]')).map((a, i) => ({ a, p: +a.dataset.p, i }));
const sorted = links.slice().sort((x, y) => x.p - y.p || x.i - y.i);
let pdf = null, N = 6215, W = 0, H = 0, ratio = 1.414, pages = [], rendered = new Map(), active = null, lastPage = 0, ticking = false;

function step() { return H + GAP; }
function pageAt(y) { return Math.min(N, Math.max(1, Math.floor(y / step()) + 1)); }
function layout() {
  W = Math.max(200, box.clientWidth - 2 * GAP - 2); H = Math.round(W * ratio);
  for (const d of pages) { d.style.width = W + 'px'; d.style.height = H + 'px'; }
}
function goto(p) {
  p = Math.min(N, Math.max(1, p | 0));
  box.scrollTop = (p - 1) * step();
  if (window.innerWidth <= 900) { const nav = document.querySelector('nav'); const y = box.getBoundingClientRect().top + window.scrollY - ((nav && nav.offsetHeight) || 0) - 8; window.scrollTo({ top: y, behavior: 'smooth' }); }
  if (!pdf) pendingJump = p;
}
let pendingJump = 0;

async function renderPage(n) {
  if (rendered.has(n) || !pdf) return;
  const holder = pages[n - 1]; const st = { task: null, canvas: null }; rendered.set(n, st);
  try {
    const page = await pdf.getPage(n);
    if (!rendered.has(n)) return;
    const vp1 = page.getViewport({ scale: 1 });
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const vp = page.getViewport({ scale: (W / vp1.width) * dpr });
    const c = document.createElement('canvas'); c.width = Math.floor(vp.width); c.height = Math.floor(vp.height);
    st.canvas = c; st.task = page.render({ canvasContext: c.getContext('2d'), viewport: vp });
    await st.task.promise;
    if (rendered.get(n) === st) { holder.prepend(c); }
  } catch (e) { if (e && e.name !== 'RenderingCancelledException') console.warn('page', n, e); rendered.delete(n); }
}
function drop(n) {
  const st = rendered.get(n); if (!st) return; rendered.delete(n);
  try { st.task && st.task.cancel(); } catch (e) {}
  if (st.canvas) { st.canvas.remove(); st.canvas.width = st.canvas.height = 0; }
}
function update() {
  ticking = false; if (!H) return;
  const top = box.scrollTop, first = pageAt(top), last = pageAt(top + box.clientHeight);
  const now = pageAt(top + box.clientHeight * 0.3);
  for (let n = Math.max(1, first - 1); n <= Math.min(N, last + 2); n++) renderPage(n);
  for (const n of Array.from(rendered.keys())) if (n < first - 6 || n > last + 6) drop(n);
  if (now !== lastPage) { lastPage = now; cur.textContent = now; syncToc(now); }
}
function syncToc(p) {
  let lo = 0, hi = sorted.length - 1, k = -1;
  while (lo <= hi) { const m = (lo + hi) >> 1; if (sorted[m].p <= p) { k = m; lo = m + 1; } else hi = m - 1; }
  const it = k >= 0 ? sorted[k] : null;
  if (!it || it === active) return;
  if (active) active.a.classList.remove('on');
  active = it; it.a.classList.add('on');
  if (filt.value.trim()) return;
  for (let el = it.a.parentElement; el && el !== tocs; el = el.parentElement) if (el.tagName === 'DETAILS' && !el.open) el.open = true;
  const r = it.a.getBoundingClientRect(), tr = tocs.getBoundingClientRect();
  if (r.top < tr.top + 20 || r.bottom > tr.bottom - 20) tocs.scrollTop += (r.top - tr.top) - tocs.clientHeight / 3;
}
box.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
window.addEventListener('resize', () => { const p = lastPage || 1; layout(); for (const n of Array.from(rendered.keys())) drop(n); box.scrollTop = (p - 1) * step(); update(); });
tocs.addEventListener('click', e => {
  const a = e.target.closest('a[data-p]'); if (!a) return;
  e.preventDefault(); goto(+a.dataset.p);
  const sum = a.closest('summary'); if (sum) { const d = sum.parentElement; setTimeout(() => { d.open = true; }, 0); }
});
go.addEventListener('click', () => goto(+jump.value));
jump.addEventListener('keydown', e => { if (e.key === 'Enter') goto(+jump.value); });

// Filter
let ft;
filt.addEventListener('input', () => { clearTimeout(ft); ft = setTimeout(applyFilter, 150); });
function applyFilter() {
  const q = filt.value.trim().toLowerCase();
  tocs.querySelectorAll('.hit').forEach(el => el.classList.remove('hit'));
  if (q.length < 2) { tocs.classList.remove('filt'); return; }
  tocs.classList.add('filt');
  for (const { a } of links) {
    if (!a.textContent.toLowerCase().includes(q)) continue;
    for (let el = a.parentElement; el && el !== tocs; el = el.parentElement) {
      if (el.tagName === 'LI' || el.classList.contains('bk')) el.classList.add('hit');
      if (el.tagName === 'DETAILS') el.open = true;
    }
    // a matched chapter/book heading shows its children too
    const d = a.closest('summary') && a.closest('summary').parentElement;
    if (d) d.querySelectorAll('li').forEach(li => li.classList.add('hit'));
  }
}

async function init() {
  try {
    const pdfjs = await import('../pdfjs/pdf.min.mjs');
    pdfjs.GlobalWorkerOptions.workerSrc = new URL('../pdfjs/pdf.worker.min.mjs', import.meta.url).href;
    pdf = await pdfjs.getDocument({ url: PDF_URL, disableAutoFetch: true, disableStream: true, rangeChunkSize: 262144 }).promise;
    N = pdf.numPages; tot.textContent = N; jump.max = N;
    const p1 = await pdf.getPage(1); const v = p1.getViewport({ scale: 1 }); ratio = v.height / v.width;
    msg.remove();
    const frag = document.createDocumentFragment();
    for (let n = 1; n <= N; n++) { const d = document.createElement('div'); d.className = 'pgx'; d.innerHTML = '<span class="n">' + n + '</span>'; pages.push(d); frag.appendChild(d); }
    box.appendChild(frag); layout();
    const h = location.hash.match(/page=(\d+)/);
    if (pendingJump) goto(pendingJump); else if (h) goto(+h[1]);
    update(); syncToc(lastPage || 1);
    window.__dissReady = true;
  } catch (e) {
    console.error(e); msg.innerHTML = 'The inline viewer could not load here. <a href="' + PDF_URL + '" target="_blank" rel="noopener">Open the full PDF</a>.';
  }
}
const io = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { io.disconnect(); init(); } }, { rootMargin: '600px' });
io.observe(document.getElementById('diss'));
