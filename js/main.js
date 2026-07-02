/**
 * CIMA ABSOLUTA — Main JavaScript
 * Modular by section, no dependencies beyond vanilla JS.
 */

'use strict';

/* ═══════════════════════════════════════════
   UTILITIES
═══════════════════════════════════════════ */

const $ = (selector, context = document) => context.querySelector(selector);
const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];

function isInViewport(el, threshold = 0.2) {
  const rect = el.getBoundingClientRect();
  return rect.top < window.innerHeight * (1 - threshold + 1) - window.innerHeight * threshold;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}


/* ═══════════════════════════════════════════
   NAV — Scroll behavior + mobile burger
═══════════════════════════════════════════ */

function initNav() {
  const nav = $('#mainNav');
  const burger = $('#navBurger');
  const mobile = $('#navMobile');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('nav--scrolled', window.scrollY > 60);
  }, { passive: true });

  burger.addEventListener('click', () => {
    const open = burger.classList.toggle('is-open');
    mobile.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
  });

  // Close mobile menu on link click
  $$('a', mobile).forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('is-open');
      mobile.classList.remove('is-open');
    });
  });
}


/* ═══════════════════════════════════════════
   ALTIMETER — Scroll progress indicator
═══════════════════════════════════════════ */

function initAltimeter() {
  const fill = $('#altimeterFill');
  const marker = $('#altimeterMarker');
  if (!fill || !marker) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = clamp(scrollTop / docHeight, 0, 1);
    const pct = progress * 100;

    fill.style.height = pct + '%';
    marker.style.top = pct + '%';
  }, { passive: true });
}


/* ═══════════════════════════════════════════
   REVEAL ON SCROLL — Fade-in-up animation
═══════════════════════════════════════════ */

function initReveal() {
  const revealEls = $$('.reveal-up');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Si el usuario prefiere menos movimiento, mostramos todo directamente
  if (prefersReducedMotion) {
    revealEls.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.dataset.delay || 0;
        setTimeout(() => {
          el.classList.add('is-visible');
        }, parseInt(delay));
        observer.unobserve(el);
      }
    });
  }, {
    threshold: 0.08, // umbral bajo: se activa apenas un fragmento del
                      // elemento entra al viewport, clave en pantallas
                      // chicas donde los elementos suelen ser más altos
                      // que el propio viewport.
    rootMargin: '0px 0px -6% 0px', // dispara un poco antes de llegar al borde inferior
  });

  revealEls.forEach(el => observer.observe(el));
}


/* ═══════════════════════════════════════════
   TRUST BAR — Animated counters
═══════════════════════════════════════════ */

function initTrustBar() {
  const stats = $$('.trustbar__number[data-target]');
  let animated = false;

  function animateCounters() {
    stats.forEach(el => {
      const target = parseFloat(el.dataset.target);
      const decimal = el.dataset.decimal || '';
      const duration = 1800;
      const step = 16;
      const steps = duration / step;
      let current = 0;
      let count = 0;

      const timer = setInterval(() => {
        count++;
        current = target * (count / steps);
        if (count >= steps) {
          current = target;
          clearInterval(timer);
        }
        el.textContent = Math.floor(current) + (count >= steps ? decimal : '');
      }, step);
    });
  }

  const trustbar = $('.trustbar');
  if (!trustbar) return;

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !animated) {
      animated = true;
      animateCounters();
    }
  }, { threshold: 0.3 });

  observer.observe(trustbar);
}


/* ═══════════════════════════════════════════
   3D TILT CARDS — Manifesto section
═══════════════════════════════════════════ */

/**
 * USA RIDGELINE ANIMATIONS
 * Animaciones para el SVG de ridgeline al final de la sección manifesto
 */

class USARidgelineAnimations {
  constructor() {
    this.svgContainer = document.querySelector('.pre-footer-svg');
    this.ridgelinePath = document.querySelector('.ridgeline-path');
    this.init();
  }

  init() {
    if (!this.ridgelinePath) {
      console.warn('No SVG ridgeline path found');
      return;
    }

    // Calcular la longitud real del path
    const length = this.ridgelinePath.getTotalLength();
    
    // Aplicar valores iniciales
    this.ridgelinePath.style.strokeDasharray = length;
    this.ridgelinePath.style.strokeDashoffset = length;

    // Observar cuando entra en viewport
    this.observeRidgelineElement();
  }

