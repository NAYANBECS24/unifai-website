/**
 * UnifAI — Interactive Engine & UI Controller
 * Handles entrance choreography, mobile drawer, interactive console,
 * smooth anchor scrolling, and scroll-triggered reveals.
 */

(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. Mobile Menu Drawer & Backdrop Controller
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
      if (e.target.closest('a')) {
        closeMenu();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.body.classList.contains('menu-open')) {
      closeMenu();
    }
  });

  window.addEventListener('resize', () => {
    if (window.matchMedia('(min-width: 901px)').matches && document.body.classList.contains('menu-open')) {
      closeMenu();
    }
  });

  // --------------------------------------------------------------------------
  // 2. Smooth Anchor Scrolling
  // --------------------------------------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        closeMenu();

        const headerOffset = 76;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // --------------------------------------------------------------------------
  // 3. Hero Entrance Choreography Fallback
  // --------------------------------------------------------------------------
  const appearEls = Array.from(document.querySelectorAll('.appear'));
  appearEls.forEach((el) => {
    el.addEventListener(
      'animationend',
      () => {
        el.classList.add('is-in');
      },
      { once: true }
    );
  });

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const stillAnimating = appearEls.some((el) => {
        if (typeof el.getAnimations !== 'function') return false;
        return el.getAnimations().some((a) => a.playState === 'running');
      });

      if (!stillAnimating) {
        appearEls.forEach((el) => el.classList.add('is-in'));
      }
    });
  });

  // --------------------------------------------------------------------------
  // 4. Interactive Hero Query Console (Typewriter & Reactive Metrics)
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

      // Reactively update telemetry metrics if configured
      if (btn.dataset.agents && metricAgents) metricAgents.textContent = btn.dataset.agents;
      if (btn.dataset.policies && metricPolicies) metricPolicies.textContent = btn.dataset.policies;
      if (btn.dataset.providers && metricProviders) metricProviders.textContent = btn.dataset.providers;
      if (btn.dataset.health && metricHealth) metricHealth.textContent = btn.dataset.health;
    });
  });

  // --------------------------------------------------------------------------
  // 5. Subtle Pointer Parallax for Hero Control Art
  // --------------------------------------------------------------------------
  const artContainer = document.querySelector('.hero-art');
  const queryPanel = document.querySelector('.query-panel');

  if (artContainer && queryPanel && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    artContainer.addEventListener('pointermove', (e) => {
      const rect = artContainer.getBoundingClientRect();
      const xRel = (e.clientX - rect.left) / rect.width - 0.5;
      const yRel = (e.clientY - rect.top) / rect.height - 0.5;

      queryPanel.style.transform = `perspective(1000px) rotateY(${xRel * 7}deg) rotateX(${-yRel * 5}deg) translateY(-4px)`;
    });

    artContainer.addEventListener('pointerleave', () => {
      queryPanel.style.transform = '';
    });
  }

  // --------------------------------------------------------------------------
  // 6. IntersectionObserver for Scroll Reveals
  // --------------------------------------------------------------------------
  const revealTargets = document.querySelectorAll(
    '.section, .feature-band, .vision, .contact, .stats-band, .cards article, .architecture-board'
  );

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('seen');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealTargets.forEach((el) => {
      el.classList.add('scroll-reveal');
      revealObserver.observe(el);
    });
  } else {
    // Fallback for older environments
    revealTargets.forEach((el) => el.classList.add('seen'));
  }
})();
