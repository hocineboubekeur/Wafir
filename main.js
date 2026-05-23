/* ═══════════════════════════════════════════
   WFIR — Poster Website  |  main.js
═══════════════════════════════════════════ */

/* ════════════════════════════════
   1. NAV — scroll glass effect
════════════════════════════════ */
(function initNav() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  // Mobile toggle
  const toggle  = document.getElementById('nav-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  if (toggle && mobileNav) {
    toggle.addEventListener('click', () => {
      const open = mobileNav.style.display === 'flex';
      mobileNav.style.display = open ? 'none' : 'flex';
    });
    // Close on link click
    mobileNav.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => { mobileNav.style.display = 'none'; })
    );
  }
})();


/* ════════════════════════════════
   2. HERO ENTRANCE ANIMATION
════════════════════════════════ */
(function heroEntrance() {
  const items = [
    '#hero-eyebrow',
    '#hero-arabic',
    '#hero-tagline',
    '#hero-meaning',
    '#hero-stats',
  ];
  items.forEach((sel, i) => {
    const el = document.querySelector(sel);
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(28px)';
    el.style.transition = `opacity 0.7s ease ${i * 0.15 + 0.2}s, transform 0.7s ease ${i * 0.15 + 0.2}s`;
    // Tiny delay so browser registers initial state
    requestAnimationFrame(() => requestAnimationFrame(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }));
  });
})();


/* ════════════════════════════════
   3. SCROLL REVEAL
════════════════════════════════ */
(function initReveal() {
  const selectors = '.reveal, .reveal-left, .reveal-right';
  const elements  = document.querySelectorAll(selectors);

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach(el => io.observe(el));
})();


/* ════════════════════════════════
   4. ANIMATED COUNTERS
════════════════════════════════ */
(function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  /**
   * @param {HTMLElement} el
   * @param {number}      target
   * @param {string}      suffix  — e.g. '%', 'M', '+'
   * @param {string}      prefix  — e.g. '€', '>'
   */
  function animateCounter(el, target, suffix = '', prefix = '') {
    let start     = 0;
    const step    = target / 70;
    const tick    = () => {
      start += step;
      if (start >= target) {
        el.textContent = prefix + target.toLocaleString() + suffix;
        return;
      }
      el.textContent = prefix + Math.round(start).toLocaleString() + suffix;
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';
      animateCounter(el, target, suffix, prefix);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => io.observe(el));
})();


/* ════════════════════════════════
   5. MATH DIAGRAM — SVG LINES
   Draw animated connecting lines
   from center node to each satellite
════════════════════════════════ */
(function initMathDiagram() {
  const canvas = document.getElementById('math-canvas');
  if (!canvas) return;

  const ctx    = canvas.getContext('2d');
  const wrap   = canvas.parentElement;

  function resize() {
    canvas.width  = wrap.offsetWidth;
    canvas.height = wrap.offsetHeight;
    draw();
  }

  function getCenter(id) {
    const el   = document.getElementById(id);
    if (!el) return null;
    const wr   = wrap.getBoundingClientRect();
    const er   = el.getBoundingClientRect();
    return {
      x: er.left + er.width  / 2 - wr.left,
      y: er.top  + er.height / 2 - wr.top,
    };
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const core = getCenter('math-core');
    const nodes = ['math-n-top', 'math-n-right', 'math-n-bottom', 'math-n-left'];

    nodes.forEach(id => {
      const pt = getCenter(id);
      if (!core || !pt) return;

      // Gradient line
      const grad = ctx.createLinearGradient(core.x, core.y, pt.x, pt.y);
      grad.addColorStop(0, 'rgba(200,146,42,0.7)');
      grad.addColorStop(1, 'rgba(200,146,42,0.15)');

      ctx.beginPath();
      ctx.setLineDash([6, 5]);
      ctx.lineDashOffset = 0;
      ctx.strokeStyle = grad;
      ctx.lineWidth   = 1.5;
      ctx.moveTo(core.x, core.y);
      ctx.lineTo(pt.x, pt.y);
      ctx.stroke();
      ctx.setLineDash([]);
    });
  }

  // Animate dashes
  let offset = 0;
  function animateDash() {
    const core  = getCenter('math-core');
    const nodes = ['math-n-top', 'math-n-right', 'math-n-bottom', 'math-n-left'];

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    offset = (offset - 0.3) % 22;

    nodes.forEach(id => {
      const pt = getCenter(id);
      if (!core || !pt) return;

      const grad = ctx.createLinearGradient(core.x, core.y, pt.x, pt.y);
      grad.addColorStop(0, 'rgba(200,146,42,0.8)');
      grad.addColorStop(1, 'rgba(200,146,42,0.1)');

      ctx.beginPath();
      ctx.setLineDash([6, 5]);
      ctx.lineDashOffset = offset;
      ctx.strokeStyle    = grad;
      ctx.lineWidth      = 1.8;
      ctx.moveTo(core.x, core.y);
      ctx.lineTo(pt.x, pt.y);
      ctx.stroke();
    });
    ctx.setLineDash([]);
    requestAnimationFrame(animateDash);
  }

  window.addEventListener('resize', resize);
  resize();

  // Start animation once math section is visible
  const mathSection = document.getElementById('math');
  const io = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      animateDash();
      io.disconnect();
    }
  }, { threshold: 0.2 });
  if (mathSection) io.observe(mathSection);
})();


/* ════════════════════════════════
   6. ACTIVE NAV LINK HIGHLIGHT
   (Intersection-based section tracking)
════════════════════════════════ */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-links a[href^="#"], #mobile-nav a[href^="#"]');
  if (!sections.length || !links.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      links.forEach(a => {
        const active = a.getAttribute('href') === `#${id}`;
        a.style.color = active ? 'var(--gold-light)' : '';
        a.style.background = active ? 'rgba(255,255,255,0.1)' : '';
      });
    });
  }, { threshold: 0.4 });

  sections.forEach(s => io.observe(s));
})();


/* ════════════════════════════════
   7. SMOOTH SCROLL for anchor links
════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 72; // nav height
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
