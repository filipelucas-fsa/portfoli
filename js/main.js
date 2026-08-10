document.addEventListener('DOMContentLoaded', () => {

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // === PRELOADER ===
  (function initPreloader() {
    try {
      var preloader = document.getElementById('preloader');

      // Tempo real de exibição ≈ SWEEP_MS + FLASH_HOLD_MS + FADE_MS.
      // A margem de segurança fica bem acima disso para nunca cortar a animação no meio.
      var SWEEP_MS = 2600;
      var FLASH_HOLD_MS = 550;
      var FADE_MS = 650;
      var SAFETY_MS = SWEEP_MS + FLASH_HOLD_MS + FADE_MS + 1500;

      var safetyId = setTimeout(function () {
        console.log('[preloader] ⏰ fallback');
        if (preloader && preloader.parentNode) preloader.remove();
        document.body.classList.add('loaded');
      }, SAFETY_MS);

      function safeComplete() {
        clearTimeout(safetyId);
        if (!preloader || !preloader.parentNode) return;
        preloader.remove();
        document.body.classList.add('loaded');
        console.log('[preloader] ✓ removido');
      }

      if (!preloader) {
        clearTimeout(safetyId);
        document.body.classList.add('loaded');
        return;
      }

      if (prefersReducedMotion) {
        safeComplete();
        return;
      }

      console.log('[preloader] ▶ iniciado');

      // Curva de easing cinematográfica: acelera, sustenta, desacelera suave no fim.
      function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      }

      var S = 'http://www.w3.org/2000/svg';

      // ── Container ──
      var container = document.createElement('div');
      container.className = 'preloader-logo-container';

      // ── Camada 0: halo ambiente reativo ao progresso ──
      var ambientGlow = document.createElement('div');
      ambientGlow.className = 'preloader-glow-ambient';
      container.appendChild(ambientGlow);

      // ── Camada 1: PNG escuro (base) ──
      var logoImg = document.createElement('img');
      logoImg.className = 'preloader-logo';
      logoImg.alt = '';
      logoImg.draggable = false;
      container.appendChild(logoImg);

      // ── Camada 2: SVG overlay com contorno REAL do PNG via filter + mask de varredura ──
      var svg = document.createElementNS(S, 'svg');
      svg.setAttribute('viewBox', '0 0 1024 724');
      svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
      svg.classList.add('preloader-contour-svg');

      // ── defs: filter + mask ──
      var defs = document.createElementNS(S, 'defs');

      // redEdge filter (mesmo do original, agora dentro do SVG)
      var f = document.createElementNS(S, 'filter');
      f.setAttribute('id', 'redEdge');
      f.setAttribute('x', '-20%');
      f.setAttribute('y', '-20%');
      f.setAttribute('width', '140%');
      f.setAttribute('height', '140%');

      var e1 = document.createElementNS(S, 'feMorphology');
      e1.setAttribute('operator', 'dilate');
      e1.setAttribute('radius', '3');
      e1.setAttribute('in', 'SourceAlpha');
      e1.setAttribute('result', 'expanded');
      f.appendChild(e1);
      var e2 = document.createElementNS(S, 'feFlood');
      e2.setAttribute('flood-color', '#ff0000');
      e2.setAttribute('flood-opacity', '1');
      e2.setAttribute('result', 'color');
      f.appendChild(e2);
      var e3 = document.createElementNS(S, 'feComposite');
      e3.setAttribute('operator', 'in');
      e3.setAttribute('in', 'color');
      e3.setAttribute('in2', 'expanded');
      e3.setAttribute('result', 'outline');
      f.appendChild(e3);
      var e4 = document.createElementNS(S, 'feComposite');
      e4.setAttribute('operator', 'out');
      e4.setAttribute('in', 'outline');
      e4.setAttribute('in2', 'SourceAlpha');
      f.appendChild(e4);
      defs.appendChild(f);

      // mask: círculo com stroke grosso que varre de baixo (90° = 6h)
      var mask = document.createElementNS(S, 'mask');
      mask.setAttribute('id', 'sweepMask');
      mask.setAttribute('maskContentUnits', 'userSpaceOnUse');

      var mc = document.createElementNS(S, 'circle');
      mc.setAttribute('id', 'maskCircle');
      mc.setAttribute('cx', '512');
      mc.setAttribute('cy', '362');
      mc.setAttribute('r', '362');
      mc.setAttribute('fill', 'none');
      mc.setAttribute('stroke', 'white');
      mc.setAttribute('stroke-width', '724');
      mc.setAttribute('stroke-dasharray', '2275');
      mc.setAttribute('stroke-dashoffset', '2275');
      mc.setAttribute('transform', 'rotate(90 512 362)');

      mask.appendChild(mc);
      defs.appendChild(mask);
      svg.appendChild(defs);

      // PNG com contorno vermelho (mascarado pela varredura)
      var outlineImg = document.createElementNS(S, 'image');
      outlineImg.setAttribute('href', 'img/batman-logo2.png');
      outlineImg.setAttribute('width', '1024');
      outlineImg.setAttribute('height', '724');
      outlineImg.setAttribute('filter', 'url(#redEdge)');
      outlineImg.setAttribute('mask', 'url(#sweepMask)');
      svg.appendChild(outlineImg);

      container.appendChild(svg);

      // ── Camada 4: lampejo de ignição ao concluir a varredura ──
      var flash = document.createElement('div');
      flash.className = 'preloader-flash';
      container.appendChild(flash);

      preloader.appendChild(container);

      // ── Contador percentual (abaixo do logo) ──
      var percentEl = document.createElement('div');
      percentEl.className = 'preloader-percent';
      percentEl.textContent = '000%';
      preloader.appendChild(percentEl);
      requestAnimationFrame(function () { percentEl.classList.add('visible'); });

      // ── Iniciar quando o PNG base carregar ──
      var started = false;

      function startAnim() {
        if (started) return;
        started = true;
        console.log('[preloader] ◈ varredura do contorno');

        var circum = 2 * Math.PI * 362;
        var maskEl = document.getElementById('maskCircle');
        maskEl.style.strokeDasharray = circum + 'px';
        maskEl.style.strokeDashoffset = circum + 'px';

        var t0 = null;
        function sweep(ts) {
          if (!t0) t0 = ts;
          var raw = Math.min((ts - t0) / SWEEP_MS, 1);
          var eased = easeInOutCubic(raw);

          maskEl.style.strokeDashoffset = (circum * (1 - eased)) + 'px';
          container.style.setProperty('--scan', eased.toFixed(3));
          percentEl.textContent = String(Math.round(eased * 100)).padStart(3, '0') + '%';

          if (raw < 1) {
            requestAnimationFrame(sweep);
          } else {
            // Sequência de conclusão: lampejo → glow sustentado → fade elegante
            flash.classList.add('active');
            svg.classList.add('glow');

            setTimeout(function () {
              percentEl.classList.remove('visible');
              preloader.classList.add('fade-out');
              clearTimeout(safetyId);
              setTimeout(function () {
                if (preloader && preloader.parentNode) preloader.remove();
                document.body.classList.add('loaded');
                console.log('[preloader] ✓ removido');
              }, FADE_MS);
            }, FLASH_HOLD_MS);
          }
        }
        requestAnimationFrame(sweep);
      }

      logoImg.onload = startAnim;
      logoImg.onerror = function () {
        console.log('[preloader] ⚠ erro logo');
        startAnim();
      };
      logoImg.src = 'img/batman-logo2.png';
      if (logoImg.complete) startAnim();
    } catch (err) {
      console.error('[preloader] ❌ erro:', err);
      var el = document.getElementById('preloader');
      if (el && el.parentNode) el.remove();
      document.body.classList.add('loaded');
    }
  })();

  // === SMOOTH SCROLL WRAPPER ===
  const wrapper = document.querySelector('.smooth-wrapper');
  const content = document.querySelector('.smooth-content');
  const nav = document.querySelector('nav');
  const backToTop = document.querySelector('.back-to-top');
  const heroImage = document.querySelector('.hero-image');
  const heroSection = document.querySelector('#hero');

  let target = 0;
  let current = 0;
  let maxScroll = 0;
  let isAnimating = false;
  let touchStartY = 0;
  let touchStartScroll = 0;

  function updateDimensions() {
    const contentHeight = content.offsetHeight;
    const viewportHeight = window.innerHeight;
    maxScroll = Math.max(0, contentHeight - viewportHeight);
    target = Math.min(target, maxScroll);
  }

  function applyScroll(y) {
    wrapper.style.transform = `translateY(${-y}px)`;
    if (window.ScrollTrigger) ScrollTrigger.update();
  }

  function updateEffects() {
    if (nav) {
      if (current > 80) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    }

    if (backToTop) {
      if (current > 300) backToTop.classList.add('visible');
      else backToTop.classList.remove('visible');
    }

    if (heroImage && heroSection && window.matchMedia('(pointer: fine)').matches && !prefersReducedMotion) {
      const heroHeight = heroSection.offsetHeight;
      const progress = Math.min(current / heroHeight, 1);
      heroImage.style.opacity = 1 - progress;
    }
  }

  function scrollLoop() {
    current += (target - current) * 0.40;

    if (Math.abs(current - target) < 0.5) {
      current = target;
    }

    applyScroll(current);
    updateEffects();

    if (current !== target) {
      requestAnimationFrame(scrollLoop);
    } else {
      isAnimating = false;
    }
  }

  function startScroll() {
    if (isAnimating) return;
    isAnimating = true;
    requestAnimationFrame(scrollLoop);
  }

  function setScroll(y) {
    target = Math.max(0, Math.min(y, maxScroll));
    startScroll();
  }

  // === WHEEL EVENT ===
  if (!prefersReducedMotion) {
    window.addEventListener('wheel', (e) => {
      e.preventDefault();
      setScroll(target + e.deltaY);
    }, { passive: false });
  }

  // === TOUCH EVENTS ===
  if (!prefersReducedMotion) {
    window.addEventListener('touchstart', (e) => {
      touchStartY = e.touches[0].clientY;
      touchStartScroll = target;
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      const deltaY = touchStartY - e.touches[0].clientY;
      setScroll(touchStartScroll + deltaY);
    }, { passive: true });
  }

  // === KEYBOARD EVENTS ===
  if (!prefersReducedMotion) {
    window.addEventListener('keydown', (e) => {
      let delta = 0;
      switch (e.key) {
        case 'ArrowDown': delta = 80; break;
        case 'ArrowUp': delta = -80; break;
        case 'PageDown': case ' ': delta = window.innerHeight * 0.8; break;
        case 'PageUp': delta = -window.innerHeight * 0.8; break;
        case 'Home': target = 0; startScroll(); return;
        case 'End': target = maxScroll; startScroll(); return;
        default: return;
      }
      e.preventDefault();
      setScroll(target + delta);
    });
  }

  // === RESIZE ===
  window.addEventListener('resize', () => {
    if (!prefersReducedMotion) {
      const prevMax = maxScroll;
      updateDimensions();
      target = Math.min(target, maxScroll);
      if (prevMax !== maxScroll && Math.abs(current - target) > 0.5) {
        startScroll();
      }
      if (current > maxScroll) {
        current = maxScroll;
        applyScroll(current);
        updateEffects();
      }
    }
  });

  // === REDUCED MOTION FALLBACK ===
  if (prefersReducedMotion) {
    content.style.display = 'block';
    wrapper.style.transform = 'none';
    document.body.style.position = '';
    document.body.style.height = '';
    document.body.style.overflow = '';
    document.body.style.width = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.touchAction = '';
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = '';

    window.addEventListener('scroll', () => {
      const y = window.pageYOffset;
      if (nav) {
        if (y > 80) nav.classList.add('scrolled');
        else nav.classList.remove('scrolled');
      }
      if (backToTop) {
        if (y > 300) backToTop.classList.add('visible');
        else backToTop.classList.remove('visible');
      }
      if (heroImage && heroSection && window.matchMedia('(pointer: fine)').matches) {
        const heroHeight = heroSection.offsetHeight;
        const progress = Math.min(y / heroHeight, 1);
        heroImage.style.opacity = 1 - progress;
      }
    }, { passive: true });
  } else {
    updateDimensions();
    applyScroll(0);
    updateEffects();
  }

  // === MOBILE MENU ===
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const navAnchors = document.querySelectorAll('.nav-links a');

  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.classList.toggle('open');
    navLinks.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  navAnchors.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('open');
      navLinks.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // === GSAP CINEMATIC LAYER (bridge com o scroll customizado) ===
  const gsapReady = !prefersReducedMotion && window.gsap && window.ScrollTrigger;

  if (gsapReady) {
    try {
      gsap.registerPlugin(ScrollTrigger);

      // Ponte entre o fake-scroll (transform em .smooth-wrapper) e o ScrollTrigger.
      // getBoundingClientRect já reflete a posição real na tela (o transform já moveu
      // o layout visualmente), então só precisamos informar o "scrollTop" fake.
      ScrollTrigger.scrollerProxy(document.body, {
        scrollTop(value) {
          if (arguments.length) { setScroll(value); }
          return current;
        },
        getBoundingClientRect() {
          return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
        },
        pinType: 'transform',
      });
      ScrollTrigger.defaults({ scroller: document.body });
    } catch (err) {
      console.error('[cineFX] falha ao inicializar ScrollTrigger proxy:', err);
    }
  }

  // === SCROLL REVEAL CINEMATOGRÁFICO ===
  if (gsapReady) {
    try {
      document.querySelectorAll('section').forEach((section) => {
        const items = Array.from(section.querySelectorAll('.reveal'));
        if (!items.length) return;

        const titles = items.filter((el) => el.classList.contains('section-title'));
        const others = items.filter((el) => !el.classList.contains('section-title'));

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top 82%',
            once: true,
          },
        });

        // Títulos: varredura vermelha revelando o texto (mesma linguagem do preloader)
        titles.forEach((title) => {
          title.style.position = title.style.position || 'relative';
          const scan = document.createElement('span');
          scan.className = 'title-scanline';
          title.appendChild(scan);

          tl.to(title, { clipPath: 'inset(0 0% 0 0)', duration: 0.9, ease: 'power2.inOut' }, 0)
            .fromTo(scan, { left: '0%' }, { left: '100%', duration: 0.9, ease: 'power2.inOut' }, 0)
            .to(scan, { opacity: 0, duration: 0.25 }, 0.75);
        });

        // Demais elementos: entrada com profundidade 3D, em stagger
        if (others.length) {
          tl.to(others, {
            opacity: 1,
            rotateX: 0,
            y: 0,
            scale: 1,
            filter: 'blur(0px)',
            duration: 0.9,
            ease: 'power3.out',
            stagger: 0.1,
          }, titles.length ? 0.15 : 0);
        }

        // Contadores da seção "Números" disparam junto com o reveal
        if (section.id === 'dados') {
          tl.call(() => startCounters(), null, 0.2);
        }
      });

      ScrollTrigger.refresh();
    } catch (err) {
      console.error('[cineFX] falha no reveal cinematográfico:', err);
      document.querySelectorAll('.reveal').forEach((el) => {
        el.style.opacity = 1;
        el.style.transform = 'none';
        el.style.filter = 'none';
        el.style.clipPath = 'none';
      });
    }
  } else {
    // Reduced motion / sem GSAP: mostra tudo direto, sem animação
    // (os números em #dados já vêm com o valor final no próprio HTML)
    document.querySelectorAll('.reveal').forEach((el) => {
      el.style.opacity = 1;
      el.style.transform = 'none';
      el.style.filter = 'none';
      el.style.clipPath = 'none';
    });
  }

  // === VARREDURA DE LUZ ENTRE SEÇÕES ===
  if (gsapReady) {
    try {
      document.querySelectorAll('section').forEach((section) => {
        const sweepWrap = document.createElement('div');
        sweepWrap.className = 'section-sweep';
        const bar = document.createElement('div');
        bar.className = 'sweep-bar';
        sweepWrap.appendChild(bar);
        section.appendChild(sweepWrap);

        gsap.timeline({
          scrollTrigger: { trigger: section, start: 'top 75%', once: true },
        }).fromTo(bar, { xPercent: -160 }, { xPercent: 460, duration: 1.1, ease: 'power2.inOut' });
      });
    } catch (err) {
      console.error('[cineFX] falha na varredura entre seções:', err);
    }
  }

  // === TILT 3D NOS CARDS ===
  if (gsapReady && window.matchMedia('(pointer: fine)').matches) {
    try {
      function attach3DTilt(selector, maxDeg) {
        document.querySelectorAll(selector).forEach((card) => {
          card.style.transformStyle = 'preserve-3d';

          card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const px = (e.clientX - rect.left) / rect.width;
            const py = (e.clientY - rect.top) / rect.height;
            const rotateY = (px - 0.5) * maxDeg * 2;
            const rotateX = (0.5 - py) * maxDeg * 2;
            gsap.to(card, {
              rotateX, rotateY,
              transformPerspective: 700,
              duration: 0.4,
              ease: 'power2.out',
            });
          });

          card.addEventListener('mouseleave', () => {
            gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.6, ease: 'power3.out' });
          });
        });
      }

      attach3DTilt('.servico-card', 6);
      attach3DTilt('.stack-card', 8);

      // Projetos: tilt 3D pronunciado com profundidade interna (thumb e info "flutuam")
      document.querySelectorAll('.projeto-card').forEach((card) => {
        card.style.transformStyle = 'preserve-3d';
        const thumb = card.querySelector('.projeto-thumb');
        const info = card.querySelector('.projeto-info');

        card.addEventListener('mouseenter', () => {
          gsap.to(card, { y: -6, duration: 0.35, ease: 'power2.out' });
        });

        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const px = (e.clientX - rect.left) / rect.width;
          const py = (e.clientY - rect.top) / rect.height;
          const rotateY = (px - 0.5) * 14;
          const rotateX = (0.5 - py) * 14;
          gsap.to(card, { rotateX, rotateY, transformPerspective: 800, duration: 0.4, ease: 'power2.out' });
          if (thumb) gsap.to(thumb, { z: 40, duration: 0.4, ease: 'power2.out' });
          if (info) gsap.to(info, { z: 25, duration: 0.4, ease: 'power2.out' });
        });

        card.addEventListener('mouseleave', () => {
          gsap.to(card, { y: 0, rotateX: 0, rotateY: 0, duration: 0.6, ease: 'power3.out' });
          if (thumb) gsap.to(thumb, { z: 0, duration: 0.5, ease: 'power3.out' });
          if (info) gsap.to(info, { z: 0, duration: 0.5, ease: 'power3.out' });
        });
      });
    } catch (err) {
      console.error('[cineFX] falha no tilt 3D:', err);
    }
  }

  // === PARALLAX 3D NA IMAGEM DO HERO ===
  if (gsapReady && heroImage && window.matchMedia('(pointer: fine)').matches) {
    try {
      document.addEventListener('mousemove', (e) => {
        const px = e.clientX / window.innerWidth;
        const py = e.clientY / window.innerHeight;
        const rotateY = (px - 0.5) * 10;
        const rotateX = (0.5 - py) * 8;
        gsap.to(heroImage, {
          rotateX, rotateY,
          transformPerspective: 1200,
          duration: 0.7,
          ease: 'power2.out',
        });
      });
    } catch (err) {
      console.error('[cineFX] falha no parallax do hero:', err);
    }
  }

  function startCounters() {
    const numbers = document.querySelectorAll('.dado-number');
    numbers.forEach(el => {
      const text = el.textContent;
      const match = text.match(/(\d+)/);
      if (!match) return;
      const t = parseInt(match[1], 10);
      const suffixEl = el.querySelector('.dado-suffix');
      el.textContent = '0';
      if (suffixEl) el.appendChild(suffixEl);

      const duration = 1500;
      const startTime = performance.now();

      function update(currentTime) {
        const progress = Math.min((currentTime - startTime) / duration, 1);
        el.textContent = Math.floor(progress * t);
        if (suffixEl) el.appendChild(suffixEl);
        if (progress < 1) requestAnimationFrame(update);
      }
      requestAnimationFrame(update);
    });
  }

  // === CURSOR GLOW ===
  if (!prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
    const glow = document.querySelector('.cursor-glow');
    let rafId = null;
    let mouseX = -500;
    let mouseY = -500;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!rafId) {
        rafId = requestAnimationFrame(updateGlow);
      }

      if (!glow.classList.contains('active')) {
        glow.classList.add('active');
      }
    });

    document.addEventListener('mouseleave', () => {
      glow.classList.remove('active');
    });

    function updateGlow() {
      glow.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
      rafId = null;
    }
  }

  // === BACK TO TOP CLICK ===
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      if (prefersReducedMotion) {
        window.scrollTo(0, 0);
      } else {
        setScroll(0);
      }
    });
  }

  // === SMOOTH SCROLL FOR ANCHOR LINKS ===
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const t = document.querySelector(targetId);
      if (t) {
        e.preventDefault();
        if (prefersReducedMotion) {
          const navH = nav.offsetHeight;
          const pos = t.getBoundingClientRect().top + window.pageYOffset - navH;
          window.scrollTo(0, pos);
        } else {
          const navH = nav.offsetHeight;
          const pos = t.getBoundingClientRect().top + current - navH;
          setScroll(pos);
        }
      }
    });
  });

  // === BATMAN AURA ===
  (function initAura() {
    const auraContainer = document.querySelector('.batman-aura');
    if (!auraContainer) return;
    if (prefersReducedMotion) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const heroImg = document.querySelector('.hero-image');
    const heroSection = document.querySelector('#hero');
    if (!heroImg || !heroSection) return;

    let auraAnimId = null;
    let currentAuraOpacity = 0;
    let totalMaxLength = 0;
    let targetOffset = 0;
    let currentOffset = 0;
    let auraPaths = [];
    let ready = false;

    fetch('img/batman-lateral.svg')
      .then(r => r.text())
      .then(svgText => {
        auraContainer.innerHTML = svgText;
        const svg = auraContainer.querySelector('svg');
        if (!svg) return;

        svg.removeAttribute('width');
        svg.removeAttribute('height');

        var allPaths = Array.from(svg.querySelectorAll('path'));
        if (!allPaths.length) return;

        var pathsWithLen = [];
        allPaths.forEach(function (p) {
          var len = 0;
          try { len = p.getTotalLength(); } catch (e) { len = 100; }
          if (!len || len < 1) len = 100;
          pathsWithLen.push({ path: p, len: len });
        });

        // Find 90th percentile to exclude outer contour paths
        var sorted = pathsWithLen.slice().sort(function (a, b) { return a.len - b.len; });
        var threshold = sorted[Math.floor(sorted.length * 0.9)].len;

        var maxLen = 0;
        var kept = [];
        pathsWithLen.forEach(function (item) {
          var p = item.path;
          var len = item.len;

          if (len > threshold) {
            p.style.display = 'none';
            return;
          }

          kept.push(p);
          p.removeAttribute('fill');
          p.setAttribute('stroke', 'rgba(255,255,255,0.6)');
          p.setAttribute('stroke-width', '0.5');
          p.setAttribute('stroke-linecap', 'round');
          p.setAttribute('stroke-linejoin', 'round');
          p.setAttribute('stroke-dasharray', len);
          p.setAttribute('stroke-dashoffset', len);
          if (len > maxLen) maxLen = len;
        });

        auraPaths = kept;
        if (!auraPaths.length) return;
        totalMaxLength = Math.max(maxLen, 100);
        targetOffset = totalMaxLength;
        currentOffset = totalMaxLength;
        ready = true;
      })
      .catch(() => {});

    function animateAura() {
      currentOffset += (targetOffset - currentOffset) * 0.06;

      if (Math.abs(currentOffset - targetOffset) < 3) {
        currentOffset = targetOffset;
      }

      const progress = Math.min(currentOffset / totalMaxLength, 1);

      for (let i = 0; i < auraPaths.length; i++) {
        const len = parseFloat(auraPaths[i].getAttribute('stroke-dasharray'));
        auraPaths[i].setAttribute('stroke-dashoffset', len * progress);
      }

      if (Math.abs(currentOffset - targetOffset) >= 3) {
        auraAnimId = requestAnimationFrame(animateAura);
      } else {
        auraAnimId = null;
      }
    }

    function updateAuraProximity(e) {
      if (!ready) return;

      const scrollPast = heroSection.offsetHeight * 0.75;
      if (current > scrollPast) {
        if (currentAuraOpacity !== 0) {
          currentAuraOpacity = 0;
          auraContainer.style.opacity = '0';
        }
        return;
      }

      const rect = heroImg.getBoundingClientRect();
      const cx = rect.left + rect.width * 0.5;
      const cy = rect.top + rect.height * 0.45;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      const activationRadius = 250;
      const fullRadius = 120;
      let newOpacity = 0;
      let newTarget = totalMaxLength;

      if (dist < fullRadius) {
        newOpacity = 0.3;
        newTarget = 0;
      } else if (dist < activationRadius) {
        const t = 1 - (dist - fullRadius) / (activationRadius - fullRadius);
        const eased = 1 - Math.pow(1 - t, 2);
        newOpacity = 0.3 * eased;
        newTarget = totalMaxLength * (1 - eased);
      } else {
        newOpacity = 0;
        newTarget = totalMaxLength;
      }

      if (Math.abs(newOpacity - currentAuraOpacity) > 0.005) {
        currentAuraOpacity = newOpacity;
        auraContainer.style.opacity = newOpacity;
      }

      if (Math.abs(newTarget - targetOffset) > 10) {
        targetOffset = newTarget;
        if (!auraAnimId) {
          auraAnimId = requestAnimationFrame(animateAura);
        }
      }
    }

    document.addEventListener('mousemove', updateAuraProximity, { passive: true });

    document.addEventListener('mouseleave', () => {
      if (!ready) return;
      currentAuraOpacity = 0;
      auraContainer.style.opacity = '0';
      targetOffset = totalMaxLength;
      if (!auraAnimId) {
        auraAnimId = requestAnimationFrame(animateAura);
      }
    });
  })();
});

function toggleProjetos() {
  var extras = document.getElementById('projetosExtras');
  var btn = document.getElementById('btnMais');
  if (!extras || !btn) return;

  var isVisible = extras.classList.contains('visible');

  if (isVisible) {
    extras.classList.remove('visible');
    btn.classList.remove('active');
    btn.innerHTML = 'Ver mais <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="btn-mais-icon"><polyline points="6 9 12 15 18 9"/></svg>';
  } else {
    extras.classList.add('visible');
    btn.classList.add('active');
    btn.innerHTML = 'Ver menos <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="btn-mais-icon"><polyline points="6 9 12 15 18 9"/></svg>';
  }
}
