/* =========================
SLIDER
========================= */

const slides = document.querySelectorAll(".slide");
const slider = document.querySelector(".slider-wrapper");
let current = 0;

function showSlide(index) {
  if (!slides.length) return;
  slides.forEach((s) => s.classList.remove("active"));
  slides[index].classList.add("active");
  updateIndicators(index);
}

function nextSlide() {
  if (!slides.length) return;
  current = (current + 1) % slides.length;
  showSlide(current);
}

function prevSlide() {
  if (!slides.length) return;
  current = (current - 1 + slides.length) % slides.length;
  showSlide(current);
}

showSlide(current);

/* =========================
AUTO SLIDE
========================= */

let autoInterval;

function startAutoSlide() {
  stopAutoSlide();
  autoInterval = setInterval(nextSlide, 4000);
}

function stopAutoSlide() {
  clearInterval(autoInterval);
}

if (slider) {
  slider.addEventListener("mouseenter", stopAutoSlide);
  slider.addEventListener("mouseleave", startAutoSlide);
  slider.addEventListener("touchstart", stopAutoSlide, { passive: true });
}

startAutoSlide();

/* =========================
SLIDER INDICATORS
========================= */

function createIndicators() {
  const wrapper = document.querySelector(".slider-wrapper");
  if (!wrapper || slides.length < 2) return;

  const container = document.createElement("div");
  container.className = "slider-indicators";

  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.className = "indicator" + (i === current ? " active" : "");
    dot.setAttribute("aria-label", "Slide " + (i + 1));
    dot.addEventListener("click", () => {
      current = i;
      showSlide(current);
    });
    container.appendChild(dot);
  });

  wrapper.appendChild(container);
}

function updateIndicators(index) {
  document.querySelectorAll(".indicator").forEach((dot, i) => {
    dot.classList.toggle("active", i === index);
  });
}

createIndicators();

/* =========================
DRAG / SWIPE
========================= */

if (slider) {
  let startX = 0;
  let endX = 0;
  let isDragging = false;
  let dragStartX = 0;

  slider.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
  }, { passive: true });

  slider.addEventListener("touchend", (e) => {
    endX = e.changedTouches[0].clientX;
    const diff = startX - endX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) nextSlide();
      else prevSlide();
      startAutoSlide();
    }
  }, { passive: true });

  slider.addEventListener("mousedown", (e) => {
    isDragging = true;
    dragStartX = e.clientX;
    slider.style.cursor = "grabbing";
  });

  window.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    endX = e.clientX;
  });

  window.addEventListener("mouseup", () => {
    if (!isDragging) return;
    isDragging = false;
    slider.style.cursor = "";

    const diff = dragStartX - endX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextSlide();
      else prevSlide();
      startAutoSlide();
    }

    dragStartX = 0;
    endX = 0;
  });
}

/* =========================
MOBILE NAV
========================= */

const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("navMenu");
const navLinks = Array.from(document.querySelectorAll(".nav-link"));

const navItems = navLinks
  .map((link) => {
    const target = link.getAttribute("data-target") || link.getAttribute("href")?.slice(1) || "";
    const section = target ? document.getElementById(target) : null;
    return section ? { link, section, target } : null;
  })
  .filter(Boolean);

function setActiveLink(activeId) {
  navLinks.forEach((link) => {
    const target = link.getAttribute("data-target") || link.getAttribute("href")?.slice(1) || "";
    link.classList.toggle("active", target === activeId);
  });
}

function scrollToSection(targetId) {
  const section = document.getElementById(targetId);
  if (!section) return;

  section.scrollIntoView({ behavior: "smooth", block: "start" });
  setActiveLink(targetId);
}

function updateActiveLinkFromScroll() {
  if (!navItems.length) return;

  const viewportCenter = window.innerHeight / 2;
  let activeId = navItems[0].target;

  for (const { target, section } of navItems) {
    const rect = section.getBoundingClientRect();
    if (rect.top <= viewportCenter && rect.bottom >= viewportCenter) {
      activeId = target;
      break;
    }
    if (rect.top <= viewportCenter) {
      activeId = target;
    }
  }

  setActiveLink(activeId);
}

