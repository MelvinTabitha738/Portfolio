/* Melvin Tabitha — CV / resume viewer
   Keeps Back and Download in view above the document. Desktop browsers show
   the PDF in their own viewer, exactly as the file looks. Phones can't show a
   PDF inline, so there PDF.js draws the pages, with a Times-equivalent font
   because the PDF uses Times without embedding it. */
(function () {
  "use strict";

  // Bump a version here whenever its PDF is regenerated.
  var DOCS = {
    cv: { file: "Melvin-Tabitha-CV.pdf", v: 6, title: "CV" },
    resume: { file: "Melvin-Tabitha-Resume.pdf", v: 5, title: "Resume" },
  };
  var WORKER = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
  var FONTS = "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/standard_fonts/";

  var params = new URLSearchParams(window.location.search);
  var doc = DOCS[params.get("doc")] || DOCS.cv;
  var url = doc.file + "?v=" + doc.v;

  var pagesEl = document.getElementById("main");
  var statusEl = document.getElementById("cv-status");
  var download = document.getElementById("cv-download");
  var back = document.getElementById("cv-back");

  document.title = doc.title + " — Melvin Tabitha";
  document.getElementById("cv-title").textContent = doc.title;
  download.href = url;
  download.setAttribute("download", doc.file);

  /* ---- Back: return to the exact page and scroll spot the visitor left ---- */
  back.addEventListener("click", function (e) {
    var ref = document.referrer;
    if (ref && ref.indexOf(window.location.origin + "/") === 0 && window.history.length > 1) {
      e.preventDefault();
      window.history.back();
    }
  });

  function fail() {
    statusEl.innerHTML = "";
    statusEl.append("The preview couldn't load. ");
    var a = document.createElement("a");
    a.href = url;
    a.textContent = "Open the " + doc.title + " as a PDF";
    statusEl.append(a, ".");
  }

  /* ---- Desktop: the browser's own PDF viewer --------------------------- */
  var nativePdf = navigator.pdfViewerEnabled === true &&
    window.matchMedia && window.matchMedia("(pointer: fine)").matches;
  if (nativePdf) {
    var frame = document.createElement("iframe");
    frame.className = "cv-frame";
    frame.src = url;
    frame.title = doc.title;
    document.body.classList.add("cv-native");
    statusEl.hidden = true;
    pagesEl.appendChild(frame);
    return;
  }

  /* ---- Phones: PDF.js ---------------------------------------------------- */
  var lib = window.pdfjsLib;
  if (!lib) return fail();
  lib.GlobalWorkerOptions.workerSrc = WORKER;

  var pdf = null;
  var renderedWidth = 0;

  // Links in the PDF become real anchors laid over the page, sized in
  // percentages so they stay in place as the page scales.
  function addLinks(page, vp, sheet) {
    return page.getAnnotations().then(function (annots) {
      annots.forEach(function (a) {
        if (a.subtype !== "Link" || !a.url) return;
        var r = vp.convertToViewportRectangle(a.rect);
        var x = Math.min(r[0], r[2]), y = Math.min(r[1], r[3]);
        var link = document.createElement("a");
        link.className = "cv-link";
        link.href = a.url;
        if (a.url.indexOf("melvintabitha.vercel.app") === -1) {
          link.target = "_blank";
          link.rel = "noopener";
        }
        link.setAttribute("aria-label", a.url.replace(/^mailto:/, ""));
        link.style.left = (x / vp.width) * 100 + "%";
        link.style.top = (y / vp.height) * 100 + "%";
        link.style.width = (Math.abs(r[2] - r[0]) / vp.width) * 100 + "%";
        link.style.height = (Math.abs(r[3] - r[1]) / vp.height) * 100 + "%";
        sheet.appendChild(link);
      });
    });
  }

  function renderPage(n, width) {
    return pdf.getPage(n).then(function (page) {
      var vp = page.getViewport({ scale: width / page.getViewport({ scale: 1 }).width });
      // Cap the pixel ratio so four pages stay light on phone memory.
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      var sheet = document.createElement("div");
      sheet.className = "cv-sheet";
      sheet.style.aspectRatio = vp.width + " / " + vp.height;
      var canvas = document.createElement("canvas");
      canvas.width = Math.floor(vp.width * dpr);
      canvas.height = Math.floor(vp.height * dpr);
      canvas.setAttribute("role", "img");
      canvas.setAttribute("aria-label", doc.title + ", page " + n + " of " + pdf.numPages);
      sheet.appendChild(canvas);
      var ctx = canvas.getContext("2d");
      return page
        .render({ canvasContext: ctx, viewport: vp, transform: dpr !== 1 ? [dpr, 0, 0, dpr, 0, 0] : null })
        .promise.then(function () { return addLinks(page, vp, sheet); })
        .then(function () { return sheet; });
    });
  }

  function renderAll() {
    var width = Math.min(pagesEl.clientWidth, 860);
    renderedWidth = width;
    var jobs = [];
    for (var n = 1; n <= pdf.numPages; n++) jobs.push(renderPage(n, width));
    return Promise.all(jobs).then(function (sheets) {
      pagesEl.querySelectorAll(".cv-sheet").forEach(function (s) { s.remove(); });
      statusEl.hidden = true;
      sheets.forEach(function (s) { pagesEl.appendChild(s); });
    });
  }

  // useSystemFonts off: never fall back to whatever serif the phone has.
  lib.getDocument({ url: url, standardFontDataUrl: FONTS, useSystemFonts: false }).promise
    .then(function (loaded) { pdf = loaded; return renderAll(); })
    .catch(fail);

  // Sharpen the pages if the window grows noticeably (e.g. phone rotated).
  var timer = null;
  window.addEventListener("resize", function () {
    clearTimeout(timer);
    timer = setTimeout(function () {
      if (pdf && Math.min(pagesEl.clientWidth, 860) > renderedWidth * 1.15) renderAll().catch(fail);
    }, 250);
  });
})();
