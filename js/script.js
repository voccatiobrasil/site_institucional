(function () {
  'use strict';

  // Reforço contra clickjacking; o bloqueio principal é o cabeçalho HTTP frame-ancestors.
  if (window.top !== window.self) {
    try { window.top.location = window.self.location; } catch (e) { /* bloqueado */ }
    document.documentElement.style.display = 'none';
    return;
  }

  // Dados editáveis do site: contatos, horário, endereço, redes sociais e login.
  const SITE_CONFIG = deepFreeze({
    contacts: {
      phone: '+55 (47) 9 3385-3383',
      whatsapp: '+55 (47) 9 3385-3383',
      email: 'contato@voccatio.com.br'
    },

    businessHours: [
      { days: 'Segunda a sexta', hours: '08h às 18h' }
    ],

    location: {
      address: 'Maringá - PR',
      mapEmbedUrl: "https://www.google.com/maps?q=Maring%C3%A1%2C%20PR&output=embed"
    },

    social: {
      linkedin: '',
      instagram: 'https://www.instagram.com/voccatio/',
      youtube: 'https://www.youtube.com/@Voccatio'
    },

    // Enquanto vazio, o botão Login exibe um aviso.
    internalAreaUrl: ''
  });

  function deepFreeze(object) {
    Object.values(object).forEach((value) => {
      if (value && typeof value === 'object') deepFreeze(value);
    });
    return Object.freeze(object);
  }

  // Hosts permitidos por tipo de link; URLs fora da lista são ignoradas.
  const ALLOWED_SOCIAL_HOSTS = {
    linkedin:  ['linkedin.com', 'www.linkedin.com', 'br.linkedin.com'],
    instagram: ['instagram.com', 'www.instagram.com'],
    youtube:   ['youtube.com', 'www.youtube.com', 'youtu.be']
  };
  const ALLOWED_MAP_HOSTS = ['www.google.com', 'maps.google.com'];
  const FORM_ENDPOINT_PATTERN = /^https:\/\/formspree\.io\/f\/[A-Za-z0-9]+$/;

  const TEXT = {
    pending: 'A definir',
    loginSoon: 'A área interna estará disponível em breve.',
    formSending: 'Enviando…',
    formSuccess: 'Mensagem enviada. A Voccatio entrará em contato em breve.',
    formFailure: 'Não foi possível enviar. Tente novamente em instantes.',
    rateLimited: 'Aguarde um instante antes de enviar outra mensagem.',
    required: 'Preencha este campo.',
    invalidEmail: 'Informe um e-mail válido, como exemplo@email.com.',
    invalidPhone: 'Informe o WhatsApp completo, como (47) 9 3385-3383.',
    tooLong: (max) => `Use no máximo ${max} caracteres.`
  };

  const $  = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  const prefersReducedMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function onFrame(callback) {
    let scheduled = false;
    return function (...args) {
      if (scheduled) return;
      scheduled = true;
      window.requestAnimationFrame(() => {
        scheduled = false;
        callback.apply(this, args);
      });
    };
  }

  const EMAIL_PATTERN = /^[^\s@<>"'()\\,;:]+@[^\s@<>"'()\\,;:]+\.[^\s@<>"'()\\,;:]{2,}$/;

  const digitsOnly = (value) => String(value).replace(/\D/g, '');

  // Aceita apenas https e, se informado, hosts permitidos; barra javascript:, data: e afins.
  function safeHttpsUrl(value, allowedHosts) {
    try {
      const url = new URL(String(value).trim());
      if (url.protocol !== 'https:') return '';
      if (url.username || url.password) return '';
      if (allowedHosts && !allowedHosts.includes(url.hostname)) return '';
      return url.href;
    } catch (error) {
      return '';
    }
  }

  function safeInternalUrl(value) {
    const text = String(value).trim();
    if (/^\/(?![/\\])[\w\-./?=&%#]*$/.test(text)) return text;
    return safeHttpsUrl(text);
  }

  // Remove caracteres de controle, invisíveis e de direção de texto.
  function sanitizeText(value) {
    return String(value)
      .normalize('NFC')
      .replace(/\r\n?/g, '\n')
      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g, '')
      .replace(/[\u200B-\u200F\u202A-\u202E\u2060-\u2064\u2066-\u2069\uFEFF]/g, '')
      .trim();
  }

  let toastTimer = null;
  function showToast(message) {
    const toast = $('[data-toast]');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 3500);
  }

  function initHeaderAndProgress() {
    const header = $('[data-header]');
    const progressBar = $('[data-scroll-progress]');

    const update = onFrame(() => {
      const scrollTop = window.scrollY;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;

      if (header) header.classList.toggle('is-scrolled', scrollTop > 20);
      if (progressBar && scrollable > 0) {
        progressBar.style.transform = `scaleX(${Math.min(scrollTop / scrollable, 1)})`;
      }
    });

    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  function initMobileMenu() {
    const toggle = $('[data-nav-toggle]');
    const nav = $('[data-nav]');
    if (!toggle || !nav) return;

    const setOpen = (isOpen) => {
      nav.classList.toggle('is-open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
    };

    toggle.addEventListener('click', () =>
      setOpen(toggle.getAttribute('aria-expanded') !== 'true'));

    nav.addEventListener('click', (event) => {
      if (event.target.closest('a')) setOpen(false);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') setOpen(false);
    });
  }

  function initScrollReveal() {
    const items = $$('[data-reveal]');
    if (!items.length) return;

    if (!('IntersectionObserver' in window)) {
      items.forEach((item) => item.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

    items.forEach((item) => observer.observe(item));
  }

  function initActiveNavigation() {
    const links = $$('.main-nav__link');
    const sections = $$('[data-section]');
    if (!links.length || !sections.length || !('IntersectionObserver' in window)) return;

    const setActive = (id) => {
      links.forEach((link) =>
        link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`));
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach((section) => observer.observe(section));
  }

  function initHeroParallax() {
    const mark = $('[data-parallax]');
    if (!mark || prefersReducedMotion()) return;

    const update = onFrame(() => {
      if (window.scrollY > window.innerHeight) return;
      mark.style.transform = `translateY(${window.scrollY * 0.18}px)`;
    });

    window.addEventListener('scroll', update, { passive: true });
  }

  function initPanelSteps() {
    const container = $('[data-flow-steps]');
    if (!container || prefersReducedMotion()) return;

    const steps = Array.from(container.children);
    let current = 0;

    window.setInterval(() => {
      steps[current].classList.remove('is-active');
      current = (current + 1) % steps.length;
      steps[current].classList.add('is-active');
    }, 1800);
  }

  function initContactChannels() {
    const phoneHref = (value, prefix) => {
      const digits = digitsOnly(value);
      return digits.length >= 10 && digits.length <= 15 ? `${prefix}${digits}` : '';
    };
    const builders = {
      phone:    (value) => ({ text: value, href: phoneHref(value, 'tel:+') }),
      whatsapp: (value) => ({ text: value, href: phoneHref(value, 'https://wa.me/') }),
      email:    (value) => ({
        text: value,
        href: EMAIL_PATTERN.test(value) ? `mailto:${value}` : ''
      })
    };

    $$('[data-contact]').forEach((element) => {
      const key = element.dataset.contact;
      const value = (SITE_CONFIG.contacts[key] || '').trim();

      if (!value || !builders[key]) {
        element.textContent = TEXT.pending;
        element.removeAttribute('href');
        return;
      }

      const { text, href } = builders[key](value);
      element.textContent = text;
      if (href) {
        element.setAttribute('href', href);
      } else {
        element.removeAttribute('href');
      }
    });
  }

  function initBusinessHours() {
    const list = $('[data-hours-list]');
    if (!list || !SITE_CONFIG.businessHours.length) return;

    list.replaceChildren(...SITE_CONFIG.businessHours.map(({ days, hours }) => {
      const item = document.createElement('li');
      item.textContent = `${days}: ${hours}`;
      return item;
    }));
  }

  function initLocation() {
    const { address, mapEmbedUrl } = SITE_CONFIG.location;
    const addressElement = $('[data-address]');
    const mapContainer = $('[data-map]');

    if (addressElement && address.trim()) addressElement.textContent = address;

    const mapUrl = safeHttpsUrl(mapEmbedUrl, ALLOWED_MAP_HOSTS);

    if (mapContainer && mapUrl) {
      const frame = document.createElement('iframe');
      frame.src = mapUrl;
      frame.title = 'Mapa com a localização da Voccatio';
      frame.loading = 'lazy';
      // Sandbox: o mapa roda isolado do restante do site.
      frame.setAttribute('sandbox', 'allow-scripts allow-same-origin');
      frame.referrerPolicy = 'strict-origin-when-cross-origin';
      frame.setAttribute('allow', '');
      mapContainer.replaceChildren(frame);
    }
  }

  function initSocialLinks() {
    $$('[data-social]').forEach((link) => {
      const network = link.dataset.social;
      const url = safeHttpsUrl(SITE_CONFIG.social[network] || '', ALLOWED_SOCIAL_HOSTS[network]);

      if (!url) {
        link.removeAttribute('href');
        link.setAttribute('aria-disabled', 'true');
        return;
      }
      link.setAttribute('href', url);
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    });
  }

  function initFooterYear() {
    const target = $('[data-year]');
    if (target) target.textContent = String(new Date().getFullYear());
  }

  // Os limites de caracteres vêm do atributo maxlength de cada campo no HTML.

  const PHONE_DIGITS = 11; // DDD (2) + 9 + número (8)

  // Proteções contra abuso do envio (o limite real fica no Formspree).
  const SUBMIT_TIMEOUT_MS = 15000;
  const MIN_FILL_TIME_MS = 3000;
  const SUBMIT_COOLDOWN_MS = 30000;
  const MAX_SUBMITS_PER_SESSION = 5;

  function formatBrazilianPhone(rawValue, isPaste = false) {
    let digits = digitsOnly(rawValue);

    if (isPaste && digits.length > PHONE_DIGITS && digits.startsWith('55')) {
      digits = digits.slice(2);
    }
    digits = digits.slice(0, PHONE_DIGITS);
    if (!digits.length) return '';

    let formatted = `(${digits.slice(0, 2)}`;
    if (digits.length > 2) formatted += `) ${digits[2]}`;
    if (digits.length > 3) formatted += ` ${digits.slice(3, 7)}`;
    if (digits.length > 7) formatted += `-${digits.slice(7)}`;
    return formatted;
  }

  function validateText(value, maxLength, isRequired) {
    const text = sanitizeText(value);
    if (!text) return isRequired ? TEXT.required : '';
    return maxLength > 0 && text.length > maxLength ? TEXT.tooLong(maxLength) : '';
  }

  const validators = {
    nome:     (value, field) => validateText(value, field.maxLength, true),
    assunto:  (value, field) => validateText(value, field.maxLength, true),
    mensagem: (value, field) => validateText(value, field.maxLength, false),

    email: (value, field) => {
      const email = sanitizeText(value);
      if (!email) return TEXT.required;
      if (field.maxLength > 0 && email.length > field.maxLength) return TEXT.tooLong(field.maxLength);
      return EMAIL_PATTERN.test(email) ? '' : TEXT.invalidEmail;
    },

    // Celular brasileiro: 11 dígitos, com o 9 logo após o DDD.
    whatsapp: (value) => {
      if (!value.trim()) return TEXT.required;
      const digits = digitsOnly(value);
      return digits.length === PHONE_DIGITS && digits[2] === '9' ? '' : TEXT.invalidPhone;
    }
  };

  function setFieldError(form, name, message) {
    const input = form.elements[name];
    const output = $(`[data-error-for="${name}"]`, form);
    if (input) input.classList.toggle('is-invalid', Boolean(message));
    if (output) output.textContent = message;
  }

  function validateField(form, name) {
    const field = form.elements[name];
    const message = validators[name](field.value, field);
    setFieldError(form, name, message);
    return !message;
  }

  function validateForm(form) {
    const invalidNames = Object.keys(validators).filter((name) => !validateField(form, name));
    if (invalidNames.length) form.elements[invalidNames[0]].focus();
    return invalidNames.length === 0;
  }

  function initPhoneMask(form) {
    const phoneField = form.elements.whatsapp;
    if (!phoneField) return;

    phoneField.addEventListener('input', (event) => {
      const isPaste = event.inputType === 'insertFromPaste';
      phoneField.value = formatBrazilianPhone(phoneField.value, isPaste);
    });
  }

  function initCharCounters(form) {
    const counters = $$('[data-counter-for]', form);
    if (!counters.length) return;

    const update = () => {
      counters.forEach((counter) => {
        const field = form.elements[counter.dataset.counterFor];
        const max = field.maxLength;
        counter.textContent = `${field.value.length}/${max}`;
        counter.classList.toggle('is-limit', field.value.length >= max);
      });
    };

    form.addEventListener('input', update);
    form.addEventListener('reset', () => window.setTimeout(update));
    update();
  }

  // Sem endpoint definido, o envio é simulado.
  async function sendContactMessage(endpoint, payload) {
    if (!endpoint) {
      return new Promise((resolve) => window.setTimeout(resolve, 900));
    }

    // Só envia para o endpoint esperado do Formspree.
    if (!FORM_ENDPOINT_PATTERN.test(endpoint)) throw new Error('Endpoint inválido');

    // Timeout: evita o botão ficar travado se a rede não responder.
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), SUBMIT_TIMEOUT_MS);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload),
        mode: 'cors',
        credentials: 'omit',
        cache: 'no-store',
        referrerPolicy: 'strict-origin-when-cross-origin',
        redirect: 'error',
        signal: controller.signal
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
    } finally {
      window.clearTimeout(timeout);
    }
  }

  function setFormStatus(form, message, type) {
    const status = $('[data-form-status]', form);
    if (!status) return;
    status.textContent = message;
    status.classList.toggle('is-success', type === 'success');
    status.classList.toggle('is-error', type === 'error');
  }

  // Envia somente os campos conhecidos, higienizados e limitados ao maxlength.
  function buildPayload(form) {
    const payload = {};
    Object.keys(validators).forEach((name) => {
      const field = form.elements[name];
      let value = sanitizeText(field.value);
      if (name === 'whatsapp') value = formatBrazilianPhone(value);
      if (field.maxLength > 0) value = value.slice(0, field.maxLength);
      payload[name] = value;
    });
    return payload;
  }

  const submitGuard = (() => {
    let lastSubmit = 0;
    let count = 0;
    try { count = Number(window.sessionStorage.getItem('voccatio_submits')) || 0; } catch (e) { /* storage bloqueado */ }

    return {
      check() {
        if (count >= MAX_SUBMITS_PER_SESSION) return TEXT.rateLimited;
        if (Date.now() - lastSubmit < SUBMIT_COOLDOWN_MS) return TEXT.rateLimited;
        return '';
      },
      register() {
        lastSubmit = Date.now();
        count += 1;
        try { window.sessionStorage.setItem('voccatio_submits', String(count)); } catch (e) { /* storage bloqueado */ }
      }
    };
  })();

  function initContactForm() {
    const form = $('[data-contact-form]');
    if (!form) return;

    const submitButton = $('[data-submit]', form);
    const endpoint = form.getAttribute('action');
    const renderedAt = Date.now();

    initPhoneMask(form);
    initCharCounters(form);

    form.addEventListener('input', (event) => {
      const name = event.target.name;
      if (validators[name]) setFieldError(form, name, '');
    });

    form.addEventListener('focusout', (event) => {
      const name = event.target.name;
      if (validators[name] && event.target.value.trim()) validateField(form, name);
    });

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      setFormStatus(form, '', '');

      // Campo isca preenchido ou preenchimento instantâneo = robô. Descarta em silêncio.
      if (form.elements._gotcha.value) return;
      if (Date.now() - renderedAt < MIN_FILL_TIME_MS) return;
      if (!validateForm(form)) return;

      const blocked = submitGuard.check();
      if (blocked) {
        setFormStatus(form, blocked, 'error');
        return;
      }

      submitButton.disabled = true;
      setFormStatus(form, TEXT.formSending, '');

      try {
        await sendContactMessage(endpoint, buildPayload(form));
        submitGuard.register();
        form.reset();
        setFormStatus(form, TEXT.formSuccess, 'success');
      } catch (error) {
        setFormStatus(form, TEXT.formFailure, 'error');
      } finally {
        submitButton.disabled = false;
      }
    });
  }

  function initInternalLogin() {
    const button = $('[data-internal-login]');
    if (!button) return;

    const url = safeInternalUrl(SITE_CONFIG.internalAreaUrl);

    if (url) {
      button.setAttribute('href', url);
      button.setAttribute('rel', 'noopener noreferrer');
      return;
    }

    button.addEventListener('click', (event) => {
      event.preventDefault();
      showToast(TEXT.loginSoon);
    });
  }

  function init() {
    document.documentElement.classList.add('js-ready');

    initHeaderAndProgress();
    initMobileMenu();
    initScrollReveal();
    initActiveNavigation();
    initHeroParallax();
    initPanelSteps();

    initContactChannels();
    initBusinessHours();
    initLocation();
    initSocialLinks();
    initFooterYear();

    initContactForm();
    initInternalLogin();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