if (hamburger && navMenu) {
  hamburger.addEventListener("click", () => {
    navMenu.classList.toggle("active");
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    const target = link.getAttribute("data-target") || link.getAttribute("href")?.slice(1) || "";
    if (!target) return;
    if (navMenu) navMenu.classList.remove("active");
    scrollToSection(target);
  });
});

if (navItems.length) {
  window.addEventListener("scroll", updateActiveLinkFromScroll, { passive: true });
  window.addEventListener("resize", updateActiveLinkFromScroll);
  updateActiveLinkFromScroll();
}

/* =========================
NAVBAR HIDE ON SCROLL
========================= */

const navbar = document.querySelector(".navbar");
let lastScrollY = 0;

function handleNavbarScroll() {
  const currentScrollY = window.scrollY;

  if (currentScrollY < 80) {
    navbar.classList.remove("hide", "scrolled");
    lastScrollY = currentScrollY;
    return;
  }

  navbar.classList.add("scrolled");

<<<<<<< HEAD
    if (endX - startX > 50) {
      prevSlide();
    }
  });
}
=======
  if (currentScrollY > lastScrollY && currentScrollY > 100) {
    navbar.classList.add("hide");
  } else {
    navbar.classList.remove("hide");
  }

  lastScrollY = currentScrollY;
}

window.addEventListener("scroll", handleNavbarScroll, { passive: true });

/* =========================
BACK TO TOP
========================= */

const backToTop = document.createElement("button");
backToTop.className = "back-to-top";
backToTop.setAttribute("aria-label", "Back to top");
backToTop.innerHTML = '<i class="fa-solid fa-chevron-up"></i>';
document.body.appendChild(backToTop);

window.addEventListener("scroll", () => {
  backToTop.classList.toggle("show", window.scrollY > 500);
}, { passive: true });

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

/* =========================
SCROLL REVEAL
========================= */

function observeReveal() {
  const elements = document.querySelectorAll(".reveal");
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  elements.forEach((el) => observer.observe(el));
}

observeReveal();

/* =========================
PAGE ENTRANCE
========================= */

window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});

/* =========================
ORDER SYSTEM
========================= */

const API_BASE = "";

const MENU_DATA = [
  { id: 1, name: "CIWENG", price: 10000, description: "Camilan berbahan dasar aci yang gurih dan renyah.", image: "src/ciweng.jpeg" },
  { id: 2, name: "MOLACHEE", price: 10000, description: "Makanan ringan dengan cita rasa khas dan tekstur kenyal yang lezat.", image: "src/molachee.jpeg" },
  { id: 3, name: "CILUKBA", price: 10000, description: "Camilan gurih dengan tekstur renyah di luar dan lembut di dalam.", image: "src/cilukba.jpeg" }
];

let cart = {};

function renderMenu(items) {
  const container = document.getElementById("orderItems");
  if (!container) return;

  container.innerHTML = items
    .map(
      (item) => `
    <div class="order-card reveal zoom-in" data-id="${item.id}">
      <img src="${item.image}" alt="${item.name}" class="order-card-img" />
      <h4>${item.name}</h4>
      <p class="order-desc">${item.description}</p>
      <span class="order-price">Rp${item.price.toLocaleString()}</span>
      <div class="qty-controls">
        <button class="qty-btn" data-id="${item.id}" data-action="minus">−</button>
        <span class="qty-num" data-id="${item.id}">0</span>
        <button class="qty-btn" data-id="${item.id}" data-action="plus">+</button>
      </div>
    </div>`
    )
    .join("");

  container.querySelectorAll(".qty-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.dataset.id);
      const action = btn.dataset.action;
      if (action === "plus") changeQty(id, 1);
      else changeQty(id, -1);
    });
  });

  observeReveal();
}

async function loadMenu() {
  try {
    const res = await fetch(API_BASE + "/api/menu");
    const items = await res.json();
    renderMenu(items);
  } catch (e) {
    renderMenu(MENU_DATA);
  }
}

function changeQty(id, delta) {
  cart[id] = (cart[id] || 0) + delta;
  if (cart[id] <= 0) delete cart[id];

  const numEl = document.querySelector(`.qty-num[data-id="${id}"]`);
  if (numEl) numEl.textContent = cart[id] || 0;

  const card = document.querySelector(`.order-card[data-id="${id}"]`);
  if (card) {
    card.style.borderColor = cart[id] ? "var(--pink)" : "#ffb4c9";
  }

  updateTotal();
}

