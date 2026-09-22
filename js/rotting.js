/* Rotting Orchards: nav state, mobile menu, scroll reveal */
(function () {
  "use strict";

  var nav = document.getElementById("nav");
  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");

  function onScroll() {
    if (window.scrollY > 40) { nav.classList.add("scrolled"); }
    else { nav.classList.remove("scrolled"); }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  function closeMenu() {
    links.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.textContent = "Menu";
  }
  toggle.addEventListener("click", function () {
    var open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.textContent = open ? "Close" : "Menu";
  });
  links.addEventListener("click", function (e) {
    if (e.target.closest("a")) closeMenu();
  });

  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("in"); io.unobserve(entry.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }
})();

/* Rotting Orchards: mosaic gallery lightbox (photos + click-to-load YouTube) */
(function () {
  "use strict";
  var tiles = Array.prototype.slice.call(document.querySelectorAll(".gtile[data-full], .gtile[data-youtube]"));
  if (!tiles.length) return;

  var items = tiles.map(function (t) {
    var cap = t.querySelector("figcaption");
    return {
      youtube: t.getAttribute("data-youtube"),
      full: t.getAttribute("data-full"),
      caption: cap ? cap.textContent.trim() : (t.getAttribute("data-caption") || "")
    };
  });

  // build lightbox once
  var lb = document.createElement("div");
  lb.className = "lightbox";
  lb.setAttribute("role", "dialog");
  lb.setAttribute("aria-modal", "true");
  lb.innerHTML =
    '<button class="lb-btn lb-close" aria-label="Close">✕</button>' +
    '<button class="lb-btn lb-prev" aria-label="Previous">‹</button>' +
    '<button class="lb-btn lb-next" aria-label="Next">›</button>' +
    '<div class="lightbox__media" id="lbMedia"></div>' +
    '<div class="lb-cap" id="lbCap"></div>';
  document.body.appendChild(lb);

  var media = lb.querySelector("#lbMedia");
  var cap = lb.querySelector("#lbCap");
  var current = 0;

  function render() {
    var it = items[current];
    if (it.youtube) {
      media.innerHTML = '<div class="lb-video"><iframe src="https://www.youtube-nocookie.com/embed/' +
        it.youtube + '?autoplay=1&rel=0" title="' + (it.caption || "Video") +
        '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>';
    } else {
      media.innerHTML = '<img src="' + it.full + '" alt="' + (it.caption || "") + '">';
    }
    cap.textContent = it.caption || "";
  }
  function open(i) { current = i; render(); lb.classList.add("open"); document.body.style.overflow = "hidden"; }
  function close() { lb.classList.remove("open"); media.innerHTML = ""; document.body.style.overflow = ""; }
  function step(d) { current = (current + d + items.length) % items.length; render(); }

  tiles.forEach(function (t, i) {
    t.setAttribute("tabindex", "0");
    t.setAttribute("role", "button");
    t.addEventListener("click", function () { open(i); });
    t.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(i); }
    });
  });

  lb.querySelector(".lb-close").addEventListener("click", close);
  lb.querySelector(".lb-prev").addEventListener("click", function () { step(-1); });
  lb.querySelector(".lb-next").addEventListener("click", function () { step(1); });
  lb.addEventListener("click", function (e) { if (e.target === lb) close(); });
  document.addEventListener("keydown", function (e) {
    if (!lb.classList.contains("open")) return;
    if (e.key === "Escape") close();
    else if (e.key === "ArrowLeft") step(-1);
    else if (e.key === "ArrowRight") step(1);
  });
})();
