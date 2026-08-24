/* project.single_screen — FINAL interaction layer */

document.addEventListener("DOMContentLoaded", () => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const progressBar = $("#progress-bar");
  const sidebarProgress = $(".sidebar-progress__fill");
  const sidebar = $("#sidebar");
  const hero = $(".hero");
  const heroImage = $(".hero-image");
  const heroContent = $(".hero-content");

  /* ---------- Article block entrance ---------- */
  // Text/image blocks reveal once when first entering the viewport.
  // They do not replay when the reader scrolls back.
  const revealBlocks = [
    ...$$(".article > .content-section > *"),
    ...$$(".article > .content-section > .comparison"),
    ...$$(".article > .notes-section > *"),
    ...$$(".article > .references-section > *"),
    ...$$(".site-footer")
  ].filter(Boolean);

  document.body.classList.add("js-reveal-ready");

  revealBlocks.forEach((el, i) => {
    el.classList.add("scroll-reveal");
    el.style.transitionDelay = `${Math.min((i % 8) * 18, 126)}ms`;
  });

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-revealed");
        revealObserver.unobserve(entry.target);
      });
    }, {
      threshold: 0.08,
      rootMargin: "0px 0px -7% 0px"
    });

    revealBlocks.forEach(el => revealObserver.observe(el));
  } else {
    revealBlocks.forEach(el => el.classList.add("is-revealed"));
  }

  /* ---------- Reading progress ---------- */
  function updateProgress() {
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const value = Math.max(0, Math.min(1, window.scrollY / max));

    if (progressBar) progressBar.style.transform = `scaleX(${value})`;
    if (sidebarProgress) sidebarProgress.style.height = `${value * 100}%`;
  }

  /* ---------- Hero parallax ---------- */
  function updateHero() {
    if (!hero || !heroImage) return;

    const rect = hero.getBoundingClientRect();
    const vh = window.innerHeight;

    if (rect.bottom <= 0 || rect.top >= vh) return;

    const p = Math.max(0, Math.min(1, -rect.top / Math.max(1, rect.height)));

    // Image and text move at different rates for depth.
    heroImage.style.transform =
      `translate3d(0, ${p * 48}px, 0) scale(${1.09 + p * 0.035})`;

    if (heroContent) {
      heroContent.style.transform =
        `translate3d(0, calc(-50% + ${-p * 22}px), 0)`;
    }
  }

  /* ---------- Sidebar collapse ---------- */
  $$(".side-group").forEach(group => {
    const button = $(".side-toggle", group);
    const subs = $(".side-subs", group);
    if (!button || !subs) return;

    // Every group is closed on a fresh load.
    group.classList.remove("is-open");
    button.setAttribute("aria-expanded", "false");

    button.addEventListener("click", event => {
      event.preventDefault();
      event.stopPropagation();

      const open = !group.classList.contains("is-open");
      group.classList.toggle("is-open", open);
      button.setAttribute("aria-expanded", String(open));
    });
  });

  /* ---------- Manual before/after slider ---------- */
  $$(".comparison").forEach(box => {
    const after = $(".comparison__after", box);
    const divider = $(".comparison__divider", box);
    const handle = $(".comparison__handle", box);
    if (!after || !divider || !handle) return;

    let value = 50;
    let dragging = false;

    function setValueFromClientX(clientX) {
      const rect = box.getBoundingClientRect();
      value = ((clientX - rect.left) / rect.width) * 100;
      value = Math.max(0, Math.min(100, value));

      after.style.clipPath = `inset(0 0 0 ${value}%)`;
      divider.style.left = `${value}%`;
      handle.style.left = `${value}%`;
      handle.setAttribute("aria-valuenow", String(Math.round(value)));
    }

    box.addEventListener("pointerdown", event => {
      dragging = true;
      box.setPointerCapture?.(event.pointerId);
      setValueFromClientX(event.clientX);
    });

    box.addEventListener("pointermove", event => {
      if (dragging) setValueFromClientX(event.clientX);
    });

    box.addEventListener("pointerup", () => { dragging = false; });
    box.addEventListener("pointercancel", () => { dragging = false; });

    handle.tabIndex = 0;
    handle.setAttribute("role", "slider");
    handle.setAttribute("aria-label", "Drag to compare before and after");
    handle.setAttribute("aria-valuemin", "0");
    handle.setAttribute("aria-valuemax", "100");
    handle.setAttribute("aria-valuenow", "50");

    handle.addEventListener("keydown", event => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();

      value += event.key === "ArrowRight" ? 2 : -2;
      value = Math.max(0, Math.min(100, value));

      const rect = box.getBoundingClientRect();
      setValueFromClientX(rect.left + rect.width * value / 100);
    });
  });

  /* ---------- Smooth internal navigation ---------- */
  $$('a[href^="#"]').forEach(link => {
    link.addEventListener("click", event => {
      const href = link.getAttribute("href");
      if (!href || href === "#") return;

      const target = document.querySelector(href);
      if (!target) return;

      // Let comparison slider and external/hash-free controls behave normally.
      if (link.classList.contains("side-toggle")) return;

      event.preventDefault();

      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - 24,
        behavior: "smooth"
      });
    });
  });

  /* ---------- Note highlighting ---------- */
  $$("[data-note-link]").forEach(link => {
    link.addEventListener("click", () => {
      const href = link.getAttribute("href");
      if (!href) return;

      window.setTimeout(() => {
        const target = document.querySelector(href);
        if (!target) return;

        target.classList.add("note-highlight");
        window.setTimeout(() => target.classList.remove("note-highlight"), 1800);
      }, 450);
    });
  });

  /* ---------- Efficient scroll loop ---------- */
  let ticking = false;

  function onScroll() {
    if (ticking) return;

    ticking = true;
    requestAnimationFrame(() => {
      updateProgress();
      updateHero();
      updateActive();
      ticking = false;
    });
  }

  updateProgress();
  updateHero();
  updateActive();

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
});


