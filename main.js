/* =========================================================
   UNna Studio & Beleza — main.js
   Stack de motion:
     · Lenis   — smooth scroll fluido (local /vendor)
     · anime.js — reveals, split de títulos, parallax, magnético (local /vendor)
   Tudo com fallback: se um script falhar ou prefers-reduced-motion
   estiver ativo, o site continua 100% funcional e legível.
   ========================================================= */
(function () {
  "use strict";

  var html = document.documentElement;
  html.classList.add("has-js");

  // força animações se o parâmetro ?force-motion=true for passado (demo/teste)
  var forceMotion = /force-motion=true/.test(window.location.search);
  var reduce = forceMotion ? false : window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasAnime = typeof window.anime !== "undefined";
  var hasLenis = typeof window.Lenis !== "undefined";

  // debug: log no console para confirmar o estado das libs
  console.log(
    "[UNna] Motion Stack:\n" +
    "  Lenis: " + (hasLenis ? "✓ carregado" : "✗ não encontrado") + "\n" +
    "  anime.js: " + (hasAnime ? "✓ carregado" : "✗ não encontrado") + "\n" +
    "  prefers-reduced-motion do SO: " + (reduce && !forceMotion ? "✓ ATIVO" : "✗ inativo") + "\n" +
    "  force-motion (URL ?force-motion=true): " + (forceMotion ? "✓ ATIVO (override de teste)" : "✗ inativo") + "\n" +
    "  Mode: " + (reduce && !forceMotion ? "Acessibilidade (anims desativadas)" : (hasAnime && hasLenis ? "Premium com Lenis + anime" : "Fallback CSS"))
  );
  if (forceMotion) {
    console.log("%c[UNna] 🎬 MODO DEMO: Animações forçadas para teste. Para ver animações de verdade, desative prefers-reduced-motion no seu SO.", "color: #B8956A; font-weight: bold");
  }

  if (hasAnime && !reduce) html.classList.add("anime-on");
  else html.classList.add("no-anime");

  var EASE = "cubicBezier(0.16, 1, 0.3, 1)";

  /* =======================================================
     ⚙️  CONFIGURAÇÃO — Agendamento online (Trinks)
     SUBSTITUIR pelo endereço do SEU agendamento no Trinks.
     Ex.: "https://www.trinks.com/unna-studio-beleza"
     (No Trinks: Configurações → Agendamento online → link/iframe)
     ======================================================= */
  var TRINKS_URL = "https://www.trinks.com/unna-studio/";

  /* =======================================================
     1. LENIS — smooth scroll
     ======================================================= */
  var lenis = null;
  if (hasLenis && !reduce) {
    lenis = new Lenis({
      duration: 1.15,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
    });
    console.log("[UNna] Lenis ativado: smooth scroll com inércia fluida");
    (function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    })();
  } else {
    console.log("[UNna] Lenis desativado: " + (reduce ? "prefers-reduced-motion ativo" : "biblioteca não carregou"));
  }

  /* rolagem suave até um alvo (usa Lenis se disponível) */
  function scrollToTarget(target) {
    var offset = -parseInt(getComputedStyle(html).getPropertyValue("--header-h")) || -78;
    if (lenis) {
      lenis.scrollTo(target, { offset: offset, duration: 1.25 });
    } else {
      var y = target.getBoundingClientRect().top + window.scrollY + offset;
      window.scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" });
    }
  }

  /* =======================================================
     2. HEADER ao rolar + PARALLAX do hero
     ======================================================= */
  var header = document.getElementById("header");
  var heroBg = document.querySelector(".hero-bg");
  var heroLogo = document.querySelector(".hero-logo");
  var fab = document.getElementById("fabWhatsapp");
  var winH = window.innerHeight;
  window.addEventListener("resize", function () { winH = window.innerHeight; });

  // parallax só no desktop — no mobile priorizamos scroll nativo fluido
  var isDesktop = window.matchMedia("(min-width: 901px)").matches;
  window.matchMedia("(min-width: 901px)").addEventListener("change", function (e) {
    isDesktop = e.matches;
    if (!isDesktop && heroBg) { heroBg.style.transform = ""; if (heroLogo) heroLogo.style.cssText = ""; }
  });

  function onScroll(y) {
    header.classList.toggle("scrolled", y > 60);

    // botão flutuante de WhatsApp surge depois do hero
    if (fab) fab.classList.toggle("visible", y > winH * 0.6);

    // parallax sutil (desktop): fundo desce mais devagar; logo desvanece
    if (isDesktop && !reduce && heroBg && y < winH) {
      heroBg.style.transform = "translateY(" + (y * 0.18).toFixed(1) + "px)";
      if (heroLogo) {
        heroLogo.style.opacity = Math.max(0, 1 - y / 420);
        heroLogo.style.transform =
          "translate(-50%, calc(-58% + " + (y * 0.08).toFixed(1) + "px))";
      }
    }
  }

  if (lenis) {
    lenis.on("scroll", function (e) { onScroll(e.scroll); });
  }
  window.addEventListener("scroll", function () { onScroll(window.scrollY); }, { passive: true });
  onScroll(window.scrollY);

  /* =======================================================
     3. MENU MOBILE (overlay)
     ======================================================= */
  var burger = document.getElementById("burger");
  var body = document.body;

  function closeMenu() {
    if (!body.classList.contains("menu-open")) return;
    body.classList.remove("menu-open");
    burger.setAttribute("aria-expanded", "false");
    burger.setAttribute("aria-label", "Abrir menu");
    if (lenis) lenis.start();
  }
  function toggleMenu() {
    var open = body.classList.toggle("menu-open");
    burger.setAttribute("aria-expanded", open ? "true" : "false");
    burger.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    // trava/destrava o scroll do Lenis enquanto o overlay está aberto
    if (lenis) { open ? lenis.stop() : lenis.start(); }
  }
  burger.addEventListener("click", toggleMenu);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
  });

  /* =======================================================
     4. TABS de serviços
     ======================================================= */
  var tabs = document.querySelectorAll(".tab");
  var panels = document.querySelectorAll(".tab-panel");

  function activateTab(name) {
    tabs.forEach(function (t) {
      var on = t.getAttribute("data-tab") === name;
      t.classList.toggle("active", on);
      t.setAttribute("aria-selected", on ? "true" : "false");
    });
    panels.forEach(function (p) {
      var on = p.getAttribute("data-panel") === name;
      p.classList.toggle("active", on);
      // micro-stagger dos cards ao trocar de aba
      if (on && hasAnime && !reduce) {
        anime.remove(p.querySelectorAll(".serv-card"));
        anime({
          targets: p.querySelectorAll(".serv-card"),
          opacity: [0, 1],
          translateY: [18, 0],
          delay: anime.stagger(40),
          duration: 700,
          easing: EASE,
        });
      }
    });
  }
  tabs.forEach(function (t) {
    t.addEventListener("click", function () { activateTab(t.getAttribute("data-tab")); });
  });

  /* =======================================================
     5. Links âncora — rolagem suave + troca de aba
        (cards de categoria também caem aqui via [data-tab])
     ======================================================= */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    var id = a.getAttribute("href");
    a.addEventListener("click", function (e) {
      // botões de agendamento são tratados pelo modal (seção 10) — ignore aqui
      if (a.hasAttribute("data-open-booking")) return;
      if (id === "#") { e.preventDefault(); closeMenu(); scrollToTarget(document.body); return; }
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      if (a.dataset.tab) activateTab(a.dataset.tab);
      closeMenu();
      // pequeno atraso quando o menu mobile estava aberto, p/ animação fechar
      setTimeout(function () { scrollToTarget(target); }, 0);
    });
  });

  /* =======================================================
     6. SPLIT de títulos (palavra a palavra)
     ======================================================= */
  function splitHeading(el) {
    var frag = document.createDocumentFragment();

    function pushWords(text, isEm) {
      text.split(/(\s+)/).forEach(function (tok) {
        if (tok === "") return;
        if (/^\s+$/.test(tok)) { frag.appendChild(document.createTextNode(tok)); return; }
        var outer = document.createElement("span");
        outer.className = "w";
        var inner = document.createElement("span");
        inner.className = "wi" + (isEm ? " wi--em" : "");
        inner.textContent = tok;
        outer.appendChild(inner);
        frag.appendChild(outer);
      });
    }

    Array.prototype.forEach.call(el.childNodes, function (node) {
      if (node.nodeType === 3) pushWords(node.textContent, false);
      else if (node.nodeType === 1) pushWords(node.textContent, node.tagName === "EM");
    });

    el.innerHTML = "";
    el.appendChild(frag);
    el.style.opacity = "1"; // revela o container; as palavras seguem mascaradas
  }

  var splitEls = document.querySelectorAll(".split");
  if (hasAnime && !reduce) {
    splitEls.forEach(splitHeading);
  }

  function revealSplit(el) {
    anime({
      targets: el.querySelectorAll(".wi"),
      translateY: ["110%", "0%"],
      duration: 1100,
      delay: anime.stagger(45),
      easing: EASE,
    });
  }

  /* =======================================================
     7. REVEAL no scroll (IntersectionObserver + anime)
     ======================================================= */
  var reveals = document.querySelectorAll(".reveal");

  function revealEl(el) {
    if (hasAnime && !reduce) {
      var delay = parseFloat(getComputedStyle(el).transitionDelay) * 1000 || 0;
      anime.remove(el);
      anime({
        targets: el,
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 1100,
        delay: delay,
        easing: EASE,
      });
    } else {
      el.classList.add("is-visible");
    }
  }

  if (reduce) {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
    splitEls.forEach(function (el) { el.classList.add("is-visible"); });
  } else if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        if (el.classList.contains("split")) revealSplit(el);
        else revealEl(el);
        io.unobserve(el);
      });
    }, { threshold: 0.12 });

    reveals.forEach(function (el) { io.observe(el); });
    if (hasAnime) splitEls.forEach(function (el) { io.observe(el); });
  } else {
    // sem IO: mostra tudo
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
    if (hasAnime) splitEls.forEach(revealSplit);
  }

  /* =======================================================
     8. Botões MAGNÉTICOS (só desktop com hover + anime)
     ======================================================= */
  if (hasAnime && !reduce && window.matchMedia("(hover: hover)").matches) {
    document.querySelectorAll(".btn").forEach(function (btn) {
      btn.addEventListener("mousemove", function (e) {
        var r = btn.getBoundingClientRect();
        var x = e.clientX - r.left - r.width / 2;
        var y = e.clientY - r.top - r.height / 2;
        anime({
          targets: btn,
          translateX: x * 0.28,
          translateY: y * 0.28,
          duration: 400,
          easing: "easeOutQuad",
        });
      });
      btn.addEventListener("mouseleave", function () {
        anime({
          targets: btn,
          translateX: 0,
          translateY: 0,
          duration: 700,
          easing: "easeOutElastic(1, .6)",
        });
      });
    });
  }

  /* =======================================================
     9. ANTES / DEPOIS — slider arrastável (mouse + touch)
     ======================================================= */
  document.querySelectorAll("[data-ba]").forEach(function (ba) {
    var handle = ba.querySelector(".ba-handle");
    var pos = 50;
    var startX = 0, startY = 0, candidate = false, dragging = false;

    function set(p) {
      pos = Math.max(0, Math.min(100, p));
      ba.style.setProperty("--pos", pos + "%");
      if (handle) handle.setAttribute("aria-valuenow", Math.round(pos));
    }
    function posFromX(clientX) {
      var r = ba.getBoundingClientRect();
      set(((clientX - r.left) / r.width) * 100);
    }
    set(50);

    ba.addEventListener("pointerdown", function (e) {
      startX = e.clientX; startY = e.clientY;
      candidate = true; dragging = false;
      // clique direto no punho começa a arrastar imediatamente
      if (e.target === handle) { dragging = true; posFromX(e.clientX); }
    });
    window.addEventListener("pointermove", function (e) {
      if (!candidate && !dragging) return;
      if (candidate && !dragging) {
        var dx = Math.abs(e.clientX - startX), dy = Math.abs(e.clientY - startY);
        if (dx > dy && dx > 6) dragging = true;       // gesto horizontal → arrasta
        else if (dy > dx && dy > 6) { candidate = false; return; } // vertical → deixa rolar
      }
      if (dragging) { posFromX(e.clientX); e.preventDefault(); }
    }, { passive: false });
    window.addEventListener("pointerup", function () { candidate = false; dragging = false; });

    // acessibilidade: setas do teclado
    if (handle) {
      handle.addEventListener("keydown", function (e) {
        if (e.key === "ArrowLeft") { set(pos - 5); e.preventDefault(); }
        if (e.key === "ArrowRight") { set(pos + 5); e.preventDefault(); }
      });
    }
  });

  /* =======================================================
     10. MODAL DE AGENDAMENTO (Trinks) — iframe lazy
     ======================================================= */
  var booking = document.getElementById("booking");
  var bookingFrame = document.getElementById("bookingFrame");
  var bookingLoaded = false;

  function openBooking() {
    if (!booking) return;
    if (!bookingLoaded) {
      var fb = document.getElementById("bookingFallback");
      if (fb) fb.href = TRINKS_URL;
      bookingFrame.classList.remove("loaded", "slow");
      // se demorar muito (ou o Trinks bloquear embed), oferece "abrir em nova aba"
      var slowTimer = setTimeout(function () { bookingFrame.classList.add("slow"); }, 8000);

      var f = document.createElement("iframe");
      f.src = TRINKS_URL;
      f.title = "Agendamento online — UNna Studio & Beleza";
      f.setAttribute("allow", "fullscreen; payment");
      f.setAttribute("loading", "eager");
      f.addEventListener("load", function () {
        clearTimeout(slowTimer);
        bookingFrame.classList.add("loaded"); // esconde o "Carregando…"
      });
      bookingFrame.appendChild(f);
      bookingLoaded = true;
    }
    booking.classList.add("open");
    booking.setAttribute("aria-hidden", "false");
    body.classList.add("booking-open");
    if (lenis) lenis.stop();
  }
  function closeBooking() {
    if (!booking || !booking.classList.contains("open")) return;
    booking.classList.remove("open");
    booking.setAttribute("aria-hidden", "true");
    body.classList.remove("booking-open");
    if (lenis && !body.classList.contains("menu-open")) lenis.start();
  }
  document.querySelectorAll("[data-open-booking]").forEach(function (el) {
    el.addEventListener("click", function (e) { e.preventDefault(); closeMenu(); openBooking(); });
  });
  document.querySelectorAll("[data-close-booking]").forEach(function (el) {
    el.addEventListener("click", closeBooking);
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeBooking(); });

  /* =======================================================
     11. AVALIAÇÕES (Google) — marquee infinito (desliza p/ a esquerda)
         Dados em reviews.js
     ======================================================= */
  (function reviewsMarquee(reduce) {
    var data = window.UNNA_REVIEWS || [];
    var meta = window.UNNA_REVIEWS_META || {};
    var track = document.getElementById("avalTrack");
    var viewport = document.getElementById("avalViewport");
    if (!track || !viewport || !data.length) return;

    function stars(n) {
      n = Math.max(0, Math.min(5, Math.round(n)));
      return "★★★★★".slice(0, n) + "☆☆☆☆☆".slice(0, 5 - n);
    }
    function esc(s) {
      return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
      });
    }

    // resumo (nota média + contagem + link) — preenchido a partir de reviews.js
    var sum = data.reduce(function (s, r) { return s + (r.rating || 5); }, 0);
    var avg = meta.average != null ? meta.average : sum / data.length;
    var count = meta.total != null ? meta.total : data.length;
    var avgEl = document.getElementById("avalAvg");
    var countEl = document.getElementById("avalCount");
    var starsEl = document.getElementById("avalStars");
    var prof = document.getElementById("avalProfile");
    if (avgEl) avgEl.textContent = avg.toFixed(1).replace(".", ",");
    if (countEl) countEl.textContent = count;
    if (starsEl) starsEl.textContent = stars(avg);
    if (prof && meta.profileUrl) prof.href = meta.profileUrl;

    function makeSlide(r, clone) {
      var s = document.createElement("div");
      s.className = "aval-slide";
      if (clone) s.setAttribute("aria-hidden", "true"); // cópias não são lidas 2x
      s.innerHTML =
        '<figure class="aval-card">' +
          '<div class="stars" aria-hidden="true">' + stars(r.rating || 5) + "</div>" +
          "<blockquote>" + esc(r.text) + "</blockquote>" +
          '<figcaption><span class="aval-name">' + esc(r.name) + "</span>" +
          '<span class="aval-src">' + (r.date ? esc(r.date) + " · " : "") + "via Google</span></figcaption>" +
        "</figure>";
      return s;
    }

    // movimento reduzido (acessibilidade): sem animação, rolagem manual
    if (reduce) {
      data.forEach(function (r) { track.appendChild(makeSlide(r, false)); });
      viewport.classList.add("is-static");
      return;
    }

    var SPEED = 36;          // px por segundo (deslize lento)
    var baseWidth = 0, pos = 0, paused = false, last = 0, raf = null;

    function build() {
      if (raf) cancelAnimationFrame(raf);
      track.innerHTML = "";
      pos = 0;
      // 1º conjunto (o "real", lido por leitores de tela)
      data.forEach(function (r) { track.appendChild(makeSlide(r, false)); });
      baseWidth = track.scrollWidth;
      // duplica até cobrir a viewport + 1 conjunto → loop sem buracos
      var guard = 0;
      while (track.scrollWidth < baseWidth + viewport.offsetWidth + 80 && guard < 20) {
        data.forEach(function (r) { track.appendChild(makeSlide(r, true)); });
        guard++;
      }
      last = performance.now();
      raf = requestAnimationFrame(tick);
    }

    function tick(now) {
      var dt = (now - last) / 1000; last = now;
      if (dt > 0.1) dt = 0.1; // evita pulo se a aba ficou inativa
      if (!paused && baseWidth > 0) {
        pos -= SPEED * dt;
        if (-pos >= baseWidth) pos += baseWidth; // recomeça suavemente
        track.style.transform = "translateX(" + pos.toFixed(2) + "px)";
      }
      raf = requestAnimationFrame(tick);
    }

    // pausa ao passar o mouse / segurar o dedo (para conseguir ler)
    viewport.addEventListener("mouseenter", function () { paused = true; });
    viewport.addEventListener("mouseleave", function () { paused = false; });
    viewport.addEventListener("pointerdown", function () { paused = true; });
    window.addEventListener("pointerup", function () { paused = false; });

    // recalcula larguras ao redimensionar
    var rt = null;
    window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(build, 200); });

    build();
  })(reduce);

  /* =======================================================
     12. Ano no rodapé
     ======================================================= */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
