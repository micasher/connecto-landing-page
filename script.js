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
  const scrollTargetMap = {
    "#about": "#about .section-head",
    "#how": "#solution .solution-head",
    "#results": "#results .section-head",
    "#faq": "#faq .section-head",
    "#contact": "#contact .contact-head",
    "#clients": "#clients .clients-head",
    "#live-examples": "#live-examples .section-head",
    "#reviews": "#reviews .section-head",
    "#comparison": "#comparison .section-head"
  };

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const mappedSelector = scrollTargetMap[targetId];
      const target = document.querySelector(mappedSelector || targetId);
      if (!target) return;

      event.preventDefault();

      const header = document.querySelector(".site-header");
      const headerOffset = (header ? header.offsetHeight : 0) + 6;
      const top = targetId === "#top"
        ? 0
        : target.getBoundingClientRect().top + window.scrollY - headerOffset;

      window.scrollTo({ top, behavior: "smooth" });
    });
  });
}

function setupFormMessage() {
  const form = document.getElementById("lead-form");
  const successMessage = document.getElementById("form-success");
  const errorMessage = document.getElementById("form-error");
  const submitButton = form?.querySelector('button[type="submit"]');

  if (!form || !successMessage || !errorMessage || !submitButton) return;

  // Replace this with your deployed Google Apps Script Web App /exec URL.
  const LEADS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbzsvhwUwpJuFuh8SW-4lw7XZnC1KNXuRywc2pLqqHQjR2ATAjlFj9x3f9nhLOG_hEoGWg/exec";

  function setMessageState(type) {
    successMessage.classList.remove("show");
    errorMessage.classList.remove("show");

    if (type === "success") successMessage.classList.add("show");
    if (type === "error") errorMessage.classList.add("show");
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const honeypot = form.querySelector('input[name="website"]');
    if (honeypot && honeypot.value.trim()) return;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    if (!LEADS_WEB_APP_URL.includes("/exec")) {
      setMessageState("error");
      return;
    }

    const formData = new FormData(form);
    const payload = {
      fullName: (formData.get("fullName") || "").toString().trim(),
      businessName: (formData.get("businessName") || "").toString().trim(),
      phone: (formData.get("phone") || "").toString().trim(),
      email: (formData.get("email") || "").toString().trim(),
      details: (formData.get("details") || "").toString().trim(),
      source: "connecto-landing-page",
      pageUrl: window.location.href,
      userAgent: navigator.userAgent,
      submittedAt: new Date().toISOString()
    };

    const body = new URLSearchParams(payload);

    form.classList.add("is-loading");
    submitButton.disabled = true;
    setMessageState(null);

    try {
      // Apps Script Web Apps are cross-origin; no-cors lets the browser send the request.
      await fetch(LEADS_WEB_APP_URL, {
        method: "POST",
        mode: "no-cors",
        body
      });

      setMessageState("success");
      form.reset();
    } catch (error) {
      setMessageState("error");
    } finally {
      form.classList.remove("is-loading");
      submitButton.disabled = false;
    }
  });
}

function setupResultStoryModal() {
  const modal = document.getElementById("story-modal");
  const image = document.getElementById("story-modal-image");
  const triggers = document.querySelectorAll("[data-result-story]");
  const closeControls = document.querySelectorAll("[data-story-close]");

  if (!modal || !image || !triggers.length) return;

  function closeModal() {
    modal.hidden = true;
    image.removeAttribute("src");
    document.body.style.overflow = "";
  }

  function openModal(src) {
    image.src = src;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
  }

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const src = trigger.getAttribute("data-result-story");
      if (!src) return;
      openModal(src);
    });
  });

  closeControls.forEach((control) => {
    control.addEventListener("click", closeModal);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.hidden) {
      closeModal();
    }
  });
}

function setupResponsiveHeroImagePlacement() {
  const grid = document.querySelector(".hero-grid");
  const copy = document.querySelector(".hero-copy");
  const visual = document.querySelector(".hero-visual");
  const actions = document.querySelector(".hero-actions");

  if (!grid || !copy || !visual || !actions) return;

  const marker = document.createElement("span");
  marker.hidden = true;
  marker.setAttribute("aria-hidden", "true");
  marker.className = "hero-visual-marker";
  grid.insertBefore(marker, visual);

  const mobileQuery = window.matchMedia("(max-width: 760px)");

  function placeHeroImage() {
    if (mobileQuery.matches) {
      if (visual.parentElement !== copy) {
        copy.insertBefore(visual, actions);
      }
      return;
    }

    if (visual.parentElement !== grid) {
      grid.insertBefore(visual, marker.nextSibling);
    }
  }

  placeHeroImage();

  if (typeof mobileQuery.addEventListener === "function") {
    mobileQuery.addEventListener("change", placeHeroImage);
  } else {
    mobileQuery.addListener(placeHeroImage);
  }
}

