function updateCountdown() {
  const deadline = new Date('2026-08-01T00:00:00Z');
  const diff = deadline - new Date();
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

function copyDeploy() {
  navigator.clipboard.writeText(document.getElementById('deploy-code').textContent).then(() => {
    const btn = document.getElementById('copy-btn');
    btn.textContent = 'Copied!'; btn.style.background = '#008f6e';
    setTimeout(() => { btn.textContent = 'Copy'; btn.style.background = ''; }, 2000);
  });
}
function copyDeploy2() {
  navigator.clipboard.writeText(document.getElementById('deploy-code-2').textContent).then(() => {
    const btn = document.getElementById('copy-btn-2');
    btn.textContent = 'Copied!';
    setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
  });
}

document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const el = document.getElementById(a.getAttribute('href').slice(1));
    if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth' }); }
  });
});