function updateTotal() {
  const totalEl = document.getElementById("orderTotal");
  if (!totalEl) return;

  const cards = document.querySelectorAll(".order-card");
  let total = 0;

  cards.forEach((card) => {
    const id = parseInt(card.dataset.id);
    const qty = cart[id] || 0;
    if (qty > 0) {
      const priceText = card.querySelector(".order-price").textContent;
      const price = parseInt(priceText.replace(/[^0-9]/g, ""));
      total += price * qty;
    }
  });

  totalEl.textContent = "Rp" + total.toLocaleString();
}

function sendViaWhatsApp(items, name, phone, address, total) {
  let message = "Halo ACICU, saya ingin memesan:\n\n";
  items.forEach((item) => {
    message += `- ${item.name} x${item.quantity} = Rp${(item.price * item.quantity).toLocaleString()}\n`;
  });
  message += `\nTotal: Rp${total.toLocaleString()}`;
  message += `\n\nNama: ${name}`;
  message += `\nNo. HP: ${phone}`;
  message += `\nAlamat: ${address}`;
  window.open(`https://wa.me/6282286512274?text=${encodeURIComponent(message)}`, "_blank");
}

function resetOrderForm() {
  document.getElementById("custName").value = "";
  document.getElementById("custPhone").value = "";
  document.getElementById("custAddress").value = "";
  cart = {};
  document.querySelectorAll(".qty-num").forEach((el) => (el.textContent = "0"));
  document.querySelectorAll(".order-card").forEach((el) => (el.style.borderColor = "#ffb4c9"));
  updateTotal();
}

async function submitOrder() {
  const name = document.getElementById("custName").value.trim();
  const phone = document.getElementById("custPhone").value.trim();
  const address = document.getElementById("custAddress").value.trim();
  const msg = document.getElementById("orderMsg");
  const btn = document.getElementById("submitOrder");

  const items = Object.entries(cart)
    .map(([id, qty]) => {
      const card = document.querySelector(`.order-card[data-id="${id}"]`);
      const name = card?.querySelector("h4")?.textContent || "";
      const priceText = card?.querySelector(".order-price")?.textContent || "0";
      const price = parseInt(priceText.replace(/[^0-9]/g, ""));
      return { menu_id: parseInt(id), name, price, quantity: qty };
    })
    .filter((i) => i.quantity > 0);

  if (!name || !phone || !address) {
    msg.textContent = "Harap isi semua data pemesan";
    msg.className = "order-msg error";
    return;
  }

  if (!items.length) {
    msg.textContent = "Pilih minimal 1 menu";
    msg.className = "order-msg error";
    return;
  }

  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);

  btn.disabled = true;
  btn.textContent = "Mengirim...";
  msg.textContent = "";
  msg.className = "order-msg";

  try {
    const res = await fetch(API_BASE + "/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customer_name: name, phone, address, items }),
    });

    const data = await res.json();

    if (res.ok) {
      msg.textContent = "✅ " + data.message;
      msg.className = "order-msg success";
      resetOrderForm();
    } else {
      msg.textContent = "❌ " + (data.error || "Gagal memproses pesanan");
      msg.className = "order-msg error";
    }
  } catch (e) {
    msg.innerHTML = "⚠️ Server tidak tersedia. <a href='#' id='waFallback' style='color:#2ecc5f;font-weight:700;'>Kirim via WhatsApp</a>";
    msg.className = "order-msg";
    document.getElementById("waFallback").addEventListener("click", (ev) => {
      ev.preventDefault();
      sendViaWhatsApp(items, name, phone, address, total);
      msg.textContent = "✅ Dialihkan ke WhatsApp";
      msg.className = "order-msg success";
      resetOrderForm();
    });
  }

  btn.disabled = false;
  btn.textContent = "Pesan Sekarang";
}

const submitBtn = document.getElementById("submitOrder");
if (submitBtn) submitBtn.addEventListener("click", submitOrder);

loadMenu();
>>>>>>> f076b9a (add backend with Vercel serverless API + Neon PostgreSQL + order system)
