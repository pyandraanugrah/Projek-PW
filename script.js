function getPageFromLocation() {
  const p = window.location.pathname;
  const page = p.split("/").filter(Boolean).pop() || "index.html";
  return page;
}

function setActiveNavByPage() {
  const current = getPageFromLocation();
  const links = Array.from(document.querySelectorAll(".nav-link"));

  links.forEach((a) => {
    const href = a.getAttribute("href") || "";
    // allow absolute paths too (rare)
    const normalized = href.split("/").filter(Boolean).pop() || href;
    const isActive = normalized === current || (current === "index.html" && normalized === "index.html");
    a.classList.toggle("is-active", isActive);
  });
}

function initContactForm() {
  const form = document.getElementById("contactForm");
  const note = document.getElementById("contactNote");
  if (!form || !note) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const name = String(formData.get("name") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const message = String(formData.get("message") || "").trim();

    if (!name || !phone || !message) {
      note.textContent = "Mohon lengkapi semua field.";
      return;
    }

    // Simple phone check (10-13 digits)
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 10 || digits.length > 13) {
      note.textContent = "No. HP terlihat tidak valid.";
      return;
    }

    note.textContent = "Pesan kamu sudah terkirim! (Demo form)";
    form.reset();
  });
}

window.addEventListener("DOMContentLoaded", () => {
  setActiveNavByPage();
  initContactForm();
});
