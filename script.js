const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [
  ...root.querySelectorAll(selector)
];


/* =========================================================
   MAIN ELEMENTS
   ========================================================= */

const sidebar = $("#sidebar");
const hero = $("#home");
const progress = $("#progress");

const sections = $$("[data-section]");
const navLinks = $$(".sidebar nav a");
const revealElements = $$(".reveal");

const deepZoom = $("#deepZoom");
const deepImage = $(".deep-image");

const stickySteps = $$(".sticky-step");
const stickyVisual = $("#stickyVisual");

const backgroundStory = $(".background-story");
const backgroundImage = $("#backgroundImage");
const backgroundSteps = $$(".background-steps article");

const numberItems = $$(".number-item");


/* =========================================================
   1. HERO → SIDEBAR
   Sidebar remains hidden while the hero is visible.
   ========================================================= */

if (hero && sidebar) {

  const heroObserver = new IntersectionObserver(
    (entries) => {

      entries.forEach((entry) => {

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

}


/* =========================================================
   2. THIN READING PROGRESS LINE
   ========================================================= */

function updateProgress() {

  const totalHeight =
    document.documentElement.scrollHeight -
    window.innerHeight;

  let percentage = 0;

  if (totalHeight > 0) {
    percentage =
      (window.scrollY / totalHeight) * 100;
  }

  percentage = Math.max(
    0,
    Math.min(100, percentage)
  );

  if (progress) {
    progress.style.height =
      percentage + "%";
  }

}

window.addEventListener(
  "scroll",
  updateProgress,
  { passive: true }
);

window.addEventListener(
  "resize",
  updateProgress
);

updateProgress();


/* =========================================================
   3. ACTIVE SIDEBAR SECTION
   ========================================================= */

if (sections.length > 0) {

  const sectionObserver =
    new IntersectionObserver(
      (entries) => {

        entries.forEach((entry) => {

          if (!entry.isIntersecting) {
            return;
          }

          const currentSection =
            entry.target.dataset.section;

          navLinks.forEach((link) => {

            link.classList.toggle(
              "active",
              link.dataset.target === currentSection
            );

          });

        });

      },
      {
        rootMargin: "-35% 0px -55% 0px",
        threshold: 0
      }
    );


  sections.forEach((section) => {
    sectionObserver.observe(section);
  });

}


/* =========================================================
   4. GENERAL SCROLL REVEAL
   ========================================================= */

if (revealElements.length > 0) {

  const revealObserver =
    new IntersectionObserver(
      (entries) => {

        entries.forEach((entry) => {

          if (entry.isIntersecting) {

            entry.target.classList.add(
              "is-visible"
            );

          }

        });

      },
      {
        threshold: 0.18
      }
    );


  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });

}


/* =========================================================
   5. TYPE 04 — DEEP ZOOM
   ========================================================= */

function updateDeepZoom() {

  if (!deepZoom || !deepImage) {
    return;
  }

  const rectangle =
    deepZoom.getBoundingClientRect();


  /*
   * Calculate how far the image section
   * has travelled through the viewport.
   */

  let scrollProgress =
    (
      window.innerHeight -
      rectangle.top
    ) /
    (
      window.innerHeight +
      rectangle.height
    );


  scrollProgress = Math.max(
    0,
    Math.min(1, scrollProgress)
  );


  /*
   * Zoom from 1x → 2.8x
   */

  const scale =
    1 +
    scrollProgress * 1.8;


  /*
   * Small movement while zooming.
   */

  const x =
    (scrollProgress - 0.5) * 4;

  const y =
    -scrollProgress * 4;


  deepImage.style.transform =
    `scale(${scale}) translate(${x}%, ${y}%)`;

}

window.addEventListener(
  "scroll",
  updateDeepZoom,
  { passive: true }
);

window.addEventListener(
  "resize",
  updateDeepZoom
);

updateDeepZoom();


/* =========================================================
   6. TYPE 07 — STICKY / PINNED VISUAL
   ========================================================= */

if (stickySteps.length > 0) {

  const stickyObserver =
    new IntersectionObserver(
      (entries) => {

        entries.forEach((entry) => {

          if (!entry.isIntersecting) {
            return;
          }


          /*
           * Remove active state
           * from every step.
           */

          stickySteps.forEach((step) => {

            step.classList.remove(
              "active"
            );

          });


          /*
           * Activate current step.
           */

          entry.target.classList.add(
            "active"
          );


          /*
           * Slightly change the
           * pinned visual scale.
           */

          const stepNumber =
            Number(
              entry.target.dataset.step || 0
            );


          if (stickyVisual) {

            const scale =
              1 +
              stepNumber * 0.08;

            stickyVisual.style.transform =
              `scale(${scale})`;

          }

        });

      },
      {
        rootMargin: "-35% 0px -35% 0px",
        threshold: 0
      }
    );


  stickySteps.forEach((step) => {

    stickyObserver.observe(step);

  });

}


/* =========================================================
   7. TYPE 08 — BACKGROUND TRANSITION
   ========================================================= */

function updateBackground() {

  if (
    !backgroundStory ||
    !backgroundImage
  ) {
    return;
  }


  const rectangle =
    backgroundStory.getBoundingClientRect();


  const availableHeight =
    backgroundStory.offsetHeight -
    window.innerHeight;


  let scrollProgress =
    -rectangle.top /
    Math.max(1, availableHeight);


  scrollProgress = Math.max(
    0,
    Math.min(1, scrollProgress)
  );


  /*
   * Work out which background state
   * should currently be visible.
   */

  const numberOfSteps =
    backgroundSteps.length;


  const activeIndex =
    Math.min(
      numberOfSteps - 1,
      Math.floor(
        scrollProgress *
        numberOfSteps
      )
    );


  backgroundSteps.forEach(
    (step, index) => {

      step.classList.toggle(
        "active",
        index === activeIndex
      );

    }
  );


  /*
   * Temporary prototype backgrounds.
   *
   * Later these become actual photographs:
   *
   * 010.jpg
   * 011.jpg
   * 012.jpg
   */

  const backgrounds = [

    "linear-gradient(120deg,#777,#444 55%,#222)",

    "linear-gradient(120deg,#999,#555 55%,#252525)",

    "linear-gradient(120deg,#666,#333 55%,#111)"

  ];


  backgroundImage.style.background =
    backgrounds[activeIndex] ||
    backgrounds[0];


  /*
   * Very subtle background zoom.
   */

  backgroundImage.style.transform =
    `scale(${1.02 + scrollProgress * 0.05})`;

}


window.addEventListener(
  "scroll",
  updateBackground,
  { passive: true }
);

window.addEventListener(
  "resize",
  updateBackground
);

updateBackground();


/* =========================================================
   8. NUMBER / DATA SEQUENCE
   ========================================================= */

if (numberItems.length > 0) {

  const numberObserver =
    new IntersectionObserver(
      (entries) => {

        entries.forEach((entry) => {

          if (entry.isIntersecting) {

            entry.target.classList.add(
              "active"
            );

          }

        });

      },
      {
        threshold: 0.45
      }
    );


  numberItems.forEach((item) => {

    numberObserver.observe(item);

  });

}


/* =========================================================
   9. SIDEBAR SMOOTH SCROLL
   ========================================================= */

navLinks.forEach((link) => {

  link.addEventListener(
    "click",
    (event) => {

      const href =
        link.getAttribute("href");

      const target =
        $(href);


      if (!target) {
        return;
      }


      event.preventDefault();


      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    }
  );

});


/* =========================================================
   10. FOOTNOTE / ENDNOTE LINKS
   ========================================================= */

const footnoteLinks =
  $$(".footnote, .note a");


footnoteLinks.forEach((link) => {

  link.addEventListener(
    "click",
    (event) => {

      const href =
        link.getAttribute("href");

      const target =
        $(href);


      if (!target) {
        return;
      }


      event.preventDefault();


      target.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });

    }
  );

});


/* =========================================================
   11. OPTIONAL HERO PARALLAX
   Very subtle movement only.
   ========================================================= */

const heroMedia =
  $(".hero-placeholder");


function heroParallax() {

  if (!heroMedia) {
    return;
  }


  const scroll =
    window.scrollY;


  if (
    scroll < window.innerHeight
  ) {

    const progress =
      scroll /
      window.innerHeight;


    heroMedia.style.transform =
      `scale(${1.02 + progress * 0.06})
       translateY(${progress * 12}px)`;

  }

}


window.addEventListener(
  "scroll",
  heroParallax,
  { passive: true }
);

heroParallax();
