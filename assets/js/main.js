/* Andrés García · Delineante proyectista — interacciones del sitio */
(function () {
  "use strict";

  var config = window.SITE_CONFIG || {};
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var CATEGORY_LABELS = {
    edificacion: "Edificación",
    bim: "BIM",
    estructuras: "Estructuras metálicas",
    planos: "Planos"
  };

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $all(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === "text") node.textContent = attrs[k];
      else if (k === "class") node.className = attrs[k];
      else node.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { if (c) node.appendChild(c); });
    return node;
  }

  function isSafeUrl(url) {
    return typeof url === "string" && /^(https?:|mailto:|tel:|assets\/|\.\/|\/)/i.test(url.trim());
  }

  /* ---------- Cabecera y navegación ---------- */
  var header = $("#header");
  var toggle = $("#navToggle");
  var nav = $("#nav");

  function setMenu(open) {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    nav.classList.toggle("is-open", open);
    document.body.classList.toggle("menu-open", open);
  }

  toggle.addEventListener("click", function () {
    setMenu(toggle.getAttribute("aria-expanded") !== "true");
  });

  $all(".nav__link").forEach(function (link) {
    link.addEventListener("click", function () { setMenu(false); });
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && nav.classList.contains("is-open")) {
      setMenu(false);
      toggle.focus();
    }
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 960) setMenu(false);
  });

  function onScroll() {
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Enlace activo según la sección visible */
  var navLinks = $all('.nav__link[href^="#"]');
  var sections = navLinks
    .map(function (l) { return document.getElementById(l.getAttribute("href").slice(1)); })
    .filter(Boolean);

  if ("IntersectionObserver" in window) {
    var activeObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (l) {
          var active = l.getAttribute("href") === "#" + entry.target.id;
          l.classList.toggle("is-active", active);
          if (active) l.setAttribute("aria-current", "true");
          else l.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { activeObserver.observe(s); });
  }

  /* ---------- Animaciones de aparición ---------- */
  var revealObserver = null;
  if (!reduceMotion && "IntersectionObserver" in window) {
    document.documentElement.classList.add("js-reveal");
    revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  }

  function observeReveal(scope) {
    $all(".reveal", scope).forEach(function (node, i) {
      if (!revealObserver) { node.classList.add("is-visible"); return; }
      node.style.transitionDelay = Math.min(i % 6, 5) * 60 + "ms";
      revealObserver.observe(node);
    });
  }

  /* ---------- Currículum ---------- */
  var cvButton = $("#cvButton");
  var cvText = $("#cvText");
  if (config.cvUrl && isSafeUrl(config.cvUrl)) {
    cvButton.href = config.cvUrl;
    cvButton.setAttribute("download", "");
    cvButton.classList.remove("is-disabled");
    cvButton.removeAttribute("aria-disabled");
    cvButton.removeAttribute("tabindex");
    cvText.textContent = "Descarga mi currículum en formato PDF.";
  } else {
    cvButton.addEventListener("click", function (e) { e.preventDefault(); });
  }

  /* ---------- Portafolio ---------- */
  var projectsEl = $("#projects");
  var projectsNote = $("#projectsNote");
  var projects = Array.isArray(config.projects) ? config.projects : [];

  function categoriesOf(item) {
    var c = item.category || [];
    return Array.isArray(c) ? c : [c];
  }

  function renderProjects() {
    projectsEl.innerHTML = "";

    if (!projects.length) {
      (config.projectPlaceholders || []).forEach(function (p, i) {
        var card = el("article", {
          class: "project project--placeholder reveal",
          "data-category": categoriesOf(p).join(" ")
        }, [
          el("div", { class: "media-slot", role: "img", "aria-label": "Espacio reservado para " + p.label.toLowerCase() }, [
            el("span", { class: "media-slot__label", text: p.label }),
            el("span", { class: "media-slot__hint", text: "Próximamente" })
          ]),
          el("div", { class: "project__body" }, [
            el("p", { class: "project__meta", text: categoriesOf(p).map(function (c) { return CATEGORY_LABELS[c] || c; }).join(" · ") }),
            el("h3", { class: "project__title", text: "Espacio reservado " + String(i + 1).padStart(2, "0") })
          ])
        ]);
        projectsEl.appendChild(card);
      });
      return;
    }

    projectsNote.hidden = true;
    projects.forEach(function (p, i) {
      var cats = categoriesOf(p);
      var media;
      if (p.image && isSafeUrl(p.image)) {
        media = el("button", { class: "project__media", type: "button", "data-index": String(i), "aria-label": "Ampliar imagen de " + (p.title || "proyecto") }, [
          el("img", { src: p.image, alt: p.alt || p.title || "", loading: "lazy", decoding: "async" })
        ]);
      } else {
        media = el("div", { class: "media-slot", role: "img", "aria-label": "Imagen pendiente" }, [
          el("span", { class: "media-slot__label", text: "Imagen pendiente" })
        ]);
      }
      var meta = cats.map(function (c) { return CATEGORY_LABELS[c] || c; });
      if (p.year) meta.push(p.year);

      var body = el("div", { class: "project__body" }, [
        el("p", { class: "project__meta", text: meta.join(" · ") }),
        el("h3", { class: "project__title", text: p.title || "Proyecto" }),
        p.description ? el("p", { class: "project__desc", text: p.description }) : null,
        Array.isArray(p.tools) && p.tools.length
          ? el("ul", { class: "project__tools", "aria-label": "Software utilizado" },
              p.tools.map(function (t) { return el("li", { text: t }); }))
          : null
      ]);

      projectsEl.appendChild(el("article", { class: "project reveal", "data-category": cats.join(" ") }, [media, body]));
    });
  }

  renderProjects();

  /* Filtros */
  var filters = $all(".filter");
  filters.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var value = btn.getAttribute("data-filter");
      filters.forEach(function (b) {
        var on = b === btn;
        b.classList.toggle("is-active", on);
        b.setAttribute("aria-pressed", String(on));
      });
      $all(".project", projectsEl).forEach(function (card) {
        var cats = (card.getAttribute("data-category") || "").split(" ");
        var show = value === "todos" || cats.indexOf(value) !== -1;
        card.classList.toggle("is-hidden", !show);
        card.hidden = !show;
      });
    });
  });

  /* ---------- Renders ---------- */
  var rendersEl = $("#renders");
  var renders = Array.isArray(config.renders) ? config.renders : [];
  var galleryItems = []; // para el visor

  if (renders.length) {
    renders.forEach(function (r) {
      if (!isSafeUrl(r.src)) return;
      var idx = galleryItems.push({ src: r.src, caption: r.caption || "", alt: r.alt || r.caption || "" }) - 1;
      rendersEl.appendChild(el("figure", { class: "render reveal" }, [
        el("button", { class: "render__btn", type: "button", "data-gallery": String(idx), "aria-label": "Ampliar " + (r.caption || "render") }, [
          el("img", { src: r.src, alt: r.alt || r.caption || "", loading: "lazy", decoding: "async" })
        ]),
        r.caption ? el("figcaption", { text: r.caption }) : null
      ]));
    });
  } else {
    ["Render exterior", "Render interior", "Modelo de detalle"].forEach(function (label) {
      rendersEl.appendChild(el("figure", { class: "render reveal" }, [
        el("div", { class: "media-slot media-slot--onDark", role: "img", "aria-label": "Espacio reservado para " + label.toLowerCase() }, [
          el("span", { class: "media-slot__label", text: label }),
          el("span", { class: "media-slot__hint", text: "assets/img/renders/" })
        ])
      ]));
    });
  }

  /* Visor 3D / vídeo opcional */
  if (config.viewerEmbedUrl && /^https:\/\//i.test(config.viewerEmbedUrl)) {
    var viewer = $("#viewer");
    viewer.innerHTML = "";
    viewer.appendChild(el("div", { class: "viewer__frame" }, [
      el("iframe", {
        src: config.viewerEmbedUrl,
        title: "Visor 3D del proyecto",
        loading: "lazy",
        allow: "autoplay; fullscreen; xr-spatial-tracking",
        allowfullscreen: ""
      })
    ]));
  }

  /* ---------- Visor de imágenes (lightbox) ---------- */
  var lightbox = $("#lightbox");
  var lbImg = $("#lightboxImg");
  var lbCaption = $("#lightboxCaption");

  function openLightbox(src, alt, caption) {
    lbImg.src = src;
    lbImg.alt = alt || "";
    lbCaption.textContent = caption || "";
    if (typeof lightbox.showModal === "function") lightbox.showModal();
    else window.open(src, "_blank", "noopener");
  }

  document.addEventListener("click", function (e) {
    var projectBtn = e.target.closest(".project__media");
    if (projectBtn) {
      var p = projects[Number(projectBtn.getAttribute("data-index"))];
      if (p) openLightbox(p.image, p.alt || p.title, p.title);
      return;
    }
    var renderBtn = e.target.closest(".render__btn");
    if (renderBtn) {
      var r = galleryItems[Number(renderBtn.getAttribute("data-gallery"))];
      if (r) openLightbox(r.src, r.alt, r.caption);
    }
  });

  $("#lightboxClose").addEventListener("click", function () { lightbox.close(); });
  lightbox.addEventListener("click", function (e) { if (e.target === lightbox) lightbox.close(); });
  lightbox.addEventListener("close", function () { lbImg.src = ""; });

  /* ---------- Contacto ---------- */
  var contact = config.contact || {};
  var contactList = $("#contactList");
  var contactItems = [];

  if (contact.email) contactItems.push({ k: "Correo", v: contact.email, href: "mailto:" + contact.email });
  if (contact.phone) contactItems.push({ k: "Teléfono", v: contact.phone, href: "tel:" + contact.phone.replace(/[^\d+]/g, "") });
  if (contact.linkedin && isSafeUrl(contact.linkedin)) contactItems.push({ k: "LinkedIn", v: contact.linkedin.replace(/^https?:\/\/(www\.)?/, ""), href: contact.linkedin, external: true });
  if (contact.location) contactItems.push({ k: "Ubicación", v: contact.location });

  if (contactItems.length) {
    contactItems.forEach(function (c) {
      var value = c.href
        ? el("a", c.external ? { href: c.href, target: "_blank", rel: "noopener noreferrer", text: c.v } : { href: c.href, text: c.v })
        : el("span", { text: c.v });
      contactList.appendChild(el("li", {}, [el("span", { class: "contact-list__k", text: c.k }), value]));
    });
  } else {
    contactList.appendChild(el("li", { class: "contact-list__empty" }, [
      el("span", { text: "Los datos de contacto directo se publicarán próximamente." })
    ]));
  }

  var form = $("#contactForm");
  var status = $("#formStatus");

  function setError(field, msg) {
    var wrap = field.closest(".field");
    wrap.classList.toggle("has-error", !!msg);
    field.setAttribute("aria-invalid", msg ? "true" : "false");
    $(".field__error", wrap).textContent = msg || "";
  }

  function validate() {
    var ok = true;
    var name = form.elements.name;
    var email = form.elements.email;
    var message = form.elements.message;

    if (!name.value.trim()) { setError(name, "Indica tu nombre."); ok = false; } else setError(name);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) { setError(email, "Introduce un correo válido."); ok = false; } else setError(email);
    if (message.value.trim().length < 10) { setError(message, "El mensaje debe tener al menos 10 caracteres."); ok = false; } else setError(message);
    return ok;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    status.className = "form__status";
    if (!validate()) {
      var firstInvalid = $('[aria-invalid="true"]', form);
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    if (!contact.email) {
      status.textContent = "El formulario estará operativo en cuanto se publiquen los datos de contacto.";
      status.classList.add("is-warning");
      return;
    }

    var subject = "Consulta web: " + form.elements.subject.value;
    var body = "Nombre: " + form.elements.name.value.trim() +
      "\nCorreo: " + form.elements.email.value.trim() +
      "\n\n" + form.elements.message.value.trim();
    window.location.href = "mailto:" + contact.email +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(body);
    status.textContent = "Se ha abierto tu aplicación de correo con el mensaje preparado.";
    status.classList.add("is-success");
  });

  $all("input, textarea", form).forEach(function (f) {
    f.addEventListener("input", function () {
      if (f.getAttribute("aria-invalid") === "true") validate();
    });
  });

  /* ---------- Varios ---------- */
  $("#year").textContent = new Date().getFullYear();

  observeReveal(document);
})();
