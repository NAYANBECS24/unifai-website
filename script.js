(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // 0. Background Video Autoplay Guarantee (Brave / Safari / Mobile friendly)
  // --------------------------------------------------------------------------
  const bgVideo = document.getElementById('bgVideo') || document.querySelector('.hero-photo video');
  if (bgVideo) {
    bgVideo.muted = true;
    bgVideo.defaultMuted = true;
    bgVideo.playsInline = true;

    const playVideo = () => {
      const p = bgVideo.play();
      if (p !== undefined) {
        p.catch(() => {
          const onInteract = () => {
            bgVideo.play();
            window.removeEventListener('click', onInteract);
            window.removeEventListener('touchstart', onInteract);
            window.removeEventListener('scroll', onInteract);
          };
          window.addEventListener('click', onInteract, { once: true });
          window.addEventListener('touchstart', onInteract, { once: true });
          window.addEventListener('scroll', onInteract, { once: true });
        });
      }
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', playVideo);
    } else {
      playVideo();
    }
  }

  // --------------------------------------------------------------------------
  // 1. Entrance Choreography (Exact Vesper.ai spec)
  // --------------------------------------------------------------------------
  const appearEls = Array.from(document.querySelectorAll('.appear'));
  const heroPhoto = document.querySelector('.hero-photo');

  appearEls.forEach((el) => {
    el.addEventListener(
      'animationend',
      () => {
        el.classList.add('is-in');
      },
      { once: true }
    );
  });

  if (heroPhoto) {
    heroPhoto.addEventListener(
      'animationend',
      () => {
        heroPhoto.classList.add('is-in');
      },
      { once: true }
    );
  }

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const stillAnimating = appearEls.some((el) => {
        if (typeof el.getAnimations !== 'function') return false;
        return el.getAnimations().some((a) => a.playState === 'running' || a.playState === 'finished');
      });

      if (!stillAnimating) {
        appearEls.forEach((el) => el.classList.add('is-in'));
        if (heroPhoto) heroPhoto.classList.add('is-in');
      }
    });
  });

  // --------------------------------------------------------------------------
  // 2. Mobile Menu Controller (Exact Vesper.ai spec)
  // --------------------------------------------------------------------------
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
    burger.addEventListener('click', (e) => {
      e.stopPropagation();
      document.body.classList.contains('menu-open') ? closeMenu() : openMenu();
    });
  }

  if (menuBackdrop) {
    menuBackdrop.addEventListener('click', closeMenu);
  }

  if (mobileNav) {
    mobileNav.addEventListener('click', (e) => {
      if (e.target.tagName === 'A' || e.target.closest('a')) {
        closeMenu();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  window.addEventListener('resize', () => {
    if (window.matchMedia('(min-width: 901px)').matches) {
      closeMenu();
    }
  });

  // --------------------------------------------------------------------------
  // 3. Smooth Anchor Scrolling
  // --------------------------------------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        closeMenu();
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // --------------------------------------------------------------------------
  // 4. Interactive Console Typewriter & Telemetry (Live Demo Section)
  // --------------------------------------------------------------------------
  const queryTextEl = document.getElementById('heroQuery');
  const queryButtons = document.querySelectorAll('.query-suggestions button');
  const metricAgents = document.getElementById('metricAgents');
  const metricPolicies = document.getElementById('metricPolicies');
  const metricProviders = document.getElementById('metricProviders');
  const metricHealth = document.getElementById('metricHealth');

  let typeTimer = null;

  function typeQuery(text) {
    if (!queryTextEl) return;
    clearTimeout(typeTimer);
    queryTextEl.textContent = '';
    let idx = 0;

    const step = () => {
      if (idx < text.length) {
        queryTextEl.textContent += text.charAt(idx);
        idx++;
        typeTimer = setTimeout(step, 18);
      }
    };
    step();
  }

  queryButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      queryButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const targetQuery = btn.dataset.query || btn.textContent.trim();
      typeQuery(targetQuery);

      if (btn.dataset.agents && metricAgents) metricAgents.textContent = btn.dataset.agents;
      if (btn.dataset.policies && metricPolicies) metricPolicies.textContent = btn.dataset.policies;
      if (btn.dataset.providers && metricProviders) metricProviders.textContent = btn.dataset.providers;
      if (btn.dataset.health && metricHealth) metricHealth.textContent = btn.dataset.health;
    });
  });
})();
