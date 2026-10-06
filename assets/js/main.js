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
  | 40. Notifications Page
  |
  | Property search pages:
  | 41. Price Range Slider
  | 42. Property Listing (filter, sort, grid / list view, pagination)
  | 43. Property Map (Leaflet, half-map listing)
  | 44. Property Compare (card buttons, floating bar, compare page)
  | 45. Property Actions (share, print)
  | 46. Hero Search (home search forms -> filtered listing)
  | 47. Saved Properties (hearts + saved properties page)
  | 48. Form Validation (login, register, forgot password, newsletter)
  | 49. Countdown (coming soon)
  | 50. One-Time Code (verify email)
  | 51. Row Status Actions (dashboard tables)
  | 52. Table Search + CSV Export (dashboard tables)
  | 53. Tour Calendar (tour requests)
  | 54. Location Maps (contact, details, home sections)
  | 56. Property Forms (submit wizard, edit validation)
  | 57. Blog Filter (category, tag, search)
  | 58. Save Search + Saved Searches page
  | 59. Property Reviews (details form, dashboard reply / report / sort)
  | 60. Price History (details chart + table)
  | 61. Currency Switcher
  | 62. Table Overflow (dashboard tables wider than their card)
  | 63. File Inputs (show the chosen file names)
  | 64. Role Permissions (admin roles page)
  | 65. Ticket Replies (admin ticket details)
  | 66. Agency Directory (search, city filter, sort)
  |
  */

  /* Scripts initialization */
  $.exists = function (selector) {
    return $(selector).length > 0;
  };

  var PREF_KEYS = {
    theme: "xproperty-theme",
    sidebar: "xproperty-sidebar",
    dir: "xproperty-dir",
    lang: "xproperty-lang",
  };
  var RTL_LANG = /^(ar|he|fa|ur)\b/i;
  var THEME_MODES = ["system", "light", "dark"];
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
    settingsSwitch();
    colorModeSwitch();
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
    scrollUp();
    aosInit();
    mortgageCalculator();
    fileInputs();
    agencyDirectory();
    tomSelectInit($(".tom_select"));
    rangeSliders();
    propertyListing();
    propertyMap();
    propertyCompare();
    propertyActions();
    heroSearch();
    savedProperties();
    formValidation();
    countdown();
    otpForm();
    locationMaps();
    blogFilter();
    saveSearch();
    savedSearchesPage();
    propertyReviews();
    reviewsDashboard();
    priceHistory();
    currencySwitch();
    if ($.exists(".cs_getting_year")) {
      const date = new Date();
      $(".cs_getting_year").text(date.getFullYear());
    }
  });

  // Dashboard pages
  $(function () {
    if (!$body.hasClass("cs_dashboard")) return;
    dashboardSidebar();
    tomSelectInit($(".cs_select select"));
    filterTabs();
    statusActions();
    tableTools();
    tourCalendar();
    propertyForms();
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
    notifications();
    tableOverflow();
    rolePermissions();
    ticketReplies();
  });
  /* Run on window resize */
  $(window).on("resize", function () {
    const mobileWidth = 1199;
    if ($(window).width() >= mobileWidth) {
    }
  });

  /* 01. Preloader */
  function preloader() {
    $(".cs_preloader").fadeOut();
    $(".cs_preloader_in").delay(150).fadeOut("slow");
  }

  /* Tom Select (front-end .tom_select and dashboard .cs_select selects) */
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
      if ($(this).closest(".cs_select").length && this.options.length <= 8)
        settings.controlInput = null;
      if (this.name === "property-location") locationSearch(this, settings);
      var select = new TomSelect(this, settings);
      select.control.classList.toggle("rtl", select.rtl);
      select.dropdown.setAttribute("data-lenis-prevent", "");
    });
  }

  /* Location search (selects named "property-location") */
  var LOCATION_COUNTRIES = {
    "new-york": "United States",
    london: "United Kingdom",
    paris: "France",
    dubai: "United Arab Emirates (UAE)",
    tokyo: "Japan",
    sydney: "Australia",
    toronto: "Canada",
    berlin: "Germany",
    singapore: "Singapore",
    mumbai: "India",
  };

  function locationSearch(select, settings) {
    Array.prototype.forEach.call(select.options, function (option) {
      if (option.value && LOCATION_COUNTRIES[option.value]) {
        option.setAttribute("data-country", LOCATION_COUNTRIES[option.value]);
      }
    });
    settings.searchField = ["text", "country"];
    settings.placeholder =
      select.options[0] && !select.options[0].value
        ? select.options[0].text
        : "Search Location...";
    settings.render = {
      option: function (data, escape) {
        return (
          '<div class="cs_location_option"><i class="fa-solid fa-location-dot" aria-hidden="true"></i>' +
          "<span>" +
          escape(data.text) +
          "</span>" +
          (data.country ? "<small>" + escape(data.country) + "</small>" : "") +
          "</div>"
        );
      },
      no_results: function () {
        return '<div class="no-results">No locations found</div>';
      },
    };
  }

  /* 02. Mobile Menu */
  function mainNav() {
    $(".cs_nav").append('<span class="cs_menu_toggle"><span></span></span>');
    $(".cs_nav_list_wrap, .cs_nav_list").attr("data-lenis-prevent", "");
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
    $(".menu-item-has-children > a[href='#']").on("click", function (e) {
      e.preventDefault();
      $(this).siblings(".cs_menu_dropdown_toggle").trigger("click");
    });
  }

  /* 03. Sticky Header */
  function stickyHeader() {
    var scroll = $(window).scrollTop();
    if (scroll >= 10) {
      $(".cs_sticky_header").addClass("cs_sticky_active");
    } else {
      $(".cs_sticky_header").removeClass("cs_sticky_active");
    }
  }

  /* 04. Dynamic Background */
  function dynamicBackground() {
    $("[data-src]").each(function () {
      var src = $(this).attr("data-src");
      $(this).css({
        "background-image": "url(" + src + ")",
      });
    });
  }

  /* 05. Slick Slider */
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
  /* 06. Language Select */
  var LANGUAGE_PAGES = {};
  var RTL_LANGUAGES = ["AR"];

  function currentLanguage() {
    if (RTL_LANG.test(document.documentElement.lang)) return "AR";
    return String(readPref(PREF_KEYS.lang) || "EN").toUpperCase();
  }

  function showLanguage(lang) {
    var $button = $(
      ".cs_language_dropdown button[data-lang='" + lang + "']",
    ).first();
    if (!$button.length) return;
    $(".cs_language_switcher > :first-child").attr({
      class: $button.children(".flag-btn").attr("class"),
      "data-lang": lang,
      "aria-label": "Language: " + String($button.text()).trim(),
    });
    $(".cs_language_dropdown button")
      .removeClass("active")
      .attr("aria-pressed", "false");
    $button.addClass("active").attr("aria-pressed", "true");
  }

  function goWithDir(dir, url) {
    var target = new URL(url || window.location.href, window.location.href);
    if (saveDir(dir)) target.searchParams.delete("dir");
    else target.searchParams.set("dir", dir);
    window.location.href = target.toString();
  }

  function quantityInit() {
    showLanguage(currentLanguage());

    $(".cs_language_switcher").on("click", function () {
      $(".cs_language_dropdown").slideToggle(250);
    });

    $(".cs_language_dropdown button").on("click", function () {
      var lang = String($(this).data("lang")).toUpperCase();
      var page = window.location.pathname.split("/").pop() || "index.html";
      var dir = RTL_LANGUAGES.indexOf(lang) > -1 ? "rtl" : "ltr";
      savePref(PREF_KEYS.lang, lang);
      showLanguage(lang);
      $(".cs_language_dropdown").hide();

      var translated = (LANGUAGE_PAGES[lang] || {})[page];
      var original = null;
      $.each(LANGUAGE_PAGES, function (code, pages) {
        $.each(pages, function (source, target) {
          if (target === page && code !== lang) original = source;
        });
      });
      if (translated || original) goWithDir(dir, translated || original);
      else if (dir !== layoutDir) goWithDir(dir);
    });

    $(document).on("click", function (e) {
      if (!$(e.target).closest(".cs_language_select").length) {
        $(".cs_language_dropdown").slideUp(250);
      }
    });
  }
  /* 07. Search Modal Toggle */
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
  /* 08. Smooth Page Scroll */
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
  /* 09. Counter Animation */
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
  /* 10. Modal Video */
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
  /* 11. Review */
  function review() {
    $(".cs_rating").each(function () {
      var review = $(this).data("rating");
      var reviewVal = review * 20 + "%";
      $(this).find(".cs_rating_percentage").css("width", reviewVal);
    });
  }
  /* 12. Tabs */
  function tabs() {
    $(".cs_tab_links a").on("click", function (e) {
      var currentAttrValue = $(this).attr("href");
      $(".cs_tabs " + currentAttrValue)
        .addClass("active")
        .siblings()
        .removeClass("active");
      $(this).parents("li").addClass("active").siblings().removeClass("active");
      e.preventDefault();
    });
  }
  /* 13. Accordian */
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
  /* 14. heart toggle */
  function elementToggle() {
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
  /* 15.Date And Time Picker */
  function dateTimePicker() {
    function namePickerFields(selectedDates, dateStr, instance) {
      var base = instance.input.id || instance.input.name || "date";
      $(instance.calendarContainer)
        .find("input, select")
        .each(function () {
          var part = this.getAttribute("aria-label") || "field";
          if (!this.name && !this.id)
            this.name = base + "_" + part.toLowerCase();
        });
    }
    flatpickr("#timePicker, #timePicker2", {
      enableTime: true,
      allowInput: true,
      noCalendar: true,
      dateFormat: "G:i: K",
      onReady: namePickerFields,
    });
    flatpickr("#datePicker, #datePicker2", {
      enableTime: false,
      allowInput: true,
      minDate: "today",
      dateFormat: "d-F-Y",
      onReady: namePickerFields,
    });
  }
  /* 16.Apartment Finding Function */
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
  /* 17. Pricing value Toggle */
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
  /* 18. Light Gallery */
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
  /* 19. Load More Portfolio Items */
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
  /* 21. Scroll Up */
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
  /* 22. Dynamic contact form */
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
      result.style.display = "";
      var demo =
        !object.access_key || object.access_key === "YOUR_WEB3FORMS_ACCESS_KEY";

      // Optional hCaptcha
      if (
        !demo &&
        form.querySelector(".h-captcha") &&
        !object["h-captcha-response"]
      ) {
        result.innerHTML = "Please complete the captcha.";
        return;
      }
      result.innerHTML = "Please wait...";

      if (object.botcheck || demo) {
        setTimeout(function () {
          result.innerHTML =
            "Thanks! Your message has been sent. (Demo: add your Web3Forms access key in contact.html to receive emails.)";
          form.reset();
          setTimeout(function () {
            result.style.display = "none";
          }, 6000);
        }, 600);
        return;
      }

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
  /* 23. AOS Animation */
  function aosInit() {
    AOS.init({
      offset: 120,
      duration: 800,
      easing: "ease",
      once: true,
      mirror: false,
    });
  }
  /* 24. Saved Preferences */
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
    var isDark =
      themeMode === "dark" || (themeMode === "system" && darkQuery.matches);

    html.classList.toggle("cs_dark", isDark);
    html.setAttribute("data-color-mode", themeMode);
    $(".cs_theme_switch").attr(
      "aria-label",
      "Color mode: " + THEME_LABELS[themeMode],
    );
    $(".cs_mode_switch button").each(function () {
      var isActive = $(this).data("mode") === themeMode;
      $(this)
        .toggleClass("active", isActive)
        .attr("aria-pressed", String(isActive));
    });
  }

  function setThemeMode(mode) {
    themeMode = mode;
    savePref(PREF_KEYS.theme, mode);
    applyThemeMode();
  }

  /* 25. Color Mode Switch */
  function colorModeSwitch() {
    var $group = $(
      '<div class="cs_mode_switch" role="group" aria-label="Color mode"></div>',
    );

    [
      { mode: "system", icon: "fa-solid fa-desktop", label: "Device mode" },
      { mode: "light", icon: "fa-solid fa-sun", label: "Light mode" },
      { mode: "dark", icon: "fa-solid fa-moon", label: "Dark mode" },
    ].forEach(function (option) {
      $('<button type="button"></button>')
        .attr({
          "data-mode": option.mode,
          "aria-label": option.label,
          title: option.label,
        })
        .append($('<i aria-hidden="true"></i>').addClass(option.icon))
        .appendTo($group);
    });

    if (!$("body").hasClass("cs_dashboard"))
      $(".cs_settings_panel").append($group);

    $group.on("click", "button", function () {
      setThemeMode($(this).data("mode"));
    });

    // Dashboard topbar button
    $(".cs_theme_switch").on("click", function () {
      setThemeMode(
        THEME_MODES[(THEME_MODES.indexOf(themeMode) + 1) % THEME_MODES.length],
      );
    });

    var onDeviceChange = function () {
      if (themeMode === "system") applyThemeMode();
    };
    if (darkQuery.addEventListener)
      darkQuery.addEventListener("change", onDeviceChange);
    else darkQuery.addListener(onDeviceChange);

    applyThemeMode();
  }
  /* 26. Layout Direction */
  function isDir(value) {
    return value === "rtl" || value === "ltr";
  }

  function saveDir(dir) {
    try {
      localStorage.setItem(PREF_KEYS.dir, dir);
      return localStorage.getItem(PREF_KEYS.dir) === dir;
    } catch (e) {
      return false;
    }
  }

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
      if (RTL_LANG.test(document.documentElement.lang)) saved = "rtl";
      layoutDir = saved || (isDir(markup) ? markup : "ltr");
      stored = saved ? true : canStore();
    }
    applyDir(layoutDir);

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

  /* 27. Settings Switch */
  function settingsSwitch() {
    var wrap = document.createElement("div");
    wrap.className = "cs_dir_switch cs_primary_font cs_semibold";

    var panel = document.createElement("div");
    panel.className = "cs_settings_panel";
    panel.id = "csSettingsPanel";
    // Dashboard pages
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
      toggle.hidden = open;
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    }

    toggle.addEventListener("click", function () {
      setOpen(true);
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
  /* 28. Sidebar */
  function dashboardSidebar() {
    var $toggle = $(".cs_sidebar_toggle");
    $toggle.attr(
      "aria-expanded",
      String(!$html.hasClass("cs_sidebar_collapsed")),
    );

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

  /* 29. Sidebar Submenus */
  function submenus() {
    $(".cs_submenu a.active")
      .closest(".cs_has_submenu")
      .addClass("cs_open cs_has_active");
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

  function toggleSubmenu($item, open) {
    var menu = $item.children(".cs_submenu")[0];
    $item.children(".cs_menu_link").attr("aria-expanded", String(open));
    var reduce =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!menu || !menu.getClientRects().length || reduce) {
      $item.toggleClass("cs_open", open);
      if (menu) menu.style.height = "";
      return;
    }
    menu.style.height = (open ? 0 : menu.scrollHeight) + "px";
    menu.offsetHeight;
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

  /* 30. Topbar Dropdowns (notifications, profile) */
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

  function dashboardModals() {
    $("[data-modal-open]").on("click", function () {
      var modal = document.getElementById($(this).data("modal-open"));
      if (!modal || typeof modal.showModal !== "function") return;
      var $opener = $(this);
      $(modal).data("opener", $opener);
      $(modal)
        .find("[data-review-field]")
        .each(function () {
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

    $(".cs_dash_modal").on("click", function (e) {
      if (e.target === this) this.close();
    });
  }

  function closeDropdowns() {
    $(".cs_topbar_dropdown.cs_active")
      .removeClass("cs_active")
      .find(".cs_dropdown_toggle")
      .attr("aria-expanded", "false");
    $(".cs_action_menu.cs_active")
      .removeClass("cs_active")
      .find(".cs_action_menu_toggle")
      .attr("aria-expanded", "false");
  }

  /* 31. Mobile Search */
  function mobileSearch() {
    $(".cs_search_toggle").on("click", function () {
      var $topbar = $(".cs_dashboard_topbar").toggleClass("cs_search_open");
      $(this).attr("aria-expanded", String($topbar.hasClass("cs_search_open")));
      if ($topbar.hasClass("cs_search_open"))
        $topbar.find(".cs_topbar_search input").trigger("focus");
    });
  }

  /* 32. Stat Counters (odometer runs as soon as the page loads) */
  function statCounters() {
    $(window).on("load", function () {
      $(".cs_stat_card .odometer").each(function () {
        $(this).html($(this).data("count-to"));
      });
    });
  }

  /* 33. Analytics Charts */
  var CHART_DATA = {
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
        labels: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        current: [
          9800, 10400, 12100, 11800, 13600, 14900, 15200, 16800, 15900, 17400,
          18200, 19600,
        ],
        previous: [
          8200, 8900, 9700, 10100, 10800, 11600, 12000, 12900, 13100, 13800,
          14500, 15200,
        ],
      },
    },
    // Property Owner
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
        labels: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        current: [
          3100, 3280, 3610, 3540, 3920, 4210, 4380, 4760, 4590, 5020, 5310,
          6420,
        ],
        previous: [
          2600, 2790, 2950, 3080, 3190, 3370, 3460, 3690, 3720, 3910, 4080,
          4300,
        ],
      },
    },
    // Site Admin
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
        labels: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        current: [
          28400, 30100, 33600, 32800, 36200, 38900, 40100, 42800, 41500, 44900,
          46200, 48560,
        ],
        previous: [
          22100, 23900, 25400, 26800, 27900, 29600, 30800, 32100, 32900, 34600,
          35800, 37200,
        ],
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
            ((2 * dx[i] + dx[i - 1]) / slope[i - 1] +
              (dx[i] + 2 * dx[i - 1]) / slope[i]);
    }
    var round = function (v) {
      return Math.round(v * 10) / 10;
    };
    var d = "M" + round(pts[0].x) + "," + round(pts[0].y);
    for (i = 0; i < n - 1; i++) {
      var h = dx[i] / 3;
      d +=
        "C" +
        round(pts[i].x + h) +
        "," +
        round(pts[i].y + h * tangent[i]) +
        " " +
        round(pts[i + 1].x - h) +
        "," +
        round(pts[i + 1].y - h * tangent[i + 1]) +
        " " +
        round(pts[i + 1].x) +
        "," +
        round(pts[i + 1].y);
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
    var svg = svgEl(
      "svg",
      {
        class: "cs_chart_svg",
        height: CHART.height,
        direction: "ltr",
        "aria-hidden": "true",
      },
      el,
    );
    var $tooltip = $(
      "<div class='cs_chart_tooltip' aria-hidden='true'></div>",
    ).appendTo(el);
    var plot;

    function draw() {
      var width = el.clientWidth;
      if (!width) return;
      var rtl = getComputedStyle(el).direction === "rtl";
      var mx = function (v) {
        return rtl ? width - v : v;
      };
      svg.setAttribute("width", width);
      svg.setAttribute("viewBox", "0 0 " + width + " " + CHART.height);
      svg.textContent = "";

      var gradient = svgEl(
        "linearGradient",
        { id: fillId, x1: 0, y1: 0, x2: 0, y2: 1 },
        svgEl("defs", {}, svg),
      );
      svgEl(
        "stop",
        { class: "cs_chart_stop", offset: "0", "stop-opacity": 0.22 },
        gradient,
      );
      svgEl(
        "stop",
        { class: "cs_chart_stop", offset: "0.95", "stop-opacity": 0 },
        gradient,
      );

      var ticks = niceTicks(
        Math.max.apply(null, data.current.concat(data.previous)),
        CHART.ticks,
      );
      var axis = svgEl("g", { class: "cs_chart_axis" }, svg);
      var yLabels = ticks.map(function (v) {
        var text = svgEl(
          "text",
          {
            "text-anchor": rtl ? "start" : "end",
            "dominant-baseline": "middle",
          },
          axis,
        );
        text.textContent = formatter(v);
        return text;
      });
      var xLabels = data.labels.map(function (label) {
        var text = svgEl(
          "text",
          { "text-anchor": "middle", y: CHART.height - 8 },
          axis,
        );
        text.textContent = label;
        return text;
      });
      var widest = function (texts) {
        return Math.max.apply(
          null,
          texts.map(function (t) {
            return t.getBBox().width;
          }),
        );
      };
      var xLabelWidth = widest(xLabels);
      var left = Math.ceil(widest(yLabels)) + CHART.gap;
      var right = width - Math.max(8, Math.ceil(xLabelWidth / 2));
      var bottom = CHART.height - CHART.bottom;
      var count = data.labels.length;
      var step = (right - left) / Math.max(count - 1, 1);
      var x = function (i) {
        return mx(left + step * i);
      };
      var y = function (v) {
        return bottom - ((bottom - CHART.top) * v) / ticks[ticks.length - 1];
      };

      // Grid + y labels
      var grid = svgEl("g", {}, svg);
      svg.insertBefore(grid, axis);
      ticks.forEach(function (v, i) {
        var lineY = Math.round(y(v)) + 0.5;
        svgEl(
          "line",
          {
            class: v === 0 ? "cs_chart_baseline" : "cs_chart_grid",
            x1: mx(left),
            x2: mx(right),
            y1: lineY,
            y2: lineY,
          },
          grid,
        );
        yLabels[i].setAttribute("x", mx(left - CHART.gap));
        yLabels[i].setAttribute("y", lineY);
      });

      // X labels
      var every = Math.max(1, Math.ceil((xLabelWidth + 12) / step));
      xLabels.forEach(function (text, i) {
        text.setAttribute("x", x(i));
        if (i % every) text.remove();
      });

      var toPoints = function (values) {
        return values.map(function (v, i) {
          return { x: x(i), y: y(v) };
        });
      };
      var current = toPoints(data.current);
      var previous = toPoints(data.previous);
      var currentPath = smoothPath(current);
      svgEl(
        "path",
        { class: "cs_chart_line cs_chart_line_prev", d: smoothPath(previous) },
        svg,
      );
      svgEl(
        "path",
        {
          fill: "url(#" + fillId + ")",
          d:
            currentPath +
            "L" +
            mx(right) +
            "," +
            bottom +
            "L" +
            mx(left) +
            "," +
            bottom +
            "Z",
        },
        svg,
      );
      svgEl("path", { class: "cs_chart_line", d: currentPath }, svg);

      // Hover layer
      var hover = svgEl("g", { class: "cs_chart_hover" }, svg);
      var crosshair = svgEl(
        "line",
        { class: "cs_chart_crosshair", y1: CHART.top, y2: bottom },
        hover,
      );
      var prevMarker = svgEl(
        "circle",
        { class: "cs_chart_marker cs_chart_marker_prev", r: 5 },
        hover,
      );
      var marker = svgEl("circle", { class: "cs_chart_marker", r: 6 }, hover);

      plot = {
        rtl: rtl,
        left: left,
        step: step,
        count: count,
        width: width,
        crosshair: crosshair,
        marker: marker,
        prevMarker: prevMarker,
        current: current,
        previous: previous,
      };
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
      $tooltip
        .empty()
        .append(
          $("<div class='cs_chart_tooltip_title'></div>").text(data.labels[i]),
          row("This period", data.current[i], ""),
          row("Previous period", data.previous[i], "cs_legend_dashed"),
        );

      var tipWidth = $tooltip.outerWidth();
      var after = px + 14;
      var before = px - 14 - tipWidth;
      var tipLeft = plot.rtl
        ? before < 0
          ? after
          : before
        : after + tipWidth > plot.width
          ? before
          : after;
      tipLeft = Math.max(0, Math.min(tipLeft, plot.width - tipWidth));
      $tooltip.css({ left: tipLeft, top: CHART.top });
      $(el).addClass("cs_chart_active");
    }

    function hidePoint() {
      $(el).removeClass("cs_chart_active");
    }

    $(svg).on("pointermove pointerdown", function (e) {
      if (!plot) return;
      var px = e.clientX - svg.getBoundingClientRect().left;
      if (plot.rtl) px = plot.width - px;
      var i = Math.round((px - plot.left) / plot.step);
      showPoint(Math.min(plot.count - 1, Math.max(0, i)));
    });
    $(svg).on("pointerleave", hidePoint);

    draw();
    renderChartTable($card, data, formatter);

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
      $(this)
        .addClass("active")
        .attr("aria-pressed", "true")
        .siblings()
        .removeClass("active")
        .attr("aria-pressed", "false");
      hidePoint();
      draw();
      renderChartTable($card, data, formatter);
    });
  }

  function renderChartTable($card, data, formatter) {
    var rows = data.labels.map(function (label, i) {
      return (
        "<tr><th scope='row'>" +
        label +
        "</th><td>" +
        formatter(data.current[i]) +
        "</td><td>" +
        formatter(data.previous[i]) +
        "</td></tr>"
      );
    });
    $card.find(".cs_chart_table tbody").html(rows.join(""));
  }

  /* 34. Filter Tabs */
  function filterTabs() {
    $(".cs_filter_tabs").each(function () {
      var $tabs = $(this);
      var $buttons = $tabs.find("[data-filter]");
      var $target = $($tabs.data("target"));
      var $empty = $target.find(".cs_empty_row");

      function activate(filter) {
        if (!$buttons.filter('[data-filter="' + filter + '"]').length)
          filter = $buttons.first().data("filter");
        $buttons.removeClass("active").attr("aria-pressed", "false");
        $buttons
          .filter('[data-filter="' + filter + '"]')
          .addClass("active")
          .attr("aria-pressed", "true");

        var shown = 0;
        $target.find("[data-status]").each(function () {
          var match = filter === "all" || $(this).data("status") === filter;
          $(this).toggle(match);
          if (match) shown++;
        });
        $empty.toggle(shown === 0);

        $(".cs_submenu a")
          .removeClass("active")
          .filter(function () {
            return (
              this.pathname === window.location.pathname &&
              this.hash === "#" + filter
            );
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

      $tabs.on("cs:refresh", function () {
        activate($buttons.filter(".active").data("filter"));
      });

      activate(window.location.hash.slice(1));
    });
  }

  /* 35. Messages (chat) */
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
      $chat
        .find(".cs_chat_item")
        .removeClass("active")
        .removeAttr("aria-current");
      $item
        .addClass("active")
        .attr("aria-current", "true")
        .find(".cs_menu_badge")
        .remove();
      $chat
        .find(".cs_chat_head img")
        .attr("src", $item.find("img").attr("src"));
      $chat
        .find(".cs_chat_head_name")
        .text($item.find(".cs_chat_item_name").text());
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
      var time = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      $("<div class='cs_chat_bubble cs_out'></div>")
        .text(text)
        .append($("<time></time>").text(time))
        .appendTo($thread);
      $input.val("");
      toBottom();
    });
  }

  /* 36. File Upload Previews (gallery drop zone + avatar) */
  function uploads() {
    $(".cs_upload_box input[type='file']").on("change", function () {
      var $previews = $(this)
        .closest(".cs_upload_wrap")
        .find(".cs_upload_previews");
      Array.prototype.forEach.call(this.files, function (file) {
        var $remove = $(
          "<button type='button'><i class='fa-solid fa-xmark'></i></button>",
        ).attr("aria-label", "Remove " + file.name);
        if (/^image\//.test(file.type)) {
          $("<div></div>")
            .append(
              $("<img alt=''>").attr("src", URL.createObjectURL(file)),
              $remove,
            )
            .appendTo($previews);
          return;
        }
        var icon = /\.pdf$/i.test(file.name)
          ? "fa-file-pdf"
          : /\.docx?$/i.test(file.name)
            ? "fa-file-word"
            : "fa-file-lines";
        $("<div class='cs_upload_file'></div>")
          .append(
            $("<i aria-hidden='true'></i>").addClass("fa-solid " + icon),
            $("<span></span>").text(file.name),
            $remove,
          )
          .appendTo($previews);
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
        $(this)
          .closest(".cs_profile_card_thumb")
          .find("img")
          .attr("src", URL.createObjectURL(file));
      }
    });
  }

  /* 37. Settings Section Nav (highlights the section in view) */
  function settingsNav() {
    var $links = $(".cs_settings_nav a[href^='#']");
    if (!$links.length || !("IntersectionObserver" in window)) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          $links
            .removeClass("active")
            .filter('[href="#' + entry.target.id + '"]')
            .addClass("active");
        });
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );

    $links.each(function () {
      var section = document.getElementById(this.hash.slice(1));
      if (section) observer.observe(section);
    });
  }

  /* 38. Mortgage Calculator */
  function mortgageCalculator() {
    var $form = $(".cs_mortgage_calculation_form");
    if (!$form.length) return;
    var $result = $form.find(".cs_mortgage_result");

    function value(name) {
      var raw = String($form.find('[name="' + name + '"]').val()).replace(
        /[$,%\s]/g,
        "",
      );
      return raw === "" ? 0 : Number(raw);
    }

    function money(amount) {
      return (
        "$" +
        amount.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      );
    }

    function breakdown(total, down, loanPayment, months, tax, insurance) {
      if (!$("[data-mortgage]").length) return;
      var whole = function (n) {
        return "$" + Math.round(n).toLocaleString("en-US");
      };
      var monthly = loanPayment + tax + insurance;
      var payoff = new Date();
      payoff.setMonth(payoff.getMonth() + months);
      var values = {
        monthly: money(monthly),
        principal: money(loanPayment),
        tax: money(tax),
        insurance: money(insurance),
        loanAmount: whole(total - down),
        totalInterest: whole(loanPayment * months - (total - down)),
        totalCost: whole(loanPayment * months),
        payoff: payoff.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        }),
      };
      $("[data-mortgage]").each(function () {
        $(this).text(values[$(this).data("mortgage")]);
      });
      var offset = 25;
      [
        ["principal", loanPayment],
        ["tax", tax],
        ["insurance", insurance],
      ].forEach(function (part) {
        var pct = monthly ? (part[1] / monthly) * 100 : 0;
        $("[data-mortgage-arc='" + part[0] + "']").attr({
          "stroke-dasharray": pct + " " + (100 - pct),
          "stroke-dashoffset": offset,
        });
        offset -= pct;
      });
      $("[data-mortgage-link]").attr(
        "href",
        "property-listing-buy.html?max-price=" + Math.round(total),
      );
    }

    function calculate() {
      var total = value("total");
      var down = value("downpayment");
      var rate = value("interest") / 100 / 12;
      var months = value("loan") * 12;
      var tax = value("partytax") / 12;
      var insurance = value("insurance") / 12;
      var principal = total - down;

      var values = [total, down, value("interest"), months, tax, insurance];
      if (
        values.some(isNaN) ||
        values.some(function (v) {
          return v < 0;
        })
      ) {
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
      $result.text("Monthly payment: " + money(loanPayment + tax + insurance));
      breakdown(total, down, loanPayment, months, tax, insurance);
    }

    $form.on("submit", function (e) {
      e.preventDefault();
      calculate();
    });

    if ($form.is("[data-mortgage-live]")) {
      var timer;
      $form.on("input", function () {
        clearTimeout(timer);
        timer = setTimeout(calculate, 200);
      });
      calculate();
    }
  }

  /* 39. Package Editor (add / remove features + live preview card) */
  function packageEditor() {
    var $form = $("[data-package-form]");
    if (!$form.length) return;
    var $list = $form.find("[data-feature-list]");
    var $newInput = $form.find(".cs_feature_add input");
    var $preview = $("[data-package-preview]");
    var $template = $list.children("li").first().clone();

    function renderPreview() {
      $preview
        .find("[data-preview-name]")
        .text($form.find("[data-preview='name']").val());
      $preview
        .find("[data-preview-price]")
        .text($form.find("[data-preview='price']").val() || 0);
      $preview
        .find("[data-preview-desc]")
        .text($form.find("[data-preview='desc']").val());
      var $features = $preview.find(".cs_plan_features").empty();
      $list.children("li").each(function () {
        var text = String(
          $(this).find("input[type='text']").val() || "",
        ).trim();
        if (!text) return;
        var included = $(this).find("input[type='checkbox']").is(":checked");
        $("<li></li>")
          .toggleClass("cs_disabled", !included)
          .append(
            $("<i></i>").addClass(
              included ? "fa-solid fa-check" : "fa-solid fa-xmark",
            ),
            document.createTextNode(text),
          )
          .appendTo($features);
      });
    }

    function addFeature() {
      var text = String($newInput.val() || "").trim();
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

  /* 40. Notifications Page */
  function notifications() {
    var $list = $("#notificationList");
    if (!$list.length) return;
    var $tabs = $('.cs_filter_tabs[data-target="#notificationList"]');

    function refresh() {
      var $items = $list.find(".cs_notification_item");
      var unread = $items.filter('[data-status="unread"]').length;
      $tabs.find('[data-notification-count="all"]').text($items.length);
      $tabs.find('[data-notification-count="unread"]').text(unread);
      $tabs
        .find('[data-notification-count="read"]')
        .text($items.length - unread);
      $(".cs_notification_read_all").prop("disabled", unread === 0);
      $(".cs_topbar_dropdown .cs_dot").toggle(unread > 0);
      $(".cs_menu_notifications .cs_menu_badge")
        .text(unread)
        .toggle(unread > 0);
      $tabs.trigger("cs:refresh");
    }

    function markRead($item) {
      $item.attr("data-status", "read").removeData("status");
      $item.find(".cs_notification_read").remove();
    }

    $list.on("click", ".cs_notification_read", function () {
      markRead($(this).closest(".cs_notification_item"));
      refresh();
    });

    $list.on("click", ".cs_notification_delete", function () {
      $(this).closest(".cs_notification_item").remove();
      refresh();
    });

    $(".cs_notification_read_all").on("click", function () {
      $list
        .find('.cs_notification_item[data-status="unread"]')
        .each(function () {
          markRead($(this));
        });
      refresh();
    });

    refresh();
  }

  /* Shared helpers for the property search pages */
  var LOCATION_LABELS = {
    "new-york": "New York",
    london: "London",
    paris: "Paris",
    dubai: "Dubai",
    tokyo: "Tokyo",
    sydney: "Sydney",
    toronto: "Toronto",
    berlin: "Berlin",
    singapore: "Singapore",
    mumbai: "Mumbai",
  };
  var AMENITY_LABELS = {
    garden: "Garden",
    playGround: "Play Ground",
    swimmingPool: "Swimming Pool",
    fitnessCenter: "Fitness Center",
    parking: "Parking",
    security: "24/7 Security",
    elevator: "Elevator",
    rooftopTerrace: "Rooftop Terrace",
    garage: "Garage",
    bikeStorage: "Bike Storage",
  };

  function toNumber(value) {
    var raw = String(value == null ? "" : value).replace(/[^0-9.]/g, "");
    return raw === "" ? null : Number(raw);
  }

  function formatMoney(amount) {
    return "$" + Number(amount).toLocaleString("en-US");
  }

  function shortMoney(amount) {
    if (amount >= 1000000) return "$" + +(amount / 1000000).toFixed(2) + "M";
    if (amount >= 10000) return "$" + Math.round(amount / 1000) + "K";
    return formatMoney(amount);
  }

  function capitalize(text) {
    text = String(text || "");
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  function escapeHtml(text) {
    return String(text == null ? "" : text).replace(/[&<>"']/g, function (c) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      }[c];
    });
  }

  /* 41. Price Range Slider */
  function rangeSliders() {
    $(".cs_range_slider").each(function () {
      var $slider = $(this);
      var name = $slider.data("range");
      var min = Number($slider.data("min"));
      var max = Number($slider.data("max"));
      var $low = $slider.find(".cs_range_min");
      var $high = $slider.find(".cs_range_max");
      var $fill = $slider.find(".cs_range_fill");
      var $scope = $slider.parent();
      var $minInput = $scope.find("[name='min-" + name + "']");
      var $maxInput = $scope.find("[name='max-" + name + "']");
      var $label = $scope.find(".cs_range_values");

      function paint() {
        var low = Number($low.val());
        var high = Number($high.val());
        var span = max - min || 1;
        $fill.css({
          "inset-inline-start": ((low - min) / span) * 100 + "%",
          width: ((high - low) / span) * 100 + "%",
        });
        $low.css("z-index", low > min + span / 2 ? 3 : 1);
        $label.text(
          formatMoney(low) +
            " - " +
            formatMoney(high) +
            (high >= max ? "+" : ""),
        );
      }

      function fromSlider(e) {
        var low = Number($low.val());
        var high = Number($high.val());
        if (low > high) {
          if (e.target === $low[0]) $low.val(high);
          else $high.val(low);
        }
        $minInput.val(Number($low.val()) > min ? $low.val() : "");
        $maxInput.val(Number($high.val()) < max ? $high.val() : "");
        paint();
        $minInput.trigger("change");
      }

      function fromInputs() {
        var low = toNumber($minInput.val());
        var high = toNumber($maxInput.val());
        $low.val(low === null ? min : Math.max(min, Math.min(low, max)));
        $high.val(high === null ? max : Math.max(min, Math.min(high, max)));
        paint();
      }

      $low.add($high).on("input", fromSlider);
      $minInput.add($maxInput).on("input", fromInputs);
      $slider.on("cs:reset", function () {
        $minInput.add($maxInput).val("");
        fromInputs();
      });
      fromInputs();
    });
  }

  /* 42. Property Listing */
  var VIEW_KEY = "xproperty-listing-view";

  function propertyListing() {
    var $grid = $(".cs_listing_grid").first();
    if (!$grid.length) return;
    var $items = $grid.children(".cs_listing_item");
    var $empty = $grid.children(".cs_listing_empty");
    var $pager = $("[data-listing-pagination]");
    var $count = $("[data-result-count]");
    var $sort = $("[data-listing-sort]");
    var $wrapper = $grid.closest(".cs_property_list_wrapper");
    var perPage = parseInt($grid.data("per-page"), 10) || $items.length;
    var page = 1;
    var timer;
    var urlFilters = {};

    function card($item) {
      return $item.find("[data-id]").first();
    }

    function criteria() {
      var filters = $.extend(true, {}, urlFilters);
      $("[data-filter]").each(function () {
        if (
          (this.type === "checkbox" || this.type === "radio") &&
          !this.checked
        )
          return;
        var value = $(this).val();
        if (!value || value === "all") return;
        var name = $(this).data("filter");
        filters[name] = filters[name] || {
          mode: $(this).data("filter-mode") || "in",
          values: [],
        };
        filters[name].values.push(String(value));
      });
      return filters;
    }

    function inRange($card, name) {
      var value = Number($card.attr("data-" + name));
      var low = toNumber(
        $("[name='min-" + name + "']")
          .first()
          .val(),
      );
      var high = toNumber(
        $("[name='max-" + name + "']")
          .first()
          .val(),
      );
      return (low === null || value >= low) && (high === null || value <= high);
    }

    function matches($card, filters) {
      for (var name in filters) {
        var filter = filters[name];
        var value = String($card.attr("data-" + name) || "");
        var ok;
        if (name === "amenities") {
          var list = value.split(",");
          ok = filter.values.every(function (v) {
            return list.indexOf(v) > -1;
          });
        } else if (filter.mode === "min") {
          ok = Number(value) >= Number(filter.values[0]);
        } else {
          ok = filter.values.some(function (v) {
            return v.slice(-1) === "+"
              ? Number(value) >= parseInt(v, 10)
              : v === value;
          });
        }
        if (!ok) return false;
      }
      var extra = $grid.data("extraFilter");
      return (
        inRange($card, "price") &&
        inRange($card, "area") &&
        (!extra || extra($card))
      );
    }

    function sortKey($card, by) {
      switch (by) {
        case "high-budget":
          return -Number($card.attr("data-price"));
        case "low-budget":
          return Number($card.attr("data-price"));
        case "most-popular":
        case "most-sold":
        case "most-rent":
          return -Number($card.attr("data-views"));
        default:
          return -Date.parse($card.attr("data-date") || 0) || 0;
      }
    }

    function render(keepPage) {
      var filters = criteria();
      var by = $sort.val();
      var matched = [];
      $items.each(function () {
        if (matches(card($(this)), filters)) matched.push(this);
      });
      matched.sort(function (a, b) {
        return (
          sortKey(card($(a)), by) - sortKey(card($(b)), by) ||
          $items.index(a) - $items.index(b)
        );
      });

      var pages = Math.max(1, Math.ceil(matched.length / perPage));
      page = keepPage ? Math.min(page, pages) : 1;
      var start = (page - 1) * perPage;

      $items.hide();
      $grid.append(matched).append($empty);
      $(matched.slice(start, start + perPage)).show();
      $empty.toggle(!matched.length);
      $count.text(matched.length);
      renderPager(pages);

      $grid.data("matched", matched).trigger("cs:listing", [matched]);
    }

    function renderPager(pages) {
      if (!$pager.length) return;
      $pager.toggle(pages > 1).empty();
      if (pages < 2) return;
      var arrow = function (dir, target, label) {
        return $("<li></li>").append(
          $('<a href="#"></a>')
            .addClass(
              "cs_pagination_arrow cs_pagination_arrow_" + dir + " cs_center",
            )
            .toggleClass("disabled", target < 1 || target > pages)
            .attr({ "aria-label": label, "data-page": target }),
        );
      };
      $pager.append(arrow("left", page - 1, "Previous page"));
      for (var i = 1; i <= pages; i++) {
        // Long lists
        if (pages > 7 && i > 1 && i < pages && Math.abs(i - page) > 1) {
          if (i === 2 || i === pages - 1) {
            $pager.append(
              '<li><span class="cs_pagination_item cs_center">...</span></li>',
            );
          }
          continue;
        }
        $("<li></li>")
          .append(
            $('<a href="#"></a>')
              .addClass("cs_pagination_item cs_center")
              .toggleClass("active", i === page)
              .attr({
                "data-page": i,
                "aria-current": i === page ? "page" : null,
              })
              .text(i),
          )
          .appendTo($pager);
      }
      $pager.append(arrow("right", page + 1, "Next page"));
    }

    function refresh(keepPage) {
      clearTimeout(timer);
      timer = setTimeout(function () {
        render(keepPage);
      }, 120);
    }

    function reset() {
      $("[data-filter]").each(function () {
        if (this.type === "checkbox" || this.type === "radio") {
          this.checked = false;
          return;
        }
        var ts = this.tomselect;
        if (ts) {
          if (ts.options.all) ts.setValue("all", true);
          else ts.clear(true);
        } else {
          $(this).val($(this).find("option[value='all']").length ? "all" : "");
        }
      });
      $(
        "[name='min-price'], [name='max-price'], [name='min-area'], [name='max-area']",
      ).val("");
      $(".cs_range_slider").trigger("cs:reset");
      urlFilters = {};
      if (window.location.search && window.history.replaceState) {
        window.history.replaceState(null, "", window.location.pathname);
      }
      render();
    }

    function applyUrl() {
      if (!window.URLSearchParams || !window.location.search) return;
      var params = new URLSearchParams(window.location.search);
      params.forEach(function (value, name) {
        if (!value || value === "all") return;
        if (/^(min|max)-(price|area)$/.test(name)) {
          $("[name='" + name + "']")
            .first()
            .val(toNumber(value))
            .trigger("input");
          return;
        }
        var matched = false;
        $("[data-filter='" + name + "']").each(function () {
          if (this.type === "checkbox" || this.type === "radio") {
            if (this.value === value) matched = this.checked = true;
          } else if (this.tomselect) {
            if (this.tomselect.options[value]) {
              this.tomselect.setValue(value, true);
              matched = true;
            }
          } else if ($(this).find("option[value='" + value + "']").length) {
            $(this).val(value);
            matched = true;
          }
        });
        if (!matched) {
          urlFilters[name] = urlFilters[name] || { mode: "in", values: [] };
          urlFilters[name].values.push(value);
        }
      });
    }

    function setView(view) {
      view = view === "list" ? "list" : "grid";
      $grid.toggleClass("cs_list_view", view === "list");
      $(".cs_view_btn").each(function () {
        var active = $(this).data("view") === view;
        $(this).toggleClass("active", active).attr("aria-pressed", active);
      });
      savePref(VIEW_KEY, view);
    }

    $(document).on("change", "[data-filter], [data-listing-sort]", function () {
      if ($(this).data("filter") === "offer" && this.checked) {
        $("[data-filter='offer']").not(this).prop("checked", false);
      }
      refresh();
    });
    $(document).on(
      "input change",
      "[name='min-price'], [name='max-price'], [name='min-area'], [name='max-area']",
      function () {
        refresh();
      },
    );
    $(document).on("click", "[data-filter-reset]", reset);
    $(".cs_close_modal_btn").on("click", function () {
      $(".cs_close_modal").first().trigger("click");
    });
    $pager.on("click", "a[data-page]", function (e) {
      e.preventDefault();
      if ($(this).hasClass("disabled") || $(this).hasClass("active")) return;
      page = Number($(this).data("page"));
      render(true);
      var top = ($wrapper.length ? $wrapper : $grid).offset().top - 120;
      window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    });
    $grid.on("cs:refresh", function () {
      render(true);
    });
    $(".cs_view_btn").on("click", function () {
      setView($(this).data("view"));
    });

    $grid.data("search", function () {
      var filters = criteria();
      var params = new URLSearchParams();
      var bits = [];
      Object.keys(filters).forEach(function (name) {
        filters[name].values.forEach(function (v) {
          params.append(name, v);
        });
      });
      var range = {};
      ["price", "area"].forEach(function (r) {
        ["min", "max"].forEach(function (end) {
          var v = toNumber(
            $("[name='" + end + "-" + r + "']")
              .first()
              .val(),
          );
          range[end + r] = v;
          if (v !== null) params.append(end + "-" + r, v);
        });
      });
      var rooms = function (f, word) {
        if (!f) return;
        var plus = f.mode === "min" ? "+" : "";
        bits.push(f.values.join(", ") + plus + " " + word);
      };
      if (filters.type)
        bits.push(filters.type.values.map(capitalize).join(" / "));
      if (filters.location) {
        bits.push(
          filters.location.values
            .map(function (v) {
              return LOCATION_LABELS[v] || capitalize(v);
            })
            .join(" / "),
        );
      }
      rooms(filters.beds, "beds");
      rooms(filters.baths, "baths");
      if (filters.amenities) {
        bits.push(
          filters.amenities.values
            .map(function (a) {
              return AMENITY_LABELS[a] || a;
            })
            .join(", "),
        );
      }
      if (range.minprice && range.maxprice)
        bits.push(
          shortMoney(range.minprice) + " - " + shortMoney(range.maxprice),
        );
      else if (range.maxprice) bits.push("Under " + shortMoney(range.maxprice));
      else if (range.minprice) bits.push("Over " + shortMoney(range.minprice));
      return {
        query: params.toString(),
        summary: bits.join(" · ") || "All properties",
        matches: ($grid.data("matched") || []).length,
      };
    });

    setView(readPref(VIEW_KEY));
    applyUrl();
    render();
  }

  /* 47. Saved Properties */
  function savedProperties() {
    var saved = [];
    var toggles = "[data-save-toggle], .cs_heart_toggler, .cs_save_toggle";

    function sync() {
      $(toggles).each(function () {
        var on = saved.indexOf(propertyData(propertyElement(this)).id) > -1;
        $(this)
          .toggleClass("active", on)
          .attr({ "aria-pressed": on, title: on ? "Saved" : "Save" });
        $(this)
          .find("i")
          .first()
          .toggleClass("fa-solid", on)
          .toggleClass("fa-regular", !on);
        $(this)
          .find("[data-save-label]")
          .text(on ? "Saved" : "Save");
      });
    }

    $(document).on("click", toggles, function (e) {
      e.preventDefault();
      var id = propertyData(propertyElement(this)).id;
      if (!id) return;
      var i = saved.indexOf(id);
      if (i > -1) saved.splice(i, 1);
      else saved.push(id);
      sync();
    });

    sync();
    savedList();
  }

  function savedList() {
    var $list = $("[data-saved-list]");
    if (!$list.length) return;
    var $empty = $("[data-saved-empty]");
    var $search = $("[data-saved-search]");
    var $sort = $("[data-saved-sort]");
    var $filter = $("[data-saved-filter]");
    var changed = false;
    var $items = $list.children();
    $items.each(function (i) {
      var $card = $(this);
      $card.data({
        index: i,
        price:
          toNumber($card.find(".cs_saved_property_info p").first().text()) || 0,
        sale: /sale/i.test($card.find(".cs_status_badge").text()),
        rent: /rent/i.test($card.find(".cs_status_badge").text()),
        text:
          $card.find("h3").text().toLowerCase() +
          " " +
          $card.find(".cs_saved_property_info p").eq(1).text().toLowerCase(),
      });
    });

    function refresh() {
      $items = $list.children();
      var query = String($search.val() || "")
        .trim()
        .toLowerCase();
      var sort = String($sort.val() || "").toLowerCase();
      var type = String($filter.val() || "").toLowerCase();
      var shown = 0;
      $items
        .get()
        .sort(function (a, b) {
          var pa = $(a).data("price"),
            pb = $(b).data("price");
          if (sort.indexOf("high") > -1) return pb - pa;
          if (sort.indexOf("low") > -1) return pa - pb;
          return $(a).data("index") - $(b).data("index");
        })
        .forEach(function (el) {
          var $card = $(el);
          var ok =
            (!query || $card.data("text").indexOf(query) > -1) &&
            (type.indexOf("sale") < 0 || $card.data("sale")) &&
            (type.indexOf("rent") < 0 || $card.data("rent"));
          $card.toggle(ok);
          if (ok) shown++;
          $list.append($card);
        });
      if (changed) $("[data-saved-count]").text($items.length);
      $empty.toggle(shown === 0);
    }

    $list.on("click", ".cs_saved_property_remove", function () {
      var $col = $(this).closest(".cs_saved_property").parent();
      changed = true;
      $col.fadeOut(200, function () {
        $col.remove();
        refresh();
      });
    });
    $search.on("input", refresh);
    $search.closest("form").on("submit", function (e) {
      e.preventDefault();
    });
    $sort.add($filter).on("change", refresh);
    refresh();
  }

  /* 48. Form Validation (login / register / forgot password, newsletter) */
  var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function fieldError($field, message) {
    var $box = $field.closest(
      ".cs_custom_checkbox, .cs_input_wrapper, .cs_password_field, .cs_select, .cs_input_icon_wrap",
    );
    if (!$box.length) $box = $field;
    $box.siblings(".cs_field_error").remove();
    $field.toggleClass("cs_invalid", !!message).attr("aria-invalid", !!message);
    if ($field[0].tomselect)
      $($field[0].tomselect.wrapper).toggleClass("cs_invalid", !!message);
    if (message)
      $('<span class="cs_field_error" role="alert"></span>')
        .text(message)
        .insertAfter($box);
  }

  function validateForm($form) {
    var firstBad = null;
    $form
      .find("input, select, textarea")
      .not(".ts-wrapper *")
      .each(function () {
        var $field = $(this);
        var value =
          this.type === "checkbox"
            ? this.checked
            : String($field.val() || "").trim();
        var message = "";
        if (this.type === "hidden" || this.disabled) return;
        if ($field.prop("required") && !value) {
          message =
            this.type === "checkbox"
              ? "Please accept to continue."
              : this.tagName === "SELECT"
                ? "Please choose an option."
                : "This field is required.";
        } else if (
          this.type === "email" &&
          value &&
          !EMAIL_PATTERN.test(value)
        ) {
          message = "Please enter a valid email address.";
        } else if (
          $field.attr("minlength") &&
          value &&
          value.length < Number($field.attr("minlength"))
        ) {
          message = "Use at least " + $field.attr("minlength") + " characters.";
        } else if (
          $field.data("match") &&
          value !==
            String($form.find("[name='" + $field.data("match") + "']").val())
        ) {
          message = "Passwords don't match.";
        }
        fieldError($field, message);
        if (message && !firstBad) firstBad = this;
      });
    if (firstBad) {
      if (firstBad.tomselect) firstBad.tomselect.focus();
      else firstBad.focus();
    }
    return !firstBad;
  }

  function formNote($form, message, type) {
    var $note = $form.find("[data-form-note]");
    if (!$note.length) {
      $note = $(
        '<p class="cs_form_note mb-0" data-form-note aria-live="polite"></p>',
      );
      $form.append($('<div class="col-12"></div>').append($note));
    }
    $note
      .removeClass("cs_success cs_error")
      .addClass("cs_" + type)
      .text(message)
      .show();
  }

  function formNoteInline($form, message) {
    var $note = $form.find("[data-form-note]");
    if (!$note.length)
      $note = $(
        '<p class="cs_form_note mb-0" data-form-note aria-live="polite"></p>',
      ).appendTo($form);
    $note.removeClass("cs_error").addClass("cs_success").text(message).show();
  }

  function passwordToggles() {
    $("input[type='password']").each(function () {
      if ($(this).parent().hasClass("cs_password_field")) return;
      var $input = $(this);
      var $btn = $(
        '<button type="button" class="cs_password_toggle" aria-label="Show password" aria-pressed="false"><i class="fa-regular fa-eye"></i></button>',
      );
      $input.wrap('<span class="cs_password_field"></span>').after($btn);
      $btn.on("click", function () {
        var show = $input.attr("type") === "password";
        $input.attr("type", show ? "text" : "password");
        $btn
          .attr({
            "aria-label": show ? "Hide password" : "Show password",
            "aria-pressed": show,
          })
          .find("i")
          .toggleClass("fa-eye", !show)
          .toggleClass("fa-eye-slash", show);
      });
    });
  }

  function formValidation() {
    passwordToggles();

    var MESSAGES = {
      login: ["Signing in...", "Welcome back! Taking you to your dashboard..."],
      register: [
        "Creating account...",
        "Account created! Check your email for a verification code...",
      ],
      forgot: [
        "Sending...",
        "If an account exists for that email, a reset link is on its way.",
      ],
    };

    $("[data-auth-form]").on("submit", function (e) {
      var $form = $(this);
      var demo = !$form.attr("action") || $form.attr("action") === "#";
      if (!validateForm($form)) {
        e.preventDefault();
        return;
      }
      if (!demo) return;
      e.preventDefault();
      var text = (
        MESSAGES[$form.data("auth-form")] || [
          "Sending...",
          "Thanks! We'll be in touch soon.",
        ]
      ).slice();
      if ($form.data("success")) text[1] = $form.data("success");
      var $btn = $form.find("[type='submit']");
      var label = $btn.find("span").first().text();
      $btn
        .prop("disabled", true)
        .addClass("cs_loading")
        .find("span")
        .first()
        .text(text[0]);
      setTimeout(function () {
        $btn
          .prop("disabled", false)
          .removeClass("cs_loading")
          .find("span")
          .first()
          .text(label);
        if ($form.hasClass("row")) formNote($form, text[1], "success");
        else formNoteInline($form, text[1]);
        var redirect = $form.data("redirect");
        if (redirect) {
          var role = $form.find("[name='role']").val() || "buyer";
          var email = encodeURIComponent(
            $form.find("[name='email']").val() || "",
          );
          setTimeout(function () {
            window.location.href = String(redirect)
              .replace("{role}", role)
              .replace("{email}", email);
          }, 1200);
        } else {
          $form[0].reset();
        }
      }, 900);
    });

    $(document).on(
      "input change",
      "[data-auth-form] .cs_invalid, [data-auth-form] select",
      function () {
        if ($(this).hasClass("cs_invalid") || this.tagName === "SELECT")
          fieldError($(this), "");
      },
    );

    $(".cs_newsletter_form")
      .attr("novalidate", true)
      .on("submit", function (e) {
        var $form = $(this);
        var $input = $form.find("input[type='email']");
        var value = String($input.val() || "").trim();
        var valid = EMAIL_PATTERN.test(value);
        if (valid && $form.attr("action") && $form.attr("action") !== "#")
          return;
        e.preventDefault();
        var $note = $form.next(".cs_newsletter_note");
        if (!$note.length)
          $note = $(
            '<p class="cs_newsletter_note mb-0" aria-live="polite"></p>',
          ).insertAfter($form);
        $note
          .toggleClass("cs_error", !valid)
          .text(
            valid
              ? "Thanks for subscribing! Please check your inbox."
              : "Please enter a valid email address.",
          );
        $input.toggleClass("cs_invalid", !valid).attr("aria-invalid", !valid);
        if (valid) $form[0].reset();
        else $input.trigger("focus");
      });
  }

  /* 49. Countdown (coming-soon.html) */
  function countdown() {
    $("[data-countdown]").each(function () {
      var $el = $(this);
      var target = Date.parse($el.data("countdown"));
      if (!target || target <= Date.now()) target = Date.now() + 30 * 86400000;
      var pad = function (n) {
        return (n < 10 ? "0" : "") + n;
      };
      function tick() {
        var left = Math.max(0, Math.floor((target - Date.now()) / 1000));
        $el.find("[data-days]").text(pad(Math.floor(left / 86400)));
        $el.find("[data-hours]").text(pad(Math.floor((left % 86400) / 3600)));
        $el.find("[data-minutes]").text(pad(Math.floor((left % 3600) / 60)));
        $el.find("[data-seconds]").text(pad(left % 60));
      }
      tick();
      setInterval(tick, 1000);
    });
  }

  /* 50. One-Time Code (verify-email.html) */
  function otpForm() {
    var $form = $("[data-otp-form]");
    if (!$form.length) return;
    var $inputs = $form.find(".cs_otp_inputs input");
    var $error = $form.find("[data-otp-error]");
    var params = window.URLSearchParams
      ? new URLSearchParams(window.location.search)
      : null;
    var role = (params && params.get("role")) || "buyer";
    var email = params && params.get("email");
    if (email) $("[data-verify-email]").text(email);

    function fill(from, text) {
      String(text)
        .replace(/\D/g, "")
        .split("")
        .forEach(function (digit, i) {
          if ($inputs[from + i]) $inputs[from + i].value = digit;
        });
      var next = Math.min(
        from + String(text).replace(/\D/g, "").length,
        $inputs.length - 1,
      );
      $inputs.eq(next).trigger("focus");
    }

    $inputs.on("input", function () {
      var index = $inputs.index(this);
      var value = this.value.replace(/\D/g, "");
      this.value = "";
      if (value) fill(index, value);
      $error.hide();
      $inputs.removeClass("cs_invalid");
    });
    $inputs.on("keydown", function (e) {
      var index = $inputs.index(this);
      if (e.key === "Backspace" && !this.value && index > 0)
        $inputs
          .eq(index - 1)
          .val("")
          .trigger("focus");
      if (e.key === "ArrowLeft" && index > 0)
        $inputs.eq(index - 1).trigger("focus");
      if (e.key === "ArrowRight" && index < $inputs.length - 1)
        $inputs.eq(index + 1).trigger("focus");
    });
    $inputs.on("paste", function (e) {
      var text = (
        e.originalEvent.clipboardData || window.clipboardData
      ).getData("text");
      e.preventDefault();
      fill($inputs.index(this), text);
    });

    $form.on("submit", function (e) {
      e.preventDefault();
      var code = $inputs
        .map(function () {
          return this.value;
        })
        .get()
        .join("");
      if (code.length < $inputs.length) {
        $inputs
          .filter(function () {
            return !this.value;
          })
          .addClass("cs_invalid");
        $error.text("Enter the 6-digit code from your email.").show();
        $inputs.filter(".cs_invalid").first().trigger("focus");
        return;
      }
      var $btn = $form.find("[type='submit']").prop("disabled", true);
      setTimeout(function () {
        $btn.prop("disabled", false);
        formNote(
          $form,
          "Email verified! Taking you to your dashboard...",
          "success",
        );
        setTimeout(function () {
          window.location.href = String($form.data("redirect")).replace(
            "{role}",
            role,
          );
        }, 1200);
      }, 700);
    });

    var $resend = $("[data-otp-resend]");
    var $timer = $("[data-otp-timer]");
    var timer;
    function cooldown(seconds) {
      $resend.prop("disabled", true);
      clearInterval(timer);
      timer = setInterval(function () {
        seconds--;
        $timer.text(
          seconds > 0 ? "(0:" + (seconds < 10 ? "0" : "") + seconds + ")" : "",
        );
        if (seconds <= 0) {
          clearInterval(timer);
          $resend.prop("disabled", false);
        }
      }, 1000);
      $timer.text("(0:" + seconds + ")");
    }
    $resend.on("click", function () {
      formNote($form, "A new code is on its way. Check your inbox.", "success");
      cooldown(30);
    });
    cooldown(30);
    $inputs.first().trigger("focus");
  }

  /* 51. Row Status Actions (leads, tours, approvals, agents) */
  function statusActions() {
    function recount($row) {
      var $box = $row
        .parents("[id]")
        .filter(function () {
          return (
            $('.cs_filter_tabs[data-target="#' + this.id + '"]').length > 0
          );
        })
        .first();
      if (!$box.length) return;
      var $tabs = $('.cs_filter_tabs[data-target="#' + $box.attr("id") + '"]');
      var $rows = $box.find("[data-status]");
      $tabs.find("[data-filter]").each(function () {
        var filter = $(this).data("filter");
        $(this)
          .find("span")
          .text(
            filter === "all"
              ? $rows.length
              : $rows.filter('[data-status="' + filter + '"]').length,
          );
      });
      $tabs.trigger("cs:refresh");
    }

    function applyStatus($row, status, label, badgeClass) {
      $row.attr("data-status", status).removeData("status");
      $row
        .find(".cs_status_badge")
        .first()
        .attr("class", "cs_status_badge cs_status_" + badgeClass)
        .text(label);
      $row.find(".cs_status_actions").remove();
      $row.addClass("cs_row_flash");
      setTimeout(function () {
        $row.removeClass("cs_row_flash");
      }, 1200);
      recount($row);
    }

    $(document).on("click", "[data-set-status]:not(form)", function () {
      var $btn = $(this);
      var $row = $btn.closest("[data-status]");
      $btn.filter(":not(.cs_status_actions *)").remove();
      applyStatus(
        $row,
        $btn.data("set-status"),
        $btn.data("status-label"),
        $btn.data("status-class"),
      );
    });

    $(document).on(
      "submit",
      ".cs_dash_modal form[data-set-status]",
      function (e) {
        e.preventDefault();
        var $form = $(this);
        var $opener = $form.closest("dialog").data("opener");
        var $row = $opener ? $opener.closest("[data-status]") : $();
        if ($row.length)
          applyStatus(
            $row,
            $form.data("set-status"),
            $form.data("status-label"),
            $form.data("status-class"),
          );
        this.closest("dialog").close();
      },
    );
  }

  /* 52. Table Search + CSV Export */
  function tableTools() {
    $("[data-table-search]").each(function () {
      var $form = $(this);
      var $table = $($form.data("table-search"));
      var $input = $form.find("input");
      var $tabs = $(
        '.cs_filter_tabs[data-target="#' + $table.attr("id") + '"]',
      );
      function apply() {
        var query = String($input.val() || "")
          .trim()
          .toLowerCase();
        $table
          .find("tbody tr")
          .not(".cs_empty_row")
          .each(function () {
            $(this).toggleClass(
              "cs_search_hidden",
              !!query && $(this).text().toLowerCase().indexOf(query) < 0,
            );
          });
        var visible = $table
          .find("tbody tr")
          .not(".cs_empty_row")
          .filter(function () {
            return (
              $(this).css("display") !== "none" &&
              !$(this).hasClass("cs_search_hidden")
            );
          }).length;
        $table.find(".cs_empty_row").toggle(visible === 0);
      }
      $form.on("submit", function (e) {
        e.preventDefault();
      });
      $input.on("input", apply);
      $tabs.on("click", "[data-filter]", function () {
        setTimeout(apply, 0);
      });
    });

    $("[data-export-table]").on("click", function () {
      var $table = $($(this).data("export-table"));
      var cell = function (el) {
        var text = $(el).find("h3").first().text() || $(el).text();
        text = text.replace(/\s+/g, " ").trim();
        return '"' + text.replace(/"/g, '""') + '"';
      };
      var keep = $table
        .find("thead th")
        .map(function (i) {
          return /actions/i.test($(this).text()) ? null : i;
        })
        .get();
      var lines = [
        $table
          .find("thead th")
          .filter(function (i) {
            return keep.indexOf(i) > -1;
          })
          .map(function () {
            return cell(this);
          })
          .get()
          .join(","),
      ];
      $table
        .find("tbody tr")
        .not(".cs_empty_row")
        .each(function () {
          if (
            $(this).css("display") === "none" ||
            $(this).hasClass("cs_search_hidden")
          )
            return;
          lines.push(
            $(this)
              .children("td")
              .filter(function (i) {
                return keep.indexOf(i) > -1;
              })
              .map(function () {
                return cell(this);
              })
              .get()
              .join(","),
          );
        });
      var blob = new Blob(["﻿" + lines.join("\r\n")], {
        type: "text/csv;charset=utf-8",
      });
      var link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = $(this).data("export-name") || "export.csv";
      document.body.appendChild(link);
      link.click();
      setTimeout(function () {
        URL.revokeObjectURL(link.href);
        link.remove();
      }, 0);
    });
  }

  /* 53. Tour Calendar (tour-requests.html) */
  function tourCalendar() {
    $("[data-tour-calendar]").each(function () {
      var $cal = $(this);
      var $table = $($cal.data("target"));
      var parts = String($cal.data("month") || "").split("-");
      var month =
        parts.length === 2 ? new Date(+parts[0], +parts[1] - 1, 1) : new Date();
      month.setDate(1);
      var selected = null;
      var iso = function (d) {
        return (
          d.getFullYear() +
          "-" +
          ("0" + (d.getMonth() + 1)).slice(-2) +
          "-" +
          ("0" + d.getDate()).slice(-2)
        );
      };

      function tours() {
        var map = {};
        $table.find("[data-tour-date]").each(function () {
          var key = $(this).data("tour-date");
          (map[key] = map[key] || []).push(String($(this).attr("data-status")));
        });
        return map;
      }

      function render() {
        var map = tours();
        var today = iso(new Date());
        var first = (month.getDay() + 6) % 7;
        var days = new Date(
          month.getFullYear(),
          month.getMonth() + 1,
          0,
        ).getDate();
        var html =
          '<div class="cs_calendar_head">' +
          '<button type="button" class="cs_calendar_nav" data-step="-1" aria-label="Previous month"><i class="fa-solid fa-chevron-left"></i></button>' +
          '<h3 class="cs_fs_18 cs_semibold mb-0">' +
          month.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          }) +
          "</h3>" +
          '<button type="button" class="cs_calendar_nav" data-step="1" aria-label="Next month"><i class="fa-solid fa-chevron-right"></i></button>' +
          '</div><div class="cs_calendar_grid">';
        ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].forEach(function (d) {
          html += '<span class="cs_calendar_weekday">' + d + "</span>";
        });
        for (var i = 0; i < first; i++) html += "<span></span>";
        for (var day = 1; day <= days; day++) {
          var key = iso(new Date(month.getFullYear(), month.getMonth(), day));
          var list = map[key] || [];
          var dots = list
            .slice(0, 3)
            .map(function (status) {
              var cls =
                status === "pending"
                  ? " cs_pending"
                  : status === "confirmed"
                    ? " cs_confirmed"
                    : "";
              return '<span class="cs_tour_dot' + cls + '"></span>';
            })
            .join("");
          html +=
            '<button type="button" class="cs_calendar_day' +
            (list.length ? " cs_has_event" : "") +
            (key === today ? " cs_today" : "") +
            (key === selected ? " active" : "") +
            '" data-date="' +
            key +
            '"' +
            (list.length
              ? ' aria-label="' +
                day +
                ", " +
                list.length +
                " tour" +
                (list.length > 1 ? "s" : "") +
                '"'
              : "") +
            ">" +
            day +
            (dots ? '<span class="cs_calendar_dots">' + dots + "</span>" : "") +
            "</button>";
        }
        $cal.html(html + "</div>");
      }

      $cal.on("click", ".cs_calendar_nav", function () {
        month.setMonth(month.getMonth() + Number($(this).data("step")));
        render();
      });
      $cal.on("click", ".cs_calendar_day", function () {
        var date = $(this).data("date");
        selected = selected === date ? null : date;
        $table.find("tr").removeClass("cs_row_highlight");
        if (selected) {
          var $rows = $table
            .find('[data-tour-date="' + selected + '"]')
            .addClass("cs_row_highlight");
          if ($rows.length && $rows.first().is(":hidden")) {
            $(
              '.cs_filter_tabs[data-target="#' +
                $table.attr("id") +
                '"] [data-filter="all"]',
            ).trigger("click");
          }
        }
        render();
      });
      $table.on("click", "[data-set-status]", function () {
        setTimeout(render, 0);
      });
      render();
    });
  }

  /* 54. Location Maps (Leaflet) */
  function locationMaps() {
    if (typeof L === "undefined") return;
    $("[data-map]").each(function () {
      var $el = $(this);
      var center = [
        Number($el.data("lat")) || 40.7128,
        Number($el.data("lng")) || -74.006,
      ];
      var map = L.map(this, {
        center: center,
        zoom: Number($el.data("zoom")) || 13,
        scrollWheelZoom: false,
        dragging: !L.Browser.mobile,
        tap: false,
      });
      L.tileLayer(MAP_TILES, {
        attribution: MAP_ATTRIBUTION,
        maxZoom: 19,
      }).addTo(map);
      if ($el.data("pin") !== false) {
        var marker = L.marker(center, {
          icon: L.divIcon({
            className: "cs_map_marker_wrap",
            html: '<span class="cs_map_pin"><i class="fa-solid fa-house"></i></span>',
            iconSize: [0, 0],
          }),
          title: $el.data("title") || "",
        }).addTo(map);
        if ($el.data("title")) {
          marker.bindPopup(
            "<strong>" +
              escapeHtml($el.data("title")) +
              "</strong>" +
              escapeHtml($el.data("address") || ""),
            { offset: [0, -50] },
          );
        }
      }
      $(window).on("load", function () {
        map.invalidateSize();
      });
      if (window.ResizeObserver) {
        new ResizeObserver(function () {
          map.invalidateSize();
        }).observe(this);
      }
    });
  }

  /* 58. Save Search + Saved Searches page */
  var FREQUENCIES = ["Instant", "Daily", "Weekly"];

  function saveSearch() {
    var $btn = $("[data-save-search]");
    var $grid = $(".cs_listing_grid").first();
    if (!$btn.length || !$grid.data("search")) return;

    var $panel = $(
      '<div class="cs_save_search_panel cs_white_bg cs_radius_15" role="dialog" aria-label="Save this search" hidden>' +
        '<form class="cs_save_search_form" novalidate>' +
        '<h3 class="cs_fs_18 cs_semibold cs_mb_5">Save this search</h3>' +
        '<p class="cs_fs_14 cs_mb_15" data-ss-summary></p>' +
        '<label class="cs_fs_14 cs_medium cs_primary_color cs_mb_5" for="ssName">Search name</label>' +
        '<input type="text" id="ssName" class="cs_form_field cs_radius_10 cs_mb_15" maxlength="60" required>' +
        '<p class="cs_fs_14 cs_medium cs_primary_color cs_mb_5">Email me new matches</p>' +
        '<div class="cs_ss_freq cs_mb_20" role="radiogroup" aria-label="Alert frequency">' +
        FREQUENCIES.map(function (f, i) {
          return (
            '<label><input type="radio" name="ssFreq" value="' +
            f +
            '"' +
            (i === 1 ? " checked" : "") +
            "><span>" +
            f +
            "</span></label>"
          );
        }).join("") +
        "</div>" +
        '<div class="cs_ss_btns">' +
        '<button type="button" class="cs_ss_cancel cs_medium">Cancel</button>' +
        '<button type="submit" class="cs_btn cs_style_1 cs_primary_bg cs_white_color cs_medium cs_primary_font cs_radius_10"><span>Save Search</span></button>' +
        "</div></form>" +
        '<div class="cs_ss_done text-center" hidden>' +
        '<span class="cs_ss_done_icon cs_center"><i class="fa-solid fa-bell"></i></span>' +
        '<h3 class="cs_fs_18 cs_semibold cs_mb_5">Search saved</h3>' +
        '<p class="cs_fs_14 cs_mb_15" data-ss-done-text></p>' +
        '<a href="buyer/saved-searches.html" class="cs_btn cs_style_1 cs_primary_bg cs_white_color cs_medium cs_primary_font cs_radius_10"><span>Manage Saved Searches</span></a>' +
        "</div></div>",
    ).insertAfter($btn);

    function setOpen(open) {
      $panel.prop("hidden", !open);
      $btn.attr("aria-expanded", open).toggleClass("active", open);
      if (!open) return;
      var search = $grid.data("search")();
      $panel.find("form").prop("hidden", false);
      $panel.find(".cs_ss_done").prop("hidden", true);
      $panel
        .find("[data-ss-summary]")
        .text(
          search.summary +
            " · " +
            search.matches +
            (search.matches === 1 ? " home" : " homes") +
            " now",
        );
      $panel
        .find("#ssName")
        .val(
          search.summary.length > 60
            ? search.summary.slice(0, 57) + "..."
            : search.summary,
        )
        .trigger("focus")
        .select();
    }

    $btn.on("click", function (e) {
      e.stopPropagation();
      setOpen($panel.prop("hidden"));
    });
    $panel.on("click", function (e) {
      e.stopPropagation();
    });
    $panel.on("click", ".cs_ss_cancel", function () {
      setOpen(false);
    });
    $(document).on("click", function () {
      setOpen(false);
    });
    $(document).on("keydown", function (e) {
      if (e.key === "Escape") setOpen(false);
    });

    $panel.find("form").on("submit", function (e) {
      e.preventDefault();
      var $name = $panel.find("#ssName");
      var name = String($name.val() || "").trim();
      if (!name) {
        fieldError($name, "Give your search a name.");
        $name.trigger("focus");
        return;
      }
      fieldError($name, "");
      var frequency = $panel.find("input[name='ssFreq']:checked").val();
      $panel.find("form").prop("hidden", true);
      $panel.find(".cs_ss_done").prop("hidden", false);
      $panel
        .find("[data-ss-done-text]")
        .text(
          frequency === "Instant"
            ? "We'll email you as soon as a new home matches."
            : "We'll email you new matches " + frequency.toLowerCase() + ".",
        );
    });
  }

  function savedSearchesPage() {
    var $table = $("[data-saved-searches]");
    if (!$table.length) return;
    var $tbody = $table.find("tbody");
    var $empty = $tbody.find(".cs_empty_row");

    function refresh() {
      var rows = $tbody.children("tr").not($empty).length;
      $("[data-search-count]").text(rows);
      $empty.toggle(rows === 0);
    }

    $tbody.on("click", ".cs_action_reject", function () {
      var $row = $(this).closest("tr");
      $row.fadeOut(200, function () {
        $row.remove();
        refresh();
      });
    });
    $empty.toggle($tbody.children("tr").not($empty).length === 0);
  }

  /* 59. Property Reviews */

  function setStars($rating, value) {
    $rating
      .attr("data-rating", value)
      .find(".cs_rating_percentage")
      .css("width", value * 20 + "%");
  }

  function reviewAvatar(name) {
    var initials = String(name || "?")
      .split(/\s+/)
      .map(function (w) {
        return w.charAt(0);
      })
      .join("")
      .slice(0, 2)
      .toUpperCase();
    return (
      '<span class="cs_review_initials cs_center">' +
      escapeHtml(initials) +
      "</span>"
    );
  }

  function reviewItem(review) {
    var date = new Date(review.date).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
    return (
      '<li class="cs_review_item cs_review_new" data-rating="' +
      review.rating +
      '">' +
      '<div class="cs_review_head">' +
      reviewAvatar(review.name) +
      '<div class="cs_review_head_info"><h4 class="cs_fs_16 cs_semibold cs_mb_3">' +
      escapeHtml(review.name) +
      "</h4>" +
      '<div class="cs_review_meta"><div class="cs_rating" data-rating="' +
      review.rating +
      '"><div class="cs_rating_percentage" style="width: ' +
      review.rating * 20 +
      '%"></div></div>' +
      "<span>" +
      date +
      "</span>" +
      '<span class="cs_status_badge cs_status_pending">Awaiting approval</span>' +
      "</div></div></div>" +
      '<p class="mb-0">' +
      escapeHtml(review.text) +
      "</p>" +
      "</li>"
    );
  }

  function propertyReviews() {
    var $box = $("[data-property-reviews]");
    if (!$box.length) return;
    var $list = $box.find("[data-review-list]");
    var $form = $box.find("[data-review-form]");

    function summary() {
      var ratings = $list
        .children("[data-rating]")
        .map(function () {
          return Number($(this).attr("data-rating"));
        })
        .get();
      var total = ratings.length;
      var average = total
        ? ratings.reduce(function (a, b) {
            return a + b;
          }, 0) / total
        : 0;
      $box.find("[data-review-average]").text(average.toFixed(1));
      $box.find("[data-review-count]").text(total);
      setStars($box.find("[data-review-stars]"), average);
      $box.find("[data-review-bars] li").each(function () {
        var star = Number($(this).data("star"));
        var count = ratings.filter(function (r) {
          return Math.round(r) === star;
        }).length;
        $(this)
          .find(".cs_progress span")
          .css("width", (total ? (count / total) * 100 : 0) + "%");
        $(this).children("span").last().text(count);
      });
    }

    $form.on("change", "input[name='rating']", function () {
      $form.find("[data-star-error]").prop("hidden", true);
    });

    $form.on("submit", function (e) {
      e.preventDefault();
      var rating = Number(
        $form.find("input[name='rating']:checked").val() || 0,
      );
      $form.find("[data-star-error]").prop("hidden", !!rating);
      var fieldsOk = validateForm($form);
      if (!rating || !fieldsOk) return;
      var review = {
        name: String($form.find("[name='name']").val()).trim(),
        rating: rating,
        text: String($form.find("[name='review']").val()).trim(),
        date: new Date().toISOString(),
      };
      $(reviewItem(review)).hide().prependTo($list).fadeIn(300);
      summary();
      $form[0].reset();
      formNoteInline(
        $form,
        "Thanks! Your review was sent and will appear once it's approved.",
      );
    });

    summary();
  }

  function reviewsDashboard() {
    var $list = $(".cs_dashboard_content .cs_review_list");
    if (!$list.length) return;
    $list.children().each(function (i) {
      $(this).data("index", i);
    });

    $list.on("click", ".cs_review_actions button:has(.fa-reply)", function () {
      var $item = $(this).closest(".cs_review_item");
      if ($item.find(".cs_reply_form").length) return;
      $(
        '<form class="cs_reply_form"><textarea name="reply" class="cs_form_field" rows="3" placeholder="Write a public reply..." aria-label="Your reply" required></textarea>' +
          '<div class="cs_reply_btns"><button type="button" class="cs_btn cs_style_1 cs_btn_outline cs_medium cs_radius_10" data-reply-cancel><span>Cancel</span></button>' +
          '<button type="submit" class="cs_btn cs_style_1 cs_primary_bg cs_white_color cs_medium cs_radius_10"><span>Post Reply</span></button></div></form>',
      )
        .insertAfter($item.find(".cs_review_actions"))
        .find("textarea")
        .trigger("focus");
    });
    $list.on("click", "[data-reply-cancel]", function () {
      $(this).closest(".cs_reply_form").remove();
    });
    $list.on("submit", ".cs_reply_form", function (e) {
      e.preventDefault();
      var text = String($(this).find("textarea").val() || "").trim();
      if (!text) {
        $(this).find("textarea").addClass("cs_invalid").trigger("focus");
        return;
      }
      var $item = $(this).closest(".cs_review_item");
      $item.find(".cs_review_actions").remove();
      $(this).replaceWith(
        '<div class="cs_review_reply"><p class="cs_fs_14 cs_semibold cs_primary_color cs_mb_3">Your reply</p><p class="cs_fs_14 mb-0">' +
          escapeHtml(text) +
          "</p></div>",
      );
    });
    $list.on("click", ".cs_review_actions button:has(.fa-flag)", function () {
      $(this)
        .prop("disabled", true)
        .html('<i class="fa-solid fa-flag"></i> Reported');
    });

    // Sort select in the card head
    $list
      .closest(".cs_dashboard_card")
      .find(".cs_card_head select")
      .on("change", function () {
        var by = String($(this).val() || "").toLowerCase();
        var rating = function (el) {
          return (
            Number($(el).find(".cs_rating").first().attr("data-rating")) || 0
          );
        };
        $list
          .children()
          .get()
          .sort(function (a, b) {
            if (by.indexOf("highest") > -1) return rating(b) - rating(a);
            if (by.indexOf("lowest") > -1) return rating(a) - rating(b);
            return $(a).data("index") - $(b).data("index");
          })
          .forEach(function (el) {
            $list.append(el);
          });
      });
  }

  /* 60. Price History (property-details.html) */
  function priceHistory() {
    var $table = $("[data-price-table]");
    var $chart = $("[data-price-history]");
    if (!$table.length) return;
    var points = [];
    $table.find("tbody tr").each(function (i) {
      var date = new Date($(this).data("date") + "T00:00:00");
      var price = Number($(this).data("price"));
      var prev = points.length ? points[points.length - 1].price : null;
      var cells = $(this).children("td");
      cells
        .eq(0)
        .text(
          date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
        );
      cells
        .eq(2)
        .html(
          '<span class="cs_primary_color cs_semibold">' +
            formatMoney(price) +
            "</span>",
        );
      if (prev === null || i === 0) {
        cells.eq(3).html('<span class="cs_change">&mdash;</span>');
      } else {
        var change = ((price - prev) / prev) * 100;
        cells
          .eq(3)
          .html(
            '<span class="cs_change ' +
              (change < 0 ? "cs_down" : "cs_up") +
              '"><i class="fa-solid fa-arrow-' +
              (change < 0 ? "down" : "up") +
              '"></i>' +
              Math.abs(change).toFixed(1) +
              "%</span>",
          );
      }
      points.push({ date: date, price: price });
    });
    if (!$chart.length || points.length < 2) return;

    var W = 640,
      H = 220,
      pad = { top: 16, right: 16, bottom: 30, left: 64 };
    var t0 = points[0].date.getTime();
    var t1 = Math.max(points[points.length - 1].date.getTime(), Date.now());
    var prices = points.map(function (p) {
      return p.price;
    });
    var lo = Math.min.apply(null, prices) * 0.95;
    var hi = Math.max.apply(null, prices) * 1.05;
    var rtl = getComputedStyle($chart[0]).direction === "rtl";
    var mx = function (v) {
      return rtl ? W - v : v;
    };
    var x = function (t) {
      return mx(pad.left + ((t - t0) / (t1 - t0)) * (W - pad.left - pad.right));
    };
    var y = function (v) {
      return pad.top + (1 - (v - lo) / (hi - lo)) * (H - pad.top - pad.bottom);
    };

    // Step line
    var d = "M" + x(t0) + "," + y(points[0].price);
    points.forEach(function (p, i) {
      if (i) d += " H" + x(p.date.getTime()) + " V" + y(p.price);
    });
    d += " H" + x(t1);
    var area = d + " V" + (H - pad.bottom) + " H" + x(t0) + " Z";

    var svg =
      '<svg viewBox="0 0 ' +
      W +
      " " +
      H +
      '" class="cs_price_history_svg" direction="ltr" aria-hidden="true">' +
      '<defs><linearGradient id="csPriceFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="var(--accent-color)" stop-opacity="0.25"/><stop offset="1" stop-color="var(--accent-color)" stop-opacity="0"/></linearGradient></defs>';
    [hi, (hi + lo) / 2, lo].forEach(function (v) {
      svg +=
        '<line x1="' +
        mx(pad.left) +
        '" x2="' +
        mx(W - pad.right) +
        '" y1="' +
        y(v) +
        '" y2="' +
        y(v) +
        '" class="cs_grid_line"/>' +
        '<text x="' +
        mx(pad.left - 10) +
        '" y="' +
        (y(v) + 4) +
        '" text-anchor="' +
        (rtl ? "start" : "end") +
        '" class="cs_axis_label">' +
        shortMoney(v) +
        "</text>";
    });
    var years = {};
    points.forEach(function (p) {
      years[p.date.getFullYear()] = p.date.getTime();
    });
    years[new Date(t1).getFullYear()] = t1;
    Object.keys(years).forEach(function (yr) {
      svg +=
        '<text x="' +
        x(years[yr]) +
        '" y="' +
        (H - 8) +
        '" text-anchor="middle" class="cs_axis_label">' +
        yr +
        "</text>";
    });
    svg +=
      '<path d="' +
      area +
      '" fill="url(#csPriceFill)"/><path d="' +
      d +
      '" class="cs_price_line"/>';
    points.forEach(function (p) {
      svg +=
        '<circle cx="' +
        x(p.date.getTime()) +
        '" cy="' +
        y(p.price) +
        '" r="5" class="cs_price_dot"><title>' +
        p.date.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        }) +
        ": " +
        formatMoney(p.price) +
        "</title></circle>";
    });
    $chart.html(svg + "</svg>");
  }

  /* 61. Currency Switcher */
  var SITE_CONFIG = {
    currencies: {
      USD: { rate: 1, symbol: "$" },
      EUR: { rate: 0.92, symbol: "€" },
      GBP: { rate: 0.79, symbol: "£" },
      AED: { rate: 3.67, symbol: "AED " },
    },
  };
  var CURRENCY_KEY = "xproperty-currency";
  var PRICE_SELECTORS =
    ".cs_property_price, .cs_map_marker, .cs_map_popup_price, .cs_compare_table td, " +
    ".cs_saved_property_info > p:first-child, .cs_range_values, .cs_price_history_table td, .cs_axis_label, " +
    ".cs_property_header_right p";

  function currencySwitch() {
    var $select = $("[data-currency-select]");
    if (!$select.length) return;
    var code = readPref(CURRENCY_KEY);
    if (!SITE_CONFIG.currencies[code]) code = "USD";
    var converted = [];
    var pattern = /\$\s?(\d[\d,]*(?:\.\d+)?)(\s?[KM](?![a-z]))?/g;

    function format(usd, compact) {
      var c = SITE_CONFIG.currencies[code];
      var v = usd * c.rate;
      if (compact)
        return (
          c.symbol +
          (v >= 1000000
            ? +(v / 1000000).toFixed(2) + "M"
            : Math.round(v / 1000) + "K")
        );
      return c.symbol + Math.round(v).toLocaleString("en-US");
    }

    function convert(node) {
      if (node.csUsd === undefined) {
        if (!/\$\s?\d/.test(node.nodeValue)) return;
        node.csUsd = node.nodeValue;
        converted.push(node);
      }
      node.nodeValue =
        code === "USD"
          ? node.csUsd
          : node.csUsd.replace(pattern, function (m, num, suffix) {
              var usd = Number(num.replace(/,/g, ""));
              if (suffix)
                return format(
                  usd * (suffix.trim() === "M" ? 1000000 : 1000),
                  true,
                );
              return format(usd, false);
            });
    }

    function scan(root) {
      $(root)
        .find(PRICE_SELECTORS)
        .addBack(PRICE_SELECTORS)
        .each(function () {
          var walker = document.createTreeWalker(this, NodeFilter.SHOW_TEXT);
          var node;
          while ((node = walker.nextNode())) convert(node);
        });
    }

    function apply() {
      converted = converted.filter(function (n) {
        return n.isConnected;
      });
      converted.forEach(convert);
      scan(document.body);
      $select.val(code);
    }

    $select.on("change", function () {
      code = $(this).val();
      savePref(CURRENCY_KEY, code);
      apply();
    });

    if (window.MutationObserver) {
      new MutationObserver(function (mutations) {
        if (code === "USD") return;
        mutations.forEach(function (m) {
          Array.prototype.forEach.call(m.addedNodes, function (n) {
            if (n.nodeType === 1) scan(n);
            else if (
              n.nodeType === 3 &&
              n.parentElement &&
              $(n.parentElement).closest(PRICE_SELECTORS).length
            )
              convert(n);
          });
        });
      }).observe(document.body, { childList: true, subtree: true });
    }
    apply();
  }

  /* 57. Blog Filter (blog.html, blog-grid.html, blog-list.html) */
  function blogFilter() {
    var $posts = $("[data-blog-posts]");
    if (!$posts.length) return;
    var $status = $("[data-blog-status]");
    var $empty = $("[data-blog-empty]");
    var $search = $("[data-blog-search] input");
    var state = { category: "", tag: "", search: "" };
    if (window.URLSearchParams) {
      var params = new URLSearchParams(window.location.search);
      ["category", "tag", "search"].forEach(function (k) {
        state[k] = params.get(k) || "";
      });
    }
    var label = function (type, value) {
      var $link = $(
        '[data-blog-filter="' + type + '"][data-value="' + value + '"]',
      ).first();
      return $link.length ? $link.text().replace(/\s*\(\d+\)$/, "") : value;
    };

    function render() {
      var query = state.search.toLowerCase();
      var shown = 0;
      $posts.children().each(function () {
        var $post = $(this).find(".cs_post").first();
        var tags = String($post.data("tags") || "").split(",");
        var ok =
          (!state.category || $post.data("category") === state.category) &&
          (!state.tag || tags.indexOf(state.tag) > -1) &&
          (!query || $post.text().toLowerCase().indexOf(query) > -1);
        $(this).toggle(ok);
        if (ok) shown++;
      });
      var parts = [];
      if (state.category)
        parts.push(
          "in <strong>" +
            escapeHtml(label("category", state.category)) +
            "</strong>",
        );
      if (state.tag)
        parts.push(
          "tagged <strong>" + escapeHtml(label("tag", state.tag)) + "</strong>",
        );
      if (state.search)
        parts.push(
          "matching <strong>&ldquo;" +
            escapeHtml(state.search) +
            "&rdquo;</strong>",
        );
      $status.prop("hidden", !parts.length);
      $status
        .find("p")
        .html(
          "Showing " +
            shown +
            " article" +
            (shown === 1 ? "" : "s") +
            " " +
            parts.join(", "),
        );
      $empty.prop("hidden", shown > 0);
      $("[data-blog-pagination]").toggle(!parts.length);
      $("[data-blog-filter]").each(function () {
        var type = $(this).data("blog-filter");
        $(this).toggleClass(
          "active",
          String($(this).data("value")) === state[type],
        );
      });
      $search.val(state.search);
      if (window.history.replaceState) {
        var q = [];
        ["category", "tag", "search"].forEach(function (k) {
          if (state[k]) q.push(k + "=" + encodeURIComponent(state[k]));
        });
        window.history.replaceState(
          null,
          "",
          window.location.pathname + (q.length ? "?" + q.join("&") : ""),
        );
      }
    }

    $(document).on("click", "[data-blog-filter]", function (e) {
      e.preventDefault();
      var type = $(this).data("blog-filter");
      var value = String($(this).data("value") || "");
      state[type] = state[type] === value ? "" : value;
      render();
    });
    $(document).on("click", "[data-blog-clear]", function (e) {
      e.preventDefault();
      state = { category: "", tag: "", search: "" };
      render();
    });
    var timer;
    $search.on("input", function () {
      clearTimeout(timer);
      var value = String($(this).val() || "").trim();
      timer = setTimeout(function () {
        state.search = value;
        render();
      }, 200);
    });
    $("[data-blog-search]").on("submit", function (e) {
      e.preventDefault();
      state.search = String($search.val() || "").trim();
      render();
    });
    render();
  }

  /* 56. Property Forms (submit wizard + edit validation) */
  var WIZARD_STEPS = [
    "Basics",
    "Location",
    "Photos & Media",
    "Amenities",
    "Review",
  ];

  function propertyForms() {
    $("[data-property-form]").each(function () {
      var $form = $(this);
      var demo = !$form.attr("action") || $form.attr("action") === "#";
      var $actions = $form.find(".cs_form_actions").first();

      function photosOk($scope) {
        var $upload = $scope.find(".cs_upload_wrap");
        if (!$upload.length) return true;
        var ok = $upload.find(".cs_upload_previews > div").length > 0;
        $upload.children(".cs_field_error").remove();
        if (!ok)
          $upload.append(
            '<span class="cs_field_error" role="alert">Add at least one photo.</span>',
          );
        return ok;
      }

      function valid($scope) {
        var fields = validateForm($scope);
        return photosOk($scope) && fields;
      }

      function busy($btn, text, done) {
        var $label = $btn.find("span").last();
        var old = $label.text();
        $btn.prop("disabled", true).addClass("cs_loading");
        $label.text(text);
        setTimeout(function () {
          $btn.prop("disabled", false).removeClass("cs_loading");
          $label.text(old);
          done();
        }, 900);
      }

      function note(message) {
        var $note = $actions.siblings("[data-form-note]");
        if (!$note.length)
          $note = $(
            '<p class="cs_form_note cs_success mb-0" data-form-note aria-live="polite"></p>',
          ).insertAfter($actions);
        $note.text(message).show();
        clearTimeout($note.data("timer"));
        $note.data(
          "timer",
          setTimeout(function () {
            $note.fadeOut(300);
          }, 4000),
        );
      }

      $actions.find("button.cs_btn_outline").on("click", function () {
        var $btn = $(this);
        busy($btn, "Saving...", function () {
          note("Draft saved. You can finish it later from your listings.");
        });
      });

      $(document).on(
        "input change",
        "[data-property-form] .cs_invalid",
        function () {
          fieldError($(this), "");
        },
      );
      $form.on("change", ".cs_upload_box input[type='file']", function () {
        setTimeout(function () {
          photosOk($form);
        }, 50);
      });

      if (!$form.is("[data-wizard]")) {
        $form.on("submit", function (e) {
          if (!valid($form)) {
            e.preventDefault();
            return;
          }
          if (!demo) return;
          e.preventDefault();
          busy($form.find("[type='submit']"), "Saving...", function () {
            note("Changes saved. Your listing is updated.");
          });
        });
        return;
      }

      /* Wizard */
      var last = WIZARD_STEPS.length;
      var current = 1;
      $form.addClass("cs_wizard");
      $form.children("[class*='cs_height_']").remove();

      var $steps = $(
        '<ol class="cs_wizard_steps cs_dashboard_card" aria-label="Submission steps"></ol>',
      );
      WIZARD_STEPS.forEach(function (label, i) {
        $steps.append(
          '<li><button type="button" data-goto="' +
            (i + 1) +
            '"><span class="cs_wizard_num">' +
            (i + 1) +
            '</span><span class="cs_wizard_label">' +
            label +
            "</span></button></li>",
        );
      });
      $form.prepend($steps);

      var $review = $(
        '<div class="cs_dashboard_card" data-step="' +
          last +
          '"><div class="cs_form_section">' +
          '<h3 class="cs_form_section_title cs_fs_18 cs_semibold"><i class="fa-solid fa-clipboard-check"></i>Review &amp; Submit</h3>' +
          '<p class="cs_fs_14 cs_mb_20">Check the details below. Use Edit to change a step before you submit.</p>' +
          '<div class="cs_wizard_review"></div></div></div>',
      );
      var $nav = $('<div class="cs_dashboard_card cs_wizard_nav"></div>');
      $nav.append(
        '<button type="button" class="cs_btn cs_style_1 cs_btn_outline cs_medium cs_radius_10" data-wizard-back><span><i class="fa-solid fa-arrow-left"></i></span><span>Back</span></button>' +
          '<span class="cs_wizard_count cs_fs_14"></span>',
      );
      $actions.append(
        '<button type="button" class="cs_btn cs_style_1 cs_primary_bg cs_white_color cs_medium cs_radius_10" data-wizard-next><span>Next Step</span><span><i class="fa-solid fa-arrow-right"></i></span></button>',
      );
      $nav.append($actions);
      $form.append($review, $nav);

      function stepCards(n) {
        return $form.children('[data-step="' + n + '"]');
      }

      function fieldValue($field) {
        if ($field.is("select")) return $field.find("option:selected").text();
        return String($field.val() || "").trim();
      }

      function renderReview() {
        var html = "";
        for (var n = 1; n < last; n++) {
          var rows = "";
          stepCards(n)
            .find(".cs_form_label")
            .each(function () {
              var $field = $(
                "#" + String($(this).attr("for")).replace(/-ts-control$/, ""),
              );
              var value = $field.length ? fieldValue($field) : "";
              if (
                /price/i.test($(this).text()) &&
                $field.attr("type") === "number" &&
                value
              )
                value = formatMoney(value);
              if (value.length > 90) value = value.slice(0, 90).trim() + "...";
              if (value)
                rows +=
                  "<li><span>" +
                  escapeHtml($(this).text()) +
                  '</span><span class="cs_primary_color cs_medium">' +
                  escapeHtml(value) +
                  "</span></li>";
            });
          var photos = stepCards(n).find(".cs_upload_previews > div").length;
          if (photos)
            rows +=
              '<li><span>Photos</span><span class="cs_primary_color cs_medium">' +
              photos +
              " uploaded</span></li>";
          var checked = stepCards(n)
            .find(".cs_custom_checkbox input:checked")
            .map(function () {
              return $("label[for='" + this.id + "']").text();
            })
            .get();
          if (checked.length)
            rows +=
              '<li class="cs_wizard_review_wide"><span>Selected</span><span class="cs_primary_color cs_medium">' +
              escapeHtml(checked.join(", ")) +
              "</span></li>";
          html +=
            '<div class="cs_wizard_review_group"><div class="cs_wizard_review_head"><h4 class="cs_fs_16 cs_semibold mb-0">' +
            n +
            ". " +
            WIZARD_STEPS[n - 1] +
            '</h4><button type="button" class="cs_wizard_edit" data-goto="' +
            n +
            '"><i class="fa-solid fa-pen"></i>Edit</button></div>' +
            '<ul class="cs_mp_0">' +
            (rows || "<li><span>Nothing added yet</span></li>") +
            "</ul></div>";
        }
        $review.find(".cs_wizard_review").html(html);
      }

      function show(n, focus) {
        current = n;
        $form.children("[data-step]").hide();
        stepCards(n).show();
        $steps.find("li").each(function (i) {
          $(this)
            .toggleClass("active", i + 1 === n)
            .toggleClass("done", i + 1 < n)
            .find("button")
            .attr("aria-current", i + 1 === n ? "step" : null);
        });
        $steps.css("--cs-progress", (n - 1) / (last - 1));
        $nav
          .find("[data-wizard-back]")
          .css("visibility", n > 1 ? "visible" : "hidden");
        $nav.find("[data-wizard-next]").toggle(n < last);
        $actions.find("[type='submit']").toggle(n === last);
        $nav.find(".cs_wizard_count").text("Step " + n + " of " + last);
        if (n === last) renderReview();
        if (focus) {
          window.scrollTo({
            top: Math.max(0, $form.offset().top - 110),
            behavior: "smooth",
          });
        }
      }

      function go(n) {
        if (n === current) return;
        for (var s = current; s < n; s++) {
          if (s < last && !valid(stepCards(s))) {
            if (s !== current) show(s, true);
            return;
          }
        }
        show(n, true);
      }

      $nav.on("click", "[data-wizard-next]", function () {
        go(current + 1);
      });
      $nav.on("click", "[data-wizard-back]", function () {
        go(current - 1);
      });
      $form.on("click", "[data-goto]", function () {
        go(Number($(this).data("goto")));
      });

      $form.on("submit", function (e) {
        for (var s = 1; s < last; s++) {
          if (!valid(stepCards(s))) {
            e.preventDefault();
            show(s, true);
            return;
          }
        }
        if (!demo) return;
        e.preventDefault();
        busy($actions.find("[type='submit']"), "Submitting...", function () {
          $form.children().hide();
          $(
            '<div class="cs_dashboard_card cs_wizard_done text-center">' +
              '<span class="cs_wizard_done_icon cs_center"><i class="fa-solid fa-check"></i></span>' +
              '<h2 class="cs_fs_25 cs_semibold cs_mb_10">Property submitted for review</h2>' +
              '<p class="cs_mb_24">Thanks! Our team usually reviews new listings within 24 hours. We&rsquo;ll email you as soon as it goes live.</p>' +
              '<div class="cs_wizard_done_btns">' +
              '<a href="' +
              escapeHtml($form.data("done-url") || "index.html") +
              '" class="cs_btn cs_style_1 cs_primary_bg cs_white_color cs_medium cs_radius_10"><span>View My Listings</span></a>' +
              '<a href="' +
              escapeHtml(window.location.pathname.split("/").pop()) +
              '" class="cs_btn cs_style_1 cs_btn_outline cs_medium cs_radius_10"><span>Submit Another</span></a>' +
              "</div></div>",
          ).appendTo($form);
          window.scrollTo({
            top: Math.max(0, $form.offset().top - 110),
            behavior: "smooth",
          });
        });
      });

      show(1, false);
    });
  }

  /* 46. Hero Search */
  function heroSearch() {
    $(".cs_search_form").on("submit", function (e) {
      if ($(this).attr("action") && $(this).attr("action") !== "#") return;
      e.preventDefault();
      var $form = $(this);
      var params = new URLSearchParams();
      var add = function (name, value) {
        if (value && value !== "all") params.append(name, value);
      };
      var rooms = function (value) {
        return value === "more4" ? "5+" : value;
      };

      var offer =
        $form.find("[name='property-category']").val() ||
        ($form.closest(".cs_tab").attr("id") === "rent" ? "rent" : "buy");
      add("type", $form.find("[name='property-type']").val());
      add("location", $form.find("[name='property-location']").val());
      add("beds", rooms($form.find("[name='bedroom']").val()));
      add("baths", rooms($form.find("[name='bathroom']").val()));

      var $modal = $(".cs_advanced_search_modal");
      $modal.find("input[type='checkbox']:checked").each(function () {
        var room = /^(bed|bath)(\d|more4|4\+)$/.exec(this.id);
        if (room) add(room[1] + "s", /^\d$/.test(room[2]) ? room[2] : "5+");
        else if (AMENITY_LABELS[this.id]) add("amenities", this.id);
      });
      ["min-price", "max-price", "min-area", "max-area"].forEach(
        function (name) {
          add(name, toNumber($modal.find("[name='" + name + "']").val()));
        },
      );

      var query = params.toString();
      window.location.href =
        (offer === "rent"
          ? "property-listing-rent.html"
          : "property-listing-buy.html") + (query ? "?" + query : "");
    });
  }

  /* 43. Property Map (Leaflet + MarkerCluster) */
  var MAP_TILES = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
  var MAP_ATTRIBUTION =
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

  function propertyMap() {
    var el = document.getElementById("propertyMap");
    if (!el || typeof L === "undefined") return;
    var $grid = $(".cs_listing_grid").first();
    var $boundsToggle = $("#mapSearchToggle");
    var map = L.map(el, {
      center: [
        Number($(el).data("lat")) || 40.73,
        Number($(el).data("lng")) || -73.98,
      ],
      zoom: Number($(el).data("zoom")) || 12,
      zoomControl: false,
    });
    L.control.zoom({ position: "bottomright" }).addTo(map);

    L.tileLayer(MAP_TILES, {
      attribution: MAP_ATTRIBUTION,
      maxZoom: 19,
    }).addTo(map);

    var hasCluster = typeof L.markerClusterGroup === "function";
    var layer = hasCluster
      ? L.markerClusterGroup({
          showCoverageOnHover: false,
          maxClusterRadius: 45,
          iconCreateFunction: function (cluster) {
            return L.divIcon({
              html: "<span>" + cluster.getChildCount() + "</span>",
              className: "cs_map_cluster",
              iconSize: L.point(46, 46),
            });
          },
        })
      : L.layerGroup();
    layer.addTo(map);

    var markers = {};
    $grid.find("[data-lat][data-lng]").each(function () {
      var $card = $(this);
      var id = $card.attr("data-id");
      var price = Number($card.attr("data-price"));
      var rent = $card.attr("data-offer") === "rent";
      var title = $card.find(".cs_property_title a").first();
      var popup =
        '<a href="' +
        escapeHtml(title.attr("href")) +
        '" class="cs_map_popup_card">' +
        '<span class="cs_map_popup_thumb"><img src="' +
        escapeHtml($card.find(".cs_card_img_front").attr("src")) +
        '" alt="">' +
        '<span class="cs_map_popup_price cs_primary_font cs_semibold">' +
        "<bdi>" +
        formatMoney(price) +
        (rent ? "<small>/month</small>" : "") +
        "</bdi></span></span>" +
        '<span class="cs_map_popup_body">' +
        '<span class="cs_map_popup_title cs_primary_font cs_semibold cs_primary_color">' +
        escapeHtml(title.text()) +
        "</span>" +
        '<span class="cs_map_popup_address">' +
        escapeHtml($card.find(".cs_property_location_text p").text()) +
        "</span>" +
        '<span class="cs_map_popup_meta">' +
        $card.attr("data-beds") +
        " Beds &middot; " +
        $card.attr("data-baths") +
        " Baths &middot; " +
        $card.attr("data-area") +
        " Sqft</span>" +
        "</span></a>";
      var marker = L.marker(
        [Number($card.attr("data-lat")), Number($card.attr("data-lng"))],
        {
          icon: L.divIcon({
            className: "cs_map_marker_wrap",
            html:
              '<span class="cs_map_marker cs_primary_font">' +
              shortMoney(price) +
              "</span>",
            iconSize: [0, 0],
          }),
          title: title.text(),
          riseOnHover: true,
        },
      ).bindPopup(popup, {
        className: "cs_map_popup",
        minWidth: 250,
        maxWidth: 250,
        offset: [0, -38],
        closeButton: false,
      });
      marker.on("click", function () {
        $grid.find(".cs_card.cs_map_active").removeClass("cs_map_active");
        $card.addClass("cs_map_active");
      });
      markers[id] = marker;
    });

    function highlight(id, on) {
      var marker = markers[id];
      if (!marker || !map.hasLayer(layer)) return;
      var shown = hasCluster ? layer.getVisibleParent(marker) : marker;
      if (shown && shown.getElement && shown.getElement()) {
        $(shown.getElement()).toggleClass("cs_active", on);
        if (shown === marker) marker.setZIndexOffset(on ? 1000 : 0);
      }
    }

    function show(matched, fit) {
      layer.clearLayers();
      var visible = [];
      $(matched).each(function () {
        var marker = markers[$(this).find("[data-id]").first().attr("data-id")];
        if (marker) visible.push(marker);
      });
      if (hasCluster) layer.addLayers(visible);
      else
        visible.forEach(function (m) {
          layer.addLayer(m);
        });
      if (fit && visible.length) {
        map.fitBounds(L.featureGroup(visible).getBounds(), {
          padding: [60, 60],
          maxZoom: 14,
        });
      }
    }

    $grid.on("cs:listing", function (e, matched) {
      show(matched, !$boundsToggle.is(":checked"));
    });
    $grid.on("mouseenter", "[data-lat]", function () {
      highlight($(this).attr("data-id"), true);
    });
    $grid.on("mouseleave", "[data-lat]", function () {
      highlight($(this).attr("data-id"), false);
    });

    $grid.data("extraFilter", function ($card) {
      if (!$boundsToggle.is(":checked")) return true;
      return map
        .getBounds()
        .contains([
          Number($card.attr("data-lat")),
          Number($card.attr("data-lng")),
        ]);
    });
    map.on("moveend", function () {
      if ($boundsToggle.is(":checked")) $grid.trigger("cs:refresh");
    });
    $boundsToggle.on("change", function () {
      $grid.trigger("cs:refresh");
    });

    show(
      $grid.data("matched") || $grid.children(".cs_listing_item").get(),
      true,
    );
    $(window).on("load resize", function () {
      map.invalidateSize();
    });
  }

  /* 44. Property Compare */
  var COMPARE_MAX = 4;
  var COMPARE_DEMO = [
    {
      id: "buy-1",
      title: "Golden Meadows",
      url: "property-details.html",
      image: "assets/img/property-img-1.jpg",
      address: "4325 Maplewood Drive, Evergreen Estates, CA 90210",
      type: "house",
      offer: "buy",
      location: "new-york",
      price: 450000,
      beds: 3,
      baths: 2,
      area: 1450,
      garage: 1,
      year: 2012,
      amenities: ["garden", "parking", "security"],
    },
    {
      id: "buy-2",
      title: "Evergreen Estates",
      url: "property-details.html",
      image: "assets/img/property-img-2.jpg",
      address: "217 Horizon Heights Road, Silverstone Towers, NY 10022",
      type: "house",
      offer: "buy",
      location: "london",
      price: 720000,
      beds: 4,
      baths: 3,
      area: 2100,
      garage: 2,
      year: 2018,
      amenities: ["garden", "swimmingPool", "garage", "parking"],
    },
    {
      id: "buy-4",
      title: "Mesion Villa",
      url: "property-details.html",
      image: "assets/img/property-img-9.jpg",
      address: "382 Blue Sky Boulevard, Oakwood Residences, CO 80202",
      type: "villa",
      offer: "buy",
      location: "paris",
      price: 1250000,
      beds: 5,
      baths: 4,
      area: 3200,
      garage: 3,
      year: 2021,
      amenities: [
        "garden",
        "swimmingPool",
        "fitnessCenter",
        "garage",
        "security",
      ],
    },
  ];
  // Kept for the current page only; the compare page shows COMPARE_DEMO
  var compareList = null;

  function compareRead() {
    return compareList;
  }

  function compareSave(list) {
    compareList = list;
  }

  function slugify(text) {
    return String(text || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  function propertyElement(el) {
    var $el = $(el).closest("[data-id]");
    return $el.length ? $el : $(el).closest(".cs_card");
  }

  function propertyData($el) {
    var title = $el.find(".cs_property_title a").first();
    var priceText = $el.find(".cs_property_price").first().text();
    var feature = function (pattern) {
      var match = null;
      $el.find(".cs_property_features li").each(function () {
        match = match || pattern.exec($(this).text());
      });
      return match ? toNumber(match[1]) || 0 : 0;
    };
    var number = function (name, fallback) {
      return Number($el.attr("data-" + name)) || fallback || 0;
    };
    var name = $el.attr("data-title") || title.text().trim();
    return {
      id: $el.attr("data-id") || slugify(name),
      title: name,
      url:
        $el.attr("data-url") || title.attr("href") || "property-details.html",
      image:
        $el.attr("data-image") ||
        $el
          .find(".cs_card_img_front, .cs_card_thumbnail img")
          .first()
          .attr("src"),
      address:
        $el.attr("data-address") ||
        $el.find(".cs_property_location_text p").first().text().trim(),
      type: $el.attr("data-type"),
      offer:
        $el.attr("data-offer") || (/month/i.test(priceText) ? "rent" : "buy"),
      location: $el.attr("data-location"),
      price: number("price", toNumber(priceText.split("/")[0])),
      beds: number("beds", feature(/Bed\D*(\d+)/i)),
      baths: number("baths", feature(/Bath\D*(\d+)/i)),
      area: number("area", feature(/([\d,]+)\s*Sqft/i)),
      garage: number("garage"),
      year: number("year"),
      amenities: ($el.attr("data-amenities") || "").split(",").filter(Boolean),
    };
  }

  function propertyCompare() {
    var $toggles = $("[data-compare-toggle]");
    var list = compareRead() || [];
    var $bar;

    function has(id) {
      return list.some(function (item) {
        return item.id === id;
      });
    }

    function sync() {
      $("[data-compare-toggle]").each(function () {
        var on = has($(this).closest("[data-id]").attr("data-id"));
        $(this)
          .toggleClass("active", on)
          .attr({
            "aria-pressed": on,
            title: on ? "Remove from compare" : "Add to compare",
          });
        $(this)
          .find("[data-compare-label]")
          .text(on ? "Added" : "Compare");
      });
      if ($bar) renderBar();
    }

    function buildBar() {
      $bar = $(
        '<div class="cs_compare_bar cs_white_bg cs_radius_20" role="region" aria-label="Compare properties">' +
          '<div class="cs_compare_bar_items"></div>' +
          '<div class="cs_compare_bar_info">' +
          '<p class="cs_compare_bar_title cs_fs_20 cs_semibold cs_primary_font cs_primary_color mb-0">Compare Properties</p>' +
          '<p class="cs_compare_bar_note mb-0" aria-live="polite"></p>' +
          "</div>" +
          '<div class="cs_compare_bar_btns">' +
          '<button type="button" class="cs_compare_clear cs_primary_color cs_medium">Clear</button>' +
          '<a href="compare.html" class="cs_btn cs_style_1 cs_primary_bg cs_white_color cs_medium cs_primary_font cs_radius_10"><span>Compare Now</span></a>' +
          "</div>" +
          "</div>",
      ).appendTo("body");
      $bar.on("click", ".cs_compare_bar_remove", function () {
        var id = $(this).data("id");
        list = list.filter(function (item) {
          return item.id !== id;
        });
        compareSave(list);
        sync();
      });
      $bar.on("click", ".cs_compare_clear", function () {
        list = [];
        compareSave(list);
        sync();
      });
    }

    function renderBar(note) {
      var $slots = $bar.find(".cs_compare_bar_items").empty();
      for (var i = 0; i < COMPARE_MAX; i++) {
        var item = list[i];
        if (item) {
          $slots.append(
            '<div class="cs_compare_bar_item cs_radius_10" title="' +
              escapeHtml(item.title) +
              '">' +
              '<img src="' +
              escapeHtml(item.image) +
              '" alt="' +
              escapeHtml(item.title) +
              '">' +
              '<button type="button" class="cs_compare_bar_remove cs_center cs_radius_100" data-id="' +
              escapeHtml(item.id) +
              '" aria-label="Remove ' +
              escapeHtml(item.title) +
              '"><i class="fa-solid fa-xmark"></i></button>' +
              "</div>",
          );
        } else {
          $slots.append(
            '<div class="cs_compare_bar_item cs_empty cs_center cs_radius_10"><i class="fa-solid fa-plus"></i></div>',
          );
        }
      }
      $bar
        .find(".cs_compare_bar_note")
        .text(
          note ||
            list.length +
              " of " +
              COMPARE_MAX +
              " selected" +
              (list.length < 2 ? " - add one more to compare" : ""),
        );
      $bar
        .find(".cs_btn")
        .toggleClass("disabled", list.length < 2)
        .attr("aria-disabled", list.length < 2);
      $bar.toggleClass("active", list.length > 0);
      $("body").toggleClass("cs_compare_open", list.length > 0);
    }

    if ($toggles.length) {
      buildBar();
      $(document).on("click", "[data-compare-toggle]", function (e) {
        e.preventDefault();
        var $property = $(this).closest("[data-id]");
        var id = $property.attr("data-id");
        if (has(id)) {
          list = list.filter(function (item) {
            return item.id !== id;
          });
        } else if (list.length >= COMPARE_MAX) {
          renderBar(
            "You can compare up to " +
              COMPARE_MAX +
              " properties. Remove one first.",
          );
          $bar.removeClass("cs_shake");
          void $bar[0].offsetWidth;
          $bar.addClass("cs_shake");
          return;
        } else {
          list.push(propertyData($property));
        }
        compareSave(list);
        sync();
      });
      $bar.on("click", ".cs_btn.disabled", function (e) {
        e.preventDefault();
      });
      sync();
    }

    compareTable();
  }

  function compareTable() {
    var $wrap = $("#compareTable");
    if (!$wrap.length) return;
    var stored = compareRead();
    var items = stored || COMPARE_DEMO;
    var $empty = $("[data-compare-empty]");
    var $tools = $("[data-compare-tools]");
    var onlyDiff = $("#compareDifferences").is(":checked");

    $wrap.toggle(items.length > 0);
    $tools.toggle(items.length > 0);
    $empty.toggle(!items.length);
    if (!items.length) return;

    var best = function (key, lowest) {
      var values = items.map(function (item) {
        return key === "ppsf" ? pricePerSqft(item) : Number(item[key]) || 0;
      });
      var target = lowest
        ? Math.min.apply(null, values)
        : Math.max.apply(null, values);
      return values.every(function (v) {
        return v === target;
      })
        ? null
        : target;
    };
    var pricePerSqft = function (item) {
      return item.area ? Math.round(item.price / item.area) : 0;
    };
    var priceText = function (item) {
      return (
        "<bdi>" +
        formatMoney(item.price) +
        (item.offer === "rent" ? "<small>/month</small>" : "") +
        "</bdi>"
      );
    };

    var rows = [
      {
        label: "Price",
        key: "price",
        best: best("price", true),
        html: priceText,
      },
      {
        label: "Price per Sqft",
        key: "ppsf",
        best: best("ppsf", true),
        html: function (item) {
          return pricePerSqft(item) ? formatMoney(pricePerSqft(item)) : "-";
        },
      },
      {
        label: "Offer",
        html: function (item) {
          return item.offer === "rent" ? "For Rent" : "For Sale";
        },
      },
      {
        label: "Property Type",
        html: function (item) {
          return capitalize(item.type);
        },
      },
      {
        label: "Location",
        html: function (item) {
          return LOCATION_LABELS[item.location] || capitalize(item.location);
        },
      },
      { label: "Bedrooms", key: "beds", best: best("beds") },
      { label: "Bathrooms", key: "baths", best: best("baths") },
      {
        label: "Area",
        key: "area",
        best: best("area"),
        html: function (item) {
          return Number(item.area).toLocaleString("en-US") + " Sqft";
        },
      },
      { label: "Garage", key: "garage", best: best("garage") },
      { label: "Year Built", key: "year", best: best("year") },
    ];
    var amenities = [];
    items.forEach(function (item) {
      (item.amenities || []).forEach(function (a) {
        if (amenities.indexOf(a) < 0) amenities.push(a);
      });
    });

    var head = '<tr><th scope="col" class="cs_compare_label">Property</th>';
    items.forEach(function (item) {
      head +=
        '<th scope="col"><div class="cs_compare_property">' +
        '<button type="button" class="cs_compare_remove cs_center cs_white_bg cs_primary_color cs_radius_100" data-id="' +
        escapeHtml(item.id) +
        '" aria-label="Remove ' +
        escapeHtml(item.title) +
        '"><i class="fa-solid fa-xmark"></i></button>' +
        '<a href="' +
        escapeHtml(item.url) +
        '" class="cs_compare_thumb cs_radius_10"><img src="' +
        escapeHtml(item.image) +
        '" alt="' +
        escapeHtml(item.title) +
        '"></a>' +
        '<h3 class="cs_fs_20 cs_semibold cs_mb_5"><a href="' +
        escapeHtml(item.url) +
        '">' +
        escapeHtml(item.title) +
        "</a></h3>" +
        '<p class="cs_compare_address mb-0">' +
        escapeHtml(item.address) +
        "</p>" +
        "</div></th>";
    });
    if (items.length < COMPARE_MAX) {
      head +=
        '<th scope="col"><a href="property-listing-buy.html" class="cs_compare_add cs_center_column cs_radius_10">' +
        '<span class="cs_center cs_radius_100"><i class="fa-solid fa-plus"></i></span>Add Property</a></th>';
    }
    head += "</tr>";

    var body = "";
    var addRow = function (label, cells, cls) {
      var same = cells.every(function (c) {
        return c.text === cells[0].text;
      });
      if (onlyDiff && same && items.length > 1) return;
      body +=
        '<tr class="' +
        (cls || "") +
        '"><th scope="row" class="cs_compare_label">' +
        label +
        "</th>";
      cells.forEach(function (c) {
        body +=
          "<td" +
          (c.best ? ' class="cs_best"' : "") +
          ">" +
          c.html +
          (c.best
            ? '<span class="cs_best_badge cs_accent_bg cs_white_color cs_radius_20">Best</span>'
            : "") +
          "</td>";
      });
      if (items.length < COMPARE_MAX) body += "<td></td>";
      body += "</tr>";
    };
    rows.forEach(function (row) {
      addRow(
        row.label,
        items.map(function (item) {
          var raw = row.key === "ppsf" ? pricePerSqft(item) : item[row.key];
          var html = row.html ? row.html(item) : escapeHtml(item[row.key]);
          return {
            html: html,
            text: html,
            best:
              row.best !== undefined && row.best !== null && raw === row.best,
          };
        }),
      );
    });
    if (amenities.length) {
      body +=
        '<tr class="cs_compare_group"><th scope="row" class="cs_compare_label" colspan="' +
        (items.length + 1 + (items.length < COMPARE_MAX ? 1 : 0)) +
        '">Amenities</th></tr>';
      amenities.forEach(function (a) {
        addRow(
          AMENITY_LABELS[a] || capitalize(a),
          items.map(function (item) {
            var yes = (item.amenities || []).indexOf(a) > -1;
            return {
              text: String(yes),
              html: yes
                ? '<span class="cs_compare_yes cs_center cs_radius_100" aria-label="Yes"><i class="fa-solid fa-check"></i></span>'
                : '<span class="cs_compare_no" aria-label="No">-</span>',
            };
          }),
        );
      });
    }

    $wrap.html(
      '<table class="cs_compare_table"><thead>' +
        head +
        "</thead><tbody>" +
        body +
        "</tbody></table>",
    );
    $("[data-compare-count]").text(items.length);

    if ($wrap.data("bound")) return;
    $wrap.data("bound", true);
    $wrap.on("click", ".cs_compare_remove", function () {
      var id = $(this).data("id");
      compareSave(
        (compareRead() || COMPARE_DEMO).filter(function (item) {
          return item.id !== id;
        }),
      );
      compareTable();
    });
    $("[data-compare-clear]").on("click", function () {
      compareSave([]);
      compareTable();
    });
    $("#compareDifferences").on("change", compareTable);
  }

  /* 45. Property Actions (property details) */
  function propertyActions() {
    var $share = $(".cs_share_wrap");

    // "Book a Live Video Tour"
    $("[data-tour-type]").on("click", function (e) {
      var $radio = $(
        "input[name='tour-type'][value='" + $(this).data("tour-type") + "']",
      );
      var $form = $radio.closest("form");
      if (!$radio.length) return;
      e.preventDefault();
      $radio.prop("checked", true);
      window.scrollTo({
        top: Math.max(
          0,
          $form.closest(".cs_sidebar_widget").offset().top - 110,
        ),
        behavior: "smooth",
      });
      var name = $form.find("[name='name']")[0];
      if (name) name.focus({ preventScroll: true });
    });

    $("[data-print]").on("click", function () {
      window.print();
    });

    if (!$share.length) return;
    var url = window.location.href;
    var title =
      String($("[data-share-title]").first().text() || "").trim() ||
      document.title;
    var links = {
      facebook:
        "https://www.facebook.com/sharer/sharer.php?u=" +
        encodeURIComponent(url),
      x:
        "https://twitter.com/intent/tweet?url=" +
        encodeURIComponent(url) +
        "&text=" +
        encodeURIComponent(title),
      linkedin:
        "https://www.linkedin.com/sharing/share-offsite/?url=" +
        encodeURIComponent(url),
      whatsapp: "https://wa.me/?text=" + encodeURIComponent(title + " " + url),
      email:
        "mailto:?subject=" +
        encodeURIComponent(title) +
        "&body=" +
        encodeURIComponent(url),
    };
    $share.find("[data-share]").each(function () {
      var network = $(this).data("share");
      if (links[network]) $(this).attr("href", links[network]);
      if (network !== "email")
        $(this).attr({ target: "_blank", rel: "noopener" });
    });

    function setOpen($wrap, open) {
      $wrap
        .toggleClass("active", open)
        .find(".cs_share_toggle")
        .attr("aria-expanded", open);
    }

    $share.on("click", ".cs_share_toggle", function (e) {
      e.stopPropagation();
      var $wrap = $(this).closest(".cs_share_wrap");
      if (navigator.share && window.matchMedia("(pointer: coarse)").matches) {
        navigator.share({ title: title, url: url }).catch(function () {});
        return;
      }
      setOpen($wrap, !$wrap.hasClass("active"));
    });

    $share.on("click", "[data-share-copy]", function (e) {
      e.preventDefault();
      var $label = $(this).find("span").last();
      var done = function () {
        $label.text("Link copied!");
        setTimeout(function () {
          $label.text("Copy Link");
        }, 2000);
      };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(url).then(done);
      } else {
        var $tmp = $('<textarea name="share_link"></textarea>')
          .val(url)
          .css({ position: "fixed", opacity: 0 })
          .appendTo("body");
        $tmp[0].select();
        try {
          document.execCommand("copy");
          done();
        } catch (err) {}
        $tmp.remove();
      }
    });

    $(document).on("click", function (e) {
      if (!$(e.target).closest(".cs_share_dropdown").length)
        setOpen($share, false);
    });
    $(document).on("keydown", function (e) {
      if (e.key === "Escape") setOpen($share, false);
    });
  }

  /* 62. Table Overflow */
  function tableOverflow() {
    var $wraps = $(".cs_dashboard_content .overflow-x-auto");
    if (!$wraps.length) return;

    function check(wrap) {
      var table = wrap.firstElementChild;
      if (!table) return;
      wrap.classList.toggle(
        "cs_table_scroll",
        table.scrollWidth > wrap.clientWidth + 1,
      );
    }

    function checkAll() {
      $wraps.each(function () {
        check(this);
      });
    }

    if ("ResizeObserver" in window) {
      var observer = new ResizeObserver(function (entries) {
        entries.forEach(function (entry) {
          check(entry.target);
        });
      });
      $wraps.each(function () {
        observer.observe(this);
      });
    } else {
      $(window).on("resize", checkAll);
    }
    checkAll();
  }

  /* 63. File Inputs */
  function fileInputs() {
    $(".cs_file_input_wrapper input[type='file']")
      .each(function () {
        var $label = $(this).siblings("label");
        $label.data("empty", $label.html());
      })
      .on("change", function () {
        var $label = $(this).siblings("label");
        var names = Array.prototype.map.call(this.files, function (file) {
          return file.name;
        });
        if (!names.length) {
          $label.html($label.data("empty"));
          return;
        }
        $label
          .empty()
          .append(
            '<i class="fa-solid fa-file-circle-check" aria-hidden="true"></i> ',
            $("<span></span>").text(names.join(", ")),
          );
      });
  }

  /* 66. Agency Directory (agencies.html) */
  function agencyDirectory() {
    var $form = $(".cs_directory_toolbar");
    var $cards = $(".cs_agency_tile");
    if (!$form.length || !$cards.length) return;
    var $row = $cards.first().closest(".row");
    var $count = $(".cs_directory_result span").first();
    var $empty = $(
      "<p class='cs_directory_empty text-center w-100 mb-0'>No agencies match your search.</p>",
    )
      .hide()
      .insertAfter($row);
    var items = $cards
      .map(function () {
        var $card = $(this);
        var $stats = $card.find(".cs_agency_tile_stats li > span:first-child");
        return {
          $col: $card.parent(),
          city: String($card.data("city") || ""),
          text: $card.text().replace(/\s+/g, " ").toLowerCase(),
          name: $card.find("h3").first().text().trim(),
          rating: Number($card.find(".cs_rating").data("rating")) || 0,
          agents: toNumber($stats.eq(0).text()),
          listings: toNumber($stats.eq(1).text()),
        };
      })
      .get();

    function apply() {
      var query = String($form.find("[name='search']").val() || "")
        .trim()
        .toLowerCase();
      var city = $form.find("[name='city']").val();
      var sort = $form.find("[name='sort']").val() || "rating";
      var shown = items.filter(function (item) {
        var match =
          (!city || item.city === city) &&
          (!query || item.text.indexOf(query) > -1);
        item.$col.toggle(match);
        return match;
      });
      items
        .slice()
        .sort(function (a, b) {
          return sort === "name"
            ? a.name.localeCompare(b.name)
            : b[sort] - a[sort];
        })
        .forEach(function (item) {
          $row.append(item.$col);
        });
      $count.text(shown.length);
      $empty.toggle(shown.length === 0);
    }

    $form.on("submit", function (e) {
      e.preventDefault();
      apply();
    });
    $form.find("[name='search']").on("input", apply);
    $form.find("select").on("change", apply);
  }

  /* 64. Role Permissions (admin/roles.html) */
  var ROLE_PRESETS = {
    "Super Admin": ["*"],
    Moderator: [
      "properties.view",
      "properties.edit",
      "properties.approve",
      "users.view",
      "reviews.*",
      "blog.view",
      "blog.edit",
      "blog.approve",
    ],
    Support: [
      "properties.view",
      "users.view",
      "users.edit",
      "reviews.view",
      "subscriptions.view",
      "financials.view",
    ],
    Finance: [
      "properties.view",
      "users.view",
      "subscriptions.*",
      "financials.*",
    ],
  };

  function rolePermissions() {
    var $table = $(".cs_perm_table");
    var select = $table.closest("form").find("select")[0];
    if (!$table.length || !select) return;
    var $boxes = $table.find("input[type='checkbox'][name^='perm[']");
    var key = function (input) {
      var m = /^perm\[([^\]]+)\]\[([^\]]+)\]$/.exec(input.name);
      return m ? m[1] + "." + m[2] : "";
    };
    var checkedKeys = function () {
      return $boxes
        .filter(":checked")
        .map(function () {
          return key(this);
        })
        .get();
    };
    var current = select.value;
    var saved = {};
    saved[current] = checkedKeys();

    function allowed(role, k) {
      return (saved[role] || ROLE_PRESETS[role] || []).some(function (p) {
        return (
          p === "*" ||
          p === k ||
          (p.slice(-2) === ".*" && k.indexOf(p.slice(0, -1)) === 0)
        );
      });
    }

    function load(role) {
      if (role === current) return;
      saved[current] = checkedKeys();
      current = role;
      $boxes.each(function () {
        this.checked = allowed(role, key(this));
      });
      $(".cs_role_card").each(function () {
        $(this).toggleClass(
          "active",
          $(this).find("h2").text().trim() === role,
        );
      });
    }

    $(select).on("change", function () {
      load(this.value);
    });

    $(".cs_role_card").on("click", function () {
      var role = $(this).find("h2").text().trim();
      if (select.tomselect) select.tomselect.setValue(role, true);
      else select.value = role;
      load(role);
    });
  }

  /* 65. Ticket Replies (admin/ticket-details.html) */
  function ticketReplies() {
    var $thread = $(".cs_ticket_thread");
    var $form = $("#ticketReply").closest("form");
    if (!$thread.length || !$form.length) return;

    $form.on("submit", function (e) {
      e.preventDefault();
      var text = String($("#ticketReply").val() || "").trim();
      if (!text) return;
      var $staff = $thread
        .find(".cs_ticket_msg_staff")
        .not(".cs_ticket_msg_note")
        .last();
      var $msg = ($staff.length ? $staff : $thread.children().last()).clone();
      $msg.toggleClass(
        "cs_ticket_msg_note",
        $form.find(".cs_ticket_note_toggle input").is(":checked"),
      );
      $msg.find(".cs_ticket_files, .cs_ticket_msg_body > p").remove();
      $msg
        .find("time")
        .attr("datetime", new Date().toISOString())
        .text("Just now");
      $("<p></p>").text(text).appendTo($msg.find(".cs_ticket_msg_body"));

      var input = $form.find("input[type='file']")[0];
      if (input && input.files.length) {
        var $list = $("<ul class='cs_ticket_files'></ul>");
        Array.prototype.forEach.call(input.files, function (file) {
          $("<li></li>")
            .append(
              $("<span></span>").append(
                "<i class='fa-regular fa-file' aria-hidden='true'></i>",
                $("<span></span>").text(file.name),
              ),
            )
            .appendTo($list);
        });
        $msg.find(".cs_ticket_msg_body").append($list);
      }

      $msg.appendTo($thread).addClass("cs_row_flash");
      setTimeout(function () {
        $msg.removeClass("cs_row_flash");
      }, 1200);

      var submitter = e.originalEvent && e.originalEvent.submitter;
      if (submitter && submitter === $form.find("button[type='submit']")[0]) {
        $(".cs_ticket_badges .cs_status_badge")
          .filter(function () {
            return /^(Open|Pending)$/.test($(this).text().trim());
          })
          .attr("class", "cs_status_badge cs_status_active")
          .text("Resolved");
        var status = document.getElementById("ticketStatus");
        if (status && status.tomselect)
          status.tomselect.setValue("Resolved", true);
        else if (status) status.value = "Resolved";
      }
      this.reset();
    });
  }
})(jQuery);