  /**
   * Observador de intersección - anima cuando el elemento es visible
   */
  observeRidgelineElement() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.triggerRidgelineAnimation();
          // Solo animar una vez
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    if (this.svgContainer) {
      observer.observe(this.svgContainer);
    }
  }

  /**
   * Activar la animación del ridgeline
   */
  triggerRidgelineAnimation() {
    if (!this.ridgelinePath) return;

    const length = this.ridgelinePath.getTotalLength();

    // Reset a posición inicial
    this.ridgelinePath.style.strokeDasharray = length;
    this.ridgelinePath.style.strokeDashoffset = length;

    // Pequeño delay y luego animar
    setTimeout(() => {
      this.ridgelinePath.style.transition = 'stroke-dashoffset 4s ease-out';
      this.ridgelinePath.style.strokeDashoffset = 0;
      this.ridgelinePath.classList.add('is-animating');
    }, 100);
  }

  /**
   * Pausar la animación
   */
  pauseAnimation() {
    if (this.ridgelinePath) {
      this.ridgelinePath.style.animationPlayState = 'paused';
    }
  }

  /**
   * Reanudar la animación
   */
  resumeAnimation() {
    if (this.ridgelinePath) {
      this.ridgelinePath.style.animationPlayState = 'running';
    }
  }

  /**
   * Resetear a estado inicial
   */
  resetAnimation() {
    if (!this.ridgelinePath) return;

    const length = this.ridgelinePath.getTotalLength();
    this.ridgelinePath.style.transition = 'none';
    this.ridgelinePath.style.strokeDashoffset = length;
    this.ridgelinePath.classList.remove('is-animating');

    // Trigger reflow
    void this.ridgelinePath.offsetHeight;

    // Volver a animar
    this.ridgelinePath.style.transition = 'stroke-dashoffset 4s ease-out';
    this.ridgelinePath.style.strokeDashoffset = 0;
    this.ridgelinePath.classList.add('is-animating');
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  window.usaRidgelineAnimations = new USARidgelineAnimations();
});

/**
 * EJEMPLOS DE USO
 * 
 * Desde la consola del navegador:
 * 
 * // Resetear la animación del ridgeline (vuelve a dispararla desde cero)
 * window.usaRidgelineAnimations.resetAnimation();
 * 
 * // Pausar/Reanudar
 * window.usaRidgelineAnimations.pauseAnimation();
 * window.usaRidgelineAnimations.resumeAnimation();
 */


/* ═══════════════════════════════════════════
   HERO FILTERS — Filter buttons
═══════════════════════════════════════════ */

function initHeroFilters() {
  const filterBtns = $$('.filter-btn');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      const target = $('#expediciones');

      // Scroll to catalog
      target?.scrollIntoView({ behavior: 'smooth' });

      // Apply filter after scroll
      setTimeout(() => {
        filterCatalog(filter);
        $$('.tab-btn').forEach(tab => {
          tab.classList.remove('active');
          if (tab.dataset.tab === 'all' || filter === 'all') {
            if (tab.dataset.tab === 'all') tab.classList.add('active');
          }
        });
      }, 500);
    });
  });
}


/* ═══════════════════════════════════════════
   CATALOG — Expedition cards + tabs
═══════════════════════════════════════════ */

function renderExpeditionCard(exp) {
  const stars = '★'.repeat(exp.difficulty) + '☆'.repeat(5 - exp.difficulty);
  return `
    <div class="exp-card" data-filter="${exp.filter}" data-difficulty="${exp.difficulty}">
      <div class="exp-card__img-wrap">
        <img src="${exp.image}" alt="${exp.title}" loading="lazy" />
        <div class="exp-card__hover-cta">
          <span>Ver Itinerario</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </div>
        ${exp.tag ? `<div class="exp-card__tag" style="--tag-color: ${exp.tagColor}">${exp.tag}</div>` : ''}
      </div>
      <div class="exp-card__body">
        <div class="exp-card__meta">
          <span class="exp-card__height">${exp.height}</span>
          <span class="exp-card__stars" title="Dificultad ${exp.difficulty}/5">${stars}</span>
        </div>
        <h3 class="exp-card__title">${exp.title}</h3>
        <p class="exp-card__subtitle">${exp.subtitle}</p>
        <div class="exp-card__details">
          <span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            ${exp.days} días
          </span>
          <span class="exp-card__price">${exp.currency} ${exp.price.toLocaleString()}</span>
        </div>
      </div>
    </div>
  `;
}