/* V5 — robust sidebar active-section tracker.
   Uses all main/subsection anchors and never opens a collapsed group automatically. */
(function () {
  const links = Array.from(document.querySelectorAll(
    '.sidebar a[href^="#"], .side-link[href^="#"], .side-parent-link[href^="#"], .side-sub[href^="#"]'
  ));

  if (!links.length) return;

  const items = links.map(link => {
    const id = link.getAttribute("href");
    const target = id ? document.querySelector(id) : null;
    return target ? { link, target } : null;
  }).filter(Boolean);

  if (!items.length) return;

  function clearActive() {
    document.querySelectorAll(
      '.sidebar .is-active, .sidebar .has-active-child'
    ).forEach(el => {
      el.classList.remove("is-active", "has-active-child");
    });
  }

  function activate(item) {
    clearActive();

    item.link.classList.add("is-active");

    const group = item.link.closest(".side-group");
    if (group) {
      group.classList.add("has-active-child");

      const parent = group.querySelector(":scope > .side-parent-link");
      if (parent && parent !== item.link) {
        parent.classList.add("is-parent-context");
      }
    }
  }

  // Pick the section whose top is nearest to (but not far below) the reading line.
  function updateActive() {
    const line = window.scrollY + window.innerHeight * 0.28;
    let current = items[0];

    for (const item of items) {
      if (item.target.getBoundingClientRect().top + window.scrollY <= line) {
        current = item;
      } else {
        break;
      }
    }

    activate(current);
  }

  // Do not expand collapsed groups. If the active item is hidden, its parent
  // remains marked; the reader can open it manually.
  updateActive();

  let raf = 0;
  window.addEventListener("scroll", () => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      updateActive();
      raf = 0;
    });
  }, { passive: true });
})();



/* ============================================================
   FINAL SIDEBAR ACTIVE-SECTION SYSTEM
   One source of truth. Never opens collapsed groups automatically.
   ============================================================ */
(function () {
  const sidebar = document.querySelector(".sidebar");
  if (!sidebar) return;

  const allLinks = Array.from(
    sidebar.querySelectorAll(
      'a.side-link[href^="#"], a.side-parent-link[href^="#"], a.side-sub[href^="#"]'
    )
  );

  const items = allLinks.map(link => {
    const href = link.getAttribute("href");
    if (!href || href === "#") return null;

    const target = document.getElementById(href.slice(1));
    if (!target) return null;

    return {
      link,
      target,
      group: link.closest(".side-group"),
      isSub: link.classList.contains("side-sub")
    };
  }).filter(Boolean);

  if (!items.length) return;

  function clearStates() {
    sidebar.querySelectorAll(
      ".is-active, .is-parent-context, .has-active-child"
    ).forEach(el => {
      el.classList.remove(
        "is-active",
        "is-parent-context",
        "has-active-child"
      );
    });
  }

  function setActive(item) {
    clearStates();
    if (!item) return;

    if (item.isSub && item.group) {
      // The subsection is the actual reading position.
      item.link.classList.add("is-active");
      item.group.classList.add("has-active-child");

      const parent = item.group.querySelector(":scope > .side-parent .side-parent-link");
      if (parent) {
        parent.classList.add("is-parent-context");
      }
    } else {
      // A top-level section is the actual reading position.
      item.link.classList.add("is-active");
    }
  }

  function updateActive() {
    const readingLine = window.scrollY + window.innerHeight * 0.30;

    let current = items[0];

    for (const item of items) {
      const top = item.target.getBoundingClientRect().top + window.scrollY;

      if (top <= readingLine) {
        current = item;
      } else {
        break;
      }
    }

    setActive(current);
  }

  // Recalculate after fonts/images/layout settle.
  updateActive();
  window.addEventListener("load", updateActive);

  let raf = 0;
  window.addEventListener("scroll", () => {
    if (raf) return;

    raf = requestAnimationFrame(() => {
      updateActive();
      raf = 0;
    });
  }, { passive: true });

  window.addEventListener("resize", updateActive);

  // If a sidebar link is clicked, immediately mark it active.
  allLinks.forEach(link => {
    link.addEventListener("click", () => {
      const item = items.find(x => x.link === link);
      if (item) setActive(item);
    });
  });
})();





/* ============================================================
   V8 — authoritative sidebar progress rail updater
   ============================================================ */
(function () {
  const rail = document.querySelector(".sidebar-progress");
  const fill = document.querySelector(".sidebar-progress__fill");

  if (!rail || !fill) return;

  function updateSidebarRail() {
    const documentHeight = Math.max(
      1,
      document.documentElement.scrollHeight - window.innerHeight
    );

    const progress = Math.max(
      0,
      Math.min(1, window.scrollY / documentHeight)
    );

    fill.style.height = `${progress * 100}%`;
  }

  updateSidebarRail();

  let raf = 0;

  window.addEventListener("scroll", () => {
    if (raf) return;

    raf = requestAnimationFrame(() => {
      updateSidebarRail();
      raf = 0;
    });
  }, { passive: true });

  window.addEventListener("resize", updateSidebarRail);
  window.addEventListener("load", updateSidebarRail);
})();

