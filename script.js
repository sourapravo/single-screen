const image = document.getElementById("story-image");

const steps = document.querySelectorAll(".step");

const images = [
  "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80",

  "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=80",

  "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=1200&q=80"
];


const observer = new IntersectionObserver(
  (entries) => {

    entries.forEach(entry => {

      if (entry.isIntersecting) {

        const index = [...steps].indexOf(entry.target);

        image.style.opacity = "0";
        image.style.transform = "scale(1.03)";

        setTimeout(() => {

          image.src = images[index];

          image.style.opacity = "1";
          image.style.transform = "scale(1)";

        }, 350);

      }

    });

  },
  {
    threshold: 0.55
  }
);


steps.forEach(step => observer.observe(step));