function filterCatalog(filter) {
  const cards = $$('.exp-card');
  cards.forEach(card => {
    const show = filter === 'all' || card.dataset.filter === filter || card.dataset.difficulty === filter;
    card.style.display = show ? '' : 'none';
    if (show) {
      card.style.animation = 'none';
      card.offsetHeight; // reflow
      card.style.animation = '';
    }
  });
}

function initCatalog() {
  const grid = $('#catalogGrid');
  if (!grid || !window.expeditionsData) return;

  grid.innerHTML = window.expeditionsData.map(renderExpeditionCard).join('');

  // Tab filtering
  $$('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterCatalog(btn.dataset.tab);
    });
  });
}


/* ═══════════════════════════════════════════
   FLAGSHIP COUNTDOWN — Real countdown timer
═══════════════════════════════════════════ */

function initCountdown() {
  const daysEl = $('#cdDays');
  const hoursEl = $('#cdHours');
  const minsEl = $('#cdMins');
  if (!daysEl) return;

  // Target: November 15 of the next upcoming year
  const now = new Date();
  let targetYear = now.getFullYear();
  const target = new Date(targetYear, 10, 15, 6, 0, 0); // Nov 15 at 06:00

  if (now >= target) {
    target.setFullYear(targetYear + 1);
  }

  function update() {
    const diff = target - new Date();
    if (diff <= 0) return;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minsEl.textContent = String(mins).padStart(2, '0');
  }

  update();
  setInterval(update, 30000);
}


/* ═══════════════════════════════════════════
   JOURNEY TIMELINE — Scroll-activated line
═══════════════════════════════════════════ */

function initJourney() {
  const timeline = $('#journeyTimeline');
  const lineFill = $('#journeyLineFill');
  const steps = $$('.journey__step');
  if (!timeline || !lineFill || steps.length === 0) return;

  let isTimelineVisible = false;

  // Observar si la timeline está visible en viewport
  const timelineObserver = new IntersectionObserver(
    (entries) => {
      isTimelineVisible = entries[0].isIntersecting;
      if (isTimelineVisible) {
        updateProgress();
      }
    },
    { threshold: 0 }
  );

  timelineObserver.observe(timeline);

  let rafId = null;

  // Calcula y aplica el progreso (0 → 1) de la línea + estado activo de cada paso
  function updateProgress() {
    const rect = timeline.getBoundingClientRect();
    const viewH = window.innerHeight;

    // Progreso de scroll dentro de la timeline (0 a 1)
    const progress = clamp(
      (viewH - rect.top) / (rect.height + viewH * 0.5),
      0,
      1
    );

    // Rellena la línea verde de 0% a 100% según el progreso
    lineFill.style.height = (progress * 100) + '%';

    // Activa/desactiva cada paso (gris → verde) según el progreso.
    // Al subir el scroll, "progress" baja y la clase se remueve sola,
    // volviendo el punto/número a gris.
    steps.forEach((step, i) => {
      const stepThreshold = (i + 1) / steps.length;
      // Umbral más generoso (-0.15) para que el paso se active un poco
      // antes de llegar exactamente a su posición — mejor UX.
      const isActive = progress >= (stepThreshold - 0.15);
      step.classList.toggle('is-active', isActive);
    });
  }

  // Listener de scroll optimizado con requestAnimationFrame:
  // agrupa los eventos de scroll y ejecuta como máximo un cálculo
  // por frame (~60fps), evitando trabajo redundante.
  const handleScroll = () => {
    if (!isTimelineVisible) return;
    if (rafId) return; // ya hay un cálculo agendado para el próximo frame
    rafId = requestAnimationFrame(() => {
      updateProgress();
      rafId = null;
    });
  };

  // Scroll listener pasivo para mejor rendimiento (no bloquea el scroll)
  window.addEventListener('scroll', handleScroll, { passive: true });

  // Recalcular también al cambiar el tamaño de ventana (rotación mobile, resize)
  window.addEventListener('resize', handleScroll, { passive: true });

  // Inicializar en la carga
  updateProgress();

  // Limpiar listeners cuando sea necesario
  return () => {
    timelineObserver.disconnect();
    window.removeEventListener('scroll', handleScroll);
    window.removeEventListener('resize', handleScroll);
    if (rafId) cancelAnimationFrame(rafId);
  };
}


/* ═══════════════════════════════════════════
   LEVEL TEST — Quiz logic
═══════════════════════════════════════════ */

