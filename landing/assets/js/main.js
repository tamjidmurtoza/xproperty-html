/*--------------------------------------------------------------
>> Xproperty Landing Page Scripts (no dependencies)
----------------------------------------------------------------
01. Inner pages data & render
02. Header, mobile nav & scroll progress
03. Reveal on scroll
04. Counters
05. Headline rotator & hero slideshow
06. Hero tilt
07. Page filter
08. Dashboard tabs
09. Hover-scroll distance
10. LTR / RTL compare slider
11. Misc
--------------------------------------------------------------*/
(function () {
  "use strict";

  document.documentElement.classList.add("js");

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, ctx) { return (ctx || document).querySelector(s); };
  var $$ = function (s, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(s)); };

  /*============================================================
    01. Inner pages data & render
  ============================================================*/
  var PAGES = [
    { file: "property-listing-buy", title: "Listing – Buy", cat: "property" },
    { file: "property-listing-rent", title: "Listing – Rent", cat: "property" },
    { file: "property-listing-search", title: "Search Results", cat: "property" },
    { file: "property-listing-map", title: "Half-Map Search", cat: "property" },
    { file: "property-details", title: "Property Details", cat: "property" },
    { file: "compare", title: "Compare Properties", cat: "property" },
    { file: "mortgage-calculator", title: "Mortgage Calculator", cat: "property" },
    { file: "gallery", title: "Property Gallery", cat: "property" },
    { file: "projects", title: "New Developments", cat: "property" },
    { file: "project-details", title: "Project Details", cat: "property" },
    { file: "open-house", title: "Open House", cat: "property" },
    { file: "neighborhoods", title: "Neighborhood Guides", cat: "property" },
    { file: "neighborhood-details", title: "Neighborhood Details", cat: "property" },
    { file: "sell-property", title: "Sell / Home Valuation", cat: "property" },
    { file: "rental-application", title: "Rental Application", cat: "property" },
    { file: "about-us", title: "About Us", cat: "company" },
    { file: "agents-list", title: "Agents", cat: "company" },
    { file: "agent-details", title: "Agent Profile", cat: "company" },
    { file: "agency-details", title: "Agency Profile", cat: "company" },
    { file: "agencies", title: "Agency Directory", cat: "company" },
    { file: "services", title: "Services", cat: "company" },
    { file: "testimonials", title: "Testimonials", cat: "company" },
    { file: "careers", title: "Careers", cat: "company" },
    { file: "pricing", title: "Pricing Plans", cat: "company" },
    { file: "faq", title: "FAQ", cat: "company" },
    { file: "contact", title: "Contact", cat: "company" },
    { file: "blog", title: "Blog Sidebar", cat: "blog" },
    { file: "blog-grid", title: "Blog Grid", cat: "blog" },
    { file: "blog-list", title: "Blog List", cat: "blog" },
    { file: "blog-details", title: "Blog Details", cat: "blog" },
    { file: "login", title: "Login", cat: "auth" },
    { file: "register", title: "Register", cat: "auth" },
    { file: "forgot-password", title: "Forgot Password", cat: "auth" },
    { file: "verify-email", title: "Verify Email", cat: "auth" },
    { file: "coming-soon", title: "Coming Soon", cat: "auth" },
    { file: "maintenance", title: "Maintenance", cat: "auth" },
    { file: "error", title: "404 Error", cat: "auth" },
    { file: "privacy-policy", title: "Privacy Policy", cat: "auth" },
    { file: "terms-condition", title: "Terms & Conditions", cat: "auth" },
    { file: "admin/index", title: "Admin Overview", cat: "roles", label: "Admin" },
    { file: "admin/property-approvals", title: "Property Approvals", cat: "roles", label: "Admin" },
    { file: "admin/all-properties", title: "All Properties", cat: "roles", label: "Admin" },
    { file: "admin/user-management", title: "User Management", cat: "roles", label: "Admin" },
    { file: "admin/agents", title: "Agents & Agencies", cat: "roles", label: "Admin" },
    { file: "admin/reports", title: "Reports & Analytics", cat: "roles", label: "Admin" },
    { file: "admin/invoice", title: "Invoice", cat: "roles", label: "Admin" },
    { file: "admin/subscriptions", title: "Subscriptions", cat: "roles", label: "Admin" },
    { file: "admin/financials", title: "Financials", cat: "roles", label: "Admin" },
    { file: "admin/listing-settings", title: "Listing Settings", cat: "roles", label: "Admin" },
    { file: "admin/roles", title: "Roles & Permissions", cat: "roles", label: "Admin" },
    { file: "admin/support-tickets", title: "Support Tickets", cat: "roles", label: "Admin" },
    { file: "admin/blog-posts", title: "Blog Posts", cat: "roles", label: "Admin" },
    { file: "admin/coupons", title: "Coupons", cat: "roles", label: "Admin" },
    { file: "agent/index", title: "Agent Overview", cat: "roles", label: "Agent" },
    { file: "agent/my-listings", title: "My Listings", cat: "roles", label: "Agent" },
    { file: "agent/leads", title: "Leads & Inquiries", cat: "roles", label: "Agent" },
    { file: "agent/tour-requests", title: "Tour Requests", cat: "roles", label: "Agent" },
    { file: "agent/analytics", title: "Listing Analytics", cat: "roles", label: "Agent" },
    { file: "agent/messages", title: "Messages", cat: "roles", label: "Agent" },
    { file: "agent/billing", title: "Package & Billing", cat: "roles", label: "Agent" },
    { file: "agent/offers", title: "Offers", cat: "roles", label: "Agent" },
    { file: "agent/documents", title: "Documents & Contracts", cat: "roles", label: "Agent" },
    { file: "owner/index", title: "Owner Overview", cat: "roles", label: "Owner" },
    { file: "owner/submit-property", title: "Submit Property", cat: "roles", label: "Owner" },
    { file: "owner/tenants", title: "Tenants & Leases", cat: "roles", label: "Owner" },
    { file: "owner/applications", title: "Rental Applications", cat: "roles", label: "Owner" },
    { file: "owner/maintenance", title: "Maintenance Requests", cat: "roles", label: "Owner" },
    { file: "buyer/index", title: "Buyer Overview", cat: "roles", label: "Buyer" },
    { file: "buyer/saved-properties", title: "Saved Properties", cat: "roles", label: "Buyer" },
    { file: "buyer/saved-searches", title: "Saved Searches", cat: "roles", label: "Buyer" },
    { file: "buyer/tours", title: "My Tours", cat: "roles", label: "Buyer" },
    { file: "buyer/offers", title: "My Offers", cat: "roles", label: "Buyer" },
    { file: "buyer/applications", title: "My Applications", cat: "roles", label: "Buyer" }
  ];
  var CAT_LABEL = { property: "Property", dashboard: "Dashboard", roles: "Role Dashboard", company: "Company", blog: "Blog", auth: "Utility" };

  var grid = $("#lpPageGrid");
  if (grid) {
    grid.innerHTML = PAGES.map(function (p, i) {
      return (
        '<article class="lp-page" data-cat="' + p.cat + '" data-reveal="fade-up" data-delay="' + (i % 4) * 80 + '">' +
        '<a class="lp-page-shot" href="../' + p.file + '.html" target="_blank" rel="noopener" aria-label="Open ' + p.title + ' page">' +
        '<img src="assets/img/screens/' + p.file.replace("/", "-") + '.jpg" alt="' + p.title + ' page preview" loading="lazy">' +
        "</a>" +
        '<div class="lp-page-meta"><h3>' + p.title + "</h3><span>" + (p.label || CAT_LABEL[p.cat]) + "</span></div>" +
        "</article>"
      );
    }).join("");
  }

  /*============================================================
    02. Header, mobile nav & scroll progress
  ============================================================*/
  var header = $("#lpHeader");
  var nav = $("#lpNav");
  var burger = $("#lpBurger");
  var toTop = $("#lpToTop");
  var progress = $(".lp-progress span");

  function setMenu(open) {
    burger.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("is-open", open);
    header.classList.toggle("is-open", open);
  }

  if (burger) {
    burger.addEventListener("click", function () {
      setMenu(burger.getAttribute("aria-expanded") !== "true");
    });
    $$("a", nav).forEach(function (a) {
      a.addEventListener("click", function () { setMenu(false); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setMenu(false);
    });
  }

  var ticking = false;
  function onScroll() {
    var y = window.scrollY;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    header.classList.toggle("is-scrolled", y > 20);
    toTop.classList.toggle("is-visible", y > 700);
    if (progress) progress.style.transform = "scaleX(" + (max > 0 ? y / max : 0) + ")";
    ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();

  toTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  });

  // Highlight current section in nav
  var navLinks = $$('.lp-nav a[href^="#"]:not(.lp-btn)');
  if ("IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        navLinks.forEach(function (a) {
          a.classList.toggle("is-current", a.getAttribute("href") === "#" + en.target.id);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    navLinks.forEach(function (a) {
      var sec = $(a.getAttribute("href"));
      if (sec) spy.observe(sec);
    });
  }

  /*============================================================
    03. Reveal on scroll
  ============================================================*/
  var revealEls = $$("[data-reveal]");
  revealEls.forEach(function (el) {
    var d = el.getAttribute("data-delay");
    if (d) el.style.setProperty("--d", d + "ms");
  });

  if ("IntersectionObserver" in window && !reduceMotion) {
    var revealer = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("is-revealed");
          revealer.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { revealer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-revealed"); });
  }

  /*============================================================
    04. Counters
  ============================================================*/
  function animateCount(el) {
    var target = parseInt(el.getAttribute("data-count"), 10) || 0;
    if (reduceMotion) { el.textContent = target; return; }
    var start = null;
    var dur = 1600;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var counters = $$("[data-count]");
  if ("IntersectionObserver" in window) {
    var counterObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          animateCount(en.target);
          counterObs.unobserve(en.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { counterObs.observe(el); });
  } else {
    counters.forEach(animateCount);
  }

  /*============================================================
    05. Headline rotator & hero slideshow
  ============================================================*/
  function cycle(items, interval, onChange) {
    if (items.length < 2 || reduceMotion) return;
    var i = 0;
    setInterval(function () {
      var prev = items[i];
      i = (i + 1) % items.length;
      onChange(prev, items[i]);
    }, interval);
  }

  cycle($$(".lp-rotator-word"), 2600, function (prev, next) {
    prev.classList.remove("is-active");
    prev.classList.add("is-leaving");
    next.classList.remove("is-leaving");
    next.classList.add("is-active");
    setTimeout(function () { prev.classList.remove("is-leaving"); }, 700);
  });

  cycle($$(".lp-hero-slides img"), 3800, function (prev, next) {
    prev.classList.remove("is-active");
    next.classList.add("is-active");
  });

  /*============================================================
    06. Hero tilt (pointer devices only)
  ============================================================*/
  var tiltEl = $("[data-tilt]");
  var visual = $(".lp-hero-visual");
  if (tiltEl && visual && !reduceMotion && window.matchMedia("(hover: hover)").matches) {
    visual.addEventListener("mousemove", function (e) {
      var r = visual.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      tiltEl.style.transform = "rotateY(" + x * 6 + "deg) rotateX(" + -y * 6 + "deg)";
    });
    visual.addEventListener("mouseleave", function () {
      tiltEl.style.transform = "";
    });
  }

  /*============================================================
    07. Page filter
  ============================================================*/
  var filterBtns = $$(".lp-filter button");
  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var f = btn.getAttribute("data-filter");
      filterBtns.forEach(function (b) {
        var on = b === btn;
        b.classList.toggle("is-active", on);
        b.setAttribute("aria-selected", String(on));
      });
      $$(".lp-page").forEach(function (card, idx) {
        var show = f === "all" || card.getAttribute("data-cat") === f;
        card.classList.toggle("is-hidden", !show);
        card.classList.add("is-revealed");
        if (show && !reduceMotion) {
          card.classList.add("is-entering");
          card.style.transitionDelay = (idx % 4) * 50 + "ms";
          requestAnimationFrame(function () {
            requestAnimationFrame(function () { card.classList.remove("is-entering"); });
          });
        }
      });
      setScrollDistances();
    });
  });

  /*============================================================
    08. Dashboard tabs
  ============================================================*/
  var dashBtns = $$("[data-dash-target]");
  var dashUrl = $(".lp-dash-visual .lp-browser-url");
  var dashTimer = null;

  function showDash(btn) {
    var key = btn.getAttribute("data-dash-target");
    dashBtns.forEach(function (b) {
      var on = b === btn;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-selected", String(on));
    });
    $$(".lp-dash-tabs-view img").forEach(function (img) {
      img.classList.toggle("is-active", img.getAttribute("data-dash") === key);
    });
    if (dashUrl) {
      dashUrl.lastChild.textContent = " xproperty.com/" + btn.getAttribute("data-url");
    }
  }

  dashBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      clearInterval(dashTimer); // stop autoplay once the user interacts
      showDash(btn);
    });
  });

  // Autoplay through dashboard screens while the section is visible
  var dashSec = $("#dashboard");
  if (dashSec && dashBtns.length && "IntersectionObserver" in window && !reduceMotion) {
    var dashIdx = 0;
    var autoplayed = false;
    new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting && !autoplayed) {
        autoplayed = true;
        dashTimer = setInterval(function () {
          dashIdx = (dashIdx + 1) % dashBtns.length;
          showDash(dashBtns[dashIdx]);
        }, 3500);
      }
    }, { threshold: 0.4 }).observe(dashSec);
  }

  /*============================================================
    09. Hover-scroll distance (full-page screenshot previews)
  ============================================================*/
  function setScrollDistances() {
    $$(".lp-demo-shot, .lp-page-shot").forEach(function (box) {
      var img = $("img", box);
      if (!img || !img.complete || !img.naturalHeight) return;
      var diff = img.getBoundingClientRect().height - box.clientHeight;
      box.style.setProperty("--scroll", diff > 0 ? -diff + "px" : "0px");
    });
  }
  $$(".lp-demo-shot img, .lp-page-shot img").forEach(function (img) {
    img.addEventListener("load", setScrollDistances);
  });
  window.addEventListener("load", setScrollDistances);
  window.addEventListener("resize", setScrollDistances);

  /*============================================================
    10. LTR / RTL compare slider
  ============================================================*/
  var compare = $("#lpCompare");
  if (compare) {
    var compareRange = $(".lp-compare-range", compare);
    var setPos = function (v) { compare.style.setProperty("--pos", v + "%"); };
    var hinted = false;

    compareRange.addEventListener("input", function () {
      hinted = true; // the user took over, cancel the hint
      setPos(compareRange.value);
    });

    // Sweep the divider once when the slider first scrolls into view
    if ("IntersectionObserver" in window && !reduceMotion) {
      var compareObs = new IntersectionObserver(function (entries) {
        if (!entries[0].isIntersecting) return;
        compareObs.disconnect();
        var start = null;
        function sweep(ts) {
          if (hinted) return;
          if (!start) start = ts;
          var p = Math.min((ts - start) / 1800, 1);
          var v = 50 + Math.sin(p * Math.PI * 2) * 22;
          setPos(v);
          compareRange.value = v;
          if (p < 1) requestAnimationFrame(sweep);
        }
        setTimeout(function () { requestAnimationFrame(sweep); }, 400);
      }, { threshold: 0.5 });
      compareObs.observe(compare);
    }
  }

  /*============================================================
    11. Misc
  ============================================================*/
  var year = $("#lpYear");
  if (year) year.textContent = new Date().getFullYear();

  // FAQ: smooth open / close, one item open at a time
  var faqItems = $$(".lp-faq-item");

  function faqToggle(item, open) {
    var summary = $("summary", item);
    if (reduceMotion || !item.animate) {
      item.open = open;
      return;
    }
    var startH = item.offsetHeight; // measured before cancel, so a reversed toggle starts mid-way
    if (item._anim) item._anim.cancel();
    clearTimeout(item._timer);

    item.classList.toggle("is-closing", !open);
    if (open) item.open = true;
    var endH = open ? item.offsetHeight : summary.offsetHeight + (item.offsetHeight - item.clientHeight);

    item.style.overflow = "hidden";
    item._anim = item.animate(
      { height: [startH + "px", endH + "px"] },
      { duration: 420, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }
    );
    // A timer rather than onfinish, so the item always settles even if the animation is throttled
    item._timer = setTimeout(function () {
      item._anim = null;
      item.style.overflow = "";
      if (!open) {
        item.open = false;
        item.classList.remove("is-closing");
      }
    }, 420);
  }

  faqItems.forEach(function (item) {
    $("summary", item).addEventListener("click", function (e) {
      e.preventDefault();
      var opening = !item.open || item.classList.contains("is-closing");
      faqToggle(item, opening);
      if (opening) {
        faqItems.forEach(function (other) {
          if (other !== item && other.open && !other.classList.contains("is-closing")) faqToggle(other, false);
        });
      }
    });
  });

  // Set your marketplace item URL here; every [data-purchase] button links to it
  var PURCHASE_URL = "";
  if (PURCHASE_URL) {
    $$("[data-purchase]").forEach(function (a) {
      a.href = PURCHASE_URL;
      a.target = "_blank";
      a.rel = "noopener";
    });
  }
})();
