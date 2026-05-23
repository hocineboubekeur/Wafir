/* ════════════════════════════════════
   SurpriseBox — main.js
   Depends on: GSAP 3.12 + ScrollTrigger
════════════════════════════════════ */

// ── Register GSAP Plugin ──────────────────────────────────────────────────────
gsap.registerPlugin(ScrollTrigger);


/* ══════════════════════════════════════
   1. NAV — Scroll-triggered style change
══════════════════════════════════════ */
const nav     = document.getElementById('main-nav');
const navLogo = document.getElementById('nav-logo');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    nav.classList.add('scrolled');
    navLogo.style.color = '#111';
  } else {
    nav.classList.remove('scrolled');
    navLogo.style.color = '#fff';
  }
});


/* ══════════════════════════════════════
   2. MOBILE MENU — Toggle open / close
══════════════════════════════════════ */
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu    = document.getElementById('mobile-menu');

mobileMenuBtn.addEventListener('click', () => {
  mobileMenu.classList.toggle('hidden');
  mobileMenu.classList.toggle('flex');
});

// Close mobile menu when a link inside it is clicked
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.add('hidden');
    mobileMenu.classList.remove('flex');
  });
});


/* ══════════════════════════════════════
   3. HERO — Entrance animation timeline
══════════════════════════════════════ */
const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

heroTl
  .from('#hero-badge',    { y: 20, opacity: 0, duration: 0.6 })
  .from('#hero-headline', { y: 40, opacity: 0, duration: 0.8 }, '-=0.3')
  .from('#hero-sub',      { y: 30, opacity: 0, duration: 0.7 }, '-=0.5')
  .from('#hero-ctas',     { y: 20, opacity: 0, duration: 0.6 }, '-=0.4')
  .from('#hero-stats',    { y: 16, opacity: 0, duration: 0.5 }, '-=0.3')
  .from('#hero-phone',    {
    y: 60, opacity: 0, duration: 1,
    ease: 'back.out(1.4)',
  }, '-=0.8');


/* ══════════════════════════════════════
   4. SCROLL REVEALS — Staggered fade-ups
══════════════════════════════════════ */
gsap.utils.toArray('.reveal').forEach(el => {
  // Respect inline transition-delay set on the element for stagger groups
  const staggerDelay = el.style.transitionDelay
    ? parseFloat(el.style.transitionDelay)
    : 0;

  gsap.fromTo(
    el,
    { y: 40, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: 'power3.out',
      delay: staggerDelay,
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    }
  );
});


/* ══════════════════════════════════════
   5. COUNTER ANIMATION — Charity stats
══════════════════════════════════════ */

/**
 * Animates a number from 0 to `target` over ~60 frames (~1.2 s).
 * @param {HTMLElement} el     — Element whose textContent will be updated.
 * @param {number}      target — Final numeric value to count to.
 */
function animateCount(el, target) {
  let current = 0;
  const step = target / 60;

  const interval = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(interval);
    }
    el.textContent = Math.round(current).toLocaleString();
  }, 20);
}

// Observe elements that have a [data-count] attribute
const counterObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el  = entry.target;
        const val = parseInt(el.dataset.count, 10);
        if (!isNaN(val)) animateCount(el, val);
        counterObserver.unobserve(el); // run only once
      }
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll('[data-count]').forEach(el => {
  counterObserver.observe(el);
});
