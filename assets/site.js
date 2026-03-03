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

  function updateTopBannerLinks() {
    const banner = document.querySelector(".topBanner");
    if (!banner) return;

    const svg = banner.querySelector(".topBanner__links");
    if (!svg) return;

    const chainPath = svg.querySelector('[data-link="chain"]');
    const forestEl = banner.querySelector(".hex--forest");
    const pastureEl = banner.querySelector(".hex--pasture");
    const croplandEl = banner.querySelector(".hex--cropland");
    const wetlandEl = banner.querySelector(".hex--wetland");

    if (!chainPath || !forestEl || !pastureEl || !croplandEl || !wetlandEl) return;

    const rect = banner.getBoundingClientRect();
    const width = Math.max(rect.width, 1);
    const height = Math.max(rect.height, 1);
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);

    const center = (el) => {
      const tile = el.getBoundingClientRect();
      return {
        x: tile.left - rect.left + tile.width / 2,
        y: tile.top - rect.top + tile.height / 2,
      };
    };

    const forest = center(forestEl);
    const pasture = center(pastureEl);
    const cropland = center(croplandEl);
    const wetland = center(wetlandEl);

    const qSegment = (a, b, bendY) => {
      const cx = (a.x + b.x) / 2;
      const cy = (a.y + b.y) / 2 + bendY;
      return `Q ${cx.toFixed(2)} ${cy.toFixed(2)} ${b.x.toFixed(2)} ${b.y.toFixed(2)}`;
    };

    chainPath.setAttribute(
      "d",
      [
        `M ${forest.x.toFixed(2)} ${forest.y.toFixed(2)}`,
        qSegment(forest, pasture, height * 0.03),
        qSegment(pasture, cropland, -height * 0.04),
        qSegment(cropland, wetland, height * 0.03),
      ].join(" ")
    );

    const brainHub = { x: width * 0.34, y: height * 0.55 };
    const brainTargets = { forest, pasture, cropland, wetland };
    const brainBends = {
      forest: -height * 0.12,
      pasture: height * 0.03,
      cropland: -height * 0.05,
      wetland: height * 0.12,
    };

    Object.entries(brainTargets).forEach(([name, target]) => {
      const path = svg.querySelector(`[data-link="${name}"]`);
      if (!path) return;

      const c1x = brainHub.x + width * 0.10;
      const c1y = brainHub.y + brainBends[name];
      const c2x = target.x - width * 0.10;
      const c2y = target.y;

      path.setAttribute(
        "d",
        `M ${brainHub.x.toFixed(2)} ${brainHub.y.toFixed(2)} C ${c1x.toFixed(2)} ${c1y.toFixed(2)} ${c2x.toFixed(2)} ${c2y.toFixed(2)} ${target.x.toFixed(2)} ${target.y.toFixed(2)}`
      );
    });
  }

  let bannerFrame = 0;
  const queueBannerUpdate = () => {
    if (bannerFrame) return;
    bannerFrame = window.requestAnimationFrame(() => {
      bannerFrame = 0;
      updateTopBannerLinks();
    });
  };

  queueBannerUpdate();
  window.addEventListener("resize", queueBannerUpdate);
})();
