const sidebar = document.querySelector(".sidebar");
const hero = document.querySelector(".hero");
const heroImage = document.getElementById("hero-image");

const progressFill = document.getElementById("progress-fill");

const sections = document.querySelectorAll("[data-nav-section]");
const navLinks = document.querySelectorAll(".side-nav a");

const imageBlocks = document.querySelectorAll(".image-reveal");
const immersiveBlocks = document.querySelectorAll(".immersive");


/* =========================================================
   SIDEBAR APPEARS AFTER HERO
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
   THIN READING PROGRESS LINE
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
      ? Math.min(
          100,
          Math.max(
            0,
            (scrollTop / documentHeight) * 100
          )
        )
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

sections.forEach(section => {
  sectionObserver.observe(section);
});


/* =========================================================
   IMAGE BLOCK REVEAL
   ========================================================= */

const visualObserver = new IntersectionObserver(
  (entries) => {

    entries.forEach(entry => {

      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }

    });

  },
  {
    threshold: 0.25
  }
);


/* Normal separate image blocks */

imageBlocks.forEach(block => {
  visualObserver.observe(block);
});


/* Full-width immersive image blocks */

immersiveBlocks.forEach(block => {

  const bg = block.dataset.bg;

  if (bg) {

    block.style.setProperty(
      "--bg-image",
      `url("${bg}")`
    );

  }

  visualObserver.observe(block);

});


/* =========================================================
   HERO PARALLAX / SLOW ZOOM
   ========================================================= */

function heroParallax() {

  if (!heroImage) return;

  const scrollY = window.scrollY;

  if (scrollY <= window.innerHeight) {

    const progress =
      Math.min(
        1,
        Math.max(
          0,
          scrollY / window.innerHeight
        )
      );

    const scale =
      1.02 + (progress * 0.07);

    const translateY =
      progress * 18;

    heroImage.style.transform =
      `scale(${scale}) translateY(${translateY}px)`;

    heroImage.style.opacity =
      String(1 - (progress * 0.12));

  }

}

window.addEventListener("scroll", heroParallax, {
  passive: true
});

heroParallax();


/* =========================================================
   SUBTLE TEXT REVEAL
   ========================================================= */

/*
   Text does not disappear.
   It begins slightly softer and moves gently into place
   when the reader reaches it.
*/

const textBlocks =
  document.querySelectorAll(".text-block");

textBlocks.forEach(block => {

  block.style.opacity = "0.55";

  block.style.transform =
    "translateY(18px)";

  block.style.transition =
    "opacity .8s ease, transform .9s ease";

});


const textObserver = new IntersectionObserver(
  (entries) => {

    entries.forEach(entry => {

      if (!entry.isIntersecting) return;

      entry.target.style.opacity = "1";

      entry.target.style.transform =
        "translateY(0)";

    });

  },
  {
    threshold: 0.3
  }
);


textBlocks.forEach(block => {
  textObserver.observe(block);
});
