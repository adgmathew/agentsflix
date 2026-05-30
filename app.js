// ── COUNTDOWN ──
function updateCountdown() {
  const diff = new Date('2026-08-01T00:00:00Z') - new Date();
  if (diff <= 0) return;
  const days  = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins  = Math.floor((diff % 3600000) / 60000);
  const secs  = Math.floor((diff % 60000) / 1000);
  const pad   = n => String(n).padStart(2,'0');
  const set   = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  set('cd-days', pad(days)); set('cd-hours', pad(hours)); set('cd-mins', pad(mins)); set('cd-secs', pad(secs));
  set('fc-days', pad(days)); set('fc-hours', pad(hours)); set('fc-mins', pad(mins));
  set('cd-days-feat', days);
  const il = document.getElementById('countdown-inline');
  if (il) il.textContent = days + ' days, ' + hours + 'h ' + mins + 'm remaining';
}
updateCountdown();
setInterval(updateCountdown, 1000);

// ── COPY DEPLOY ──
function copyDeploy() {
  const code = document.getElementById('deploy-code').textContent;
  navigator.clipboard.writeText(code).then(() => {
    const btn = document.getElementById('copy-btn');
    btn.textContent = '✓ Copied!'; btn.style.background = '#008f6e';
    setTimeout(() => { btn.textContent = 'Copy'; btn.style.background = ''; }, 2200);
  }).catch(() => {
    // Fallback for older browsers
    const ta = document.createElement('textarea');
    ta.value = code; document.body.appendChild(ta); ta.select();
    document.execCommand('copy'); document.body.removeChild(ta);
    const btn = document.getElementById('copy-btn');
    btn.textContent = '✓ Copied!';
    setTimeout(() => { btn.textContent = 'Copy'; }, 2200);
  });
}
function copyDeploy2() {
  const code = document.getElementById('deploy-code-2').textContent;
  navigator.clipboard.writeText(code).then(() => {
    const btn = document.getElementById('copy-btn-2');
    btn.textContent = '✓ Copied!';
    setTimeout(() => { btn.textContent = 'Copy'; }, 2200);
  });
}

// ── SMOOTH SCROLL ──
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth' }); }
  });
});

// ── DEMO MODAL ──
function openDemo() {
  const modal = document.getElementById('demoModal');
  if (modal) { modal.classList.add('open'); document.body.style.overflow = 'hidden'; }
}
function closeModal() {
  const modal = document.getElementById('demoModal');
  if (modal) { modal.classList.remove('open'); document.body.style.overflow = ''; }
}
function closeDemo(e) {
  if (e.target === document.getElementById('demoModal')) closeModal();
}
function switchTab(btn, panelId) {
  document.querySelectorAll('.dm-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.dm-panel').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  const panel = document.getElementById(panelId);
  if (panel) panel.classList.add('active');
}
// Close modal on Escape
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
