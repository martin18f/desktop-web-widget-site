const header = document.querySelector(".site-header");

window.addEventListener("scroll", () => {
  header.style.borderBottom = window.scrollY > 12 ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid transparent";
});
