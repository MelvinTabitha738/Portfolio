/* Melvin Tabitha — portfolio
   Vanilla JS. Everything here is an enhancement: the site reads fine without it. */
(function () {
  "use strict";

  /* ---- Mobile navigation ------------------------------------------------ */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    // Close the panel after choosing a link (mobile)
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("open")) {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  /* ---- Scroll-spy: highlight the section currently in view --------------- */
  var spyLinks = Array.prototype.slice.call(
    document.querySelectorAll('.site-nav a[href^="#"], .site-nav a[href^="/#"]')
  );
  if (spyLinks.length && "IntersectionObserver" in window) {
    var byId = {};
    spyLinks.forEach(function (a) {
      var id = a.getAttribute("href").split("#")[1];
      if (id) byId[id] = a;
    });
    var sections = Object.keys(byId)
      .map(function (id) {
        return document.getElementById(id);
      })
      .filter(Boolean);
    if (sections.length) {
      var spy = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              spyLinks.forEach(function (a) {
                a.classList.remove("active");
              });
              var link = byId[entry.target.id];
              if (link) link.classList.add("active");
            }
          });
        },
        { rootMargin: "-40% 0px -55% 0px" }
      );
      sections.forEach(function (s) {
        spy.observe(s);
      });
    }
  }

  /* ---- Reveal on scroll --------------------------------------------------- */
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length && "IntersectionObserver" in window && !reduced) {
    var ro = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            ro.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );
    revealEls.forEach(function (el) {
      ro.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("in");
    });
  }

  /* ---- Copy email to clipboard -------------------------------------------- */
  document.querySelectorAll("[data-copy]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var value = btn.getAttribute("data-copy");
      function done() {
        btn.classList.add("copied");
        window.setTimeout(function () {
          btn.classList.remove("copied");
        }, 2000);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(value).then(done, function () {});
      } else {
        // Fallback for older browsers
        var ta = document.createElement("textarea");
        ta.value = value;
        ta.setAttribute("readonly", "");
        ta.style.position = "absolute";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        try {
          document.execCommand("copy");
          done();
        } catch (e) {}
        document.body.removeChild(ta);
      }
    });
  });

  /* ---- Contact composer ------------------------------------------------------
     No backend and nothing stored: the form drafts the message, then hands it
     to WhatsApp or the visitor's own email app. */
  var form = document.getElementById("compose-form");
  if (form) {
    var errEl = form.querySelector(".error");
    function read() {
      var name = form.elements.name.value.trim();
      var message = form.elements.message.value.trim();
      if (!name) {
        errEl.textContent = "Please add your name.";
        form.elements.name.focus();
        return null;
      }
      if (!message) {
        errEl.textContent = "Please write a short message first.";
        form.elements.message.focus();
        return null;
      }
      errEl.textContent = "";
      return { name: name, message: message };
    }
    form.addEventListener("submit", function (e) {
      e.preventDefault(); // WhatsApp is the primary action
      var d = read();
      if (!d) return;
      var text = "Hi Melvin, I'm " + d.name + ".\n\n" + d.message;
      window.open(
        "https://wa.me/254729563144?text=" + encodeURIComponent(text),
        "_blank",
        "noopener"
      );
    });
    var emailBtn = document.getElementById("compose-email");
    if (emailBtn) {
      emailBtn.addEventListener("click", function () {
        var d = read();
        if (!d) return;
        var subject = "Enquiry from your portfolio — " + d.name;
        window.location.href =
          "mailto:melvintabitha26@gmail.com?subject=" +
          encodeURIComponent(subject) +
          "&body=" +
          encodeURIComponent(d.message);
      });
    }
  }

  /* ---- Hero role typing cycle ------------------------------------------------
     Starts from the identity ("Software Developer") that is already in the
     HTML — so the primary identity is readable the instant the page paints.
     After a pause, the typing cycle swaps in the secondary role so the
     distinction between identity and capability is explicit. */
  var roleText = document.getElementById("role-text");
  var roleTag = document.getElementById("role-tag");
  if (roleText && roleTag) {
    var roleReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var roles = [
      { text: "Software Developer", tag: "identity", cls: "" },
      { text: "Search Engine Optimization (SEO)", tag: "also offers", cls: "secondary" }
    ];
    if (roleReduced) {
      // Reduced motion: no typing. Keep the identity static; append secondary.
      roleText.textContent = roles[0].text;
      roleTag.textContent = roles[0].tag;
      var hint = document.createElement("span");
      hint.className = "role-also";
      hint.style.marginLeft = "10px";
      hint.style.color = "var(--muted)";
      hint.textContent = "· also offers " + roles[1].text;
      roleText.parentNode.appendChild(hint);
    } else {
      // Start fully showing role 0 (already in markup). Pause, then cycle.
      var idx = 0;
      var ch = roles[0].text.length;
      var state = "pausing";
      var SPEED_TYPE = 55, SPEED_DEL = 28, PAUSE_FULL = 2400, PAUSE_EMPTY = 320;

      function applyTag() {
        roleTag.textContent = roles[idx].tag;
        roleTag.className = "role-tag " + roles[idx].cls;
      }
      function schedule(fn, ms) { setTimeout(fn, ms); }
      function tick() {
        var cur = roles[idx];
        if (state === "typing") {
          ch++;
          roleText.textContent = cur.text.slice(0, ch);
          if (ch >= cur.text.length) {
            state = "pausing";
            schedule(function () { state = "deleting"; tick(); }, PAUSE_FULL);
            return;
          }
          schedule(tick, SPEED_TYPE);
        } else if (state === "deleting") {
          ch--;
          roleText.textContent = cur.text.slice(0, ch);
          if (ch <= 0) {
            idx = (idx + 1) % roles.length;
            applyTag();
            state = "typing";
            schedule(tick, PAUSE_EMPTY);
            return;
          }
          schedule(tick, SPEED_DEL);
        }
      }
      // Kick off the cycle after the identity has had a moment to be read.
      schedule(function () { state = "deleting"; tick(); }, PAUSE_FULL);
    }
  }

  /* ---- Theme toggle ----------------------------------------------------------
     The actual theme is applied before paint by a tiny inline script in each
     page's <head> (reads localStorage, falls back to prefers-color-scheme).
     This handler just toggles and persists the choice. */
  var themeBtn = document.querySelector(".theme-toggle");
  if (themeBtn) {
    function syncLabel() {
      var isLight = document.documentElement.getAttribute("data-theme") === "light";
      themeBtn.setAttribute("aria-pressed", String(isLight));
      themeBtn.setAttribute(
        "aria-label",
        isLight ? "Switch to dark mode" : "Switch to light mode"
      );
      themeBtn.setAttribute("title", isLight ? "Switch to dark mode" : "Switch to light mode");
      // Keep the browser-chrome colour (theme-color meta) in step with the UI.
      var meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute("content", isLight ? "#f8f7f4" : "#0b0e13");
    }
    syncLabel();
    themeBtn.addEventListener("click", function () {
      var next =
        document.documentElement.getAttribute("data-theme") === "light"
          ? "dark"
          : "light";
      document.documentElement.setAttribute("data-theme", next);
      try { localStorage.setItem("melvin.theme", next); } catch (e) {}
      syncLabel();
    });
    // If the visitor hasn't picked a theme yet, follow their OS preference changes.
    var mql = window.matchMedia("(prefers-color-scheme: light)");
    var onPref = function (e) {
      var stored = null;
      try { stored = localStorage.getItem("melvin.theme"); } catch (_) {}
      if (stored) return;
      document.documentElement.setAttribute("data-theme", e.matches ? "light" : "dark");
      syncLabel();
    };
    if (mql.addEventListener) mql.addEventListener("change", onPref);
    else if (mql.addListener) mql.addListener(onPref);
  }

  /* ---- Footer year ------------------------------------------------------------ */
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
