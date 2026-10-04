/*=============================================================
  Xproperty - RTL Support
  Load in <head> right after bootstrap css so the direction is
  applied before the page paints.
  - Once RTL is chosen, <html dir="rtl"> stays on every page until
    the user picks LTR (saved in localStorage)
  - ?dir=rtl or ?dir=ltr in the URL overrides it
  - Where storage is blocked (file:// in some browsers, private
    windows) the choice is carried in ?dir= on internal links
  - Swaps bootstrap.min.css <-> bootstrap.rtl.min.css
  - Adds the LTR / RTL switch button
===============================================================*/
(function () {
  "use strict";

  var STORAGE_KEY = "xproperty-dir";
  var ARABIC_FONT =
    "https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&display=swap";
  var html = document.documentElement;

  function isDir(value) {
    return value === "rtl" || value === "ltr";
  }

  function getSaved() {
    try {
      var value = localStorage.getItem(STORAGE_KEY);
      return isDir(value) ? value : null;
    } catch (e) {
      return null;
    }
  }

  // Returns true only when the value can be read back
  function save(dir) {
    try {
      localStorage.setItem(STORAGE_KEY, dir);
      return localStorage.getItem(STORAGE_KEY) === dir;
    } catch (e) {
      return false;
    }
  }

  // Checks storage works without saving a direction the user never picked
  function canStore() {
    try {
      localStorage.setItem(STORAGE_KEY + "-test", "1");
      localStorage.removeItem(STORAGE_KEY + "-test");
      return true;
    } catch (e) {
      return false;
    }
  }

  function applyDir(dir) {
    html.setAttribute("dir", dir);

    var bootstrap = document.querySelector('link[href*="bootstrap"][href$=".css"]');
    if (bootstrap) {
      var href = bootstrap.getAttribute("href");
      var next =
        dir === "rtl"
          ? href.replace(/bootstrap\.min\.css$/, "bootstrap.rtl.min.css")
          : href.replace(/bootstrap\.rtl\.min\.css$/, "bootstrap.min.css");
      if (next !== href) bootstrap.setAttribute("href", next);
    }

    if (dir === "rtl" && !document.getElementById("cs-rtl-font")) {
      var font = document.createElement("link");
      font.id = "cs-rtl-font";
      font.rel = "stylesheet";
      font.href = ARABIC_FONT;
      document.head.appendChild(font);
    }
  }

  var param = new URLSearchParams(window.location.search).get("dir");
  var dir;
  var stored;
  if (isDir(param)) {
    dir = param;
    stored = save(dir);
  } else {
    var saved = getSaved();
    var markup = html.getAttribute("dir");
    dir = saved || (isDir(markup) ? markup : "ltr");
    stored = saved ? true : canStore();
  }
  applyDir(dir);

  // No storage: keep RTL by adding ?dir=rtl to internal page links
  if (!stored && dir === "rtl") {
    document.addEventListener(
      "click",
      function (e) {
        var link = e.target.closest && e.target.closest("a[href]");
        if (!link || link.target === "_blank") return;
        var href = link.getAttribute("href");
        if (!href || /^(#|mailto:|tel:|javascript:)/i.test(href)) return;
        var url = new URL(href, window.location.href);
        if (url.origin !== window.location.origin || !/(\.html|\/)$/i.test(url.pathname)) return;
        url.searchParams.set("dir", "rtl");
        link.setAttribute("href", url.toString());
      },
      true,
    );
  }

  // Direction switch: LTR button sets LTR mode, RTL button sets RTL mode
  document.addEventListener("DOMContentLoaded", function () {
    var wrap = document.createElement("div");
    wrap.className = "cs_dir_switch cs_primary_font cs_semibold";
    wrap.setAttribute("role", "group");
    wrap.setAttribute("aria-label", "Layout direction");

    [
      { dir: "ltr", label: "LTR", title: "Left to right layout" },
      { dir: "rtl", label: "RTL", title: "Right to left layout" },
    ].forEach(function (option) {
      var btn = document.createElement("button");
      var isActive = option.dir === dir;
      btn.type = "button";
      btn.textContent = option.label;
      btn.setAttribute("aria-label", option.title);
      btn.setAttribute("aria-pressed", isActive ? "true" : "false");
      if (isActive) btn.className = "active";
      btn.addEventListener("click", function () {
        if (option.dir === dir) return;
        var url = new URL(window.location.href);
        // Saved: drop ?dir= so the saved choice wins. Not saved: carry it in the URL
        if (save(option.dir)) url.searchParams.delete("dir");
        else url.searchParams.set("dir", option.dir);
        window.location.replace(url.toString());
      });
      wrap.appendChild(btn);
    });

    document.body.appendChild(wrap);
  });
})();
