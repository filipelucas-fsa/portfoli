document.addEventListener('DOMContentLoaded', () => {

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // === NAV SCROLL STATE ===
  const nav = document.querySelector('nav');
  function updateNav() {
    if (window.scrollY > 40) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  }
  updateNav();
  window.addEventListener('scroll', updateNav, { passive: true });

  // === MOBILE MENU ===
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // === SMOOTH SCROLL FOR ANCHOR LINKS ===
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#' || targetId.length < 2) return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const navH = nav.offsetHeight;
      const top = target.getBoundingClientRect().top + window.pageYOffset - navH + 1;
      window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  });

  // === SCROLL REVEAL ===
  const revealEls = document.querySelectorAll('.reveal');
  if (prefersReducedMotion) {
    revealEls.forEach(el => el.classList.add('in-view'));
  } else if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(el => observer.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in-view'));
  }

  // === STAT COUNTERS ===
  const statEls = document.querySelectorAll('.stat-number[data-target]');
  if (statEls.length && 'IntersectionObserver' in window) {
    const statObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        animateCount(entry.target);
        statObserver.unobserve(entry.target);
      });
    }, { threshold: 0.5 });
    statEls.forEach(el => statObserver.observe(el));
  } else {
    statEls.forEach(el => { el.textContent = el.dataset.target + (el.dataset.suffix || ''); });
  }

  function animateCount(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    if (prefersReducedMotion) {
      el.textContent = target + suffix;
      return;
    }
    const duration = 1400;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(tick);
  }

  // === CURSOR GLOW ===
  if (!prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
    const glow = document.querySelector('.cursor-glow');
    let rafId = null;
    let mouseX = -500, mouseY = -500;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!rafId) rafId = requestAnimationFrame(updateGlow);
      if (glow && !glow.classList.contains('active')) glow.classList.add('active');
    });
    document.addEventListener('mouseleave', () => { if (glow) glow.classList.remove('active'); });

    function updateGlow() {
      if (glow) glow.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
      rafId = null;
    }
  }

  // === HERO PHOTO 3D TILT ===
  const heroPhoto = document.querySelector('.hero-photo');
  const heroFrame = document.querySelector('.hero-photo-frame');
  const heroBadge = document.querySelector('.hero-photo-badge');
  if (heroPhoto && heroFrame && !prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
    let targetRX = 0, targetRY = 0, targetRZ = 0;
    let curRX = 0, curRY = 0, curRZ = 0;
    let rafTilt = null;

    heroPhoto.addEventListener('pointermove', (e) => {
      const rect = heroPhoto.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      targetRY = (px - 0.5) * 20;
      targetRX = (0.5 - py) * 16;
      targetRZ = (px - 0.5) * 3;
      if (!rafTilt) rafTilt = requestAnimationFrame(tiltTick);
    });

    heroPhoto.addEventListener('pointerleave', () => {
      targetRX = 0; targetRY = 0; targetRZ = 0;
      if (!rafTilt) rafTilt = requestAnimationFrame(tiltTick);
    });

    function tiltTick() {
      curRX += (targetRX - curRX) * 0.14;
      curRY += (targetRY - curRY) * 0.14;
      curRZ += (targetRZ - curRZ) * 0.14;
      const frameT = `rotateY(${curRY.toFixed(2)}deg) rotateX(${curRX.toFixed(2)}deg) rotateZ(${curRZ.toFixed(2)}deg)`;
      heroFrame.style.transform = frameT;
      heroBadge.style.transform = `${frameT} translateZ(50px)`;
      if (Math.abs(targetRX - curRX) > 0.05 || Math.abs(targetRY - curRY) > 0.05 || Math.abs(targetRZ - curRZ) > 0.05) {
        rafTilt = requestAnimationFrame(tiltTick);
      } else {
        curRX = targetRX; curRY = targetRY; curRZ = targetRZ;
        heroFrame.style.transform = `rotateY(${targetRY}deg) rotateX(${targetRX}deg) rotateZ(${targetRZ}deg)`;
        heroBadge.style.transform = `rotateY(${targetRY}deg) rotateX(${targetRX}deg) rotateZ(${targetRZ}deg) translateZ(50px)`;
        rafTilt = null;
      }
    }
  }

  // === BACK TO TOP ===
  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    function updateBackToTop() {
      if (window.scrollY > 400) backToTop.classList.add('visible');
      else backToTop.classList.remove('visible');
    }
    updateBackToTop();
    window.addEventListener('scroll', updateBackToTop, { passive: true });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  }

  // === ACTIVE NAV LINK ON SCROLL ===
  const sections = document.querySelectorAll('main section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');
  if (sections.length && navAnchors.length && 'IntersectionObserver' in window) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navAnchors.forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === '#' + id);
          });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    sections.forEach(s => navObserver.observe(s));
  }

});
