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
