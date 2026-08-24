/* project.single_screen — interaction layer */

document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const progress = document.querySelector(".reading-progress");
  const hero = document.querySelector(".hero");
  const heroImage = document.querySelector(".hero__image");
  const heroText = document.querySelector(".hero__content");
  const sidebar = document.querySelector(".sidebar");

  // Reading progress — deliberately a very thin line, no percentage.
  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progressValue = docHeight > 0 ? scrollTop / docHeight : 0;

    if (progress) {
      progress.style.transform = `scaleX(${progressValue})`;
    }
  }

  // Hero parallax.
  function updateHero() {
    if (!hero || !heroImage) return;

    const rect = hero.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    if (rect.bottom > 0 && rect.top < viewportHeight) {
      const progress = Math.min(
        1,
        Math.max(0, -rect.top / Math.max(1, rect.height))
      );

      const y = progress * 12;
      const scale = 1.02 + progress * 0.025;

      heroImage.style.transform = `translate3d(0, ${y}px, 0) scale(${scale})`;

      if (heroText) {
        const textY = progress * -18;
        const opacity = Math.max(0, 1 - progress * 1.15);

        heroText.style.transform = `translate3d(0, ${textY}px, 0)`;
        heroText.style.opacity = opacity;
      }
    }
  }

  // Reveal sidebar after leaving the hero.
  function updateSidebar() {
    if (!sidebar || !hero) return;

    const threshold = hero.offsetHeight * 0.72;

    if (window.scrollY > threshold) {
      sidebar.classList.add("is-visible");
    } else {
      sidebar.classList.remove("is-visible");
    }
  }

  // Square Prologue image dissolve.
  const dissolve = document.querySelector("[data-dissolve]");
  const dissolveImageA = dissolve?.querySelector("[data-image-a]");
  const dissolveImageB = dissolve?.querySelector("[data-image-b]");

  function updateDissolve() {
    if (!dissolve || !dissolveImageA || !dissolveImageB) return;

    const rect = dissolve.getBoundingClientRect();
    const viewport = window.innerHeight;

    const start = viewport * 0.72;
    const end = viewport * 0.18;

    let amount = (start - rect.top) / (start - end);
    amount = Math.max(0, Math.min(1, amount));

    dissolveImageA.style.opacity = `${1 - amount}`;
    dissolveImageB.style.opacity = `${amount}`;

    const scaleA = 1 + amount * 0.025;
    const scaleB = 1.025 - amount * 0.025;

    dissolveImageA.style.transform = `scale(${scaleA})`;
    dissolveImageB.style.transform = `scale(${scaleB})`;

    const blurA = amount * 1.5;
    const blurB = (1 - amount) * 1.5;

    dissolveImageA.style.filter = `blur(${blurA}px)`;
    dissolveImageB.style.filter = `blur(${blurB}px)`;
  }

  // Collapsible sidebar sections.
  document.querySelectorAll(".sidebar__toggle").forEach((button) => {
    button.addEventListener("click", () => {
      const parent = button.closest(".sidebar__group");
      if (!parent) return;

      const expanded = parent.classList.toggle("is-expanded");
      button.setAttribute("aria-expanded", expanded ? "true" : "false");
    });
  });

  // Smooth scrolling for internal navigation.
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const id = link.getAttribute("href");

      if (!id || id === "#") return;

      const target = document.querySelector(id);
      if (!target) return;

      event.preventDefault();

      const offset = 24;
      const top =
        target.getBoundingClientRect().top +
        window.scrollY -
        offset;

      window.scrollTo({
        top,
        behavior: "smooth"
      });
    });
  });

  // Citation / note return links.
  document.querySelectorAll("[data-note-link]").forEach((link) => {
    link.addEventListener("click", () => {
      const targetId = link.getAttribute("href");
      if (!targetId) return;

      setTimeout(() => {
        const target = document.querySelector(targetId);

        if (target) {
          target.classList.add("note-highlight");

          window.setTimeout(() => {
            target.classList.remove("note-highlight");
          }, 1800);
        }
      }, 450);
    });
  });

  // Initial state.
  updateProgress();
  updateHero();
  updateSidebar();
  updateDissolve();

  // One requestAnimationFrame loop keeps scroll effects smooth.
  let ticking = false;

  function requestUpdate() {
    if (ticking) return;

    ticking = true;

    window.requestAnimationFrame(() => {
      updateProgress();
      updateHero();
      updateSidebar();
      updateDissolve();

      ticking = false;
    });
  }

  window.addEventListener("scroll", requestUpdate, {
    passive: true
  });

  window.addEventListener("resize", requestUpdate);

  // Hero entrance.
  if (hero) {
    window.setTimeout(() => {
      hero.classList.add("is-loaded");
    }, 80);
  }
});