function setupMobileHeaderAutoHide() {
  const header = document.querySelector(".site-header");
  const mobileNav = document.querySelector("[data-mobile-nav]");
  const menuButton = document.querySelector("[data-menu-btn]");

  if (!header) return;

  const mobileQuery = window.matchMedia("(max-width: 1080px)");
  let lastY = window.scrollY;
  let ticking = false;
  const minDelta = 6;

  function showHeader() {
    header.classList.remove("is-hidden-mobile");
  }

  function updateHeaderState() {
    const currentY = window.scrollY;

    if (!mobileQuery.matches) {
      showHeader();
      lastY = currentY;
      ticking = false;
      return;
    }

    const menuIsOpen = mobileNav?.classList.contains("open") || menuButton?.getAttribute("aria-expanded") === "true";
    if (menuIsOpen || currentY <= 20) {
      showHeader();
      lastY = currentY;
      ticking = false;
      return;
    }

    if (currentY > lastY + minDelta) {
      header.classList.add("is-hidden-mobile");
    } else if (currentY < lastY - minDelta) {
      showHeader();
    }

    lastY = currentY;
    ticking = false;
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(updateHeaderState);
  }

  function onViewportChange() {
    showHeader();
    lastY = window.scrollY;
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  menuButton?.addEventListener("click", showHeader);

  if (typeof mobileQuery.addEventListener === "function") {
    mobileQuery.addEventListener("change", onViewportChange);
  } else {
    mobileQuery.addListener(onViewportChange);
  }

  updateHeaderState();
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

function setupCarousel(wrapper) {
  const track = wrapper.querySelector("[data-carousel-track]");
  const container = wrapper.querySelector(".carousel-container");
  const prevBtn = wrapper.querySelector("[data-carousel-prev]");
  const nextBtn = wrapper.querySelector("[data-carousel-next]");

  if (!track || !container || !prevBtn || !nextBtn) return;

  const items = Array.from(track.querySelectorAll(".carousel-item"));
  const totalItems = items.length;
  const desktopItems = Number(wrapper.dataset.carouselItemsDesktop || 3);
  const tabletItems = Number(wrapper.dataset.carouselItemsTablet || Math.min(desktopItems, 3));
  const mobileItems = Number(wrapper.dataset.carouselItemsMobile || Math.min(tabletItems, 2));
  const gap = Number(wrapper.dataset.carouselGap || 24);
  let currentIndex = 0;

  function getVisibleItems() {
    if (window.innerWidth <= 560) return Math.max(1, mobileItems);
    if (window.innerWidth <= 900) return Math.max(1, tabletItems);
    return Math.max(1, desktopItems);
  }

  function getMaxIndex(visibleItems) {
    return Math.max(0, totalItems - visibleItems);
  }

  function getItemWidth(visibleItems) {
    return (container.offsetWidth - gap * (visibleItems - 1)) / visibleItems;
  }

  function updateCarousel() {
    const visibleItems = Math.min(getVisibleItems(), totalItems);
    const maxIndex = getMaxIndex(visibleItems);
    if (currentIndex > maxIndex) currentIndex = maxIndex;

    const w = getItemWidth(visibleItems);
    items.forEach((item) => { item.style.width = w + "px"; });
    const offset = currentIndex * (w + gap);
    track.style.transform = `translateX(${offset}px)`;

    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex >= maxIndex;
    prevBtn.style.opacity = prevBtn.disabled ? "0.35" : "1";
    nextBtn.style.opacity = nextBtn.disabled ? "0.35" : "1";
  }

  nextBtn.addEventListener("click", () => {
    const visibleItems = Math.min(getVisibleItems(), totalItems);
    const maxIndex = getMaxIndex(visibleItems);
    if (currentIndex < maxIndex) {
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

function setupIOSSafariFallbacks() {
  const ua = navigator.userAgent || "";
  const isIOSDevice = /iPad|iPhone|iPod/.test(ua)
    || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const isWebKit = /WebKit/i.test(ua);
  const isAltBrowser = /CriOS|FxiOS|EdgiOS|OPiOS/i.test(ua);

  if (!isIOSDevice || !isWebKit || isAltBrowser) return;

  document.documentElement.classList.add("ios-safari");

  const dashboardImage = document.querySelector(".how-dashboard-frame img");
  if (!dashboardImage) return;

  // iOS Safari can occasionally skip lazy-loading this image below the iframe.
  dashboardImage.setAttribute("loading", "eager");
  dashboardImage.setAttribute("decoding", "sync");
  dashboardImage.setAttribute("fetchpriority", "high");

  function nudgePaint() {
    dashboardImage.style.webkitTransform = "translateZ(0)";
    dashboardImage.style.transform = "translateZ(0)";
  }

  if (dashboardImage.complete) {
    nudgePaint();
    return;
  }

  dashboardImage.addEventListener("load", nudgePaint, { once: true });
  dashboardImage.addEventListener("error", () => {
    const src = dashboardImage.getAttribute("src");
    if (!src) return;
    const separator = src.includes("?") ? "&" : "?";
    dashboardImage.setAttribute("src", `${src}${separator}ios_retry=${Date.now()}`);
  }, { once: true });
}

setYear();
setupMobileMenu();
setupFaqAccordion();
setupSmoothScroll();
setupFormMessage();
setupResultStoryModal();
setupResponsiveHeroImagePlacement();
setupMobileHeaderAutoHide();
animateCounters();
setupReveal();
setupIOSSafariFallbacks();
document.querySelectorAll(".carousel-wrapper").forEach(setupCarousel);
