(function () {
  const headerOffset = 80;
  const stickyCta = document.getElementById('sticky-cta');
  const sampleForm = document.querySelector('.sample__form');
  const successMessage = document.getElementById('sample-success');
  const yearEl = document.getElementById('current-year');

  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  const scrollLinks = document.querySelectorAll('.js-scroll');
  scrollLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        const target = document.querySelector(href);
        if (target) {
          event.preventDefault();
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({
            top: targetPosition - headerOffset,
            behavior: 'smooth'
          });
        }
      }
      pushCtaEvent(link);
    });
  });

  function pushCtaEvent(element) {
    if (!element) return;
    const label = element.getAttribute('data-cta-label') || element.textContent.trim();
    const location = element.getAttribute('data-cta-location') || 'Unknown';
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'cta_click',
      ctaLabel: label,
      ctaLocation: location
    });
  }

  const faqButtons = document.querySelectorAll('.faq__question');
  faqButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const panelId = button.getAttribute('aria-controls');
      const panel = document.getElementById(panelId);
      const expanded = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!expanded));
      if (panel) {
        panel.hidden = expanded;
      }
    });
  });

  function handleStickyCta() {
    if (!stickyCta) return;
    const scrollTop = window.scrollY || window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolledPercent = docHeight > 0 ? scrollTop / docHeight : 0;
    if (scrolledPercent >= 0.3) {
      stickyCta.classList.add('sticky-cta--visible');
      stickyCta.setAttribute('aria-hidden', 'false');
    } else {
      stickyCta.classList.remove('sticky-cta--visible');
      stickyCta.setAttribute('aria-hidden', 'true');
    }
  }

  handleStickyCta();
  window.addEventListener('scroll', handleStickyCta, { passive: true });
  window.addEventListener('resize', handleStickyCta);

  if (sampleForm) {
    sampleForm.addEventListener('submit', (event) => {
      const nameInput = sampleForm.querySelector('#sample-name');
      const emailInput = sampleForm.querySelector('#sample-email');
      const nameError = document.getElementById('sample-name-error');
      const emailError = document.getElementById('sample-email-error');
      let hasError = false;

      if (nameError) nameError.textContent = '';
      if (emailError) emailError.textContent = '';

      if (nameInput && !nameInput.value.trim()) {
        hasError = true;
        if (nameError) {
          nameError.textContent = 'Please enter your name.';
        }
      }

      if (emailInput) {
        const emailValue = emailInput.value.trim();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(emailValue)) {
          hasError = true;
          if (emailError) {
            emailError.textContent = 'Enter a valid work email.';
          }
        }
      }

      if (hasError) {
        event.preventDefault();
        if (successMessage) {
          successMessage.hidden = true;
        }
        return;
      }

      event.preventDefault();
      if (successMessage) {
        successMessage.hidden = false;
      }
      pushCtaEvent(sampleForm.querySelector('[data-cta="sample_submit"]'));
      sampleForm.reset();
    });
  }
})();