function initLevelTest() {
  const form = $('#levelTestForm');
  const result = $('#testResult');
  const submitBtn = $('#testSubmitBtn');
  const retryBtn = $('#testRetryBtn');
  const resultName = $('#resultName');
  const resultDesc = $('#resultDesc');

  if (!submitBtn) return;

  function getResult(q1, q2) {
    const results = window.testResults;

    if (q1 === 'sea' || q1 === '2000' || q2 === '0' || q2 === '2') {
      return results.beginner;
    } else if (q1 === '4000' || (q1 === '2000' && q2 === '4')) {
      return results.intermediate;
    } else if (q1 === '5000') {
      return results.advanced;
    } else {
      return results.expert;
    }
  }

  submitBtn.addEventListener('click', () => {
    const q1 = $('#q1').value;
    const q2 = $('#q2').value;

    if (!q1 || !q2) {
      $$('.leveltest__select').forEach(s => {
        if (!s.value) s.style.borderColor = '#FF5416';
      });
      return;
    }

    const res = getResult(q1, q2);
    resultName.textContent = res.name;
    resultDesc.textContent = res.desc;

    form.style.opacity = '0';
    form.style.transform = 'translateY(-10px)';
    setTimeout(() => {
      form.style.display = 'none';
      result.style.display = 'flex';
      result.style.opacity = '0';
      result.offsetHeight;
      result.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      result.style.transform = 'translateY(10px)';
      result.offsetHeight;
      result.style.opacity = '1';
      result.style.transform = 'translateY(0)';
    }, 300);
  });

  retryBtn?.addEventListener('click', () => {
    result.style.display = 'none';
    $('#q1').value = '';
    $('#q2').value = '';
    $$('.leveltest__select').forEach(s => s.style.borderColor = '');
    form.style.display = '';
    form.style.opacity = '1';
    form.style.transform = 'none';
  });
}


/* ═══════════════════════════════════════════
   CARD CAROUSEL — Lógica compartida por "Cursos" y "Testimonios"
   ─────────────────────────────────────────────────────────────
   Usa scroll horizontal NATIVO (overflow-x + scroll-snap en CSS) en
   vez de transform manual. Esto da tres cosas gratis y de forma
   perfectamente sincronizada entre sí:
     1) Swipe táctil / trackpad → el navegador lo maneja nativamente,
        con toda la fluidez e inercia del sistema operativo.
     2) Alineación exacta de las cards → scroll-snap-align hace que
        SIEMPRE termine encajado en un borde de card, nunca cortada.
     3) Flechas y rueda del mouse → ambas simplemente mueven el mismo
        scrollLeft real del contenedor, así que los 3 modos de
        interacción (flechas / wheel / touch) están 100% sincronizados.
═══════════════════════════════════════════ */

function createCardCarousel({ viewport, track, prevBtn, nextBtn, cardSelector }) {
  if (!viewport || !track) return;

  const getCards = () => $$(cardSelector, track);

  // Distancia de "1 card completa" en px, medida en vivo (se adapta
  // sola a cualquier breakpoint sin que el JS necesite saber cuántas
  // cards hay visibles en cada tamaño de pantalla).
  function getStep() {
    const cards = getCards();
    if (!cards.length) return viewport.clientWidth;
    const trackStyles = getComputedStyle(track);
    const gap = parseFloat(trackStyles.columnGap || trackStyles.gap) || 0;
    return cards[0].getBoundingClientRect().width + gap;
  }

  function getMaxScroll() {
    return Math.max(0, viewport.scrollWidth - viewport.clientWidth);
  }

  function scrollByCards(direction) {
    viewport.scrollBy({ left: direction * getStep(), behavior: 'smooth' });
  }

  function updateNavState() {
    const maxScroll = getMaxScroll();
    if (prevBtn) prevBtn.disabled = viewport.scrollLeft <= 1;
    if (nextBtn) nextBtn.disabled = viewport.scrollLeft >= maxScroll - 1;
  }

  // 1) Flechas: avanzan/retroceden exactamente 1 card completa
  if (prevBtn) prevBtn.addEventListener('click', () => scrollByCards(-1));
  if (nextBtn) nextBtn.addEventListener('click', () => scrollByCards(1));

  // 2) Rueda del mouse/trackpad: traduce el scroll vertical (lo único
  //    que tienen la mayoría de los mouse) en desplazamiento horizontal.
  //    Si el dispositivo ya manda delta horizontal (trackpad), lo dejamos
  //    pasar tal cual para que el navegador lo procese de forma nativa.
  viewport.addEventListener('wheel', (e) => {
    if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
    e.preventDefault();
    viewport.scrollBy({ left: e.deltaY, behavior: 'auto' });
  }, { passive: false });

  // 3) Touch / swipe: sin listeners manuales — "overflow-x: auto" +
  //    "scroll-snap-type" en CSS le dan swipe nativo con inercia real,
  //    más fluido que cualquier cálculo de touchstart/touchend a mano.

  // Estado de flechas sincronizado con el scroll real (rAF-throttled
  // para no recalcular en cada pixel de scroll)
  let ticking = false;
  viewport.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      updateNavState();
      ticking = false;
    });
  }, { passive: true });

  window.addEventListener('resize', updateNavState, { passive: true });

  updateNavState();
}


