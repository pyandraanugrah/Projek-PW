/* =========================
FILE: script.js
========================= */

const slider = document.getElementById("slider");
const slides = document.querySelectorAll(".slide");

let currentSlide = 0;

/* =========================
UPDATE SLIDER
========================= */

function updateSlider(){

  slider.style.transform =
    `translateX(-${currentSlide * 100}%)`;

}

/* =========================
NEXT
========================= */

function nextSlide(){

  currentSlide++;

  if(currentSlide >= slides.length){
    currentSlide = 0;
  }

  updateSlider();

}

/* =========================
PREV
========================= */

function prevSlide(){

  currentSlide--;

  if(currentSlide < 0){
    currentSlide = slides.length - 1;
  }

  updateSlider();

}

/* =========================
AUTO SLIDE
========================= */

setInterval(() => {
  nextSlide();
}, 5000);

/* =========================
ACTIVE NAV
========================= */

const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-link");

window.addEventListener("scroll", () => {

  let current = "";

  sections.forEach(section => {

    const sectionTop = section.offsetTop - 200;

    if(scrollY >= sectionTop){
      current = section.getAttribute("id");
    }

  });

  navLinks.forEach(link => {

    link.classList.remove("active");

    if(link.getAttribute("href") === `#${current}`){
      link.classList.add("active");
    }

  });

});

/* =========================
MOBILE NAV
========================= */

const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("navMenu");

hamburger.addEventListener("click", () => {

  navMenu.classList.toggle("active");

});

/* CLOSE NAV */
document.querySelectorAll(".nav-link").forEach(link => {

  link.addEventListener("click", () => {

    navMenu.classList.remove("active");

  });

});

/* =========================
SWIPE SLIDER MOBILE
========================= */

let startX = 0;
let endX = 0;

slider.addEventListener("touchstart", (e) => {

  startX = e.touches[0].clientX;

});

slider.addEventListener("touchend", (e) => {

  endX = e.changedTouches[0].clientX;

  if(startX - endX > 50){
    nextSlide();
  }

  if(endX - startX > 50){
    prevSlide();
  }

});