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
  let exitIntentShown = false;
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
    const setHTML = (id, val) => { const el = $(`#${id}`); if (el) el.innerHTML = val; };

    setText('cd-days', pad(days));
    setText('cd-hours', pad(hours));
    setText('cd-mins', pad(mins));
    setText('cd-secs', pad(secs));

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
    const spots = [$('#waitlist-count'), $('#sticky-spots'), $('#urgency-spots'), $('#hero-spots')];
    spots.forEach(el => {
      if (el) {
        const isText = el.id === 'hero-spots';
        el.textContent = isText ? `${fmt(currentSpots)} spots left` : fmt(currentSpots);
        el.style.animation = 'none';
        el.offsetHeight; // trigger reflow
        el.style.animation = 'spotsPulse 0.5s ease';
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

    // Touch swipe
    let touchStartX = 0;
    track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) diff > 0 ? nextSlide() : prevSlide();
    }, { passive: true });

    // Auto play
    function startAutoPlay() {
      testimonialAutoPlay = setInterval(nextSlide, 5000);
    }
    function resetAutoPlay() {
      clearInterval(testimonialAutoPlay);
      startAutoPlay();
    }

    // Pause on hover
    track.addEventListener('mouseenter', () => clearInterval(testimonialAutoPlay));
    track.addEventListener('mouseleave', startAutoPlay);

    startAutoPlay();
  }

  // ── EARNINGS CALCULATOR ──
  function initCalculator() {
    const sliders = {
      episodes: $('#slider-episodes'),
      views: $('#slider-views'),
      engagement: $('#slider-engagement'),
      subscribers: $('#slider-subscribers')
    };

    const valueDisplays = {
      episodes: $('#val-episodes'),
      views: $('#val-views'),
      engagement: $('#val-engagement'),
      subscribers: $('#val-subscribers')
    };

    const results = {
      ad: $('#result-ad'),
      tips: $('#result-tips'),
      subs: $('#result-subs'),
      total: $('#result-total')
    };

    function formatCurrency(n) {
      return '$' + n.toLocaleString();
    }

    function formatViews(n) {
      if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
      if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
      return String(n);
    }

    function calculate() {
      const eps = parseInt(sliders.episodes.value, 10);
      const views = parseInt(sliders.views.value, 10);
      const engagement = parseFloat(sliders.engagement.value);
      const subs = parseInt(sliders.subscribers.value, 10);

      // Ad revenue: $3-5 CPM, assume $4 * views/1000 * episodes
      const adRevenue = Math.round(4 * (views / 1000) * eps * 0.7);

      // Tips: engagement% of viewers tip avg $2
      const tipViewers = Math.round(views * eps * (engagement / 100));
      const tips = Math.round(tipViewers * 2 * 0.15); // 15% tip rate

      // Subscriptions: $4.99/mo * 70% share * subscribers
      const subRev = Math.round(4.99 * 0.7 * subs);

      const total = adRevenue + tips + subRev;

      valueDisplays.episodes.textContent = fmt(eps);
      valueDisplays.views.textContent = formatViews(views);
      valueDisplays.engagement.textContent = engagement.toFixed(1) + '%';
      valueDisplays.subscribers.textContent = fmt(subs);

      animateValue(results.ad, adRevenue, formatCurrency);
      animateValue(results.tips, tips, formatCurrency);
      animateValue(results.subs, subRev, formatCurrency);
      animateValue(results.total, total, formatCurrency);
    }

    function animateValue(el, target, formatter) {
      const start = parseInt(el.textContent.replace(/[$,]/g, ''), 10) || 0;
      const duration = 600;
      const startTime = performance.now();
      function step(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (target - start) * eased);
        el.textContent = formatter(current);
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    Object.values(sliders).forEach(slider => {
      slider.addEventListener('input', calculate);
      slider.addEventListener('change', calculate);
    });

    calculate();
  }

  // ── SCROLL REVEAL ──
  function initScrollReveal() {
    const reveals = $$('.reveal, .step-showcase, .genre-card, .creator-card, .spotlight-card, .showcase-card, .demo-feature, .calc-slider, .faq-item, .press-quote, .testimonial-card');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    reveals.forEach(el => observer.observe(el));
  }

  // ── HERO PARALLAX ──
  function initHeroParallax() {
    const heroBg = $('.hero-bg');
    const heroVideo = $('.hero-video');
    if (!heroBg) return;
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      if (scrolled < window.innerHeight) {
        heroBg.style.transform = `translateY(${scrolled * 0.3}px)`;
        if (heroVideo) heroVideo.style.transform = `translateY(${scrolled * 0.15}px) scale(1.05)`;
      }
    }, { passive: true });
  }

  // ── VIDEO PLAY INTERACTIONS ──
  function initVideoPlayers() {
    // Hero video fallback
    const heroVideo = $('.hero-video');
    const heroFallback = $('#heroVideoFallback');
    if (heroVideo && heroFallback) {
      heroVideo.addEventListener('error', () => {
        heroVideo.style.display = 'none';
        heroFallback.style.display = 'flex';
      });
      // Show fallback initially, hide when video can play
      heroVideo.addEventListener('canplay', () => {
        heroFallback.style.display = 'none';
      });
    }

    // Demo video player
    const demoVideo = $('#demoVideo');
    const demoPlayBtn = $('#demoPlayBtn');
    const demoFallback = $('#demoVideoFallback');

    if (demoVideo && demoPlayBtn) {
      demoPlayBtn.addEventListener('click', () => {
        if (demoVideo.paused) {
          demoVideo.play().catch(() => {
            if (demoFallback) demoFallback.style.display = 'flex';
          });
          demoPlayBtn.style.opacity = '0';
          demoPlayBtn.style.pointerEvents = 'none';
        } else {
          demoVideo.pause();
          demoPlayBtn.style.opacity = '1';
          demoPlayBtn.style.pointerEvents = 'auto';
        }
      });

      demoVideo.addEventListener('play', () => {
        demoPlayBtn.style.opacity = '0';
        demoPlayBtn.style.pointerEvents = 'none';
      });

      demoVideo.addEventListener('pause', () => {
        demoPlayBtn.style.opacity = '1';
        demoPlayBtn.style.pointerEvents = 'auto';
      });

      demoVideo.addEventListener('error', () => {
        if (demoFallback) demoFallback.style.display = 'flex';
        demoPlayBtn.style.display = 'none';
      });

      demoVideo.addEventListener('ended', () => {
        demoPlayBtn.style.opacity = '1';
        demoPlayBtn.style.pointerEvents = 'auto';
      });
    }

    // Showcase video cards hover preview
    $$('.video-thumb').forEach(thumb => {
      thumb.addEventListener('mouseenter', () => {
        const overlay = thumb.querySelector('.video-play-overlay');
        if (overlay) overlay.style.opacity = '1';
      });
      thumb.addEventListener('mouseleave', () => {
        const overlay = thumb.querySelector('.video-play-overlay');
        if (overlay) overlay.style.opacity = '0';
      });
    });
  }

  // ── FAQ ACCORDION ──
  function initFAQ() {
    $$('.faq-q').forEach(btn => {
      btn.addEventListener('click', () => {
        const answer = btn.nextElementSibling;
        const isOpen = answer.classList.contains('open');

        // Close all
        $$('.faq-a').forEach(a => a.classList.remove('open'));
        $$('.faq-q').forEach(q => q.setAttribute('aria-expanded', 'false'));

        // Open clicked if not already open
        if (!isOpen) {
          answer.classList.add('open');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  // ── SMOOTH SCROLL ──
  function initSmoothScroll() {
    $$('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const id = a.getAttribute('href').slice(1);
        const el = $('#' + id);
        if (el) {
          e.preventDefault();
          const offset = 80;
          const top = el.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: 'smooth' });
          // Close mobile menu if open
          document.body.classList.remove('nav-open');
        }
      });
    });
  }

  // ── MODALS ──
  function openModal(modalId) {
    const modal = $(`#${modalId}`);
    if (modal) {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
      // Focus first input
      setTimeout(() => {
        const input = modal.querySelector('input, select, textarea');
        if (input) input.focus();
      }, 100);
    }
  }

  function closeModal(modalId) {
    const modal = $(`#${modalId}`);
    if (modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  // Waitlist modal
  window.joinWaitlist = function() {
    const email = $('#hero-email')?.value || $('#waitlist-email')?.value;
    if (email && !email.includes('@')) {
      alert('Please enter a valid email address.');
      return;
    }
    openModal('waitlistModal');
    if (email) $('#wl-email').value = email;
  };

  window.closeWaitlistModal = function() { closeModal('waitlistModal'); };

  // Exit intent modal
  function initExitIntent() {
    let exitShown = false;
    document.addEventListener('mouseleave', e => {
      if (exitShown) return;
      if (e.clientY <= 0) {
        exitShown = true;
        setTimeout(() => openModal('exitIntent'), 300);
      }
    });

    // Also trigger on scroll up fast near top
    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', () => {
      if (exitShown) return;
      const currentY = window.scrollY;
      if (currentY < 100 && lastScrollY - currentY > 100) {
        exitShown = true;
        setTimeout(() => openModal('exitIntent'), 300);
      }
      lastScrollY = currentY;
    }, { passive: true });
  }

  window.closeExitIntent = function() { closeModal('exitIntent'); };

  window.joinWaitlistFromExit = function() {
    const email = $('#exit-email')?.value;
    if (email && !email.includes('@')) {
      alert('Please enter a valid email address.');
      return;
    }
    closeModal('exitIntent');
    openModal('waitlistModal');
    if (email) $('#wl-email').value = email;
  };

  // Form submission
  function initForms() {
    $('#waitlistForm')?.addEventListener('submit', handleWaitlistSubmit);
    $('#waitlist-email')?.addEventListener('keypress', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        joinWaitlist();
      }
    });
  }

  function handleWaitlistSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const name = form.querySelector('#wl-name')?.value.trim();
    const email = form.querySelector('#wl-email')?.value.trim();

    if (!name || !email) {
      alert('Please fill in your name and email.');
      return;
    }
    if (!email.includes('@')) {
      alert('Please enter a valid email address.');
      return;
    }

    const btn = $('#wlSubmitBtn');
    if (btn) {
      btn.textContent = '✓ You\'re on the list! We\'ll be in touch.';
      btn.style.background = '#008f6e';
      btn.disabled = true;
    }
    setTimeout(() => {
      closeModal('waitlistModal');
      // Show success toast
      showToast('🎉 Welcome to Agentsflix! Check your email for confirmation.');
    }, 2000);
  }

  // Sticky bar
  function initStickyBar() {
    const stickyBar = $('#stickyBar');
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const current = window.scrollY;
      if (current > 800 && !stickyBar?.classList.contains('visible')) {
        stickyBar?.classList.add('visible');
      } else if (current < 600) {
        stickyBar?.classList.remove('visible');
      }
      lastScroll = current;
    }, { passive: true });
  }

  window.closeStickyBar = function() {
    $('#stickyBar')?.classList.remove('visible');
  };

  // Toast notifications
  function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
      position:fixed; bottom:100px; left:50%; transform:translateX(-50%) translateY(100px);
      background:var(--bg3); border:1px solid var(--border); border-radius:var(--r-lg);
      padding:16px 24px; color:#fff; font-weight:600; z-index:3000;
      box-shadow:var(--shadow-lg); opacity:0; transition:all .3s cubic-bezier(0.34, 1.56, 0.64, 1);
    `;
    document.body.appendChild(toast);
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(-50%) translateY(0)';
    });
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(100px)';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // CTA click tracking
  function initCTATracking() {
    $$('[data-cta]').forEach(btn => {
      btn.addEventListener('click', () => {
        const ctaName = btn.dataset.cta;
        console.log('CTA clicked:', ctaName);
        // Here you'd send to analytics: gtag('event', 'cta_click', { cta: ctaName });
      });
    });
  }

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
        ctx.fillStyle = 'rgba(99, 102, 241, 0.5)';
        ctx.fill();
      }
    }

    // Create particles based on screen size
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
            ctx.strokeStyle = `rgba(99, 102, 241, ${0.2 - dist/500})`;
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

  // Keyboard navigation
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeModal('waitlistModal');
      closeModal('exitIntent');
    }
  });

  // Click outside modal to close
  $$('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => {
      if (e.target === overlay) closeModal(overlay.id);
    });
  });

  // ── INIT ──
  function init() {
    updateCountdowns();
    setInterval(updateCountdowns, 1000);
    animateSpots();
    initStatsCounter();
    initFloatingProof();
    initTestimonials();
    initCalculator();
    initScrollReveal();
    initHeroParallax();
    initVideoPlayers();
    initFAQ();
    initSmoothScroll();
    initExitIntent();
    initForms();
    initStickyBar();
    initCTATracking();
    initHeroParticles(); // Added call to initialize neural particles

    // Preload hero video poster
    const poster = new Image();
    poster.src = 'assets/hero-video-poster.jpg';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();