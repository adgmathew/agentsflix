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
  let count = 2847;
  const el = document.getElementById('waitlist-count');
  const sticky = document.getElementById('sticky-spots');
  const inline = document.querySelector('.urgency-bar span[style*="color:var(--red)"]');

  function update(val) {
    if (el) el.textContent = val.toLocaleString();
    if (sticky) sticky.textContent = val.toLocaleString();
    if (inline) inline.textContent = `Only ${val.toLocaleString()} waitlist spots left`;
  }

  setInterval(() => {
    if (Math.random() > 0.3) {
      count -= Math.floor(Math.random() * 3) + 1;
      if (count < 100) count = 100; // Cap it
      update(count);
    }
  }, 4000 + Math.random() * 3000);
}
animateSpots();

// ── EXIT INTENT POPUP ──
let exitShown = false;
document.addEventListener('mouseleave', (e) => {
  if (exitShown) return;
  if (e.clientY < 0) {
    exitShown = true;
    document.getElementById('exitIntent')?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
});

// ── WAITLIST ──
function joinWaitlist() {
  closeVideoModal();
  closeExitIntent();
  const email = document.getElementById('hero-email')?.value || document.getElementById('waitlist-email')?.value;
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
  document.body.style.overflow = '';
}

function joinWaitlistFromExit() {
  const email = document.getElementById('exit-email')?.value;
  closeExitIntent();
  document.getElementById('waitlistModal').classList.add('open');
  document.body.style.overflow = 'hidden';
  const wlEmail = document.getElementById('wl-email');
  if (wlEmail && email) wlEmail.value = email;
}

// ── VIDEO MODAL ──
const videoModal = document.getElementById('videoModal');
const previewVideo = document.getElementById('previewVideo');
const videoTitle = document.getElementById('videoTitle');
const videoMeta = document.getElementById('videoMeta');

const videoSources = {
  'The CEO\'s Secret': 'https://player.vimeo.com/external/494252666.sd.mp4?s=7220934586238b313dabc28962da07bc961476f5&profile_id=165',
  'Midnight Revenge': 'https://player.vimeo.com/external/494252666.sd.mp4?s=7220934586238b313dabc28962da07bc961476f5&profile_id=165',
  'Dragon\'s Heir': 'https://player.vimeo.com/external/494252666.sd.mp4?s=7220934586238b313dabc28962da07bc961476f5&profile_id=165',
  'Time Loop Love': 'https://player.vimeo.com/external/494252666.sd.mp4?s=7220934586238b313dabc28962da07bc961476f5&profile_id=165',
  'Royal Escape': 'https://player.vimeo.com/external/494252666.sd.mp4?s=7220934586238b313dabc28962da07bc961476f5&profile_id=165'
};

function openVideoModal(title, genre) {
  if (videoTitle) videoTitle.textContent = title;
  if (videoMeta) videoMeta.textContent = `Trending in ${genre.charAt(0).toUpperCase() + genre.slice(1)}`;
  if (previewVideo) {
    previewVideo.src = videoSources[title] || videoSources['The CEO\'s Secret'];
    previewVideo.play().catch(e => console.log('Auto-play blocked'));
  }
  videoModal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeVideoModal() {
  videoModal.classList.remove('open');
  if (previewVideo) {
    previewVideo.pause();
    previewVideo.src = "";
  }
  document.body.style.overflow = '';
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
  if (e.key === 'Escape') {
    closeWaitlistModal();
    closeVideoModal();
    closeExitIntent();
  }
});

// ── SCROLL REVEAL ──
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));

// ── HERO PARALLAX EFFECT ──
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg && scrolled < window.innerHeight) {
    heroBg.style.transform = `translateY(${scrolled * 0.4}px)`;
  }
});
