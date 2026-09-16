// Background 3D video autoplay with retry & fallback
const bgVideo = document.getElementById('bgVideo') || document.querySelector('.hero-photo video');
if (bgVideo) {
  bgVideo.muted = true;
  bgVideo.defaultMuted = true;
  bgVideo.playsInline = true;

  const playVideo = () => {
    const p = bgVideo.play();
    if (p !== undefined) {
      p.catch(() => {
        if (bgVideo.src && !bgVideo.src.includes('cloudfront.net')) {
          bgVideo.src = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260818_072341_50851634-bbc3-4c33-9acc-7647d4db44aa.mp4';
          bgVideo.load();
          bgVideo.play().catch(() => {});
        }
        const onInteract = () => {
          bgVideo.play();
          window.removeEventListener('click', onInteract);
          window.removeEventListener('touchstart', onInteract);
        };
        window.addEventListener('click', onInteract, { once: true });
        window.addEventListener('touchstart', onInteract, { once: true });
      });
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', playVideo);
  } else {
    playVideo();
  }
}

// Scroll-triggered reveal for sections below the fold
const revealObserver = new IntersectionObserver(entries => entries.forEach(e => {
  if (e.isIntersecting) e.target.classList.add('seen');
}), { threshold: 0.12 });
document.querySelectorAll('.section,.feature-band,.vision,.contact,.stats-band,.cards article,.architecture-board')
  .forEach(el => { el.classList.add('scroll-reveal'); revealObserver.observe(el); });

// Mobile menu
const burger = document.getElementById('burgerBtn');
const menuBackdrop = document.getElementById('menuBackdrop');
const mobileNav = document.getElementById('mobileNav');

function openMenu() {
  document.body.classList.add('menu-open');
  if (burger) {
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', 'Close menu');
  }
}
function closeMenu() {
  document.body.classList.remove('menu-open');
  if (burger) {
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Open menu');
  }
}
if (burger) {
  burger.addEventListener('click', () => {
    document.body.classList.contains('menu-open') ? closeMenu() : openMenu();
  });
}
if (menuBackdrop) menuBackdrop.addEventListener('click', closeMenu);
if (mobileNav) {
  mobileNav.addEventListener('click', e => {
    if (e.target.tagName === 'A') closeMenu();
  });
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
window.addEventListener('resize', () => { if (window.matchMedia('(min-width: 901px)').matches) closeMenu(); });

// Smooth anchor scrolling (also closes the mobile menu first)
document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
  const targetId = a.getAttribute('href');
  if (!targetId || targetId === '#') return;
  const t = document.querySelector(targetId);
  if (t) {
    e.preventDefault();
    closeMenu();
    const headerOffset = 76;
    const elementPosition = t.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
}));

// Hero entrance choreography: mark each .appear element done once its
// animation finishes, and force everything visible if animations never run
const appearEls = Array.from(document.querySelectorAll('.appear'));
appearEls.forEach(el => {
  el.addEventListener('animationend', () => el.classList.add('is-in'), { once: true });
});
requestAnimationFrame(() => requestAnimationFrame(() => {
  const stillAnimating = appearEls.some(el => {
    if (typeof el.getAnimations !== 'function') return false;
    return el.getAnimations().some(a => a.playState === 'running' || a.playState === 'finished');
  });
  if (!stillAnimating) appearEls.forEach(el => el.classList.add('is-in'));
}));

// Interactive hero query console
const query = document.getElementById('heroQuery');
const queryButtons = document.querySelectorAll('.query-suggestions button');
const metricAgents = document.getElementById('metricAgents');
const metricPolicies = document.getElementById('metricPolicies');
const metricProviders = document.getElementById('metricProviders');
const metricHealth = document.getElementById('metricHealth');

let queryTimer;
queryButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    clearTimeout(queryTimer);
    queryButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    if (query) {
      query.textContent = '';
      const text = btn.dataset.query || btn.textContent.trim();
      let i = 0;
      const type = () => {
        if (i < text.length) {
          query.textContent += text[i++];
          queryTimer = setTimeout(type, 18);
        }
      };
      type();
    }
    if (btn.dataset.agents && metricAgents) metricAgents.textContent = btn.dataset.agents;
    if (btn.dataset.policies && metricPolicies) metricPolicies.textContent = btn.dataset.policies;
    if (btn.dataset.providers && metricProviders) metricProviders.textContent = btn.dataset.providers;
    if (btn.dataset.health && metricHealth) metricHealth.textContent = btn.dataset.health;
  });
});

// Subtle pointer parallax on the hero visual
const art = document.querySelector('.hero-art');
if (art && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  art.addEventListener('pointermove', e => {
    const r = art.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    art.style.transform = `perspective(900px) rotateY(${x * 3}deg) rotateX(${-y * 2}deg)`;
  });
  art.addEventListener('pointerleave', () => {
    art.style.transform = '';
  });
}
