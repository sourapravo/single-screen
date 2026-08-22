const sidebar = document.querySelector(".sidebar");
const hero = document.querySelector(".hero");

const image = document.getElementById("hero-image");
const progressFill = document.getElementById("progress-fill");

const steps = document.querySelectorAll(".step");
const navLinks = document.querySelectorAll(".side-nav a");
const sections = document.querySelectorAll("[data-nav-section]");
const wideImages = document.querySelectorAll(".reveal-image");
const immersiveImages = document.querySelectorAll(".immersive-image");


/* =========================================================
   SHOW SIDEBAR ONLY AFTER HERO
   ========================================================= */

const heroObserver = new IntersectionObserver(
  (entries) => {

    entries.forEach(entry => {

      if (entry.isIntersecting) {
        sidebar.classList.remove("visible");
      } else {
        sidebar.classList.add("visible");
      }

    });

  },
  {
    threshold: 0.05
  }
);

heroObserver.observe(hero);


/* =========================================================
   SLEEK READING PROGRESS LINE
   No percentage / number display.
   ========================================================= */

function updateProgress() {

  const scrollTop =
    window.scrollY ||
    document.documentElement.scrollTop;

  const documentHeight =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;

  const progress =
    documentHeight > 0
      ? Math.min(100, Math.max(0, (scrollTop / documentHeight) * 100))
      : 0;

  progressFill.style.height = progress + "%";
}

window.addEventListener("scroll", updateProgress, {
  passive: true
});

window.addEventListener("resize", updateProgress);

updateProgress();


/* =========================================================
   ACTIVE SIDEBAR SECTION
   ========================================================= */

const sectionObserver = new IntersectionObserver(
  (entries) => {

    entries.forEach(entry => {

      if (!entry.isIntersecting) return;

      const id = entry.target.dataset.navSection;

      navLinks.forEach(link => {
        link.classList.toggle(
          "active",
          link.dataset.section === id
        );
      });

    });

  },
  {
    rootMargin: "-35% 0px -55% 0px",
    threshold: 0
  }
);

sections.forEach(section => sectionObserver.observe(section));


/* =========================================================
   SEPARATE IMAGE BLOCK REVEALS
   ========================================================= */

const imageObserver = new IntersectionObserver(
  (entries) => {

    entries.forEach(entry => {

      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }

    });

  },
  {
    threshold: 0.28
  }
);

wideImages.forEach(imageBlock => {
  imageObserver.observe(imageBlock);
});


/* =========================================================
   FULL-WIDTH BACKGROUND IMAGE SECTIONS
   Each immersive block gets its image from data-bg-image.
   ========================================================= */

immersiveImages.forEach(section => {

  const imageURL = section.dataset.bgImage;

  if (imageURL) {
    section.style.setProperty("--bg-image", `url("${imageURL}")`);
  }

  imageObserver.observe(section);
});


/* =========================================================
   HERO: SUBTLE PARALLAX / ZOOM AS YOU LEAVE THE HERO
   ========================================================= */

function heroParallax() {

  const scrollY = window.scrollY;

  if (scrollY < window.innerHeight) {

    const progress =
      Math.min(1, scrollY / window.innerHeight);

    const scale =
      1.03 + (progress * 0.08);

    const translateY =
      progress * 25;

    image.style.transform =
      `scale(${scale}) translateY(${translateY}px)`;

    image.style.opacity =
      String(1 - (progress * 0.18));
  }
}

window.addEventListener("scroll", heroParallax, {
  passive: true
});

heroParallax();


/* =========================================================
   SMOOTH TEXT REVEAL
   ========================================================= */

steps.forEach(step => {

  step.style.transition =
    "opacity 0.7s ease, transform 0.8s ease";

  step.style.opacity = "0.45";
  step.style.transform = "translateY(22px)";

});


const stepObserver = new IntersectionObserver(
  (entries) => {

    entries.forEach(entry => {

      if (!entry.isIntersecting) return;

      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";

    });

  },
  {
    threshold: 0.45
  }
);

steps.forEach(step => stepObserver.observe(step));
