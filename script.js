const image = document.getElementById("story-image");
const imageIndex = document.getElementById("image-index");
const progressFill = document.getElementById("progress-fill");
const progressPercent = document.getElementById("progress-percent");

const steps = document.querySelectorAll(".step");
const navLinks = document.querySelectorAll(".side-nav a");
const sections = document.querySelectorAll("[data-nav-section]");
const archiveImage = document.querySelector(".archive-image");

const images = [
  "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1600&q=85",
  "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1600&q=85",
  "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=1600&q=85"
];

let currentImage = 0;
let imageTimer = null;


/* =========================================================
   SCROLL-DRIVEN IMAGE CHANGES
   ========================================================= */

const stepObserver = new IntersectionObserver(
  (entries) => {

    entries.forEach(entry => {

      if (!entry.isIntersecting) return;

      const index = [...steps].indexOf(entry.target);

      entry.target.classList.add("is-active");

      if (index === currentImage) return;

      currentImage = index;

      image.style.opacity = "0";
      image.style.transform = "scale(1.14)";

      clearTimeout(imageTimer);

      imageTimer = setTimeout(() => {

        image.src = images[index];

        image.onload = () => {
          image.style.opacity = "1";
          image.style.transform = "scale(1)";
        };

        imageIndex.textContent =
          String(index + 1).padStart(2, "0") +
          " / " +
          String(images.length).padStart(2, "0");

      }, 350);

    });

  },
  {
    threshold: 0.55
  }
);

steps.forEach(step => stepObserver.observe(step));


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
   READING PROGRESS
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
  progressPercent.textContent = Math.round(progress) + "%";
}

window.addEventListener("scroll", updateProgress, {
  passive: true
});

window.addEventListener("resize", updateProgress);

updateProgress();


/* =========================================================
   ARCHIVE IMAGE REVEAL
   ========================================================= */

if (archiveImage) {

  const archiveObserver = new IntersectionObserver(
    (entries) => {

      entries.forEach(entry => {

        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }

      });

    },
    {
      threshold: 0.35
    }
  );

  archiveObserver.observe(archiveImage);
}
