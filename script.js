const sidebar = document.getElementById("sidebar");
const hero = document.getElementById("home");
const progress = document.getElementById("progress");
const links = document.querySelectorAll(".sidebar a");
const sections = document.querySelectorAll("[data-section]");
const reveal = document.querySelectorAll(".reveal, .reveal-image");

const deep = document.getElementById("deep");
const deepPh = document.querySelector(".deep-ph");

const steps = document.querySelectorAll(".steps article");
const stickyPh = document.getElementById("sticky-ph");

const bgStory = document.querySelector(".bg-story");
const bgPh = document.getElementById("bg-ph");
const bgSteps = document.querySelectorAll(".bg-steps article");

const numberItems = document.querySelectorAll(".numbers div");


/* =========================================================
   HERO → SIDEBAR
   Sidebar stays hidden while the hero is visible.
   ========================================================= */

new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      sidebar.classList.toggle("visible", !entry.isIntersecting);
    });
  },
  {
    threshold: 0.05
  }
).observe(hero);


/* =========================================================
   THIN READING PROGRESS LINE
   ========================================================= */

function progressBar() {
  const pageHeight =
    document.documentElement.scrollHeight - window.innerHeight;

  const percentage = pageHeight
    ? (window.scrollY / pageHeight) * 100
    : 0;

  progress.style.height =
    Math.min(100, Math.max(0, percentage)) + "%";
}

window.addEventListener("scroll", progressBar, {
  passive: true
});

window.addEventListener("resize", progressBar);

progressBar();


/* =========================================================
   ACTIVE SIDEBAR SECTION
   ========================================================= */

const sectionObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      links.forEach(link => {
        link.classList.toggle(
          "active",
          link.dataset.nav === entry.target.dataset.section
        );
      });
    });
  },
  {
    rootMargin: "-35% 0px -55% 0px"
  }
);

sections.forEach(section => {
  sectionObserver.observe(section);
});


/* =========================================================
   GENERAL SCROLL REVEALS
   ========================================================= */

const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  {
    threshold: 0.2
  }
);

reveal.forEach(element => {
  revealObserver.observe(element);
});


/* =========================================================
   TYPE 04 — DEEP ZOOM
   Scroll position controls the image scale.
   ========================================================= */

function deepZoom() {
  if (!deep || !deepPh) return;

  const rect = deep.getBoundingClientRect();

  let progressValue =
    (window.innerHeight - rect.top) /
    (window.innerHeight + rect.height);

  progressValue = Math.max(
    0,
    Math.min(1, progressValue)
  );

  const scale =
    1 + progressValue * 1.8;

  const x =
    (progressValue - 0.5) * 4;

  const y =
    -progressValue * 4;

  deepPh.style.transform =
    `scale(${scale}) translate(${x}%, ${y}%)`;
}

window.addEventListener("scroll", deepZoom, {
  passive: true
});

window.addEventListener("resize", deepZoom);

deepZoom();


/* =========================================================
   TYPE 07 — STICKY / PINNED VISUAL
   Different text steps control the visual state.
   ========================================================= */

const stepObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      steps.forEach(step => {
        step.classList.remove("is-active");
      });

      entry.target.classList.add("is-active");

      const stepNumber =
        Number(entry.target.dataset.step);

      /*
       * Prototype:
       * each step slightly changes the scale.
       *
       * Later, these states can switch actual images,
       * maps, photographs, or other visual material.
       */

      if (stickyPh) {
        stickyPh.style.transform =
          `scale(${1 + stepNumber * 0.08})`;
      }
    });
  },
  {
    rootMargin: "-35% 0px -35% 0px"
  }
);

steps.forEach(step => {
  stepObserver.observe(step);
});


/* =========================================================
   TYPE 08 — SCROLLING BACKGROUND TRANSITION
   ========================================================= */

function backgroundScroll() {
  if (!bgStory || !bgPh) return;

  const rect =
    bgStory.getBoundingClientRect();

  const availableHeight =
    bgStory.offsetHeight -
    window.innerHeight;

  let scrollProgress =
    -rect.top /
    Math.max(1, availableHeight);

  scrollProgress = Math.max(
    0,
    Math.min(1, scrollProgress)
  );

  const imageCount =
    bgSteps.length;

  const activeIndex =
    Math.min(
      imageCount - 1,
      Math.floor(
        scrollProgress * imageCount
      )
    );

  bgSteps.forEach((step, index) => {
    step.classList.toggle(
      "active",
      index === activeIndex
    );
  });


  /*
   * Prototype background states.
   *
   * When we add the actual photographs,
   * these will become real image cross-fades.
   */

  const backgrounds = [
    "linear-gradient(120deg, #777, #444 55%, #222)",
    "linear-gradient(120deg, #999, #555 55%, #252525)",
    "linear-gradient(120deg, #666, #333 55%, #111)"
  ];

  bgPh.style.background =
    backgrounds[activeIndex] ||
    backgrounds[0];

  bgPh.style.transform =
    `scale(${1.02 + scrollProgress * 0.05})`;
}

window.addEventListener(
  "scroll",
  backgroundScroll,
  {
    passive: true
  }
);

window.addEventListener(
  "resize",
  backgroundScroll
);

backgroundScroll();


/* =========================================================
   NUMBER / DATA SEQUENCE
   ========================================================= */

const numberObserver =
  new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
        }
      });
    },
    {
      threshold: 0.45
    }
  );

numberItems.forEach(item => {
  numberObserver.observe(item);
});


/* =========================================================
   SIDEBAR SMOOTH SCROLL
   ========================================================= */

links.forEach(link => {

  link.addEventListener("click", event => {

    const target =
      document.querySelector(
        link.getAttribute("href")
      );

    if (!target) return;

    event.preventDefault();

    target.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

  });

});


/* =========================================================
   FOOTNOTE / ENDNOTE LINKS
   ========================================================= */

document
  .querySelectorAll(".ref, .notes-grid a")
  .forEach(link => {

    link.addEventListener(
      "click",
      event => {

        const target =
          document.querySelector(
            link.getAttribute("href")
          );

        if (!target) return;

        event.preventDefault();

        target.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });

      }
    );

  });
