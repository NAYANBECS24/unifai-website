(function() {
  'use strict';

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

  const appearEls = Array.from(document.querySelectorAll('.appear'));
  const heroPhoto = document.querySelector('.hero-photo');
  
  appearEls.forEach(el => {
    el.addEventListener('animationend', () => el.classList.add('is-in'), { once: true });
  });
  
  if (heroPhoto) {
    heroPhoto.addEventListener('animationend', () => heroPhoto.classList.add('is-in'), { once: true });
  }
  
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const stillAnimating = appearEls.some(el => {
        if (typeof el.getAnimations !== 'function') return false;
        return el.getAnimations().some(a => a.playState === 'running' || a.playState === 'finished');
      });
      
      if (!stillAnimating) {
        appearEls.forEach(el => el.classList.add('is-in'));
        if (heroPhoto) heroPhoto.classList.add('is-in');
      }
    });
  });
  
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
  
  if (menuBackdrop) {
    menuBackdrop.addEventListener('click', closeMenu);
  }
  
  if (mobileNav) {
    mobileNav.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') closeMenu();
    });
  }
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
  
  window.addEventListener('resize', () => {
    if (window.matchMedia('(min-width: 901px)').matches) closeMenu();
  });
})();
