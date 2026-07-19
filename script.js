// ── COUNTDOWN TIMER ──
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
  const il = document.getElementById('countdown-inline');
  if (il) il.textContent = days + ' days, ' + hours + 'h ' + mins + 'm remaining';
}
updateCountdown();
setInterval(updateCountdown, 1000);

// ── LIMITED SPOTS ANIMATION ──
function animateSpots() {
  const spots = [2847, 2843, 2839, 2832, 2828, 2821, 2817, 2812];
  let idx = 0;
  const el = document.getElementById('waitlist-count');
  const sticky = document.getElementById('sticky-spots');
  setInterval(() => {
    idx = (idx + 1) % spots.length;
    const val = spots[idx];
    if (el) el.textContent = val.toLocaleString();
    if (sticky) sticky.textContent = val.toLocaleString();
  }, 3000 + Math.random() * 2000);
}
animateSpots();

// ── EXIT INTENT POPUP ──
let exitShown = false;
document.addEventListener('mouseleave', (e) => {
  if (exitShown) return;
  if (e.clientY < 0) {
    exitShown = true;
    setTimeout(() => {
      document.getElementById('waitlistModal')?.classList.add('open');
      document.body.style.overflow = 'hidden';
    }, 300);
  }
});

// ── WAITLIST ──
function joinWaitlist() {
  const email = document.getElementById('hero-email')?.value || document.getElementById('waitlist-email')?.value;
  if (!email || !email.includes('@')) {
    alert('Please enter a valid email address.');
    return;
  }
  // Open modal for full form
  document.getElementById('waitlistModal').classList.add('open');
  document.body.style.overflow = 'hidden';
  // Pre-fill email
  const wlEmail = document.getElementById('wl-email');
  if (wlEmail && email) wlEmail.value = email;
}

function closeWaitlistModal() {
  document.getElementById('waitlistModal').classList.remove('open');
  document.body.style.overflow = '';
}
document.getElementById('waitlistModal')?.addEventListener('click', function(e) {
  if (e.target === this) closeWaitlistModal();
});

function closeExitIntent() {
  document.getElementById('exitIntent')?.classList.remove('open');
}

function joinWaitlistFromExit() {
  const email = document.getElementById('exit-email')?.value;
  if (!email || !email.includes('@')) {
    alert('Please enter a valid email address.');
    return;
  }
  closeExitIntent();
  // Open main waitlist modal
  document.getElementById('waitlistModal').classList.add('open');
  document.body.style.overflow = 'hidden';
  const wlEmail = document.getElementById('wl-email');
  if (wlEmail && email) wlEmail.value = email;
}

function handleWaitlistSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const nameEl = form.querySelector('#wl-name');
  const emailEl = form.querySelector('#wl-email');
  const name = nameEl?.value.trim() || '';
  const email = emailEl?.value.trim() || '';
  
  if (!name || !email) {
    alert('Please fill in your name and email.');
    return;
  }

  const btn = document.getElementById('wlSubmitBtn');
  if (btn) {
    btn.textContent = '✓ You\'re on the list! We\'ll be in touch.';
    btn.style.background = '#008f6e';
    btn.disabled = true;
  }
  setTimeout(closeWaitlistModal, 2500);
}

// ── STICKY BAR ON SCROLL ──
const stickyBar = document.getElementById('stickyBar');
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const current = window.scrollY;
  if (current > 600 && !stickyBar?.classList.contains('visible')) {
    stickyBar?.classList.add('visible');
  } else if (current <= 400) {
    stickyBar?.classList.remove('visible');
  }
  lastScroll = current;
});

function closeStickyBar() {
  stickyBar?.classList.remove('visible');
}

// ── FAQ ACCORDION ──
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const answer = btn.nextElementSibling;
    const isOpen = answer.classList.contains('open');
    // Close all
    document.querySelectorAll('.faq-a').forEach(a => a.classList.remove('open'));
    document.querySelectorAll('.faq-q').forEach(q => q.classList.remove('open'));
    // Open clicked (if it wasn't already open)
    if (!isOpen) {
      answer.classList.add('open');
      btn.classList.add('open');
    }
  });
});

// ── SMOOTH SCROLL ──
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth' }); }
  });
});

// ── ESC TO CLOSE MODALS ──
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeWaitlistModal();
});

// ── HERO PARALLAX EFFECT ──
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg && scrolled < window.innerHeight) {
    heroBg.style.transform = `translateY(${scrolled * 0.4}px)`;
  }
});
