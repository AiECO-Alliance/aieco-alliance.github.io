(function () {
  const menuBtn = document.getElementById("menuBtn");
  const mobilePanel = document.getElementById("mobilePanel");

  if (menuBtn && mobilePanel) {
    menuBtn.addEventListener("click", () => {
      mobilePanel.classList.toggle("show");
    });
  }

  // Highlight active link based on pathname
  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  const links = document.querySelectorAll("[data-nav]");
  links.forEach((a) => {
    const href = a.getAttribute("href");
    if (!href) return;

    const norm = href.replace(/\/+$/, "") || "/";
    const isActive =
      (norm === "/" && path === "/") ||
      (norm !== "/" && path.startsWith(norm));

    if (isActive) a.classList.add("active");
  });
})();
