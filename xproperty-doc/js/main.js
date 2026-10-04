/*--------------------------------------------------------------
>> Xproperty Documentation Scripts (no dependencies)
----------------------------------------------------------------
01. Helpers
02. Theme toggle
03. Mobile sidebar
04. Code blocks & copy buttons
05. Heading anchors
06. Scroll spy
07. Navigation search
08. Back to top
--------------------------------------------------------------*/
(function () {
  "use strict";

  /*============================================================
    01. Helpers
  ============================================================*/
  var $ = function (s, ctx) { return (ctx || document).querySelector(s); };
  var $$ = function (s, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(s)); };
  var root = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function store(key, value) {
    try {
      if (value === undefined) return localStorage.getItem(key);
      localStorage.setItem(key, value);
    } catch (e) {
      return null;
    }
  }

  /*============================================================
    02. Theme toggle (remembers the choice, follows the OS by default)
  ============================================================*/
  var savedTheme = store("xp-doc-theme");
  if (savedTheme === "light" || savedTheme === "dark") root.setAttribute("data-theme", savedTheme);

  function currentTheme() {
    var t = root.getAttribute("data-theme");
    if (t) return t;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  $$("[data-theme-toggle]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      store("xp-doc-theme", next);
    });
  });

  /*============================================================
    03. Mobile sidebar
  ============================================================*/
  var menuBtn = $("#menuBtn");
  var backdrop = $(".backdrop");

  function setNav(open) {
    document.body.classList.toggle("nav-open", open);
    if (menuBtn) menuBtn.setAttribute("aria-expanded", String(open));
  }

  if (menuBtn) {
    menuBtn.addEventListener("click", function () {
      setNav(!document.body.classList.contains("nav-open"));
    });
  }
  if (backdrop) backdrop.addEventListener("click", function () { setNav(false); });
  $$(".sidebar a").forEach(function (a) {
    a.addEventListener("click", function () { setNav(false); });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") setNav(false);
  });

  /*============================================================
    04. Code blocks & copy buttons
    Every <pre data-lang="..."> is wrapped with a header and a copy button.
  ============================================================*/
  var copyIcon = '<svg class="ico" aria-hidden="true"><use href="#i-copy"/></svg>';
  var checkIcon = '<svg class="ico" aria-hidden="true"><use href="#i-check"/></svg>';

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    // Fallback for file:// pages
    return new Promise(function (resolve, reject) {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy") ? resolve() : reject();
      } catch (err) {
        reject(err);
      }
      document.body.removeChild(ta);
    });
  }

  $$("pre[data-lang]").forEach(function (pre) {
    var wrap = document.createElement("div");
    wrap.className = "code";
    var head = document.createElement("div");
    head.className = "code-head";
    head.innerHTML = "<span>" + pre.getAttribute("data-lang") + "</span>";

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "copy-btn";
    btn.innerHTML = copyIcon + "<span>Copy</span>";
    btn.setAttribute("aria-label", "Copy code");
    btn.addEventListener("click", function () {
      copyText(pre.innerText.replace(/\n$/, "")).then(function () {
        btn.classList.add("is-copied");
        btn.innerHTML = checkIcon + "<span>Copied</span>";
        setTimeout(function () {
          btn.classList.remove("is-copied");
          btn.innerHTML = copyIcon + "<span>Copy</span>";
        }, 1800);
      }).catch(function () {
        btn.querySelector("span").textContent = "Press Ctrl+C";
      });
    });

    head.appendChild(btn);
    pre.parentNode.insertBefore(wrap, pre);
    wrap.appendChild(head);
    wrap.appendChild(pre);
  });

  /*============================================================
    05. Heading anchors
  ============================================================*/
  $$(".doc-section > h2, .doc-section h3[id]").forEach(function (h) {
    var id = h.id || (h.parentElement && h.parentElement.id);
    if (!id) return;
    var a = document.createElement("a");
    a.className = "anchor";
    a.href = "#" + id;
    a.setAttribute("aria-label", "Link to this section");
    a.textContent = "#";
    h.appendChild(a);
  });

  /*============================================================
    06. Scroll spy — highlight the section in view
  ============================================================*/
  var navLinks = $$('.sidebar .nav-group a[href^="#"]');
  var linkFor = {};
  navLinks.forEach(function (a) { linkFor[a.getAttribute("href").slice(1)] = a; });

  function setActive(id) {
    navLinks.forEach(function (a) { a.classList.remove("is-active"); });
    var link = linkFor[id];
    if (!link) return;
    link.classList.add("is-active");
    // Keep the active link visible inside the scrolling sidebar
    var sidebar = $(".sidebar");
    if (sidebar && !document.body.classList.contains("nav-open")) {
      var r = link.getBoundingClientRect();
      var s = sidebar.getBoundingClientRect();
      if (r.top < s.top + 40 || r.bottom > s.bottom - 40) {
        sidebar.scrollTop += r.top - s.top - s.height / 2;
      }
    }
  }

  var sections = $$(".doc-section[id]");
  if ("IntersectionObserver" in window && sections.length) {
    var visible = {};
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { visible[en.target.id] = en.isIntersecting; });
      for (var i = 0; i < sections.length; i++) {
        if (visible[sections[i].id]) { setActive(sections[i].id); break; }
      }
    }, { rootMargin: "-80px 0px -60% 0px" });
    sections.forEach(function (sec) { spy.observe(sec); });
  }

  /*============================================================
    07. Navigation search — filters sidebar links by title and section text
  ============================================================*/
  var searchInputs = $$("[data-doc-search]");
  var groups = $$(".sidebar .nav-group");
  var emptyMsg = $(".nav-empty");

  // Index each section's text once so searches match content, not just titles
  var sectionText = {};
  sections.forEach(function (sec) { sectionText[sec.id] = sec.textContent.toLowerCase(); });

  function filterNav(query) {
    var q = query.trim().toLowerCase();
    var total = 0;
    groups.forEach(function (g) {
      var shown = 0;
      $$("li", g).forEach(function (li) {
        var a = $("a", li);
        var id = a.getAttribute("href").slice(1);
        var hit = !q || a.textContent.toLowerCase().indexOf(q) > -1 || (sectionText[id] || "").indexOf(q) > -1;
        li.classList.toggle("is-hidden", !hit);
        if (hit) shown++;
      });
      g.classList.toggle("is-hidden", shown === 0);
      total += shown;
    });
    if (emptyMsg) emptyMsg.classList.toggle("is-visible", total === 0);
  }

  searchInputs.forEach(function (input) {
    input.addEventListener("input", function () {
      searchInputs.forEach(function (other) { if (other !== input) other.value = input.value; });
      filterNav(input.value);
    });
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        var first = $(".sidebar .nav-group li:not(.is-hidden) a");
        if (first) { first.click(); input.blur(); }
      } else if (e.key === "Escape") {
        input.value = "";
        filterNav("");
        input.blur();
      }
    });
  });

  // Press "/" to focus search
  document.addEventListener("keydown", function (e) {
    var tag = (e.target.tagName || "").toLowerCase();
    if (e.key === "/" && tag !== "input" && tag !== "textarea") {
      var visibleInput = searchInputs.filter(function (i) { return i.offsetParent !== null; })[0];
      if (visibleInput) {
        e.preventDefault();
        if (!visibleInput.closest(".topbar")) setNav(true);
        visibleInput.focus();
      }
    }
  });

  /*============================================================
    08. Back to top
  ============================================================*/
  var toTop = $("#toTop");
  if (toTop) {
    var ticking = false;
    window.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        toTop.classList.toggle("is-visible", window.scrollY > 600);
        ticking = false;
      });
    }, { passive: true });
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }
})();
