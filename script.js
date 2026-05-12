function setupMobileMenu() {
  const button = document.querySelector("[data-menu-btn]");
  const panel = document.querySelector("[data-mobile-nav]");

  if (!button || !panel) return;

  button.addEventListener("click", () => {
    const isOpen = panel.classList.toggle("open");
    button.setAttribute("aria-expanded", String(isOpen));
  });

  panel.addEventListener("click", (event) => {
    if (!event.target.matches("a")) return;
    panel.classList.remove("open");
    button.setAttribute("aria-expanded", "false");
  });
}

function setupFaqAccordion() {
  const items = document.querySelectorAll(".faq-item");

  items.forEach((item) => {
    const button = item.querySelector(".faq-q");
    const answer = item.querySelector(".faq-a");

    if (!button || !answer) return;

    button.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");

      items.forEach((otherItem) => {
        const otherButton = otherItem.querySelector(".faq-q");
        if (!otherButton) return;
        otherItem.classList.remove("open");
        otherButton.setAttribute("aria-expanded", "false");
      });

      if (!isOpen) {
        item.classList.add("open");
        button.setAttribute("aria-expanded", "true");
      }
    });
  });
}

function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function setupFormMessage() {
  const form = document.getElementById("lead-form");
  const successMessage = document.getElementById("form-success");

  if (!form || !successMessage) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    successMessage.classList.add("show");
    form.reset();
  });
}

function animateCounters() {
  const counters = document.querySelectorAll(".counter");
  if (!counters.length) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const el = entry.target;
        const target = Number(el.dataset.target || 0);
        const prefix = el.dataset.prefix || "";
        const suffix = el.dataset.suffix || "";
        const duration = 1200;
        const start = performance.now();

        function step(timestamp) {
          const progress = Math.min((timestamp - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.round(target * eased);
          el.textContent = `${prefix}${new Intl.NumberFormat("he-IL").format(current)}${suffix}`;

          if (progress < 1) {
            requestAnimationFrame(step);
          }
        }

        requestAnimationFrame(step);
        obs.unobserve(el);
      });
    },
    { threshold: 0.4 }
  );

  counters.forEach((counter) => observer.observe(counter));
}

function setupReveal() {
  const elements = document.querySelectorAll(".reveal");
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.15 }
  );

  elements.forEach((element) => observer.observe(element));
}

function setYear() {
  const year = document.getElementById("year");
  if (!year) return;
  year.textContent = String(new Date().getFullYear());
}

function setupCarousel() {
  const track = document.querySelector("[data-carousel-track]");
  const container = document.querySelector(".carousel-container");
  const prevBtn = document.querySelector("[data-carousel-prev]");
  const nextBtn = document.querySelector("[data-carousel-next]");

  if (!track || !container || !prevBtn || !nextBtn) return;

  const items = Array.from(track.querySelectorAll(".carousel-item"));
  const totalItems = items.length;
  const itemsPerRow = 3;
  const gap = 24;
  let currentIndex = 0; // index of the leftmost visible card

  function getItemWidth() {
    return (container.offsetWidth - gap * (itemsPerRow - 1)) / itemsPerRow;
  }

  function applyItemWidths() {
    const w = getItemWidth();
    items.forEach((item) => { item.style.width = w + "px"; });
  }

  function updateCarousel() {
    applyItemWidths();
    const w = getItemWidth();
    const offset = currentIndex * (w + gap);
    track.style.transform = `translateX(${offset}px)`;

    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex >= totalItems - itemsPerRow;
    prevBtn.style.opacity = prevBtn.disabled ? "0.35" : "1";
    nextBtn.style.opacity = nextBtn.disabled ? "0.35" : "1";
  }

  nextBtn.addEventListener("click", () => {
    if (currentIndex < totalItems - itemsPerRow) {
      currentIndex++;
      updateCarousel();
    }
  });

  prevBtn.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateCarousel();
    }
  });

  window.addEventListener("resize", updateCarousel);

  updateCarousel();
}

setYear();
setupMobileMenu();
setupFaqAccordion();
setupSmoothScroll();
setupFormMessage();
animateCounters();
setupReveal();
setupCarousel();
