/* Inline JS */
(function () {
  const headerOffset = 80;
  const scrollLinks = document.querySelectorAll('a[href^="#"]');
  const stickyBar = document.getElementById('sticky-bar');
  const dataLayer = window.dataLayer = window.dataLayer || [];
  const gtmId = 'GTM-XXXXXXX';
  document.documentElement.setAttribute('data-gtm-id', gtmId);

  function smoothScroll(event) {
    const targetId = this.getAttribute('href').slice(1);
    if (!targetId) {
      return;
    }
    const targetEl = document.getElementById(targetId);
    if (targetEl) {
      event.preventDefault();
      const elementPosition = targetEl.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      history.replaceState(null, '', `#${targetId}`);
    }
  }

  scrollLinks.forEach(link => {
    link.addEventListener('click', smoothScroll, false);
  });

  function handleCtaClick(event) {
    const cta = event.currentTarget;
    const label = cta.getAttribute('data-cta') || cta.textContent.trim();
    const location = cta.getAttribute('data-location') || 'Unknown';
    dataLayer.push({ event: 'cta_click', ctaLabel: label, ctaLocation: location });
  }

  document.querySelectorAll('[data-cta]').forEach(btn => {
    btn.addEventListener('click', handleCtaClick, false);
  });

  function toggleStickyBar() {
    if (!stickyBar) return;
    const scrollDepth = window.scrollY || window.pageYOffset;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    if (docHeight <= 0) {
      stickyBar.classList.remove('is-visible');
      return;
    }
    const scrolledPercent = scrollDepth / docHeight;
    if (scrolledPercent >= 0.3) {
      stickyBar.classList.add('is-visible');
    } else {
      stickyBar.classList.remove('is-visible');
    }
  }

  toggleStickyBar();
  window.addEventListener('scroll', toggleStickyBar, { passive: true });
})();
