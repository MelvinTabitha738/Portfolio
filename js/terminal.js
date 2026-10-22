/* Melvin Tabitha — portfolio
   Optional terminal overlay. Progressive enhancement: every command links to real
   content that is also reachable through the regular interface. Keep it small and
   self-contained — one file, one closure, no dependencies. */
(function () {
  "use strict";

  // Avoid loading twice if this script accidentally lands on a page twice.
  if (window.__melvinTerm) return;
  window.__melvinTerm = true;

  var HIST_KEY = "melvin.term.history";
  var HIST_MAX = 50;

  /* ---- Site root: derived from this script's own URL so every in-site link
     works on https://, http:// AND file:// without any build step. ---------- */
  var _src = (document.currentScript && document.currentScript.src) || "";
  var SITE_ROOT = _src.split("?")[0].replace(/\/js\/terminal\.js$/, "/") || "./";

  var CV_URL = SITE_ROOT + "cv/Melvin-Tabitha-CV.pdf";

  /* ---- Static project + link data (kept in sync with the HTML) ----------- */
  var LINKS = {
    github: "https://github.com/MelvinTabitha738",
    linkedin: "https://www.linkedin.com/in/melvin-tabitha-5abb782a2/",
    instagram: "https://instagram.com/tabitha_can_do",
    whatsapp: "https://wa.me/254729563144",
    email: "mailto:melvintabitha26@gmail.com",
    home: SITE_ROOT + "index.html",
    projects: SITE_ROOT + "projects/index.html",
  };

  var PROJECTS = [
    {
      key: "anga",
      aliases: ["anga-weather", "anga_weather"],
      name: "Anga — Weather for Kenya",
      kind: "full-stack · case study",
      live: "https://anga-gules.vercel.app/",
      code: "https://github.com/MelvinTabitha738/Anga-weather",
      study: SITE_ROOT + "projects/anga-weather/index.html",
    },
    {
      key: "studybuddy",
      aliases: ["study-buddy", "sb"],
      name: "StudyBuddy",
      kind: "full-stack · ai · case study",
      live: "https://study-buddy-one-lovat.vercel.app/",
      code: "https://github.com/MelvinTabitha738/study-buddy-ai",
      study: SITE_ROOT + "projects/studybuddy/index.html",
    },
    {
      key: "master-photography",
      aliases: ["mp", "masterphotography", "master-photography-kenya"],
      name: "Master Photography Kenya",
      kind: "business website · seo",
      live: "https://master-photography-kenya.vercel.app/",
      code: "https://github.com/MelvinTabitha738/MasterPhotographyKenya",
    },
    {
      key: "csa",
      aliases: ["csa-africa", "csaafrica"],
      name: "CSA Africa",
      kind: "organisation website",
      live: "https://www.csaafrica.org",
    },
    {
      key: "ujamaaflow",
      aliases: ["uf", "ujamaa", "ujamaa-flow"],
      name: "UjamaaFlow",
      kind: "full product · flask",
      live: "https://ujamaaflow-cock.onrender.com",
      code: "https://github.com/MelvinTabitha738/UjamaaFlow",
    },
    {
      key: "weatherfusion",
      aliases: ["wf", "weather-fusion"],
      name: "WeatherFusion",
      kind: "server-rendered · llm",
      live: "https://weatherfusion.onrender.com",
      code: "https://github.com/MelvinTabitha738/Real-Time-Weather-App",
    },
  ];

  var SKILLS = [
    ["languages", "Python · JavaScript/TypeScript · SQL · HTML/CSS"],
    ["backend", "Django · DRF · Flask · REST · JWT · Redis · circuit breakers"],
    ["frontend", "React (incl. 19) · Vite · TanStack Start · Tailwind · hand-written CSS"],
    ["data", "PostgreSQL · MySQL · SQLite · SQLAlchemy · Django ORM"],
    ["ai", "Gemini · Groq · grounded prompting · output verification · quota-aware fallbacks"],
    ["seo", "metadata · JSON-LD · sitemaps · performance · server-rendered content"],
    ["deploy", "Vercel · Render · Neon · Oracle Cloud · gunicorn · whitenoise"],
  ];

  var SERVICES = [
    ["01 · web apps", "Full-stack applications built to behave well under real constraints (quotas, free tiers, slow networks)."],
    ["02 · websites", "Fast, professional business websites with contact flows Kenyan customers actually use (WhatsApp included)."],
    ["03 · technical seo", "Site structure, metadata, structured data, sitemaps, performance: the engineering fundamentals."],
  ];

  /* ---- Small helpers ---------------------------------------------------- */
  function h(tag, attrs, children) {
    var el = document.createElement(tag);
    if (attrs) {
      for (var k in attrs) {
        if (k === "class") el.className = attrs[k];
        else if (k === "text") el.textContent = attrs[k];
        else if (k === "html") el.innerHTML = attrs[k];
        else el.setAttribute(k, attrs[k]);
      }
    }
    if (children) {
      for (var i = 0; i < children.length; i++) {
        var c = children[i];
        if (c == null) continue;
        el.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
      }
    }
    return el;
  }

  function escapeText(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function readHistory() {
    try {
      var raw = localStorage.getItem(HIST_KEY);
      if (!raw) return [];
      var arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr.slice(-HIST_MAX) : [];
    } catch (e) {
      return [];
    }
  }
  function writeHistory(arr) {
    try {
      localStorage.setItem(HIST_KEY, JSON.stringify(arr.slice(-HIST_MAX)));
    } catch (e) {}
  }

  /* ---- Build DOM once --------------------------------------------------- */
  var launcher = h(
    "button",
    { class: "term-launcher", type: "button", "aria-haspopup": "dialog", "aria-controls": "term-overlay", "aria-expanded": "false", "aria-label": "Open terminal" },
    [h("span", { class: "caret", "aria-hidden": "true", text: "~>" }), document.createTextNode("terminal"), h("kbd", { "aria-hidden": "true", text: "`" })]
  );

  var titleEl = h("span", { class: "title", id: "term-title", text: "melvin@portfolio: ~" });
  var closeBtn = h("button", { class: "close", type: "button", "aria-label": "Close terminal", text: "esc" });
  var bar = h("div", { class: "term-bar" }, [
    h("span", { class: "dots", "aria-hidden": "true" }, [h("span"), h("span"), h("span")]),
    titleEl,
    closeBtn,
  ]);

  var body = h("div", { class: "term-body", id: "term-body", role: "log", "aria-live": "polite", "aria-relevant": "additions" });

  var promptEl = h("span", { class: "ps", "aria-hidden": "true", text: "melvin@portfolio:~$" });
  var input = h("input", {
    class: "term-input",
    id: "term-input",
    type: "text",
    autocomplete: "off",
    autocapitalize: "off",
    autocorrect: "off",
    spellcheck: "false",
    "aria-label": "Terminal input",
  });
  var inputRow = h("div", { class: "term-input-row" }, [promptEl, input]);

  var panel = h("div", { class: "term-panel", role: "dialog", "aria-modal": "true", "aria-labelledby": "term-title" }, [bar, body, inputRow]);
  var overlay = h("div", { class: "term-overlay", id: "term-overlay", "data-open": "false" }, [panel]);

  function mount() {
    document.body.appendChild(launcher);
    document.body.appendChild(overlay);
    greet();
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }

  /* ---- Printing primitives --------------------------------------------- */
  function line(text, cls) {
    var el = h("div", { class: "term-line" + (cls ? " " + cls : "") });
    el.textContent = text == null ? "" : String(text);
    body.appendChild(el);
    return el;
  }
  function html(markup, cls) {
    var el = h("div", { class: "term-line" + (cls ? " " + cls : "") });
    el.innerHTML = markup;
    body.appendChild(el);
    return el;
  }
  function echo(cmd) {
    var el = h("div", { class: "term-line term-echo" });
    el.innerHTML = '<span class="ps">melvin@portfolio:~$</span>' + escapeText(cmd);
    body.appendChild(el);
  }
  function spacer() {
    body.appendChild(h("div", { class: "term-line", text: " " }));
  }
  function scrollEnd() {
    body.scrollTop = body.scrollHeight;
  }

  function link(href, label, external) {
    var attrs = 'href="' + href + '"';
    if (external) attrs += ' rel="noopener" target="_blank"';
    return "<a " + attrs + ">" + escapeText(label) + "</a>";
  }

  /* ---- Commands --------------------------------------------------------- */
  var COMMANDS = {
    help: {
      summary: "list available commands",
      run: function () {
        var rows = Object.keys(COMMANDS)
          .sort()
          .map(function (name) {
            return "<tr><td>" + name + "</td><td>" + escapeText(COMMANDS[name].summary) + "</td></tr>";
          })
          .join("");
        html("<h4>commands</h4>");
        html("<table>" + rows + "</table>");
        html(
          '<span class="muted">Shortcuts: ↑/↓ history · Tab complete · <kbd>`</kbd> or <kbd>Ctrl+K</kbd> opens · <kbd>Esc</kbd> closes</span>'
        );
      },
    },
    whoami: {
      summary: "short identity",
      run: function () {
        line("melvin · software developer, Kenya (UTC+3)");
        line("full-stack web applications · APIs, databases, deployments · technical SEO on the side", "muted");
      },
    },
    about: {
      summary: "brief bio and About section link",
      run: function () {
        line("I build web applications end to end: the API, the data layer, the frontend and the deployment.");
        line("I like the parts of engineering most people skip: what happens when the quota runs out, when the", "muted");
        line("upstream API lies about its headers, when the user is on a slow connection.", "muted");
        spacer();
        html("Full version: " + link("/#about", "~/about", false));
      },
    },
    projects: {
      summary: "list every project",
      run: function () {
        html("<h4>projects (" + PROJECTS.length + ")</h4>");
        PROJECTS.forEach(function (p) {
          var parts = [link(p.live, "live ↗", true)];
          if (p.code) parts.push(link(p.code, "code ↗", true));
          if (p.study) parts.push(link(p.study, "case study →", false));
          html(
            '<span class="muted">· </span><strong>' +
              escapeText(p.name) +
              '</strong> &nbsp;<span class="muted">' +
              escapeText(p.kind) +
              "</span><br>&nbsp;&nbsp;" +
              parts.join(' <span class="muted">·</span> ')
          );
        });
        spacer();
        html("Full page: " + link("/projects/", "~/projects", false));
      },
    },
    skills: {
      summary: "stack by category",
      run: function () {
        var rows = SKILLS.map(function (s) {
          return "<tr><td>" + s[0] + "</td><td>" + escapeText(s[1]) + "</td></tr>";
        }).join("");
        html("<h4>skills</h4><table>" + rows + "</table>");
        html("Grid view: " + link("/#skills", "~/skills", false));
      },
    },
    services: {
      summary: "what I offer",
      run: function () {
        html("<h4>services</h4>");
        SERVICES.forEach(function (s) {
          html("<strong>" + escapeText(s[0]) + "</strong><br>&nbsp;&nbsp;" + escapeText(s[1]));
        });
        html("Section: " + link("/#services", "~/services", false));
      },
    },
    contact: {
      summary: "email, LinkedIn, GitHub, WhatsApp",
      run: function () {
        html("<h4>contact</h4>");
        html("<table>" +
          '<tr><td>email</td><td>' + link(LINKS.email, "melvintabitha26@gmail.com", false) + '</td></tr>' +
          '<tr><td>whatsapp</td><td>' + link(LINKS.whatsapp, "+254 729 563 144", true) + '</td></tr>' +
          '<tr><td>linkedin</td><td>' + link(LINKS.linkedin, "melvin-tabitha", true) + '</td></tr>' +
          '<tr><td>github</td><td>' + link(LINKS.github, "MelvinTabitha738", true) + '</td></tr>' +
          '<tr><td>instagram</td><td>' + link(LINKS.instagram, "tabitha_can_do", true) + '</td></tr>' +
          "</table>");
        html("Form: " + link("/#contact", "~/contact", false));
      },
    },
    cv: {
      summary: "open the CV (if available)",
      run: function () {
        line("Checking CV availability…", "muted");
        fetch(CV_URL, { method: "HEAD" })
          .then(function (res) {
            var type = (res.headers.get("content-type") || "").toLowerCase();
            if (res.ok && type.indexOf("pdf") !== -1) {
              html("Opening " + link(CV_URL, "Melvin-Tabitha-CV.pdf", true) + "…", "ok");
              window.open(CV_URL, "_blank", "noopener");
            } else {
              line("CV not yet uploaded. The file lands at " + CV_URL + " when I drop it in.", "err");
            }
          })
          .catch(function () {
            line("CV not reachable right now. Try the LinkedIn link via `contact`.", "err");
          });
      },
    },
    resume: {
      summary: "alias for cv",
      run: function () {
        COMMANDS.cv.run();
      },
    },
    open: {
      summary: "open <target>: project, github, linkedin, whatsapp, email, home, projects",
      run: function (args) {
        if (!args.length) {
          line("usage: open <target>", "err");
          line("targets: " + openTargets().join(", "), "muted");
          return;
        }
        var raw = args.join(" ").trim().toLowerCase();
        var target = resolveTarget(raw);
        if (!target) {
          line("unknown target: " + raw, "err");
          line("try: " + openTargets().slice(0, 6).join(", ") + ", …", "muted");
          return;
        }
        html("Opening " + link(target.url, target.label, target.external) + "…", "ok");
        if (target.external) {
          window.open(target.url, "_blank", "noopener");
        } else {
          setTimeout(function () {
            close();
            window.location.href = target.url;
          }, 150);
        }
      },
    },
    history: {
      summary: "list previous commands",
      run: function () {
        var hist = readHistory();
        if (!hist.length) {
          line("(history is empty)", "muted");
          return;
        }
        hist.forEach(function (c, i) {
          html('<span class="muted">' + String(i + 1).padStart(3, " ") + "</span>  " + escapeText(c));
        });
        html('<span class="muted">Repeat a line with !&lt;n&gt; (e.g. !3). Clear with `history -c`.</span>');
      },
    },
    clear: { summary: "clear the terminal", run: function () { body.innerHTML = ""; } },
    exit: { summary: "close the terminal (Esc)", run: function () { close(); } },
    theme: {
      summary: "switch between dark and light mode",
      run: function (args) {
        var html = document.documentElement;
        var current = html.getAttribute("data-theme") === "light" ? "light" : "dark";
        var target = (args && args[0]) ? args[0].toLowerCase() : "";
        var next;
        if (target === "light" || target === "dark") next = target;
        else if (target === "toggle" || target === "") next = current === "light" ? "dark" : "light";
        else { line("Unknown argument. Try: theme, theme light, theme dark, theme toggle.", "err"); return; }
        html.setAttribute("data-theme", next);
        try { localStorage.setItem("melvin.theme", next); } catch (e) {}
        var meta = document.querySelector('meta[name="theme-color"]');
        if (meta) meta.setAttribute("content", next === "light" ? "#f8f7f4" : "#0b0e13");
        var btn = document.querySelector(".theme-toggle");
        if (btn) {
          var isLight = next === "light";
          btn.setAttribute("aria-pressed", String(isLight));
          btn.setAttribute("aria-label", isLight ? "Switch to dark mode" : "Switch to light mode");
          btn.setAttribute("title", isLight ? "Switch to dark mode" : "Switch to light mode");
        }
        line("Theme set to " + next + ".", "ok");
      },
    },
  };

  function openTargets() {
    var t = PROJECTS.map(function (p) { return p.key; });
    return t.concat(["github", "linkedin", "whatsapp", "email", "instagram", "home", "projects"]);
  }

  function resolveTarget(raw) {
    for (var i = 0; i < PROJECTS.length; i++) {
      var p = PROJECTS[i];
      if (raw === p.key || (p.aliases && p.aliases.indexOf(raw) !== -1)) {
        return { url: p.live, label: p.name + " (live)", external: true };
      }
    }
    if (raw === "github" || raw === "gh") return { url: LINKS.github, label: "GitHub", external: true };
    if (raw === "linkedin" || raw === "li") return { url: LINKS.linkedin, label: "LinkedIn", external: true };
    if (raw === "whatsapp" || raw === "wa") return { url: LINKS.whatsapp, label: "WhatsApp", external: true };
    if (raw === "email" || raw === "mail") return { url: LINKS.email, label: "email", external: false };
    if (raw === "instagram" || raw === "ig") return { url: LINKS.instagram, label: "Instagram", external: true };
    if (raw === "home" || raw === "/") return { url: LINKS.home, label: "home", external: false };
    if (raw === "projects" || raw === "all") return { url: LINKS.projects, label: "projects", external: false };
    return null;
  }

  /* ---- Interpreter ------------------------------------------------------ */
  function run(raw) {
    var cmd = (raw || "").trim();
    if (!cmd) {
      echo("");
      return;
    }

    // !n — history recall
    if (cmd.charAt(0) === "!" && /^!\d+$/.test(cmd)) {
      var hist = readHistory();
      var n = parseInt(cmd.slice(1), 10);
      if (n >= 1 && n <= hist.length) {
        var recalled = hist[n - 1];
        echo(cmd);
        line("↻ " + recalled, "muted");
        return run(recalled);
      }
      echo(cmd);
      line("!" + n + ": event not found", "err");
      return;
    }

    // history -c  (bash-ish clear)
    if (cmd === "history -c") {
      echo(cmd);
      writeHistory([]);
      line("history cleared", "ok");
      return;
    }

    pushHistory(cmd);
    echo(cmd);

    var parts = cmd.split(/\s+/);
    var name = parts[0].toLowerCase();
    var args = parts.slice(1);
    var handler = COMMANDS[name];
    if (!handler) {
      line("command not found: " + name + ". Try `help`.", "err");
      return;
    }
    try {
      handler.run(args);
    } catch (e) {
      line("error: " + (e && e.message ? e.message : "unknown"), "err");
    }
  }

  function pushHistory(cmd) {
    var hist = readHistory();
    if (hist[hist.length - 1] !== cmd) {
      hist.push(cmd);
      writeHistory(hist);
    }
    histCursor = null;
  }

  /* ---- History navigation (↑/↓) ----------------------------------------- */
  var histCursor = null;
  var histDraft = "";

  function histUp() {
    var hist = readHistory();
    if (!hist.length) return;
    if (histCursor === null) {
      histDraft = input.value;
      histCursor = hist.length - 1;
    } else if (histCursor > 0) {
      histCursor--;
    }
    input.value = hist[histCursor];
    setCaretEnd(input);
  }
  function histDown() {
    var hist = readHistory();
    if (histCursor === null) return;
    if (histCursor < hist.length - 1) {
      histCursor++;
      input.value = hist[histCursor];
    } else {
      histCursor = null;
      input.value = histDraft;
    }
    setCaretEnd(input);
  }
  function setCaretEnd(el) {
    var v = el.value;
    el.focus();
    try { el.setSelectionRange(v.length, v.length); } catch (e) {}
  }

  /* ---- Autocomplete (Tab) ---------------------------------------------- */
  function complete() {
    var v = input.value;
    var parts = v.split(/\s+/);
    if (parts.length === 1) {
      var pool = Object.keys(COMMANDS);
      var matches = pool.filter(function (n) { return n.indexOf(parts[0]) === 0; });
      if (matches.length === 1) input.value = matches[0] + " ";
      else if (matches.length > 1) {
        line(matches.join("   "), "muted");
      }
    } else if (parts[0].toLowerCase() === "open") {
      var frag = (parts[parts.length - 1] || "").toLowerCase();
      var targets = openTargets();
      var m = targets.filter(function (t) { return t.indexOf(frag) === 0; });
      if (m.length === 1) {
        parts[parts.length - 1] = m[0];
        input.value = parts.join(" ");
      } else if (m.length > 1) {
        line(m.join("   "), "muted");
      }
    }
    scrollEnd();
  }

  /* ---- Open / close ----------------------------------------------------- */
  var lastFocus = null;

  function open() {
    if (overlay.getAttribute("data-open") === "true") return;
    lastFocus = document.activeElement;
    overlay.setAttribute("data-open", "true");
    launcher.setAttribute("aria-expanded", "true");
    document.body.setAttribute("data-term-open", "true");
    setTimeout(function () { input.focus(); scrollEnd(); }, 20);
  }
  function close() {
    if (overlay.getAttribute("data-open") !== "true") return;
    overlay.setAttribute("data-open", "false");
    launcher.setAttribute("aria-expanded", "false");
    document.body.removeAttribute("data-term-open");
    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  }
  function toggle() {
    if (overlay.getAttribute("data-open") === "true") close(); else open();
  }

  /* ---- Greeting --------------------------------------------------------- */
  function greet() {
    html(
      '<span class="muted">melvin-tabitha portfolio · interactive terminal</span>'
    );
    html(
      '<span class="muted">Type </span><strong>help</strong><span class="muted"> for commands. Everything here is also linked in the regular UI.</span>'
    );
    spacer();
    scrollEnd();
  }

  /* ---- Events ----------------------------------------------------------- */
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      var v = input.value;
      input.value = "";
      run(v);
      scrollEnd();
      return;
    }
    if (e.key === "ArrowUp") { e.preventDefault(); histUp(); return; }
    if (e.key === "ArrowDown") { e.preventDefault(); histDown(); return; }
    if (e.key === "Tab") { e.preventDefault(); complete(); return; }
    if (e.key === "Escape") { e.preventDefault(); close(); return; }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); close(); return; }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "l") { e.preventDefault(); body.innerHTML = ""; return; }
  });

  launcher.addEventListener("click", toggle);
  closeBtn.addEventListener("click", close);
  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) close();
  });
  overlay.addEventListener("keydown", function (e) {
    // simple focus trap: only input and closeBtn are interactive; keep focus on input
    if (e.key === "Tab" && document.activeElement === closeBtn) {
      e.preventDefault();
      input.focus();
    }
  });

  // Delegate link clicks inside the terminal: close the overlay for same-origin
  // navigations so the destination is visible when the page scrolls.
  body.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a");
    if (!a) return;
    // Close the overlay on any link click so the destination is visible
    // (external links open in a new tab, internal links navigate this one).
    close();
  });

  // Global keyboard: backtick or Ctrl/Cmd+K to toggle, when not typing in a field.
  document.addEventListener("keydown", function (e) {
    var inField = /^(input|textarea|select)$/i.test(document.activeElement && document.activeElement.tagName) ||
      (document.activeElement && document.activeElement.isContentEditable);
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      toggle();
      return;
    }
    if (!inField && e.key === "`") {
      e.preventDefault();
      toggle();
    }
  });
})();
