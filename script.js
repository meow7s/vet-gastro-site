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
const certCards = document.querySelectorAll('.certificate-item, .feature-cert');
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
