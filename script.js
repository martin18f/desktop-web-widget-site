const header = document.querySelector(".site-header");
const progress = document.querySelector(".scroll-progress");
const stickyCta = document.querySelector(".sticky-cta");
const cursorGlow = document.querySelector(".cursor-glow");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelectorAll(".nav a");
const revealItems = document.querySelectorAll(".reveal");
const screenshotImage = document.getElementById("activeScreenshot");
const screenshotCaption = document.getElementById("activeScreenshotCaption");
const screenshotCounter = document.getElementById("activeScreenshotCounter");
const screenshotTabs = document.querySelectorAll(".screenshot-tab");
const useChips = document.querySelectorAll(".use-chip");
const useCaseTitle = document.getElementById("useCaseTitle");
const useCaseText = document.getElementById("useCaseText");
const faqItems = document.querySelectorAll(".faq details");
const stripeCheckoutButton = document.getElementById("stripeCheckoutButton");
const stripeCheckoutStatus = document.getElementById("stripeCheckoutStatus");
const tiltElements = document.querySelectorAll("[data-tilt]");

function updateScrollUi() {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const percent = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;

  header?.classList.toggle("scrolled", window.scrollY > 12);
  stickyCta?.classList.toggle("visible", window.scrollY > 760);

  if (progress) {
    progress.style.width = `${percent}%`;
  }
}

window.addEventListener("scroll", updateScrollUi, { passive: true });
updateScrollUi();

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  rootMargin: "0px 0px -8% 0px",
  threshold: 0.08
});

revealItems.forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index % 4, 3) * 45}ms`;
  revealObserver.observe(item);
});

const pageSections = [...document.querySelectorAll("main section[id]")];
const navObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) {
      return;
    }

    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
    });
  });
}, {
  rootMargin: "-28% 0px -62% 0px"
});

pageSections.forEach((section) => navObserver.observe(section));

menuToggle?.addEventListener("click", () => {
  const isOpen = header?.classList.toggle("menu-open") || false;
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    header?.classList.remove("menu-open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});

if (cursorGlow && window.matchMedia("(pointer: fine)").matches) {
  document.addEventListener("pointermove", (event) => {
    document.body.classList.add("pointer-active");
    cursorGlow.style.left = `${event.clientX}px`;
    cursorGlow.style.top = `${event.clientY}px`;
  }, { passive: true });

  document.addEventListener("pointerleave", () => {
    document.body.classList.remove("pointer-active");
  });
}

tiltElements.forEach((element) => {
  if (!window.matchMedia("(pointer: fine)").matches) {
    return;
  }

  element.addEventListener("pointermove", (event) => {
    const bounds = element.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    element.style.transform = `perspective(1200px) rotateX(${-y * 2.4}deg) rotateY(${x * 3.2}deg)`;
  });

  element.addEventListener("pointerleave", () => {
    element.style.transform = "";
  });
});

screenshotTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    screenshotTabs.forEach((item) => item.classList.remove("active"));
    tab.classList.add("active");

    if (!screenshotImage || !screenshotCaption) {
      return;
    }

    screenshotImage.classList.add("switching");
    const nextImage = new Image();
    nextImage.src = tab.dataset.image;
    nextImage.onload = () => {
      screenshotImage.src = tab.dataset.image;
      screenshotImage.alt = tab.dataset.alt;
      screenshotCaption.textContent = tab.dataset.caption;

      if (screenshotCounter) {
        screenshotCounter.textContent = `${tab.dataset.index} / 04`;
      }

      requestAnimationFrame(() => {
        screenshotImage.classList.remove("switching");
      });
    };
  });
});

useChips.forEach((chip) => {
  chip.addEventListener("click", () => {
    useChips.forEach((item) => item.classList.remove("active"));
    chip.classList.add("active");

    if (useCaseTitle && useCaseText) {
      useCaseTitle.animate(
        [
          { opacity: 0, transform: "translateY(8px)" },
          { opacity: 1, transform: "translateY(0)" }
        ],
        { duration: 320, easing: "cubic-bezier(.2,.75,.2,1)" }
      );
      useCaseText.animate(
        [
          { opacity: 0, transform: "translateY(6px)" },
          { opacity: 1, transform: "translateY(0)" }
        ],
        { duration: 360, easing: "cubic-bezier(.2,.75,.2,1)" }
      );
      useCaseTitle.textContent = chip.dataset.title;
      useCaseText.textContent = chip.dataset.text;
    }
  });
});

faqItems.forEach((item) => {
  item.addEventListener("toggle", () => {
    if (!item.open) {
      return;
    }

    faqItems.forEach((otherItem) => {
      if (otherItem !== item) {
        otherItem.open = false;
      }
    });
  });
});

if (stripeCheckoutButton) {
  const originalStripeButtonContent = stripeCheckoutButton.innerHTML;

  const setStripeCheckoutUnavailable = (message) => {
    stripeCheckoutButton.disabled = true;
    stripeCheckoutButton.textContent = "Stripe Checkout pending";

    if (stripeCheckoutStatus) {
      stripeCheckoutStatus.textContent = message;
      stripeCheckoutStatus.classList.add("error");
    }
  };

  const verifyStripeCheckout = async () => {
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "GET",
        headers: {
          "Accept": "application/json"
        }
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.ready) {
        throw new Error("Stripe Checkout will be enabled after the secure checkout backend is deployed.");
      }

      stripeCheckoutButton.disabled = false;
      stripeCheckoutButton.innerHTML = originalStripeButtonContent;

      if (stripeCheckoutStatus) {
        stripeCheckoutStatus.textContent = "";
        stripeCheckoutStatus.classList.remove("error");
      }
    } catch (error) {
      setStripeCheckoutUnavailable(error.message || "Stripe Checkout will be enabled after deployment.");
    }
  };

  verifyStripeCheckout();

  stripeCheckoutButton.addEventListener("click", async () => {
    stripeCheckoutButton.disabled = true;
    stripeCheckoutButton.classList.add("loading");
    stripeCheckoutButton.textContent = "Opening Stripe...";

    if (stripeCheckoutStatus) {
      stripeCheckoutStatus.textContent = "";
      stripeCheckoutStatus.classList.remove("error");
    }

    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.url) {
        throw new Error(data.error || "Stripe Checkout is not available yet.");
      }

      window.location.href = data.url;
    } catch (error) {
      stripeCheckoutButton.disabled = false;
      stripeCheckoutButton.classList.remove("loading");
      stripeCheckoutButton.innerHTML = originalStripeButtonContent;

      if (stripeCheckoutStatus) {
        stripeCheckoutStatus.textContent = error.message || "Stripe Checkout is not available yet.";
        stripeCheckoutStatus.classList.add("error");
      }
    }
  });
}

window.addEventListener("load", () => {
  document.body.classList.add("checkout-ready");
});
