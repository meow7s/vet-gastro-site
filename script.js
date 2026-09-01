const menuBtn = document.getElementById('menuBtn');
const nav = document.getElementById('nav');

menuBtn?.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  menuBtn.setAttribute('aria-expanded', String(open));
});

nav?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('is-open');
    menuBtn?.setAttribute('aria-expanded', 'false');
  });
});

document.querySelectorAll('.faq-list details').forEach(item => {
  item.addEventListener('toggle', () => {
    if (!item.open) return;
    document.querySelectorAll('.faq-list details').forEach(other => {
      if (other !== item) other.open = false;
    });
  });
});

const certLightbox = document.getElementById('certLightbox');
const certLightboxImage = document.getElementById('certLightboxImage');
const certLightboxTitle = document.getElementById('certLightboxTitle');
const certLightboxMeta = document.getElementById('certLightboxMeta');
const certLightboxClose = document.getElementById('certLightboxClose');

function closeCertificateLightbox() {
  if (!certLightbox) return;
  certLightbox.classList.remove('is-open');
  certLightbox.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('lightbox-open');
  if (certLightboxImage) certLightboxImage.src = '';
}

document.querySelectorAll('.certificate-item, .feature-cert').forEach(card => {
  card.addEventListener('click', () => {
    if (!certLightbox) return;
    certLightboxImage.src = card.dataset.image || '';
    certLightboxImage.alt = card.dataset.title || 'Документ';
    certLightboxTitle.textContent = card.dataset.title || '';
    certLightboxMeta.textContent = card.dataset.meta || '';
    certLightbox.classList.add('is-open');
    certLightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lightbox-open');
  });
});

certLightboxClose?.addEventListener('click', closeCertificateLightbox);
certLightbox?.addEventListener('click', (event) => {
  if (event.target === certLightbox) closeCertificateLightbox();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeCertificateLightbox();
});


/* Certificate animations */
const certCards = document.querySelectorAll('.certificate-item, .feature-cert:not(.portfolio-stack__card)');
certCards.forEach((card, index) => {
  card.classList.add('cert-reveal');
  card.style.setProperty('--reveal-delay', `${Math.min(index * 55, 500)}ms`);
  card.style.setProperty('--float-delay', `${(index % 6) * 230}ms`);
});

const certObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      certObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

certCards.forEach(card => certObserver.observe(card));

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const desktopMotion = () => window.innerWidth > 980 && !prefersReducedMotion;

