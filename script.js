// ================================================
// AGENTSFLIX — 10/10 CONVERSION JAVASCRIPT
// All conversion triggers, animations, interactions
// ================================================

(() => {
  'use strict';

  // ── CONFIG ──
  const CONFIG = {
    launchDate: new Date('2026-08-01T00:00:00Z'),
    initialSpots: 2847,
    minSpots: 1200,
    spotDecreaseInterval: 180000, // 3 minutes
    exitIntentDelay: 0,
    floatingProofInterval: 15000,
    proofNames: [
      { name: 'Sarah K.', location: 'NYC', platform: 'iOS' },
      { name: 'Mike T.', location: 'LA', platform: 'Android' },
      { name: 'Jessica L.', location: 'Chicago', platform: 'iOS' },
      { name: 'David P.', location: 'Austin', platform: 'Android' },
      { name: 'Rachel C.', location: 'Seattle', platform: 'iOS' },
      { name: 'Alex K.', location: 'Miami', platform: 'iOS' },
      { name: 'Emma R.', location: 'Denver', platform: 'Android' },
      { name: 'James W.', location: 'Boston', platform: 'iOS' },
      { name: 'Lisa M.', location: 'Portland', platform: 'Android' },
      { name: 'Chris H.', location: 'Atlanta', platform: 'iOS' }
    ],
    proofTimes: ['1 min ago', '2 min ago', '3 min ago', '5 min ago', '8 min ago', '12 min ago', '15 min ago', '20 min ago', '25 min ago', '30 min ago']
  };

  // ── STATE ──
  let currentSpots = CONFIG.initialSpots;
  let floatingProofIndex = 0;
  let testimonialIndex = 0;
  let testimonialAutoPlay = null;

  // ── UTILITIES ──
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const fmt = n => n.toLocaleString();
  const pad = n => String(n).padStart(2, '0');

  // ── COUNTDOWN TIMERS ──
  function updateCountdowns() {
    const diff = CONFIG.launchDate - new Date();
    if (diff <= 0) return;
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);

    const setText = (id, val) => { const el = $(`#${id}`); if (el) el.textContent = val; };

    setText('hero-countdown', `${pad(days)}d ${pad(hours)}h ${pad(mins)}m`);
    setText('cta-countdown', `${pad(days)}d ${pad(hours)}h ${pad(mins)}m`);
    setText('countdown-inline', `${days}d ${hours}h ${mins}m ${secs}s`);
    setText('urgency-spots', fmt(currentSpots));
    setText('sticky-spots', fmt(currentSpots));
    setText('hero-spots', `${fmt(currentSpots)} spots left`);
  }

  // ── SPOTS ANIMATION ──
  function animateSpots() {
    setInterval(() => {
      if (currentSpots > CONFIG.minSpots) {
        const decrease = Math.floor(Math.random() * 3) + 1;
        currentSpots = Math.max(CONFIG.minSpots, currentSpots - decrease);
        updateSpotsDisplay();
      }
    }, CONFIG.spotDecreaseInterval);
  }

  function updateSpotsDisplay() {
    const spots = [$('#sticky-spots'), $('#urgency-spots'), $('#hero-spots')];
    spots.forEach(el => {
      if (el) {
        const isText = el.id === 'hero-spots';
        el.textContent = isText ? `${fmt(currentSpots)} spots left` : fmt(currentSpots);
      }
    });
  }

  // ── STATS COUNTER ANIMATION ──
  function initStatsCounter() {
    const counters = $$('.stat-num[data-target]');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.target, 10);
          const suffix = el.nextElementSibling?.classList.contains('stat-suffix') ? el.nextElementSibling.textContent : '';
          animateNumber(el, target, suffix);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => observer.observe(c));
  }

  function animateNumber(el, target, suffix = '') {
    const duration = 1800;
    const start = performance.now();
    const startVal = 0;
    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(startVal + (target - startVal) * eased);
      el.textContent = fmt(current);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = fmt(target) + suffix;
    }
    requestAnimationFrame(step);
  }

  // ── FLOATING SOCIAL PROOF ──
  function initFloatingProof() {
    const container = $('#floatingProof');
    if (!container) return;

    function showProof() {
      const proof = CONFIG.proofNames[floatingProofIndex % CONFIG.proofNames.length];
      const time = CONFIG.proofTimes[floatingProofIndex % CONFIG.proofTimes.length];

      $('#proof-name').textContent = proof.name;
      $('#proof-location').textContent = proof.location;
      $('#proof-time').textContent = time;

      container.classList.add('visible');

      setTimeout(() => {
        container.classList.remove('visible');
        floatingProofIndex++;
        setTimeout(showProof, CONFIG.floatingProofInterval);
      }, 4000);
    }

    // Start after 5 seconds
    setTimeout(showProof, 5000);
  }

  // ── TESTIMONIALS CAROUSEL ──
  function initTestimonials() {
    const track = $('#testimonialsTrack');
    const prevBtn = $('#testimonialPrev');
    const nextBtn = $('#testimonialNext');
    const dotsContainer = $('#testimonialDots');
    const cards = $$('.testimonial-card', track);

    if (!track || cards.length === 0) return;

    // Create dots
    cards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Testimonial ${i + 1}`);
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    });

    const dots = $$('.carousel-dot', dotsContainer);

    function updateCarousel() {
      const cardWidth = cards[0].offsetWidth + 24; // card + gap
      track.style.transform = `translateX(${-testimonialIndex * cardWidth}px)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === testimonialIndex));
    }

    function goToSlide(index) {
      testimonialIndex = (index + cards.length) % cards.length;
      updateCarousel();
      resetAutoPlay();
    }

    function nextSlide() { goToSlide(testimonialIndex + 1); }
    function prevSlide() { goToSlide(testimonialIndex - 1); }

    prevBtn?.addEventListener('click', prevSlide);
    nextBtn?.addEventListener('click', nextSlide);

    // Auto play
    function startAutoPlay() {
      testimonialAutoPlay = setInterval(nextSlide, 5000);
    }
    function resetAutoPlay() {
      clearInterval(testimonialAutoPlay);
      startAutoPlay();
    }

    track.addEventListener('mouseenter', () => clearInterval(testimonialAutoPlay));
    track.addEventListener('mouseleave', startAutoPlay);

    startAutoPlay();
  }

  // ── WATCH PORTAL LOGIC ──
  window.initWatchPortal = function() {
    const choices = [
      { id: 1, text: "Confront the CEO directly", next: "Scene B: CEO Audit" },
      { id: 2, text: "Hack the database", next: "Scene C: Deep Web Access" }
    ];

    const choiceContainer = $('#choiceContainer');
    choices.forEach(c => {
      const btn = document.createElement('button');
      btn.className = 'branch-btn';
      btn.textContent = c.text;
      btn.onclick = () => branchStory(c.next);
      choiceContainer.appendChild(btn);
    });
  };

  window.branchStory = function(next) {
    const title = $('#showcaseTitle');
    const desc = $('#showcaseDesc');
    const status = $('#actorStatus');

    status.textContent = 'Rendering new branch...';

    setTimeout(() => {
      title.textContent = next;
      desc.textContent = 'AI agent generated new timeline branch: ' + next;
      status.textContent = 'Active: Watching...';
    }, 1000);
  };

  // ── NEURAL PARTICLES BACKGROUND ──
  function initHeroParticles() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width, height;
    let particles = [];

    function resize() {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    }

    window.addEventListener('resize', resize);
    resize();

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 1.5 + 0.5;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx = -this.vx;
        if (this.y < 0 || this.y > height) this.vy = -this.vy;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(229, 9, 20, 0.5)';
        ctx.fill();
      }
    }

    const particleCount = Math.min(Math.floor((width * height) / 15000), 100);
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(229, 9, 20, ${0.2 - dist/500})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animate);
    }

    animate();
  }

  // ── INIT ──
  function init() {
    updateCountdowns();
    setInterval(updateCountdowns, 1000);
    animateSpots();
    initStatsCounter();
    initFloatingProof();
    initTestimonials();
    initHeroParticles();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();