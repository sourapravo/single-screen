(() => {
  'use strict';
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];

  const progressBar = $('#progress-bar');
  const hero = $('.hero');
  const heroImage = $('.hero-image');
  const heroContent = $('.hero-content');
  const dissolve = $('.dissolve-figure');
  const dissolveStage = dissolve ? $('.dissolve-stage', dissolve) : null;
  const imgA = dissolve ? $('.dissolve-a', dissolve) : null;
  const imgB = dissolve ? $('.dissolve-b', dissolve) : null;

  let ticking = false;

  function clamp(v, min = 0, max = 1) {
    return Math.min(max, Math.max(min, v));
  }

  function smoothstep(v) {
    v = clamp(v);
    return v * v * (3 - 2 * v);
  }

  function updateProgress() {
    if (!progressBar) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = max > 0 ? window.scrollY / max : 0;
    progressBar.style.transformOrigin = 'left center';
    progressBar.style.transform = `scaleX(${clamp(p)})`;
  }

  function updateHero() {
    if (!hero || !heroImage || !heroContent) return;

    const rect = hero.getBoundingClientRect();
    const h = Math.max(1, hero.offsetHeight);
    const p = clamp(-rect.top / h);

    // Noticeable but restrained parallax: image travels more slowly than the page.
    const y = p * 11;
    const scale = 1.10 + p * 0.055;
    heroImage.style.transform = `translate3d(0, ${y}%, 0) scale(${scale})`;

    // Text remains centred initially, then gently rises and dissolves away.
    const textY = p * -34;
    const opacity = clamp(1 - p * 1.25);
    const blur = p * 2.2;
    heroContent.style.transform = `translate3d(0, calc(-50% + ${textY}px), 0)`;
    heroContent.style.opacity = String(opacity);
    heroContent.style.filter = `blur(${blur}px)`;
  }

  function updateDissolve() {
    if (!dissolveStage || !imgA || !imgB) return;

    const rect = dissolveStage.getBoundingClientRect();
    const start = window.innerHeight * 0.78;
    const end = window.innerHeight * 0.14;
    const raw = (start - rect.top) / Math.max(1, start - end);
    const p = smoothstep(raw);

    imgA.style.opacity = String(1 - p);
    imgB.style.opacity = String(p);

    // A tiny photographic breathing/softening effect during the dissolve.
    imgA.style.transform = `scale(${1.00 + p * 0.035})`;
    imgB.style.transform = `scale(${1.035 - p * 0.035})`;
    imgA.style.filter = `blur(${p * 1.7}px)`;
    imgB.style.filter = `blur(${(1 - p) * 1.7}px)`;
  }

  function onFrame() {
    updateProgress();
    updateHero();
    updateDissolve();
    ticking = false;
  }

  function requestFrame() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(onFrame);
  }

  /* Subsections are deliberately manual: nothing auto-expands while scrolling. */
  $$('.side-toggle').forEach(button => {
    button.addEventListener('click', () => {
      const group = button.closest('.side-group');
      if (!group) return;
      const open = group.classList.toggle('is-open');
      button.setAttribute('aria-expanded', String(open));
      const symbol = $('span', button);
      if (symbol) symbol.textContent = open ? '−' : '+';
    });
  });

  /* Active section styling only; it never opens a collapsed group. */
  const sectionEls = $$('.content-section[data-section]');
  const sideItems = $$('.side-link, .side-group');
  const sideMap = new Map();
  sideItems.forEach(item => {
    if (item.dataset.sideSection) sideMap.set(item.dataset.sideSection, item);
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.dataset.section;
      $$('.side-link, .side-parent, .side-sub').forEach(el => el.classList.remove('is-active'));
      const item = sideMap.get(id);
      if (item) {
        const parent = item.classList.contains('side-group') ? $('.side-parent', item) : item;
        if (parent) parent.classList.add('is-active');
      }
      const sub = document.querySelector(`.side-sub[href="#${CSS.escape(id)}"]`);
      if (sub) sub.classList.add('is-active');
    });
  }, { rootMargin: '-18% 0px -70% 0px', threshold: 0 });

  sectionEls.forEach(section => observer.observe(section));

  /* Smooth internal navigation. */
  $$('a[href^="#"]').forEach(link => {
    link.addEventListener('click', event => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      event.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 24;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* Note links: briefly highlight the destination. */
  $$('a[href^="#note-"]').forEach(link => {
    link.addEventListener('click', () => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      window.setTimeout(() => {
        target.classList.add('note-highlight');
        window.setTimeout(() => target.classList.remove('note-highlight'), 1600);
      }, 450);
    });
  });

  window.addEventListener('scroll', requestFrame, { passive: true });
  window.addEventListener('resize', requestFrame);
  window.addEventListener('load', requestFrame);

  requestFrame();
})();
