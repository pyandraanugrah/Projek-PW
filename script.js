/* =========================
FILE: script.js
========================= */

const slider = document.getElementById("slider");
const slides = document.querySelectorAll(".slide");

let current = 0;

function showSlide(index) {
  if (!slides.length) return;

  slides.forEach((slide) => {
    slide.classList.remove("active");
  });

  slides[index].classList.add("active");
}

function nextSlide() {
  if (!slides.length) return;

  current++;

  if (current >= slides.length) {
    current = 0;
  }

  showSlide(current);
}

function prevSlide() {
  if (!slides.length) return;

  current--;

  if (current < 0) {
    current = slides.length - 1;
  }

  showSlide(current);
}

showSlide(current);

/* =========================
MOBILE NAV
========================= */

const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("navMenu");
const navLinks = Array.from(document.querySelectorAll(".nav-link"));
const pageSections = navLinks
  .map((link) => {
    const href = link.getAttribute("href") || "";
    if (!href.startsWith("#")) return null;
    const id = href.slice(1);
    const section = document.getElementById(id);
    return section ? { link, section } : null;
  })
  .filter(Boolean);

function setActiveLink(activeId) {
  navLinks.forEach((link) => {
    const href = link.getAttribute("href") || "";
    const isActive = href === `#${activeId}`;
    link.classList.toggle("active", isActive);
  });
}

if (hamburger && navMenu) {
  hamburger.addEventListener("click", () => {
    navMenu.classList.toggle("active");
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active");
      const href = link.getAttribute("href") || "";
      if (href.startsWith("#")) {
        setActiveLink(href.slice(1));
      }
    });
  });
}

if (pageSections.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      const visibleEntry = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visibleEntry) {
        setActiveLink(visibleEntry.target.id);
      }
    },
    {
      root: null,
      threshold: 0.5,
    }
  );

  pageSections.forEach(({ section }) => observer.observe(section));
}

/* =========================
SWIPE SLIDER MOBILE
========================= */

if (slider) {
  let startX = 0;
  let endX = 0;

  slider.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
  });

  slider.addEventListener("touchend", (e) => {
    endX = e.changedTouches[0].clientX;

    if (startX - endX > 50) {
      nextSlide();
    }

    if (endX - startX > 50) {
      prevSlide();
    }
  });
}
