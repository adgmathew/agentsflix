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
  set('cd-days', pad(days)); set('cd-hours', pad(hours));
  set('cd-mins', pad(mins)); set('cd-secs', pad(secs));
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
    const ta = document.createElement('textarea');
    ta.value = code; document.body.appendChild(ta); ta.select();
    document.execCommand('copy'); document.body.removeChild(ta);
    const btn = document.getElementById('copy-btn');
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

// ── FORM MODAL ──
function openForm() {
  document.getElementById('formModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeForm() {
  document.getElementById('formModal').classList.remove('open');
  document.body.style.overflow = '';
}
function closeFormOutside(e) {
  if (e.target === document.getElementById('formModal')) closeForm();
}
function togglePain(btn) {
  btn.classList.toggle('selected');
}
function submitForm() {
  const name  = document.getElementById('f-name').value.trim();
  const email = document.getElementById('f-email').value.trim();
  const co    = document.getElementById('f-company').value.trim();
  if (!name || !email || !co) {
    alert('Please fill in your name, email, and company name.');
    return;
  }
  const btn = document.querySelector('.form-submit-btn');
  btn.textContent = '✓ Sent! We\'ll be in touch within 24 hours.';
  btn.style.background = '#008f6e';
  btn.disabled = true;
  setTimeout(closeForm, 2400);
}

// ── DEMO MODAL ──
function openDemo() {
  document.getElementById('demoModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeDemo() {
  document.getElementById('demoModal').classList.remove('open');
  document.body.style.overflow = '';
}
function closeDemoOutside(e) {
  if (e.target === document.getElementById('demoModal')) closeDemo();
}
function switchTab(btn, panelId) {
  document.querySelectorAll('.modal-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.modal-panel').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  const p = document.getElementById(panelId);
  if (p) p.classList.add('active');
}
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeForm(); closeDemo(); }
});
