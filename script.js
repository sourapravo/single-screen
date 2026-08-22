/* =========================================================
   ELEMENTS
   ========================================================= */

const sidebar = document.getElementById("sidebar");
const hero = document.getElementById("home");
const heroImage = document.getElementById("hero-img");

const progressLine =
  document.getElementById("progress-line-fill");

const navigationLinks =
  document.querySelectorAll(".sidebar nav a");

const sections =
  document.querySelectorAll(
    "[data-section-name]"
  );

const imageBlocks =
  document.querySelectorAll(
    ".image-block"
  );

const immersiveSections =
  document.querySelectorAll(
    ".immersive-section"
  );


/* =========================================================
   1. SIDEBAR APPEARS AFTER HERO
   ========================================================= */

/*
   While the visitor is inside the hero:
       sidebar = hidden

   Once they begin reading the page:
       sidebar = visible
*/

const heroObserver =
  new IntersectionObserver(

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
   2. READING PROGRESS
   ========================================================= */

/*
   This controls ONLY the thin vertical line.

   There is deliberately:
       no 0%
       no 50%
       no 100%

   Just a discreet moving line.
*/

function updateReadingProgress() {

  const scrollTop =
    window.scrollY ||
    document.documentElement.scrollTop;


  const pageHeight =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;


  let progress = 0;


  if (pageHeight > 0) {

    progress =
      (scrollTop / pageHeight) * 100;

  }


  progress =
    Math.min(
      100,
      Math.max(0, progress)
    );


  progressLine.style.height =
    progress + "%";

}


window.addEventListener(
  "scroll",
  updateReadingProgress,
  {
    passive: true
  }
);


window.addEventListener(
  "resize",
  updateReadingProgress
);


updateReadingProgress();


/* =========================================================
   3. ACTIVE SIDEBAR ITEM
   ========================================================= */

/*
   As the reader moves through the page,
   the corresponding sidebar item becomes active.
*/

const sectionObserver =
  new IntersectionObserver(

    (entries) => {

      entries.forEach(entry => {

        if (!entry.isIntersecting) {
          return;
        }


        const currentSection =
          entry.target.dataset.sectionName;


        navigationLinks.forEach(link => {

          const linkSection =
            link.dataset.section;


          link.classList.toggle(

            "active",

            linkSection === currentSection

          );

        });

      });

    },

    {
      rootMargin:
        "-35% 0px -55% 0px",

      threshold: 0
    }

  );


sections.forEach(section => {

  sectionObserver.observe(section);

});


/* =========================================================
   4. NORMAL IMAGE BLOCK ANIMATION
   ========================================================= */

/*
   Every normal image starts:

       slightly zoomed
       slightly transparent

   When it enters the viewport:

       becomes clear
       slowly returns to normal scale
*/

const imageObserver =
  new IntersectionObserver(

    (entries) => {

      entries.forEach(entry => {

        if (!entry.isIntersecting) {
          return;
        }


        entry.target.classList.add(
          "is-visible"
        );

      });

    },

    {
      threshold: 0.25
    }

  );


imageBlocks.forEach(block => {

  imageObserver.observe(block);

});


/* =========================================================
   5. IMMERSIVE IMAGE BACKGROUNDS
   ========================================================= */

/*
   The image URL is stored in the HTML as:

   data-background="IMAGE URL"

   JavaScript takes that URL and makes it
   the background image of the immersive section.
*/

immersiveSections.forEach(section => {

  const background =
    section.dataset.background;


  if (background) {

    section.style.setProperty(

      "--immersive-image",

      `url("${background}")`

    );

  }


  imageObserver.observe(section);

});


/* =========================================================
   6. HERO IMAGE PARALLAX
   ========================================================= */

/*
   While leaving the hero:

       image slowly zooms
       image moves slightly
       image becomes slightly softer

   This is intentionally subtle.
*/

function heroParallax() {

  if (!heroImage) {
    return;
  }


  const scrollY =
    window.scrollY;


  const heroHeight =
    window.innerHeight;


  if (scrollY <= heroHeight) {


    let progress =
      scrollY / heroHeight;


    progress =
      Math.min(
        1,
        Math.max(0, progress)
      );


    const scale =
      1.02 +
      (progress * 0.07);


    const movement =
      progress * 18;


    heroImage.style.transform =
      `scale(${scale})
       translateY(${movement}px)`;


    heroImage.style.opacity =
      1 -
      (progress * 0.12);

  }

}


window.addEventListener(
  "scroll",
  heroParallax,
  {
    passive: true
  }
);


heroParallax();


/* =========================================================
   7. TEXT BLOCK REVEAL
   ========================================================= */

/*
   Text doesn't disappear.

   It starts slightly softer and moves gently
   upward into its normal position when the reader
   reaches it.
*/

const textBlocks =
  document.querySelectorAll(
    ".text-column"
  );


textBlocks.forEach(block => {

  block.style.opacity =
    "0.55";


  block.style.transform =
    "translateY(18px)";


  block.style.transition =
    "opacity .8s ease, " +
    "transform .9s ease";

});


const textObserver =
  new IntersectionObserver(

    (entries) => {

      entries.forEach(entry => {

        if (!entry.isIntersecting) {
          return;
        }


        entry.target.style.opacity =
          "1";


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


/* =========================================================
   8. FOOTNOTE RETURN
   ========================================================= */

/*
   The HTML already connects:

       ¹ → Note 1

   and:

       ↩ → original text

   We add smooth scrolling and briefly highlight
   the destination so the reader knows where they
   returned.
*/

const citations =
  document.querySelectorAll(
    ".citation"
  );


const returnLinks =
  document.querySelectorAll(
    ".return-link"
  );


function smoothFootnoteNavigation(
  links
) {

  links.forEach(link => {

    link.addEventListener(
      "click",
      function(event) {

        const targetID =
          this.getAttribute("href");


        if (!targetID) {
          return;
        }


        const target =
          document.querySelector(
            targetID
          );


        if (!target) {
          return;
        }


        event.preventDefault();


        target.scrollIntoView({

          behavior: "smooth",

          block: "center"

        });


        /*
           Brief visual indication of
           where the reader has arrived.
        */

        target.style.transition =
          "background-color .3s ease";


        target.style.backgroundColor =
          "#eef5ff";


        setTimeout(() => {

          target.style.backgroundColor =
            "transparent";

        }, 900);

      }
    );

  });

}


smoothFootnoteNavigation(
  citations
);


smoothFootnoteNavigation(
  returnLinks
);


/* =========================================================
   9. SIDEBAR LINK SMOOTH SCROLL
   ========================================================= */

navigationLinks.forEach(link => {

  link.addEventListener(
    "click",
    function(event) {

      const targetID =
        this.getAttribute("href");


      const target =
        document.querySelector(
          targetID
        );


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