/* ═══════════════════════════════════════════
   TESTIMONIALS — Carousel (usa la lógica compartida)
═══════════════════════════════════════════ */

function initTestimonials() {
  createCardCarousel({
    viewport: $('#testimonialsCarousel'),
    track: $('#testimonialsTrack'),
    prevBtn: $('#testimonialPrev'),
    nextBtn: $('#testimonialNext'),
    cardSelector: '.testimonials__card',
  });
}


/* ═══════════════════════════════════════════
   GUIDE CARDS — 3D flip on hover/touch
═══════════════════════════════════════════ */

function initGuideCards() {
  $$('.guide-card').forEach(card => {
    // Touch support
    card.addEventListener('click', () => {
      card.classList.toggle('is-flipped');
    });
  });
}


/* ═══════════════════════════════════════════
   FAQ — Accordion with animation
═══════════════════════════════════════════ */

function initFAQ() {
  $$('.faq__question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq__item');
      const answer = item.querySelector('.faq__answer');
      const inner = item.querySelector('.faq__answer-inner');
      const isOpen = btn.getAttribute('aria-expanded') === 'true';

      // Close all others
      $$('.faq__item').forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.querySelector('.faq__question').setAttribute('aria-expanded', 'false');
          otherItem.querySelector('.faq__answer').style.height = '0';
          otherItem.classList.remove('is-open');
        }
      });

      if (isOpen) {
        btn.setAttribute('aria-expanded', 'false');
        answer.style.height = '0';
        item.classList.remove('is-open');
      } else {
        btn.setAttribute('aria-expanded', 'true');
        answer.style.height = inner.offsetHeight + 'px';
        item.classList.add('is-open');
      }
    });
  });
}


/* ═══════════════════════════════════════════
   LEAD MAGNET FORM — Submission handler
═══════════════════════════════════════════ */

function initLeadMagnet() {
  const form = $('#leadmagnetForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = form.querySelector('input[type="email"]').value;
    const btn = form.querySelector('button');

    btn.textContent = '¡Enviado! Revisa tu bandeja de entrada';
    btn.style.background = '#2ecc71';
    btn.disabled = true;
    form.querySelector('input').disabled = true;

    // In a real implementation, you would POST to your email service here
    console.log('Lead captured:', email);
  });
}


/* ═══════════════════════════════════════════
   SMOOTH SCROLL — Internal anchor links
═══════════════════════════════════════════ */

function initSmoothScroll() {
  $$('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}


/* ═══════════════════════════════════════════
   REDUCED MOTION — Respect user preference
═══════════════════════════════════════════ */

function respectReducedMotion() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.classList.add('reduced-motion');
  }
}


/* ═══════════════════════════════════════════
   INIT ALL
═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  // Cada init se ejecuta en su propio try/catch: si uno falla,
  // no debe impedir que los demás módulos de la página funcionen.
  const modules = [
    respectReducedMotion,
    initNav,
    initAltimeter,
    initReveal,
    initTrustBar,
    initHeroFilters,
    initCatalog,
    initCountdown,
    initCoursesCarousel,
    initJourney,
    initLevelTest,
    initTestimonials,
    initGuideCards,
    initFAQ,
    initLeadMagnet,
    initSmoothScroll,
  ];

  modules.forEach(fn => {
    try {
      fn();
    } catch (err) {
      console.error(`Error al inicializar "${fn.name}":`, err);
    }
  });
});

function initCoursesCarousel() {
  createCardCarousel({
    viewport: $('.courses__viewport'),
    track: $('#coursesTrack'),
    prevBtn: $('#coursesPrev'),
    nextBtn: $('#coursesNext'),
    cardSelector: '.course-card',
  });
}
