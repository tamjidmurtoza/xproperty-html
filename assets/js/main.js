(function ($) {
  "use strict";

  /*
  |=====================================================================
  | Template Name: Xproperty
  | Author: Laralink
  | Version: 1.0.0
  |=====================================================================
  |=====================================================================
  | TABLE OF CONTENTS:
  |=====================================================================
  |
  | 01. Preloader
  | 02. Mobile Menu
  | 03. Sticky Header
  | 04. Dynamic Background
  | 05. Slick Slider
  | 06. Language Select
  | 07. Search Modal Toggle
  | 08. Smooth Page Scroll (Lenis)
  | 09. Counter Animation
  | 10. Modal Video
  | 11. Review
  | 12. Tabs
  | 13. Accordian
  | 14. heart toggle
  | 15. Date And Time Picker
  | 16. Apartment Finding Function
  | 17. Pricing value Toggle
  | 18. Light Gallery
  | 19. Load More Portfolio Items
  | 20. Data Table
  | 21. Scroll Up
  | 22. Dynamic contact form
  | 23. AOS Animation
  | 24. Saved Preferences (color mode + dashboard sidebar)
  | 25. Color Mode Switch (Device / Light / Dark)
  | 26. Layout Direction (LTR / RTL)
  | 27. Settings Switch (gear panel with LTR / RTL)
  |
  | Dashboard pages (body.cs_dashboard):
  | 28. Sidebar (desktop collapse + mobile offcanvas)
  | 29. Sidebar Submenus
  | 30. Topbar Dropdowns
  | 31. Mobile Search
  | 32. Stat Counters
  | 33. Analytics Charts (SVG)
  | 34. Filter Tabs (listings, approvals, users)
  | 35. Messages (chat)
  | 36. File Upload Previews
  | 37. Settings Section Nav
  | 38. Mortgage Calculator (property details)
  | 39. Package Editor (admin)
  |
  */

  /*====================================================================
    Scripts initialization
  ======================================================================*/
  $.exists = function (selector) {
    return $(selector).length > 0;
  };

  // Runs right away (not on DOM ready) so the page starts with the saved state
  var PREF_KEYS = {
    theme: "xproperty-theme",
    sidebar: "xproperty-sidebar",
    dir: "xproperty-dir",
  };
  var THEME_MODES = ["system", "light", "dark"]; // also the topbar button's click order
  var THEME_LABELS = { system: "Device", light: "Light", dark: "Dark" };
  var darkQuery = window.matchMedia("(prefers-color-scheme: dark)");
  var themeMode = savedThemeMode();
  var ARABIC_FONT =
    "https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&display=swap";
  var layoutDir = "ltr";
  var DESKTOP = window.matchMedia("(min-width: 1200px)");
  var $html = $("html");
  var $body = $("body");
  layoutDirection();
  applySavedPreferences();

  $(window).on("load", function () {
    preloader();
  });
  $(window).on("scroll", function () {
    stickyHeader();
    showScrollUp();
  });

  $(function () {
    settingsSwitch(); // first, so a missing plugin elsewhere can't block it
    colorModeSwitch(); // after settingsSwitch(), which builds the gear panel
    mainNav();
    stickyHeader();
    dynamicBackground();
    slickInit();
    quantityInit();
    modalToggle();
    smoothScroll();
    counterInit();
    modalVideo();
    review();
    tabs();
    accordian();
    elementToggle();
    dateTimePicker();
    apartmentShow();
    pricingToggle();
    lightGallery();
    loadMore();
    dataTable();
    scrollUp();
    aosInit();
    mortgageCalculator();
    tomSelectInit($(".tom_select"));
    if ($.exists(".cs_getting_year")) {
      const date = new Date();
      $(".cs_getting_year").text(date.getFullYear());
    }
  });

  // Dashboard pages: own ready handler, so an error above can't block it
  $(function () {
    if (!$body.hasClass("cs_dashboard")) return;
    dashboardSidebar();
    tomSelectInit($(".cs_select select"));
    filterTabs(); // before submenus() so the matching submenu link is marked first
    submenus();
    dropdowns();
    dashboardModals();
    mobileSearch();
    statCounters();
    analyticsCharts();
    chat();
    uploads();
    settingsNav();
    packageEditor();
  });
  /*======================================================================
   Run on window resize
  =======================================================================*/
  $(window).on("resize", function () {
    const mobileWidth = 1199;
    if ($(window).width() >= mobileWidth) {
    }
  });

  /*======================================================================
    01. Preloader
  ========================================================================*/
  function preloader() {
    $(".cs_preloader").fadeOut();
    $(".cs_preloader_in").delay(150).fadeOut("slow");
  }

  /*======================================================================
    Tom Select (front-end .tom_select and dashboard .cs_select selects)
    Short lists act like a plain select; long lists get a search box.
  ========================================================================*/
  function tomSelectInit($selects) {
    if (typeof TomSelect === "undefined") return;
    $selects.each(function () {
      if (this.tomselect) return;
      var settings = {
        create: false,
        onDropdownOpen: function (dropdown) {
          dropdown.classList.add("active");
        },
        onDropdownClose: function (dropdown) {
          dropdown.classList.remove("active");
        },
      };
      if ($(this).closest(".cs_select").length && this.options.length <= 8) settings.controlInput = null;
      var select = new TomSelect(this, settings);
      // Tom Select's RTL padding rules expect the class on the control too
      select.control.classList.toggle("rtl", select.rtl);
    });
  }

  /*======================================================================
    02. Mobile Menu
  ========================================================================*/
  function mainNav() {
    $(".cs_nav").append('<span class="cs_menu_toggle"><span></span></span>');
    $(".menu-item-has-children").append(
      '<span class="cs_menu_dropdown_toggle"><span></span></span>',
    );
    $(".cs_menu_toggle").on("click", function () {
      $(this)
        .toggleClass("active")
        .siblings(".cs_nav_list_wrap")
        .toggleClass("active")
        .children(".cs_close_nav")
        .toggleClass("active");
    });
    $(".cs_close_nav").on("click", function () {
      $(this)
        .toggleClass("active")
        .parent(".cs_nav_list_wrap")
        .toggleClass("active")
        .siblings(".cs_menu_toggle")
        .toggleClass("active");
    });
    $(".cs_menu_dropdown_toggle").on("click", function () {
      $(this).toggleClass("active").siblings("ul").slideToggle();
      $(this).parent().toggleClass("active");
    });
  }

  /*======================================================================
    03. Sticky Header
  ========================================================================*/
  function stickyHeader() {
    var scroll = $(window).scrollTop();
    if (scroll >= 10) {
      $(".cs_sticky_header").addClass("cs_sticky_active");
    } else {
      $(".cs_sticky_header").removeClass("cs_sticky_active");
    }
  }

  /*======================================================================
    04. Dynamic Background
  ========================================================================*/
  function dynamicBackground() {
    $("[data-src]").each(function () {
      var src = $(this).attr("data-src");
      $(this).css({
        "background-image": "url(" + src + ")",
      });
    });
  }

  /*======================================================================
    05. Slick Slider
  ========================================================================*/
  function slickInit() {
    if ($.exists(".cs_slider")) {
      $(".cs_slider").each(function () {
        // Slick Variable
        var $ts = $(this).find(".cs_slider_container");
        var $slickActive = $(this).find(".cs_slider_wrapper");
        var $status = $(this).find(".cs_slider_number");

        // Auto Play
        var autoPlayVar = parseInt($ts.attr("data-autoplay"), 10);
        // Auto Play Time Out
        var autoplaySpdVar = 3000;
        if (autoPlayVar > 1) {
          autoplaySpdVar = autoPlayVar;
          autoPlayVar = 1;
        }
        // Slide Change Speed
        var speedVar = parseInt($ts.attr("data-speed"), 10);
        // Slider Loop
        var loopVar = Boolean(parseInt($ts.attr("data-loop"), 10));
        // Slider Center
        var centerVar = Boolean(parseInt($ts.attr("data-center"), 10));
        // Variable Width
        var variableWidthVar = Boolean(
          parseInt($ts.attr("data-variable-width"), 10),
        );
        // Pagination
        var paginaiton = $(this)
          .find(".cs_pagination")
          .hasClass("cs_pagination");
        // Slide Per View
        var slidesPerView = $ts.attr("data-slides-per-view");
        if (slidesPerView == 1) {
          slidesPerView = 1;
        }
        if (slidesPerView == "responsive") {
          var slidesPerView = parseInt($ts.attr("data-add-slides"), 10);
          var lgPoint = parseInt($ts.attr("data-lg-slides"), 10);
          var mdPoint = parseInt($ts.attr("data-md-slides"), 10);
          var smPoint = parseInt($ts.attr("data-sm-slides"), 10);
          var xsPoing = parseInt($ts.attr("data-xs-slides"), 10);
        }
        // Fade Slider
        var fadeVar = parseInt($($ts).attr("data-fade-slide"));
        fadeVar === 1 ? (fadeVar = true) : (fadeVar = false);

        /* Start Count Slide Number */
        $slickActive.on(
          "init reInit afterChange",
          function (event, slick, currentSlide, nextSlide) {
            var i = (currentSlide ? currentSlide : 0) + 1;
            $status.html(
              `<span class="cs_current_number">${i}</span> <span class="cs_slider_number_seperator"></span> <span class="cs_total_numbers">${slick.slideCount}</span>`,
            );
          },
        );
        /* End Count Slide Number */

        // Slick Active Code
        $slickActive.slick({
          autoplay: autoPlayVar,
          dots: paginaiton,
          centerPadding: "28%",
          speed: speedVar,
          infinite: loopVar,
          autoplaySpeed: autoplaySpdVar,
          centerMode: centerVar,
          fade: fadeVar,
          prevArrow: $(this).find(".cs_left_arrow"),
          nextArrow: $(this).find(".cs_right_arrow"),
          appendDots: $(this).find(".cs_pagination"),
          slidesToShow: slidesPerView,
          variableWidth: variableWidthVar,
          swipeToSlide: true,
          rtl: $("html").attr("dir") === "rtl",
          responsive: [
            {
              breakpoint: 1400,
              settings: {
                slidesToShow: lgPoint,
              },
            },
            {
              breakpoint: 1200,
              settings: {
                slidesToShow: mdPoint,
              },
            },
            {
              breakpoint: 992,
              settings: {
                slidesToShow: smPoint,
              },
            },
            {
              breakpoint: 768,
              settings: {
                slidesToShow: xsPoing,
              },
            },
          ],
        });
      });
    }
  }
  /*======================================================================
    06. Language Select
  ========================================================================*/
  function quantityInit() {
    // Language Update Functionality
    $(".cs_language_switcher").on("click", function () {
      $(".cs_language_dropdown").slideToggle(250);
    });

    // Handle flag click
    $(".cs_language_dropdown button").on("click", function () {
      const selectedLang = $(this).data("lang");
      const selectedFlagClass = $(this).children(".flag-btn").attr("class");
      // Replace the selected flag in switcher
      $(".cs_language_switcher").html(
        '<span class="' +
          selectedFlagClass +
          '" data-lang="' +
          selectedLang +
          '"></span>',
      );
      // Hide dropdown
      $(".cs_language_dropdown").hide();
    });

    // Close dropdown on outside click
    $(document).on("click", function (e) {
      if (!$(e.target).closest(".cs_language_select").length) {
        $(".cs_language_dropdown").slideUp(250);
      }
    });
  }
  /*======================================================================
    07. Search Modal Toggle
  ========================================================================*/
  function modalToggle() {
    $(".cs_open_modal").on("click", function () {
      $(".cs_advanced_search_modal").addClass("active");
      $("body").addClass("scroll_off");
    });
    $(".cs_close_modal").on("click", function () {
      $(".cs_advanced_search_modal").removeClass("active");
      $("body").removeClass("scroll_off");
    });
  }
  /*======================================================================
    08. Smooth Page Scroll
  ========================================================================*/
  function smoothScroll() {
    const lenis = new Lenis({
      duration: 1.5,
      smooth: true,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
  }
  /*=====================================================================
    09. Counter Animation
  =======================================================================*/
  function counterInit() {
    if ($.exists(".odometer")) {
      $(window).on("scroll", function () {
        function winScrollPosition() {
          var scrollPos = $(window).scrollTop(),
            winHeight = $(window).height();
          var scrollPosition = Math.round(scrollPos + winHeight / 1.2);
          return scrollPosition;
        }

        $(".odometer").each(function () {
          var elemOffset = $(this).offset().top;
          if (elemOffset < winScrollPosition()) {
            $(this).html($(this).data("count-to"));
          }
        });
      });
    }
  }
  /*=====================================================================
    10. Modal Video
  =======================================================================*/
  function modalVideo() {
    if ($.exists(".cs_video_open")) {
      $("body").append(`
        <div class="cs_video_popup">
          <div class="cs_video_popup-overlay"></div>
          <div class="cs_video_popup-content">
            <div class="cs_video_popup-layer"></div>
            <div class="cs_video_popup_container">
              <div class="cs_video_popup-align">
                <div class="embed-responsive embed-responsive-16by9">
                  <iframe class="embed-responsive-item" src="about:blank"></iframe>
                </div>
              </div>
              <div class="cs_video_popup_close"></div>
            </div>
          </div>
        </div>
      `);
      $(document).on("click", ".cs_video_open", function (e) {
        e.preventDefault();
        var video = $(this).attr("href");

        $(".cs_video_popup_container iframe").attr("src", `${video}`);

        $(".cs_video_popup").addClass("active");
      });
      $(".cs_video_popup_close, .cs_video_popup-layer").on(
        "click",
        function (e) {
          $(".cs_video_popup").removeClass("active");
          $("html").removeClass("overflow-hidden");
          $(".cs_video_popup_container iframe").attr("src", "about:blank");
          e.preventDefault();
        },
      );
    }
  }
  /*=====================================================================
    11. Review
  =======================================================================*/
  function review() {
    $(".cs_rating").each(function () {
      var review = $(this).data("rating");
      var reviewVal = review * 20 + "%";
      $(this).find(".cs_rating_percentage").css("width", reviewVal);
    });
  }
  /*====================================================================
    12. Tabs
  =====================================================================*/
  function tabs() {
    $(".cs_tab_links a").on("click", function (e) {
      var currentAttrValue = $(this).attr("href");
      //Tab and slider both activation code
      $(".cs_tabs " + currentAttrValue)
        .addClass("active")
        .siblings()
        .removeClass("active");
      $(this).parents("li").addClass("active").siblings().removeClass("active");
      e.preventDefault();
    });
  }
  /*====================================================================
    13. Accordian
  ======================================================================*/
  function accordian() {
    $(".cs_accordian").children(".cs_accordian_body").hide();
    $(".cs_accordian.active").children(".cs_accordian_body").show();
    $(".cs_accordian_head").on("click", function () {
      $(this)
        .parent(".cs_accordian")
        .siblings()
        .children(".cs_accordian_body")
        .slideUp(250);
      $(this).siblings().slideDown(250);
      $(this)
        .parent()
        .parent()
        .siblings()
        .find(".cs_accordian_body")
        .slideUp(250);
      /* Accordian Active Class */
      $(this).parents(".cs_accordian").addClass("active");
      $(this).parent(".cs_accordian").siblings().removeClass("active");
    });
  }
  /*=====================================================================
    14. heart toggle
  =======================================================================*/
  function elementToggle() {
    $(".cs_heart_toggler i").on("click", function () {
      $(this).toggleClass("fa-solid");
    });
    // Category Widget Toggle
    $(".cs_sidebar_widget_title").on("click", function () {
      $(this)
        .toggleClass("active")
        .siblings(".cs_sidebar_widget_content")
        .slideToggle()
        .parent(".cs_sidebar_widget")
        .toggleClass("active");
    });
    $(".cs_dashboard_nav li").on("click", function () {
      $(this).addClass("active").removeClass("active");
    });
  }
  /*=====================================================================
    15.Date And Time Picker
  =======================================================================*/
  function dateTimePicker() {
    flatpickr("#timePicker", {
      enableTime: true,
      allowInput: true,
      noCalendar: true,
      dateFormat: "G:i: K", // Only time in 24-hour format
    });
    flatpickr("#datePicker", {
      enableTime: false,
      allowInput: true,
      dateFormat: "d-F-Y", // 12-hour with AM/PM
    });
  }
  /*=====================================================================
    16.Apartment Finding Function
  =======================================================================*/
  function apartmentShow() {
    const apartmentShowBtn = $(".cs_apartment_btn");
    apartmentShowBtn.on("click", function () {
      $(this)
        .parent(".cs_apartment_item")
        .addClass("active")
        .siblings(".cs_apartment_item")
        .removeClass("active");
    });
  }
  /*===================================================================
    17. Pricing value Toggle
   ===================================================================*/
  function pricingToggle() {
    let currentAttrValue = "monthly";
    $(".cs_pricing_control a").on("click", function (e) {
      $(this).parents("li").addClass("active").siblings().removeClass("active");
      e.preventDefault();
      currentAttrValue = $(this).attr("href");
      if (currentAttrValue !== "yearly") {
        $(".yearlyPrice,.yearlyText").hide();
        $(".monthlyPrice,.monthlyText").show();
      } else {
        $(".yearlyPrice,.yearlyText").show();
        $(".monthlyPrice,.monthlyText").hide();
      }
    });
  }
  /*=================================================================
   18. Light Gallery
 ====================================================================*/
  function lightGallery() {
    $(".cs_gallery_list").each(function () {
      $(this).lightGallery({
        selector: ".cs_gallery_item",
        subHtmlSelectorRelative: false,
        thumbnail: false,
        mousewheel: true,
      });
    });
  }
  /*=================================================================
   19. Load More Portfolio Items
  ===================================================================*/
  function loadMore() {
    $(".cs_property_item").slice(0, 6).show();
    $("#loadMoreProperty").on("click", function (e) {
      e.preventDefault();
      $(".cs_property_item:hidden").slice(0, 3).slideDown(250);
      if ($(".cs_property_item:hidden").length <= 1) {
        $("#loadMoreProperty span")
          .text("No More to show")
          .css("cursor", "not-allowed");
      }
    });
  }
  /*=================================================================
   20. Data Table
  ===================================================================*/
  function dataTable() {
    $("#clientsListTable").DataTable({
      responsive: true,
      language: {
        lengthMenu: "Show _MENU_ entries",
      },
    });
  }
  /*==================================================================
    21. Scroll Up
  ====================================================================*/
  function scrollUp() {
    $(".cs_scrollup_btn").on("click", function (e) {
      e.preventDefault();
      $("html,body").animate(
        {
          scrollTop: 0,
        },
        0,
      );
    });
  }
  /* For Scroll Up */
  function showScrollUp() {
    let scroll = $(window).scrollTop();
    if (scroll >= 350) {
      $(".cs_scrollup_btn").addClass("show");
    } else {
      $(".cs_scrollup_btn").removeClass("show");
    }
  }
  /*=====================================================================
    22. Dynamic contact form
  =======================================================================*/
  if ($.exists("#cs_form")) {
    const form = document.getElementById("cs_form");
    const result = document.getElementById("cs_result");

    form.addEventListener("submit", function (e) {
      const formData = new FormData(form);
      e.preventDefault();
      var object = {};
      formData.forEach((value, key) => {
        object[key] = value;
      });
      var json = JSON.stringify(object);
      result.innerHTML = "Please wait...";

      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: json,
      })
        .then(async (response) => {
          let json = await response.json();
          if (response.status == 200) {
            result.innerHTML = json.message;
          } else {
            console.log(response);
            result.innerHTML = json.message;
          }
        })
        .catch((error) => {
          console.log(error);
          result.innerHTML = "Something went wrong!";
        })
        .then(function () {
          form.reset();
          setTimeout(() => {
            result.style.display = "none";
          }, 5000);
        });
    });
  }
  /*============================================================
    23. AOS Animation
  ==============================================================*/
  function aosInit() {
    AOS.init({
      offset: 120,
      duration: 800,
      easing: "ease",
      once: true,
      mirror: false,
    });
  }
  /*============================================================
    24. Saved Preferences
    Storage can be blocked (file://, private mode), so every
    read / write is wrapped. Mode "system" follows the device.
  ==============================================================*/
  function readPref(key) {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      return null;
    }
  }

  function savePref(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (e) {}
  }

  function savedThemeMode() {
    var saved = readPref(PREF_KEYS.theme);
    return THEME_MODES.indexOf(saved) > -1 ? saved : "system";
  }

  function applySavedPreferences() {
    applyThemeMode();
    if (readPref(PREF_KEYS.sidebar) === "collapsed") {
      document.documentElement.classList.add("cs_sidebar_collapsed");
    }
  }

  function applyThemeMode() {
    var html = document.documentElement;
    var isDark = themeMode === "dark" || (themeMode === "system" && darkQuery.matches);

    html.classList.toggle("cs_dark", isDark);
    // Picks the topbar button icon in CSS
    html.setAttribute("data-color-mode", themeMode);
    $(".cs_theme_switch").attr("aria-label", "Color mode: " + THEME_LABELS[themeMode]);
    $(".cs_mode_switch button").each(function () {
      var isActive = $(this).data("mode") === themeMode;
      $(this).toggleClass("active", isActive).attr("aria-pressed", String(isActive));
    });
  }

  function setThemeMode(mode) {
    themeMode = mode;
    savePref(PREF_KEYS.theme, mode);
    applyThemeMode();
  }

  /*============================================================
    25. Color Mode Switch
    Device / Light / Dark buttons sit under LTR / RTL in the
    gear settings panel (template pages only).
    Dashboard pages use the topbar button, which cycles
    through the same three modes.
  ==============================================================*/
  function colorModeSwitch() {
    var $group = $('<div class="cs_mode_switch" role="group" aria-label="Color mode"></div>');

    [
      { mode: "system", icon: "fa-solid fa-desktop", label: "Device mode" },
      { mode: "light", icon: "fa-solid fa-sun", label: "Light mode" },
      { mode: "dark", icon: "fa-solid fa-moon", label: "Dark mode" },
    ].forEach(function (option) {
      $('<button type="button"></button>')
        .attr({ "data-mode": option.mode, "aria-label": option.label, title: option.label })
        .append($('<i aria-hidden="true"></i>').addClass(option.icon))
        .appendTo($group);
    });

    // Panel comes from settingsSwitch(). Dashboard pages use the topbar button instead
    if (!$("body").hasClass("cs_dashboard")) $(".cs_settings_panel").append($group);

    $group.on("click", "button", function () {
      setThemeMode($(this).data("mode"));
    });

    // Dashboard topbar button: Device -> Light -> Dark -> Device
    $(".cs_theme_switch").on("click", function () {
      setThemeMode(THEME_MODES[(THEME_MODES.indexOf(themeMode) + 1) % THEME_MODES.length]);
    });

    // Follow the device when it switches theme while in Device mode
    var onDeviceChange = function () {
      if (themeMode === "system") applyThemeMode();
    };
    if (darkQuery.addEventListener) darkQuery.addEventListener("change", onDeviceChange);
    else darkQuery.addListener(onDeviceChange);

    applyThemeMode();
  }
  /*============================================================
    26. Layout Direction
    Order: ?dir= in the URL, then the saved choice, then the
    dir attribute in the markup. Swaps Bootstrap for its RTL
    build and loads the Arabic font when needed.
  ==============================================================*/
  function isDir(value) {
    return value === "rtl" || value === "ltr";
  }

  // Returns true only when the value can be read back
  function saveDir(dir) {
    try {
      localStorage.setItem(PREF_KEYS.dir, dir);
      return localStorage.getItem(PREF_KEYS.dir) === dir;
    } catch (e) {
      return false;
    }
  }

  // Checks storage works without saving a direction the user never picked
  function canStore() {
    try {
      localStorage.setItem(PREF_KEYS.dir + "-test", "1");
      localStorage.removeItem(PREF_KEYS.dir + "-test");
      return true;
    } catch (e) {
      return false;
    }
  }

  function applyDir(dir) {
    document.documentElement.setAttribute("dir", dir);

    var bootstrap = document.querySelector(
      'link[href*="bootstrap"][href$=".css"]',
    );
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

  function layoutDirection() {
    var param = new URLSearchParams(window.location.search).get("dir");
    var stored;
    if (isDir(param)) {
      layoutDir = param;
      stored = saveDir(layoutDir);
    } else {
      var saved = readPref(PREF_KEYS.dir);
      var markup = document.documentElement.getAttribute("dir");
      if (!isDir(saved)) saved = null;
      layoutDir = saved || (isDir(markup) ? markup : "ltr");
      stored = saved ? true : canStore();
    }
    applyDir(layoutDir);

    // No storage: keep RTL by adding ?dir=rtl to internal page links
    if (!stored && layoutDir === "rtl") {
      document.addEventListener(
        "click",
        function (e) {
          var link = e.target.closest && e.target.closest("a[href]");
          if (!link || link.target === "_blank") return;
          var href = link.getAttribute("href");
          if (!href || /^(#|mailto:|tel:|javascript:)/i.test(href)) return;
          var url = new URL(href, window.location.href);
          if (
            url.origin !== window.location.origin ||
            !/(\.html|\/)$/i.test(url.pathname)
          )
            return;
          url.searchParams.set("dir", "rtl");
          link.setAttribute("href", url.toString());
        },
        true,
      );
    }
  }

  /*============================================================
    27. Settings Switch
    A gear button opens a panel with LTR / RTL (colorModeSwitch()
    adds the Device / Light / Dark row to the same panel).
  ==============================================================*/
  function settingsSwitch() {
    var wrap = document.createElement("div");
    wrap.className = "cs_dir_switch cs_primary_font cs_semibold";

    var panel = document.createElement("div");
    panel.className = "cs_settings_panel";
    panel.id = "csSettingsPanel";
    // Dashboard pages: no gear, LTR / RTL always visible (color mode is in the topbar)
    var isDashboard = document.body.classList.contains("cs_dashboard");
    panel.hidden = !isDashboard;

    var toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "cs_settings_toggle";
    toggle.setAttribute("aria-label", "Layout and color settings");
    toggle.setAttribute("aria-controls", panel.id);
    toggle.setAttribute("aria-expanded", "false");
    toggle.innerHTML = '<i class="fa-solid fa-gear" aria-hidden="true"></i>';

    function setOpen(open) {
      if (isDashboard) return;
      wrap.classList.toggle("cs_switch_open", open);
      panel.hidden = !open;
      toggle.hidden = open; // the box replaces the gear while open
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    }

    toggle.addEventListener("click", function () {
      setOpen(true);
      // The gear is now hidden, so move focus into the box
      var first = panel.querySelector("button");
      if (first) first.focus();
    });
    document.addEventListener("click", function (e) {
      if (!panel.hidden && !wrap.contains(e.target)) setOpen(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !panel.hidden) {
        setOpen(false);
        toggle.focus();
      }
    });

    // LTR button sets LTR mode, RTL button sets RTL mode
    var group = document.createElement("div");
    group.className = "cs_dir_group";
    group.setAttribute("role", "group");
    group.setAttribute("aria-label", "Layout direction");

    [
      { dir: "ltr", label: "LTR", title: "Left to right layout" },
      { dir: "rtl", label: "RTL", title: "Right to left layout" },
    ].forEach(function (option) {
      var btn = document.createElement("button");
      var isActive = option.dir === layoutDir;
      btn.type = "button";
      btn.textContent = option.label;
      btn.setAttribute("aria-label", option.title);
      btn.setAttribute("aria-pressed", isActive ? "true" : "false");
      if (isActive) btn.className = "active";
      btn.addEventListener("click", function () {
        if (option.dir === layoutDir) return;
        var url = new URL(window.location.href);
        // Saved: drop ?dir= so the saved choice wins. Not saved: carry it in the URL
        if (saveDir(option.dir)) url.searchParams.delete("dir");
        else url.searchParams.set("dir", option.dir);
        window.location.replace(url.toString());
      });
      group.appendChild(btn);
    });

    panel.appendChild(group);
    wrap.appendChild(panel);
    if (!isDashboard) wrap.appendChild(toggle);
    document.body.appendChild(wrap);
  }
  /*====================================================================
    28. Sidebar
    The saved mini state is put on <html> by applySavedPreferences().
  ======================================================================*/
  function dashboardSidebar() {
    var $toggle = $(".cs_sidebar_toggle");
    $toggle.attr("aria-expanded", String(!$html.hasClass("cs_sidebar_collapsed")));

    $toggle.on("click", function () {
      if (DESKTOP.matches) {
        $html.toggleClass("cs_sidebar_collapsed");
        var collapsed = $html.hasClass("cs_sidebar_collapsed");
        savePref(PREF_KEYS.sidebar, collapsed ? "collapsed" : "expanded");
        $toggle.attr("aria-expanded", String(!collapsed));
      } else {
        openOffcanvas();
      }
    });

    $(".cs_sidebar_close, .cs_sidebar_overlay").on("click", closeOffcanvas);

    $(document).on("keydown", function (e) {
      if (e.key === "Escape") {
        closeOffcanvas();
        closeDropdowns();
      }
    });

    // Going back to desktop: drop the offcanvas state
    DESKTOP.addEventListener("change", function (e) {
      if (e.matches) closeOffcanvas();
    });
  }

  function openOffcanvas() {
    $body.addClass("cs_sidebar_open scroll_off");
    $(".cs_sidebar_close").trigger("focus");
  }

  function closeOffcanvas() {
    if (!$body.hasClass("cs_sidebar_open")) return;
    $body.removeClass("cs_sidebar_open scroll_off");
  }

  /*====================================================================
    29. Sidebar Submenus
  ======================================================================*/
  function submenus() {
    // Open the parent of the current page on load
    $(".cs_submenu a.active").closest(".cs_has_submenu").addClass("cs_open cs_has_active");
    $(".cs_has_submenu.cs_open > .cs_menu_link").attr("aria-expanded", "true");

    $(".cs_has_submenu > .cs_menu_link").on("click", function (e) {
      e.preventDefault();
      var $item = $(this).parent();
      $item.siblings(".cs_open").each(function () {
        toggleSubmenu($(this), false);
      });
      toggleSubmenu($item, !$item.hasClass("cs_open"));
    });
  }

  // CSS can't transition to height: auto, so animate between 0 and the
  // measured height, then hand control back to the stylesheet
  function toggleSubmenu($item, open) {
    var menu = $item.children(".cs_submenu")[0];
    $item.children(".cs_menu_link").attr("aria-expanded", String(open));
    // No animation when hidden (mini sidebar) or when the user prefers less motion
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!menu || !menu.getClientRects().length || reduce) {
      $item.toggleClass("cs_open", open);
      if (menu) menu.style.height = "";
      return;
    }
    menu.style.height = (open ? 0 : menu.scrollHeight) + "px";
    menu.offsetHeight; // commit the start height before changing it
    $item.toggleClass("cs_open", open);
    menu.style.height = (open ? menu.scrollHeight : 0) + "px";
    $(menu)
      .off("transitionend.cs_submenu")
      .on("transitionend.cs_submenu", function (e) {
        if (e.target === menu && e.originalEvent.propertyName === "height") {
          menu.style.height = "";
          $(menu).off("transitionend.cs_submenu");
        }
      });
  }

  /*====================================================================
    30. Topbar Dropdowns (notifications, profile)
  ======================================================================*/
  function dropdowns() {
    $(".cs_dropdown_toggle").on("click", function (e) {
      e.stopPropagation();
      var $dropdown = $(this).closest(".cs_topbar_dropdown");
      var isOpen = $dropdown.hasClass("cs_active");
      closeDropdowns();
      if (!isOpen) {
        $dropdown.addClass("cs_active");
        $(this).attr("aria-expanded", "true");
      }
    });

    $(".cs_dropdown_panel").on("click", function (e) {
      e.stopPropagation();
    });

    // Table row action menu (3 dots)
    $(".cs_action_menu_toggle").on("click", function (e) {
      e.stopPropagation();
      var $menu = $(this).closest(".cs_action_menu");
      var isOpen = $menu.hasClass("cs_active");
      closeDropdowns();
      if (!isOpen) {
        $menu.addClass("cs_active");
        $(this).attr("aria-expanded", "true");
      }
    });

    $(document).on("click", closeDropdowns);
    $(document).on("keydown", function (e) {
      if (e.key === "Escape") closeDropdowns();
    });
  }

  // Dashboard modals (<dialog>). The opener's data-review-* values fill [data-review-field] slots
  function dashboardModals() {
    $("[data-modal-open]").on("click", function () {
      var modal = document.getElementById($(this).data("modal-open"));
      if (!modal || typeof modal.showModal !== "function") return;
      var $opener = $(this);
      $(modal).find("[data-review-field]").each(function () {
        var value = $opener.data("review-" + $(this).data("review-field"));
        if (value === undefined) return;
        if (this.tagName === "IMG") this.src = value;
        else $(this).text(value);
      });
      $(modal).find("form").trigger("reset");
      modal.showModal();
    });

    $(".cs_dash_modal").on("click", "[data-modal-close]", function () {
      this.closest("dialog").close();
    });

    // Click on the backdrop closes it
    $(".cs_dash_modal").on("click", function (e) {
      if (e.target === this) this.close();
    });
  }

  function closeDropdowns() {
    $(".cs_topbar_dropdown.cs_active").removeClass("cs_active").find(".cs_dropdown_toggle").attr("aria-expanded", "false");
    $(".cs_action_menu.cs_active").removeClass("cs_active").find(".cs_action_menu_toggle").attr("aria-expanded", "false");
  }

  /*====================================================================
    31. Mobile Search
  ======================================================================*/
  function mobileSearch() {
    $(".cs_search_toggle").on("click", function () {
      var $topbar = $(".cs_dashboard_topbar").toggleClass("cs_search_open");
      $(this).attr("aria-expanded", String($topbar.hasClass("cs_search_open")));
      if ($topbar.hasClass("cs_search_open")) $topbar.find(".cs_topbar_search input").trigger("focus");
    });
  }

  /*====================================================================
    32. Stat Counters (odometer runs as soon as the page loads)
  ======================================================================*/
  function statCounters() {
    $(window).on("load", function () {
      $(".cs_stat_card .odometer").each(function () {
        $(this).html($(this).data("count-to"));
      });
    });
  }

  /*====================================================================
    33. Analytics Charts
    Markup: <div class="cs_chart_wrap" data-chart="views"></div> inside a
    .cs_dashboard_card that also holds the period buttons and the
    screen-reader table (.cs_chart_table).
    One unit, one axis: this period vs. the previous period.
    Drawn as plain SVG (no chart library); colors come from the
    theme's CSS variables, so dark mode needs no repaint.
    Replace CHART_DATA with data from your API.
  ======================================================================*/
  var CHART_DATA = {
    // Agent: views across all listings
    views: {
      prefix: "",
      "7d": {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        current: [420, 532, 488, 610, 702, 890, 816],
        previous: [380, 410, 455, 470, 520, 640, 600],
      },
      "30d": {
        labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"],
        current: [2840, 3120, 3560, 3310, 3980],
        previous: [2410, 2690, 2830, 3010, 2950],
      },
      "12m": {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        current: [9800, 10400, 12100, 11800, 13600, 14900, 15200, 16800, 15900, 17400, 18200, 19600],
        previous: [8200, 8900, 9700, 10100, 10800, 11600, 12000, 12900, 13100, 13800, 14500, 15200],
      },
    },
    // Property Owner: views across the owner's properties
    ownerViews: {
      prefix: "",
      "7d": {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        current: [96, 120, 108, 134, 152, 188, 171],
        previous: [82, 94, 101, 99, 118, 140, 132],
      },
      "30d": {
        labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"],
        current: [640, 712, 805, 760, 890],
        previous: [560, 598, 642, 690, 671],
      },
      "12m": {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        current: [3100, 3280, 3610, 3540, 3920, 4210, 4380, 4760, 4590, 5020, 5310, 6420],
        previous: [2600, 2790, 2950, 3080, 3190, 3370, 3460, 3690, 3720, 3910, 4080, 4300],
      },
    },
    // Site Admin: revenue from packages & subscriptions
    revenue: {
      prefix: "$",
      "7d": {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        current: [1240, 1580, 1420, 1890, 2140, 1760, 1630],
        previous: [1100, 1320, 1290, 1510, 1700, 1490, 1380],
      },
      "30d": {
        labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"],
        current: [9200, 10450, 11800, 10900, 12600],
        previous: [8100, 8900, 9400, 9900, 9650],
      },
      "12m": {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        current: [28400, 30100, 33600, 32800, 36200, 38900, 40100, 42800, 41500, 44900, 46200, 48560],
        previous: [22100, 23900, 25400, 26800, 27900, 29600, 30800, 32100, 32900, 34600, 35800, 37200],
      },
    },
  };

  var SVG_NS = "http://www.w3.org/2000/svg";
  var CHART = { height: 330, top: 12, bottom: 34, gap: 14, ticks: 4 };
  var chartCount = 0;

  function svgEl(tag, attrs, parent) {
    var el = document.createElementNS(SVG_NS, tag);
    for (var key in attrs) el.setAttribute(key, attrs[key]);
    if (parent) parent.appendChild(el);
    return el;
  }

  // Round y-axis steps (1, 2, 2.5 or 5 x 10^n) from 0 up past max
  function niceTicks(max, count) {
    var raw = max / count || 1;
    var mag = Math.pow(10, Math.floor(Math.log(raw) / Math.LN10));
    var steps = [1, 2, 2.5, 5, 10];
    var step = mag * 10;
    for (var i = 0; i < steps.length; i++) {
      if (steps[i] * mag >= raw) {
        step = steps[i] * mag;
        break;
      }
    }
    var ticks = [];
    for (var v = 0; v < max + step; v += step) ticks.push(v);
    return ticks;
  }

  // Smooth curve that never overshoots the data (monotone cubic)
  function smoothPath(pts) {
    var n = pts.length;
    var dx = [];
    var slope = [];
    var tangent = [];
    var i;
    for (i = 0; i < n - 1; i++) {
      dx[i] = pts[i + 1].x - pts[i].x;
      slope[i] = (pts[i + 1].y - pts[i].y) / dx[i];
    }
    tangent[0] = slope[0] || 0;
    tangent[n - 1] = slope[n - 2] || 0;
    for (i = 1; i < n - 1; i++) {
      tangent[i] =
        slope[i - 1] * slope[i] <= 0
          ? 0
          : (3 * (dx[i - 1] + dx[i])) /
            ((2 * dx[i] + dx[i - 1]) / slope[i - 1] + (dx[i] + 2 * dx[i - 1]) / slope[i]);
    }
    var round = function (v) {
      return Math.round(v * 10) / 10;
    };
    var d = "M" + round(pts[0].x) + "," + round(pts[0].y);
    for (i = 0; i < n - 1; i++) {
      var h = dx[i] / 3;
      d +=
        "C" + round(pts[i].x + h) + "," + round(pts[i].y + h * tangent[i]) +
        " " + round(pts[i + 1].x - h) + "," + round(pts[i + 1].y - h * tangent[i + 1]) +
        " " + round(pts[i + 1].x) + "," + round(pts[i + 1].y);
    }
    return d;
  }

  function analyticsCharts() {
    $("[data-chart]").each(function () {
      var dataset = CHART_DATA[$(this).data("chart")];
      if (dataset) renderChart(this, dataset);
    });
  }

  function renderChart(el, dataset) {
    var $card = $(el).closest(".cs_dashboard_card");
    var $periods = $card.find(".cs_chart_period button");
    var data = dataset[$periods.filter(".active").data("period") || "12m"];
    var formatter = function (val) {
      return dataset.prefix + Math.round(val).toLocaleString();
    };
    var fillId = "csChartFill" + ++chartCount;
    // The wrap carries role="img" + aria-label; the table holds the numbers
    var svg = svgEl("svg", { class: "cs_chart_svg", height: CHART.height, "aria-hidden": "true" }, el);
    var $tooltip = $("<div class='cs_chart_tooltip' aria-hidden='true'></div>").appendTo(el);
    var plot; // geometry of the last draw, used by the hover layer

    function draw() {
      var width = el.clientWidth;
      if (!width) return;
      svg.setAttribute("width", width);
      svg.setAttribute("viewBox", "0 0 " + width + " " + CHART.height);
      svg.textContent = "";

      var gradient = svgEl("linearGradient", { id: fillId, x1: 0, y1: 0, x2: 0, y2: 1 }, svgEl("defs", {}, svg));
      svgEl("stop", { class: "cs_chart_stop", offset: "0", "stop-opacity": 0.22 }, gradient);
      svgEl("stop", { class: "cs_chart_stop", offset: "0.95", "stop-opacity": 0 }, gradient);

      // Axis labels first: their widths set the plot edges
      var ticks = niceTicks(Math.max.apply(null, data.current.concat(data.previous)), CHART.ticks);
      var axis = svgEl("g", { class: "cs_chart_axis" }, svg);
      var yLabels = ticks.map(function (v) {
        var text = svgEl("text", { "text-anchor": "end", "dominant-baseline": "middle" }, axis);
        text.textContent = formatter(v);
        return text;
      });
      var xLabels = data.labels.map(function (label) {
        var text = svgEl("text", { "text-anchor": "middle", y: CHART.height - 8 }, axis);
        text.textContent = label;
        return text;
      });
      var widest = function (texts) {
        return Math.max.apply(null, texts.map(function (t) {
          return t.getBBox().width;
        }));
      };
      var xLabelWidth = widest(xLabels);
      var left = Math.ceil(widest(yLabels)) + CHART.gap;
      var right = width - Math.max(8, Math.ceil(xLabelWidth / 2));
      var bottom = CHART.height - CHART.bottom;
      var count = data.labels.length;
      var step = (right - left) / Math.max(count - 1, 1);
      var x = function (i) {
        return left + step * i;
      };
      var y = function (v) {
        return bottom - ((bottom - CHART.top) * v) / ticks[ticks.length - 1];
      };

      // Grid + y labels
      var grid = svgEl("g", {}, svg);
      svg.insertBefore(grid, axis);
      ticks.forEach(function (v, i) {
        var lineY = Math.round(y(v)) + 0.5;
        svgEl("line", { class: v === 0 ? "cs_chart_baseline" : "cs_chart_grid", x1: left, x2: right, y1: lineY, y2: lineY }, grid);
        yLabels[i].setAttribute("x", left - CHART.gap);
        yLabels[i].setAttribute("y", lineY);
      });

      // X labels: skip some when they would collide
      var every = Math.max(1, Math.ceil((xLabelWidth + 12) / step));
      xLabels.forEach(function (text, i) {
        text.setAttribute("x", x(i));
        if (i % every) text.remove();
      });

      // Series: previous (dashed line) behind, this period (area + line) on top
      var toPoints = function (values) {
        return values.map(function (v, i) {
          return { x: x(i), y: y(v) };
        });
      };
      var current = toPoints(data.current);
      var previous = toPoints(data.previous);
      var currentPath = smoothPath(current);
      svgEl("path", { class: "cs_chart_line cs_chart_line_prev", d: smoothPath(previous) }, svg);
      svgEl("path", { fill: "url(#" + fillId + ")", d: currentPath + "L" + right + "," + bottom + "L" + left + "," + bottom + "Z" }, svg);
      svgEl("path", { class: "cs_chart_line", d: currentPath }, svg);

      // Hover layer: crosshair + one marker per series
      var hover = svgEl("g", { class: "cs_chart_hover" }, svg);
      var crosshair = svgEl("line", { class: "cs_chart_crosshair", y1: CHART.top, y2: bottom }, hover);
      var prevMarker = svgEl("circle", { class: "cs_chart_marker cs_chart_marker_prev", r: 5 }, hover);
      var marker = svgEl("circle", { class: "cs_chart_marker", r: 6 }, hover);

      plot = { left: left, step: step, count: count, width: width, crosshair: crosshair, marker: marker, prevMarker: prevMarker, current: current, previous: previous };
    }

    function showPoint(i) {
      var px = plot.current[i].x;
      plot.crosshair.setAttribute("x1", px);
      plot.crosshair.setAttribute("x2", px);
      plot.marker.setAttribute("cx", px);
      plot.marker.setAttribute("cy", plot.current[i].y);
      plot.prevMarker.setAttribute("cx", px);
      plot.prevMarker.setAttribute("cy", plot.previous[i].y);

      var row = function (name, value, markClass) {
        return $("<div class='cs_chart_tooltip_row'></div>").append(
          $("<span></span>").addClass("cs_legend_mark " + markClass),
          $("<span></span>").text(name),
          $("<strong></strong>").text(formatter(value)),
        );
      };
      $tooltip.empty().append(
        $("<div class='cs_chart_tooltip_title'></div>").text(data.labels[i]),
        row("This period", data.current[i], ""),
        row("Previous period", data.previous[i], "cs_legend_dashed"),
      );

      // Beside the crosshair, flipped to the other side near the edge
      var tipWidth = $tooltip.outerWidth();
      var tipLeft = px + 14;
      if (tipLeft + tipWidth > plot.width) tipLeft = Math.max(0, px - 14 - tipWidth);
      $tooltip.css({ left: tipLeft, top: CHART.top });
      $(el).addClass("cs_chart_active");
    }

    function hidePoint() {
      $(el).removeClass("cs_chart_active");
    }

    $(svg).on("pointermove pointerdown", function (e) {
      if (!plot) return;
      var px = e.clientX - svg.getBoundingClientRect().left;
      var i = Math.round((px - plot.left) / plot.step);
      showPoint(Math.min(plot.count - 1, Math.max(0, i)));
    });
    $(svg).on("pointerleave", hidePoint);

    draw();
    renderChartTable($card, data, formatter);

    // Redraw when the card changes width (window resize, sidebar collapse)
    if ("ResizeObserver" in window) {
      var lastWidth = el.clientWidth;
      new ResizeObserver(function () {
        if (el.clientWidth === lastWidth) return;
        lastWidth = el.clientWidth;
        hidePoint();
        draw();
      }).observe(el);
    } else {
      $(window).on("resize", draw);
    }

    // Period filter
    $periods.on("click", function () {
      data = dataset[$(this).data("period")];
      $(this).addClass("active").attr("aria-pressed", "true").siblings().removeClass("active").attr("aria-pressed", "false");
      hidePoint();
      draw();
      renderChartTable($card, data, formatter);
    });
  }

  // Screen-reader table with the same numbers as the chart
  function renderChartTable($card, data, formatter) {
    var rows = data.labels.map(function (label, i) {
      return "<tr><th scope='row'>" + label + "</th><td>" + formatter(data.current[i]) + "</td><td>" + formatter(data.previous[i]) + "</td></tr>";
    });
    $card.find(".cs_chart_table tbody").html(rows.join(""));
  }

  /*====================================================================
    34. Filter Tabs
    <ul class="cs_filter_tabs" data-target="#listingTable">
      <li><button data-filter="all">..</button></li>
      <li><button data-filter="active">..</button></li>
    Rows in the target carry data-status="active|pending|...".
    The filter is kept in the URL hash (#active), so sidebar submenu
    links such as my-listings.html#pending open the right tab.
  ======================================================================*/
  function filterTabs() {
    $(".cs_filter_tabs").each(function () {
      var $tabs = $(this);
      var $buttons = $tabs.find("[data-filter]");
      var $target = $($tabs.data("target"));
      var $items = $target.find("[data-status]");
      var $empty = $target.find(".cs_empty_row");

      function activate(filter) {
        if (!$buttons.filter('[data-filter="' + filter + '"]').length) filter = $buttons.first().data("filter");
        $buttons.removeClass("active").attr("aria-pressed", "false");
        $buttons.filter('[data-filter="' + filter + '"]').addClass("active").attr("aria-pressed", "true");

        var shown = 0;
        $items.each(function () {
          var match = filter === "all" || $(this).data("status") === filter;
          $(this).toggle(match);
          if (match) shown++;
        });
        $empty.toggle(shown === 0);

        // Highlight the matching sidebar submenu link on this page
        $(".cs_submenu a")
          .removeClass("active")
          .filter(function () {
            return this.pathname === window.location.pathname && this.hash === "#" + filter;
          })
          .addClass("active");
      }

      $buttons.on("click", function () {
        var filter = $(this).data("filter");
        history.replaceState(null, "", "#" + filter);
        activate(filter);
      });

      $(window).on("hashchange", function () {
        activate(window.location.hash.slice(1));
      });

      activate(window.location.hash.slice(1));
    });
  }

  /*====================================================================
    35. Messages (chat)
    Demo behaviour: pick a conversation, send a message.
    Hook the form submit up to your backend / websocket.
  ======================================================================*/
  function chat() {
    var $chat = $(".cs_chat");
    if (!$chat.length) return;
    var $thread = $chat.find(".cs_chat_thread");

    function toBottom() {
      $thread.scrollTop($thread[0].scrollHeight);
    }
    toBottom();

    $chat.on("click", ".cs_chat_item", function () {
      var $item = $(this);
      $chat.find(".cs_chat_item").removeClass("active").removeAttr("aria-current");
      $item.addClass("active").attr("aria-current", "true").find(".cs_menu_badge").remove();
      $chat.find(".cs_chat_head img").attr("src", $item.find("img").attr("src"));
      $chat.find(".cs_chat_head_name").text($item.find(".cs_chat_item_name").text());
      $chat.addClass("cs_chat_open");
      toBottom();
    });

    $chat.find(".cs_chat_back").on("click", function () {
      $chat.removeClass("cs_chat_open");
    });

    $chat.find(".cs_chat_form").on("submit", function (e) {
      e.preventDefault();
      var $input = $(this).find("input[type='text']");
      var text = String($input.val()).trim();
      if (!text) return;
      var time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      $("<div class='cs_chat_bubble cs_out'></div>").text(text).append($("<time></time>").text(time)).appendTo($thread);
      $input.val("");
      toBottom();
    });
  }

  /*====================================================================
    36. File Upload Previews (gallery drop zone + avatar)
  ======================================================================*/
  function uploads() {
    $(".cs_upload_box input[type='file']").on("change", function () {
      var $previews = $(this).closest(".cs_upload_wrap").find(".cs_upload_previews");
      Array.prototype.forEach.call(this.files, function (file) {
        if (!/^image\//.test(file.type)) return;
        var $img = $("<img alt=''>").attr("src", URL.createObjectURL(file));
        var $remove = $("<button type='button' aria-label='Remove image'><i class='fa-solid fa-xmark'></i></button>");
        $("<div></div>").append($img, $remove).appendTo($previews);
      });
      $(this).closest(".cs_upload_box").removeClass("cs_dragover");
    });

    $(".cs_upload_box")
      .on("dragenter dragover", function () {
        $(this).addClass("cs_dragover");
      })
      .on("dragleave drop", function () {
        $(this).removeClass("cs_dragover");
      });

    $(document).on("click", ".cs_upload_previews button", function () {
      $(this).parent().remove();
    });

    $(".cs_profile_card_thumb input[type='file']").on("change", function () {
      var file = this.files[0];
      if (file && /^image\//.test(file.type)) {
        $(this).closest(".cs_profile_card_thumb").find("img").attr("src", URL.createObjectURL(file));
      }
    });
  }

  /*====================================================================
    37. Settings Section Nav (highlights the section in view)
  ======================================================================*/
  function settingsNav() {
    var $links = $(".cs_settings_nav a[href^='#']");
    if (!$links.length || !("IntersectionObserver" in window)) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          $links.removeClass("active").filter('[href="#' + entry.target.id + '"]').addClass("active");
        });
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );

    $links.each(function () {
      var section = document.getElementById(this.hash.slice(1));
      if (section) observer.observe(section);
    });
  }

  /*====================================================================
    38. Mortgage Calculator
    Monthly payment = loan repayment + (property tax + insurance) / 12.
    Loan = total - down payment, repaid monthly over the loan term.
    Accepts "$500,000" or "6.5%" style input.
  ======================================================================*/
  function mortgageCalculator() {
    var $form = $(".cs_mortgage_calculation_form");
    if (!$form.length) return;
    var $result = $form.find(".cs_mortgage_result");

    function value(name) {
      var raw = String($form.find("[name=\"" + name + "\"]").val()).replace(/[$,%\s]/g, "");
      return raw === "" ? 0 : Number(raw);
    }

    function money(amount) {
      return "$" + amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    $form.on("submit", function (e) {
      e.preventDefault();
      var total = value("total");
      var down = value("downpayment");
      var rate = value("interest") / 100 / 12;
      var months = value("loan") * 12;
      var extras = (value("partytax") + value("insurance")) / 12;
      var principal = total - down;

      var values = [total, down, value("interest"), months, extras];
      if (values.some(isNaN) || values.some(function (v) { return v < 0; })) {
        $result.text("Please enter numbers only");
        return;
      }
      if (!total || !months) {
        $result.text("Enter the total amount and loan term");
        return;
      }
      if (principal <= 0) {
        $result.text("Down payment must be less than the total");
        return;
      }

      var loanPayment = rate
        ? (principal * rate) / (1 - Math.pow(1 + rate, -months))
        : principal / months;
      $result.text("Monthly payment: " + money(loanPayment + extras));
    });
  }

  /*====================================================================
    39. Package Editor (add / remove features + live preview card)
  ======================================================================*/
  function packageEditor() {
    var $form = $("[data-package-form]");
    if (!$form.length) return;
    var $list = $form.find("[data-feature-list]");
    var $newInput = $form.find(".cs_feature_add input");
    var $preview = $("[data-package-preview]");
    // Row to copy for new features, kept even if every feature gets removed
    var $template = $list.children("li").first().clone();

    function renderPreview() {
      $preview.find("[data-preview-name]").text($form.find("[data-preview='name']").val());
      $preview.find("[data-preview-price]").text($form.find("[data-preview='price']").val() || 0);
      $preview.find("[data-preview-desc]").text($form.find("[data-preview='desc']").val());
      var $features = $preview.find(".cs_plan_features").empty();
      $list.children("li").each(function () {
        var text = $.trim($(this).find("input[type='text']").val());
        if (!text) return;
        var included = $(this).find("input[type='checkbox']").is(":checked");
        $("<li></li>")
          .toggleClass("cs_disabled", !included)
          .append($("<i></i>").addClass(included ? "fa-solid fa-check" : "fa-solid fa-xmark"), document.createTextNode(text))
          .appendTo($features);
      });
    }

    function addFeature() {
      var text = $.trim($newInput.val());
      if (!text) {
        $newInput.trigger("focus");
        return;
      }
      var $row = $template.clone();
      $row.find("input[type='text']").val(text);
      $row.find("input[type='checkbox']").prop("checked", true);
      $list.append($row);
      $newInput.val("").trigger("focus");
      renderPreview();
    }

    $form.find(".cs_feature_add button").on("click", addFeature);
    $newInput.on("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        addFeature();
      }
    });
    $list.on("click", ".cs_feature_remove", function () {
      $(this).closest("li").remove();
      renderPreview();
    });
    $form.on("input change", renderPreview);
  }
})(jQuery); // End of use strict
