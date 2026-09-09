/* ───────────────────────────────────────────────────────────────────────────
   Emillie de Keulenaar — site behaviour
   Gallery, lightbox, section scrollspy, show-more toggles.
   No dependencies.
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  "use strict";

  /* ── Drawings ───────────────────────────────────────────────────────────
     tone "dark" = white-ink artwork, meant for a dark garment; it needs a
     dark tile to be visible at all.                                       */
  var DRAWINGS = [
    { s: "o-diabo-existe",           t: "light", c: "O diabo existe e não existe?", n: "after Guimarães Rosa · t-shirt, recto" , w: 760, h: 369 },
    { s: "viver-e-negocio",          t: "light", c: "Viver é negócio muito perigoso", n: "after Guimarães Rosa · t-shirt, verso" , w: 760, h: 401 },
    { s: "manuscrito-grande-sertao", t: "dark",  c: "Manuscrito, Grande Sertão", n: "white on black" , w: 452, h: 760 },
    { s: "gregor-samsa-plates",      t: "light", c: "Gregor Samsa, plates", n: "after Kafka · t-shirt, recto" , w: 748, h: 760 },
    { s: "gregor-samsa-manuscript",  t: "light", c: "Gregor Samsa, manuscript", n: "after Kafka · t-shirt, verso" , w: 612, h: 760 },
    { s: "manifesto-antropofago",    t: "light", c: "Manifesto Antropófago", n: "after Oswald de Andrade · recto" , w: 694, h: 760 },
    { s: "brasiliana",               t: "light", c: "Brasiliana", n: "verso" , w: 524, h: 760 },
    { s: "joao-cabral",              t: "light", c: "João Cabral de Melo Neto", n: "poster" , w: 697, h: 760 },
    { s: "confessions-time",         t: "light", c: "What was God doing before?", n: "after Augustine · silk scarf" , w: 541, h: 760 },
    { s: "town-hall-concert",        t: "light", c: "Town Hall concert", n: "" , w: 760, h: 489 },
    { s: "skeletons-codices",        t: "light", c: "Skeletons and codices", n: "buttoned shirt, front" , w: 670, h: 760 },
    { s: "procession",               t: "light", c: "Procession", n: "buttoned shirt, back" , w: 468, h: 760 },
    { s: "codex-warriors",           t: "light", c: "Codex", n: "t-shirt, front" , w: 558, h: 760 },
    { s: "shopfronts",               t: "light", c: "Shopfronts", n: "long sleeve, back" , w: 760, h: 550 },
    { s: "bangkok-rangoon",          t: "light", c: "Bangkok, Rangoon", n: "route map · tote bag" , w: 483, h: 760 },
    { s: "masken-og-maskiner",       t: "light", c: "Masken og maskiner", n: "long sleeve, front" , w: 760, h: 357 },
    { s: "chateaubriand",            t: "light", c: "Chateaubriand en avant", n: "long sleeve, front" , w: 760, h: 194 },
    { s: "blue-dog",                 t: "light", c: "Blue dog", n: "long sleeve, chest" , w: 517, h: 760 },
    { s: "om-natten",                t: "dark",  c: "Om natten", n: "white on black · long sleeve" , w: 760, h: 464 },
    { s: "om-dagen",                 t: "dark",  c: "Om dagen", n: "white on black · long sleeve, back" , w: 475, h: 760 },
    { s: "drie-rabbits",             t: "dark",  c: "Drie", n: "rabbits and numerals · t-shirt, back" , w: 725, h: 760 },
    { s: "mr-mustafa-black",         t: "light", c: "Mr. Mustafa", n: "found advertisement, black" , w: 760, h: 299 },
    { s: "killing-time",             t: "light", c: "Killing time", n: "t-shirt, front" , w: 626, h: 760 },
    { s: "redemption-club",          t: "light", c: "Redemption Club", n: "t-shirt, front" , w: 760, h: 605 },
    { s: "mr-mustafa-white",         t: "dark",  c: "Mr. Mustafa", n: "found advertisement, white" , w: 760, h: 332 },
    { s: "floppy-disk",              t: "light", c: "High Density", n: "hoodie, front" , w: 737, h: 760 },
    { s: "pixel-figures",            t: "light", c: "Four sentries", n: "hoodie, back" , w: 608, h: 760 }
  ];

  var IMG = "images/drawings/";

  /* ── Gallery ──────────────────────────────────────────────────────────────
     Hand-balanced masonry. CSS multicol balances badly here: the drawings
     vary wildly in aspect and cannot be split, so the last column ran short.
     Instead each tile goes into whichever column is currently shortest,
     using its known aspect ratio as the height (no layout reads, so this
     costs nothing and does not depend on the images having loaded).       */
  var gallery = document.getElementById("gallery");

  function buildTile(d, i) {
    var b = document.createElement("button");
    b.className = "tile" + (d.t === "dark" ? " dark" : "");
    b.type = "button";
    b.dataset.i = i;
    b.setAttribute("aria-label", d.c + (d.n ? ", " + d.n : ""));

    var img = document.createElement("img");
    img.src = IMG + d.s + "-t.webp";
    img.alt = d.c;
    // intrinsic size reserves the right height before the file arrives,
    // so the columns do not reflow as images load
    img.width = d.w;
    img.height = d.h;
    img.loading = i < 8 ? "eager" : "lazy";
    img.decoding = "async";
    img.addEventListener("load", function () { img.classList.add("ready"); });
    if (img.complete) img.classList.add("ready");

    var cap = document.createElement("span");
    cap.className = "cap";
    cap.textContent = d.c;

    b.appendChild(img);
    b.appendChild(cap);
    return b;
  }

  function columnCount() {
    var w = window.innerWidth;
    if (w <= 560) return 1;
    if (w <= 1180) return 2;
    return 3;
  }

  var builtCols = 0;

  function layoutGallery() {
    if (!gallery) return;
    var n = columnCount();
    if (n === builtCols) return;      // nothing to do on a mere resize
    builtCols = n;

    gallery.textContent = "";
    var cols = [], heights = [];
    for (var c = 0; c < n; c++) {
      var col = document.createElement("div");
      col.className = "col";
      cols.push(col);
      heights.push(0);
      gallery.appendChild(col);
    }

    DRAWINGS.forEach(function (d, i) {
      var shortest = 0;
      for (var c = 1; c < n; c++) if (heights[c] < heights[shortest]) shortest = c;
      cols[shortest].appendChild(buildTile(d, i));
      // aspect ratio + a fixed allowance for the caption line beneath
      heights[shortest] += d.h / d.w + 0.09;
    });
  }

  layoutGallery();

  var resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(layoutGallery, 150);
  });

  /* ── Lightbox ─────────────────────────────────────────────────────────── */
  var lb      = document.getElementById("lightbox"),
      lbImg   = document.getElementById("lb-img"),
      lbCap   = document.getElementById("lb-cap"),
      lbSub   = document.getElementById("lb-sub"),
      lbCount = document.getElementById("lb-count"),
      cur     = -1,
      lastFocus = null;

  function pad(n) { return (n < 10 ? "0" : "") + n; }

  function show(i) {
    if (i < 0) i = DRAWINGS.length - 1;
    if (i >= DRAWINGS.length) i = 0;
    cur = i;
    var d = DRAWINGS[i];
    lbImg.src = IMG + d.s + ".webp";
    lbImg.alt = d.c + (d.n ? ", " + d.n : "");
    lbCap.textContent = d.c;
    lbSub.textContent = d.n;
    lbCount.textContent = pad(i + 1) + " of " + DRAWINGS.length;
    lb.classList.toggle("dark", d.t === "dark");
  }

  function open(i) {
    lastFocus = document.activeElement;
    show(i);
    lb.classList.add("on");
    document.body.style.overflow = "hidden";
    lb.querySelector(".close").focus();
  }

  function close() {
    lb.classList.remove("on");
    document.body.style.overflow = "";
    lbImg.removeAttribute("src");
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  if (gallery && lb) {
    gallery.addEventListener("click", function (e) {
      var tile = e.target.closest(".tile");
      if (tile) open(+tile.dataset.i);
    });

    lb.addEventListener("click", function (e) {
      var act = e.target.dataset ? e.target.dataset.act : null;
      if (act === "close") return close();
      if (act === "prev")  return show(cur - 1);
      if (act === "next")  return show(cur + 1);
      // clicking the backdrop (not the image, not a control) closes
      if (e.target === lb || e.target.classList.contains("stage")) close();
    });

    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("on")) return;
      if (e.key === "Escape")     { e.preventDefault(); close(); }
      if (e.key === "ArrowLeft")  { e.preventDefault(); show(cur - 1); }
      if (e.key === "ArrowRight") { e.preventDefault(); show(cur + 1); }
    });
  }

  /* ── Show-more toggles ────────────────────────────────────────────────── */
  document.querySelectorAll("[data-collapse]").forEach(function (box) {
    var keep  = parseInt(box.dataset.collapse, 10),
        kids  = Array.prototype.filter.call(box.children, function (el) {
                  return el.nodeType === 1;
                }),
        extra = kids.length - keep;

    if (extra <= 0) { box.classList.remove("hide-extra"); return; }

    kids.slice(keep).forEach(function (el) { el.classList.add("x"); });

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "more";
    btn.setAttribute("aria-expanded", "false");
    btn.textContent = "Show " + extra + " more " + (box.dataset.label || "entries");
    box.insertAdjacentElement("afterend", btn);

    btn.addEventListener("click", function () {
      var open = box.classList.toggle("hide-extra") === false;
      btn.setAttribute("aria-expanded", String(open));
      btn.textContent = open
        ? "Show fewer " + (box.dataset.label || "entries")
        : "Show " + extra + " more " + (box.dataset.label || "entries");
      if (!open) box.scrollIntoView({ block: "nearest" });
    });
  });

  /* ── Scrollspy ────────────────────────────────────────────────────────── */
  var links = {};
  document.querySelectorAll('nav.toc a[href^="#"]').forEach(function (a) {
    links[a.getAttribute("href").slice(1)] = a;
  });

  var bands = Array.prototype.slice.call(document.querySelectorAll("section.band"));

  function mark(id) {
    Object.keys(links).forEach(function (k) {
      if (k === id) links[k].setAttribute("aria-current", "true");
      else links[k].removeAttribute("aria-current");
    });
  }

  /* A plain scroll calculation rather than an IntersectionObserver: the
     trailing sections are only ~150px tall, so with a narrow observer band
     they can slip through without ever triggering, leaving nothing marked
     at the foot of the page. Here the last section to have passed a line a
     quarter down the viewport wins, and hitting the bottom always selects
     the final section. */
  // Offsets are cached so the scroll handler is pure arithmetic and never
  // forces a layout; measure() is re-run whenever the page can reflow.
  var tops = [], docH = 0;

  function measure() {
    tops = bands.map(function (b) { return { id: b.id, top: b.offsetTop }; });
    docH = document.body.scrollHeight;
    spy();
  }

  function spy() {
    if (!tops.length) return;
    var y = window.scrollY, vh = window.innerHeight;
    var probe = y + vh * 0.25;

    if (y + vh >= docH - 2) return mark(tops[tops.length - 1].id);
    if (probe < tops[0].top) return mark(null);

    var active = tops[0].id;
    for (var i = 0; i < tops.length; i++) {
      if (tops[i].top <= probe) active = tops[i].id;
    }
    mark(active);
  }

  window.addEventListener("scroll", spy, { passive: true });
  window.addEventListener("resize", measure);
  // expanding a collapsed list moves every section below it
  document.addEventListener("click", function (e) {
    if (e.target.closest && e.target.closest(".more")) setTimeout(measure, 0);
  });
  if (document.readyState === "complete") measure();
  else window.addEventListener("load", measure);
  measure();

  /* ── Colophon year ────────────────────────────────────────────────────── */
  var yr = document.getElementById("yr");
  if (yr) yr.textContent = new Date().getFullYear();
})();