certCards.forEach(card => {
  card.addEventListener('mousemove', (event) => {
    if (!desktopMotion()) return;
    const rect = card.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    const rotateY = (px - 0.5) * 7;
    const rotateX = (0.5 - py) * 7;
    card.style.transform = `perspective(1100px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

const achievementsMain = document.querySelector('.inner-hero--certs');
if (achievementsMain && !document.querySelector('.achievements-page-glow')) {
  const glow = document.createElement('div');
  glow.className = 'achievements-page-glow';
  achievementsMain.appendChild(glow);
}


/* Portfolio achievements reveal */
const portfolioRevealTargets = document.querySelectorAll(
  '.portfolio-overview__top, .portfolio-stat, .case-row, .timeline-year, .portfolio-doc, .portfolio-outro__box'
);

portfolioRevealTargets.forEach((el, index) => {
  el.classList.add('portfolio-reveal');
  el.style.transitionDelay = `${Math.min((index % 6) * 60, 300)}ms`;
});

const portfolioObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      portfolioObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.10 });

portfolioRevealTargets.forEach(el => portfolioObserver.observe(el));

/* subtle magnetic movement for the 3-card hero stack */
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const stack = document.querySelector('.portfolio-stack');
  const stackCards = document.querySelectorAll('.portfolio-stack__card');

  stack?.addEventListener('mousemove', (e) => {
    if (window.innerWidth < 900) return;
    const rect = stack.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - .5;
    const y = (e.clientY - rect.top) / rect.height - .5;

    stackCards.forEach((card, idx) => {
      const power = (idx + 1) * 3.2;
      card.style.translate = `${x * power}px ${y * power}px`;
    });
  });

  stack?.addEventListener('mouseleave', () => {
    stackCards.forEach(card => card.style.translate = '');
  });
}


/* Cat paw cursor trail */
(function () {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return;

  const pawSvg = `
    <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <ellipse cx="32" cy="39" rx="14" ry="11"></ellipse>
      <ellipse cx="18" cy="22" rx="5.5" ry="8"></ellipse>
      <ellipse cx="29" cy="15" rx="5.5" ry="8"></ellipse>
      <ellipse cx="41" cy="15" rx="5.5" ry="8"></ellipse>
      <ellipse cx="52" cy="22" rx="5.5" ry="8"></ellipse>
    </svg>`;

  let lastTime = 0;
  let lastX = null;
  let lastY = null;
  let flip = false;

  function spawnPaw(x, y) {
    const paw = document.createElement('span');
    paw.className = 'paw-trail';

    const size = 17 + Math.random() * 6;
    const baseAngle = flip ? -12 : 12;

    paw.style.width = `${size}px`;
    paw.style.height = `${size}px`;
    paw.style.left = `${x}px`;
    paw.style.top = `${y}px`;
    paw.style.setProperty(
      '--paw-rotate',
      `${baseAngle + (Math.random() * 5 - 2.5)}deg`
    );

    paw.innerHTML = pawSvg;
    document.body.appendChild(paw);
    flip = !flip;

    window.setTimeout(() => paw.remove(), 1900);
  }

  function handlePointerMove(event) {
    // Не создаём лапки при касании экрана.
    if (event.pointerType === 'touch') return;

    const now = performance.now();

    if (lastX === null || lastY === null) {
      lastX = event.clientX;
      lastY = event.clientY;
      return;
    }

    const distance = Math.hypot(
      event.clientX - lastX,
      event.clientY - lastY
    );

    if (now - lastTime < 105 || distance < 38) return;

    spawnPaw(event.clientX - 2, event.clientY + 3);

    lastTime = now;
    lastX = event.clientX;
    lastY = event.clientY;
  }

  window.addEventListener('pointermove', handlePointerMove, { passive: true });
})();


/* =========================================================
   COMPLETE MOTION SYSTEM — gastrolivet
   ========================================================= */
(function () {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer:fine)').matches;

  /* Page transition overlay */
  const overlay = document.createElement('div');
  overlay.className = 'page-transition';
  overlay.setAttribute('aria-hidden', 'true');
  document.body.appendChild(overlay);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => overlay.classList.add('is-ready'));
  });

  window.addEventListener('pageshow', () => {
    overlay.classList.remove('is-leaving');
    overlay.classList.add('is-ready');
  });

  document.addEventListener('click', (event) => {
    if (reducedMotion || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest('a[href]');
    if (!link) return;
    if (link.target === '_blank' || link.hasAttribute('download')) return;

    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) return;

    let url;
    try { url = new URL(link.href, window.location.href); } catch { return; }
    if (url.origin !== window.location.origin) return;
    if (url.pathname === window.location.pathname && url.hash) return;

    event.preventDefault();
    overlay.classList.remove('is-ready');
    overlay.classList.add('is-leaving');
    window.setTimeout(() => { window.location.href = url.href; }, 330);
  });

  /* Header shrink on scroll */
  const header = document.querySelector('.header');
  let headerTicking = false;
  function updateHeader() {
    header?.classList.toggle('is-scrolled', window.scrollY > 26);
    headerTicking = false;
  }
  window.addEventListener('scroll', () => {
    if (!headerTicking) {
      requestAnimationFrame(updateHeader);
      headerTicking = true;
    }
  }, { passive: true });
  updateHeader();

  /* Hero title mask */
  function wrapTitleLines(element) {
    if (!element || element.dataset.masked === 'true') return;
    const raw = element.innerHTML.trim();
    const lines = raw.split(/<br\s*\/?>/i).map(line => line.trim()).filter(Boolean);
    if (!lines.length) return;
    element.innerHTML = lines.map(line => `<span class="title-mask-line"><span>${line}</span></span>`).join('');
    element.dataset.masked = 'true';
  }

  const maskedTitles = document.querySelectorAll('.personal-name, .inner-title, .portfolio-hero h1');
  maskedTitles.forEach(wrapTitleLines);
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      maskedTitles.forEach(el => el.classList.add('title-mask-ready'));
      document.body.classList.add('hero-intro-ready');
    });
  });

  /* Photo / major visual mask reveal */
  const photoVisuals = document.querySelectorAll('.doctor-photo-card, .portrait-placeholder');
  photoVisuals.forEach(el => el.classList.add('photo-mask-reveal'));
  const photoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('photo-mask-visible');
        photoObserver.unobserve(entry.target);
      }
    });
  }, { threshold: .16 });
  photoVisuals.forEach(el => photoObserver.observe(el));

  /* Generic scroll reveal + stagger */
  const revealSelectors = [
    '.personal-statement',
    '.personal-section-head',
    '.expertise-card',
    '.personal-nav-card',
    '.personal-contact__box',
    '.page-signature',
    '.inner-hero .container',
    '.service-card',
    '.about-visual',
    '.about-copy',
    '.faq-intro',
    '.faq-list',
    '.contact-card',
    '.cta-box'
  ].join(',');

  const revealItems = Array.from(document.querySelectorAll(revealSelectors));
  revealItems.forEach((el, index) => {
    if (el.classList.contains('cert-reveal') || el.classList.contains('portfolio-reveal')) return;
    el.classList.add('motion-reveal');
    const parent = el.parentElement;
    const siblings = parent ? Array.from(parent.children).filter(node => node.matches?.('.expertise-card,.personal-nav-card,.service-card')) : [];
    const siblingIndex = siblings.indexOf(el);
    const delay = siblingIndex >= 0 ? siblingIndex * 90 : Math.min((index % 4) * 45, 135);
    el.style.setProperty('--motion-delay', `${delay}ms`);
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('motion-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: .12, rootMargin: '0px 0px -5% 0px' });
  document.querySelectorAll('.motion-reveal').forEach(el => revealObserver.observe(el));

  /* Parallax: decorations follow cursor by just a few pixels */
  const parallaxItems = Array.from(document.querySelectorAll(
    '.personal-sticker, .doctor-photo-card__shape, .portfolio-stack__sticker, .portfolio-hero__word, .contact-pet'
  ));
  parallaxItems.forEach((el, index) => {
    el.classList.add('parallax-item');
    el.dataset.parallaxPower = String(3 + (index % 4) * 2);
  });

  if (!reducedMotion && finePointer && parallaxItems.length) {
    let parallaxFrame = null;
    let pointerX = innerWidth / 2;
    let pointerY = innerHeight / 2;
    window.addEventListener('pointermove', (e) => {
      if (e.pointerType === 'touch') return;
      pointerX = e.clientX;
      pointerY = e.clientY;
      if (parallaxFrame) return;
      parallaxFrame = requestAnimationFrame(() => {
        const nx = pointerX / innerWidth - .5;
        const ny = pointerY / innerHeight - .5;
        parallaxItems.forEach(el => {
          const p = Number(el.dataset.parallaxPower || 4);
          el.style.translate = `${nx * p * 2}px ${ny * p * 2}px`;
        });
        parallaxFrame = null;
      });
    }, { passive: true });
  }

  /* Magnetic buttons */
  if (!reducedMotion && finePointer) {
    document.querySelectorAll('.btn, .header__cta').forEach(button => {
      button.classList.add('magnetic');
      button.addEventListener('pointermove', (e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        button.style.translate = `${x * .12}px ${y * .14}px`;
      });
      button.addEventListener('pointerleave', () => { button.style.translate = ''; });
    });
  }

  /* Numeric count-up */
  const counters = Array.from(document.querySelectorAll('.portfolio-stat b'));
  counters.forEach(el => {
    const match = el.textContent.trim().match(/^(\d+)(.*)$/);
    if (!match) return;
    el.dataset.counterTarget = match[1];
    el.dataset.counterSuffix = match[2] || '';
    el.classList.add('motion-counter');
    el.textContent = `0${el.dataset.counterSuffix}`;
  });

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting || entry.target.dataset.counted === 'true') return;
      const el = entry.target;
      el.dataset.counted = 'true';
      const target = Number(el.dataset.counterTarget || 0);
      const suffix = el.dataset.counterSuffix || '';
      if (reducedMotion) { el.textContent = `${target}${suffix}`; return; }
      const start = performance.now();
      const duration = 1100 + Math.min(target, 300) * 1.3;
      function tick(now) {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = `${Math.round(target * eased)}${suffix}`;
        if (t < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      counterObserver.unobserve(el);
    });
  }, { threshold: .45 });
  counters.forEach(el => counterObserver.observe(el));

  /* Timeline lines draw themselves */
  const timelineYears = document.querySelectorAll('.timeline-year');
  const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('timeline-line-visible');
        timelineObserver.unobserve(entry.target);
      }
    });
  }, { threshold: .22 });
  timelineYears.forEach(el => timelineObserver.observe(el));

  /* Pause marquee while tab is hidden to save resources */
  document.addEventListener('visibilitychange', () => {
    document.querySelectorAll('.site-marquee__track,.portfolio-marquee__track').forEach(track => {
      track.style.animationPlayState = document.hidden ? 'paused' : '';
    });
  });
})();


/* Ambient cat paw shadows in background */
(function () {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return;
  if (document.querySelector('.ambient-paw-field')) return;

  const pawSvg = `
    <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <ellipse cx="32" cy="39" rx="14" ry="11"></ellipse>
      <ellipse cx="18" cy="22" rx="5.5" ry="8"></ellipse>
      <ellipse cx="29" cy="15" rx="5.5" ry="8"></ellipse>
      <ellipse cx="41" cy="15" rx="5.5" ry="8"></ellipse>
      <ellipse cx="52" cy="22" rx="5.5" ry="8"></ellipse>
    </svg>`;

  const field = document.createElement('div');
  field.className = 'ambient-paw-field';
  field.setAttribute('aria-hidden', 'true');

  const runCount = window.innerWidth < 760 ? 3 : 5;
  const topPositions = window.innerWidth < 760
    ? [18, 44, 76]
    : [14, 30, 49, 67, 84];

  function createRun(index) {
    const run = document.createElement('div');
    const direction = index % 2 === 0 ? 'right' : 'left';
    run.className = `ambient-paw-run ambient-paw-run--${direction}`;
    run.style.top = `${topPositions[index % topPositions.length]}vh`;
    run.style.setProperty('--run-duration', `${28 + Math.random() * 12}s`);
    run.style.setProperty('--run-opacity', `${0.10 + Math.random() * 0.08}`);
    run.style.setProperty('--run-tilt', `${(Math.random() * 10 - 5).toFixed(2)}deg`);
    run.style.animationDelay = `${-Math.random() * 20}s`;

    const inner = document.createElement('div');
    inner.className = 'ambient-paw-run__inner';

    const pawCount = window.innerWidth < 760 ? 7 : 10;
    for (let i = 0; i < pawCount; i++) {
      const paw = document.createElement('span');
      paw.className = 'ambient-paw';
      paw.innerHTML = pawSvg;
      paw.style.left = `${8 + i * (100 / pawCount)}%`;
      const y = 50 + (i % 2 === 0 ? -12 : 12) + (Math.random() * 10 - 5);
      paw.style.top = `${y}%`;
      paw.style.setProperty('--paw-size', `${20 + Math.random() * 12}px`);
      paw.style.setProperty('--paw-rotate', `${(i % 2 === 0 ? -18 : 18) + (Math.random() * 8 - 4)}deg`);
      paw.style.setProperty('--paw-delay', `${i * 0.18}s`);
      inner.appendChild(paw);
    }

    run.appendChild(inner);
    return run;
  }

  for (let i = 0; i < runCount; i++) {
    field.appendChild(createRun(i));
  }

  document.body.appendChild(field);
})();


/* =========================================================
   MOTION POLISH V2
   ========================================================= */
(function () {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer:fine)').matches;

  /* Cursor aura */
  if (!reducedMotion && finePointer) {
    const aura = document.createElement('div');
    aura.className = 'cursor-aura';
    aura.setAttribute('aria-hidden', 'true');
    document.body.appendChild(aura);

    let auraX = innerWidth / 2;
    let auraY = innerHeight / 2;
    let targetX = auraX;
    let targetY = auraY;
    let auraFrame = null;

    function animateAura() {
      auraX += (targetX - auraX) * .16;
      auraY += (targetY - auraY) * .16;
      aura.style.transform = `translate3d(${auraX}px,${auraY}px,0) translate(-50%,-50%)`;
      if (Math.abs(targetX - auraX) > .2 || Math.abs(targetY - auraY) > .2) {
        auraFrame = requestAnimationFrame(animateAura);
      } else {
        auraFrame = null;
      }
    }

    window.addEventListener('pointermove', (event) => {
      if (event.pointerType === 'touch') return;
      targetX = event.clientX;
      targetY = event.clientY;
      aura.classList.add('is-visible');
      if (!auraFrame) auraFrame = requestAnimationFrame(animateAura);
    }, { passive:true });

    document.documentElement.addEventListener('mouseleave', () => {
      aura.classList.remove('is-visible');
    });
  }

  /* Scroll progress */
  const progress = document.createElement('div');
  progress.className = 'scroll-progress';
  progress.setAttribute('aria-hidden', 'true');
  progress.innerHTML = '<div class="scroll-progress__bar"></div>';
  document.body.appendChild(progress);
  const progressBar = progress.firstElementChild;

  let progressFrame = null;
  function updateProgress() {
    const max = document.documentElement.scrollHeight - innerHeight;
    const value = max > 0 ? Math.min(Math.max(scrollY / max, 0), 1) : 0;
    progressBar.style.transform = `scaleX(${value})`;
    progressFrame = null;
  }
  window.addEventListener('scroll', () => {
    if (!progressFrame) progressFrame = requestAnimationFrame(updateProgress);
  }, { passive:true });
  window.addEventListener('resize', updateProgress, { passive:true });
  updateProgress();

  /* Refined doctor photo-card tilt */
  if (!reducedMotion && finePointer) {
    document.querySelectorAll('.doctor-photo-card').forEach(card => {
      card.addEventListener('pointermove', (event) => {
        if (event.pointerType === 'touch') return;
        const rect = card.getBoundingClientRect();
        const nx = (event.clientX - rect.left) / rect.width - .5;
        const ny = (event.clientY - rect.top) / rect.height - .5;
        const rx = ny * -4.5;
        const ry = nx * 5.5;
        card.style.transform = `perspective(1100px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-3px)`;
        card.classList.add('is-photo-hover');
      });
      card.addEventListener('pointerleave', () => {
        card.style.transform = '';
        card.classList.remove('is-photo-hover');
      });
    });
  }

  /* Tiny click pulse on interactive elements */
  if (!reducedMotion && finePointer) {
    document.addEventListener('pointerdown', (event) => {
      if (event.pointerType === 'touch') return;
      if (!event.target.closest('a,button,.expertise-card,.personal-nav-card,.service-card')) return;

      const ripple = document.createElement('span');
      ripple.className = 'click-ripple';
      ripple.style.left = `${event.clientX}px`;
      ripple.style.top = `${event.clientY}px`;
      document.body.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  }
})();


/* Sparkling effect for "Записаться" buttons */
(function () {
  const addSparkles = (el) => {
    if (!el || el.classList.contains('sparkle-cta')) return;
    el.classList.add('sparkle-cta');

    const layer = document.createElement('span');
    layer.className = 'cta-sparkles';
    layer.setAttribute('aria-hidden', 'true');
    layer.innerHTML = `
      <i class="cta-spark cta-spark--1"></i>
      <i class="cta-spark cta-spark--2"></i>
      <i class="cta-spark cta-spark--3"></i>
      <i class="cta-spark cta-spark--4"></i>
    `;
    el.appendChild(layer);
  };

  const candidates = document.querySelectorAll('a, button');
  candidates.forEach((el) => {
    const text = (el.textContent || '').trim().toLowerCase();
    if (text.includes('запис')) addSparkles(el);
  });
})();
