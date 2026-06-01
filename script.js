const header = document.querySelector(".site-header");
const progress = document.querySelector(".scroll-progress");
const stickyCta = document.querySelector(".sticky-cta");
const revealItems = document.querySelectorAll(".reveal");
const screenshotImage = document.getElementById("activeScreenshot");
const screenshotCaption = document.getElementById("activeScreenshotCaption");
const screenshotTabs = document.querySelectorAll(".screenshot-tab");
const useChips = document.querySelectorAll(".use-chip");
const useCaseTitle = document.getElementById("useCaseTitle");
const useCaseText = document.getElementById("useCaseText");
const faqItems = document.querySelectorAll(".faq details");
const stripeCheckoutButton = document.getElementById("stripeCheckoutButton");
const stripeCheckoutStatus = document.getElementById("stripeCheckoutStatus");

window.addEventListener("scroll", () => {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const percent = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;

  if (header) {
    header.style.borderBottom = window.scrollY > 12 ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid transparent";
    header.style.background = window.scrollY > 12 ? "rgba(16, 18, 21, 0.78)" : "transparent";
  }

  if (progress) {
    progress.style.width = `${percent}%`;
  }

  if (stickyCta) {
    stickyCta.classList.toggle("visible", window.scrollY > 680);
  }
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.16
});

revealItems.forEach((item) => observer.observe(item));

screenshotTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    screenshotTabs.forEach((item) => item.classList.remove("active"));
    tab.classList.add("active");

    if (screenshotImage && screenshotCaption) {
      screenshotImage.src = tab.dataset.image;
      screenshotImage.alt = tab.dataset.alt;
      screenshotCaption.textContent = tab.dataset.caption;
    }
  });
});

useChips.forEach((chip) => {
  chip.addEventListener("click", () => {
    useChips.forEach((item) => item.classList.remove("active"));
    chip.classList.add("active");

    if (useCaseTitle && useCaseText) {
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
  const originalStripeButtonText = stripeCheckoutButton.textContent;

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
      stripeCheckoutButton.textContent = originalStripeButtonText;

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
      stripeCheckoutButton.textContent = originalStripeButtonText;

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
