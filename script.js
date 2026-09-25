/*
 * Kevin Cloyd — Creative Portfolio
 * Shared behaviour for every page. Loaded after config.js (both deferred).
 * Browser APIs only: no packages, build step, trackers or API keys.
 *
 * 1. Theme and the pull-cord lamp (spring physics, keyboard, reveal)
 * 2. Local time, card spotlight, media fallbacks, page visibility
 * 3. Project viewer: Waiz Earn device preview plus video/photo samples
 * 4. Works selector: tabs, pager, swipe and deep links (#video, ?project=)
 * 5. Contact: email draft, copy helpers and topic prefill
 */

(() => {
  "use strict";

  const CONFIG = window.PORTFOLIO_CONFIG || {
    email: "urcloyd@gmail.com",
    timeZone: "Asia/Manila",
    projects: {}
  };
  const PROJECTS = CONFIG.projects || {};
  const THEME_KEY = "portfolio.theme";
  const LAMP_KEY = "portfolio.lampUsed";
  const THEME_COLORS = { light: "#f4f4ed", dark: "#0b0f17" };
  const LIVE_TIMEOUT = 15000;

  const root = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const all = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  const store = {
    get(key) {
      try {
        return window.localStorage.getItem(key);
      } catch (_) {
        return null;
      }
    },
    set(key, value) {
      try {
        window.localStorage.setItem(key, value);
      } catch (_) {
        // Private windows can block storage; everything still works for this visit.
      }
    }
  };

  function safeUrl(value) {
    if (!value) return "";
    try {
      const url = new URL(value, window.location.href);
      return url.protocol === "https:" || url.protocol === "http:" ? url.href : "";
    } catch (_) {
      return "";
    }
  }

  function setText(element, text) {
    if (element && element.textContent !== text) element.textContent = text;
  }

  function pauseMedia(scope = document) {
    all("video, audio", scope).forEach((media) => {
      if (!media.paused) media.pause();
    });
  }

  /* 1. Theme and lamp ----------------------------------------------------- */

  const theme = {
    current() {
      return root.dataset.theme === "dark" ? "dark" : "light";
    },
    apply(value, persist = false) {
      const next = value === "dark" ? "dark" : "light";
      root.dataset.theme = next;
      const meta = $('meta[name="theme-color"]');
      if (meta) meta.content = THEME_COLORS[next];
      const dark = next === "dark";
      all("[data-lamp-pull]").forEach((button) => {
        button.setAttribute("aria-pressed", String(dark));
      });
      all("[data-theme-label]").forEach((node) => setText(node, dark ? "Lamplight" : "Daylight"));
      all("[data-theme-hint]").forEach((node) => {
        setText(node, dark ? "Pull the cord for daylight." : "Pull the lamp cord for lamplight.");
      });
      if (persist) store.set(THEME_KEY, next);
    }
  };

  let audio = null;

  // A quiet, synthesised pull-chain click. It only plays after a pull.
  function playClick(on) {
    const Context = window.AudioContext || window.webkitAudioContext;
    if (!Context) return;
    try {
      audio ||= new Context();
      if (audio.state === "suspended") audio.resume();
      const now = audio.currentTime;
      const length = Math.floor(audio.sampleRate * 0.035);
      const buffer = audio.createBuffer(1, length, audio.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < length; i += 1) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / length) ** 4;
      }
      const noise = audio.createBufferSource();
      const filter = audio.createBiquadFilter();
      const noiseGain = audio.createGain();
      noise.buffer = buffer;
      filter.type = "bandpass";
      filter.frequency.value = on ? 2600 : 1900;
      filter.Q.value = 1.4;
      noiseGain.gain.value = 0.16;
      noise.connect(filter).connect(noiseGain).connect(audio.destination);
      noise.start(now);

      const body = audio.createOscillator();
      const bodyGain = audio.createGain();
      body.type = "triangle";
      body.frequency.setValueAtTime(on ? 210 : 160, now);
      body.frequency.exponentialRampToValueAtTime(70, now + 0.07);
      bodyGain.gain.setValueAtTime(0.06, now);
      bodyGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);
      body.connect(bodyGain).connect(audio.destination);
      body.start(now);
      body.stop(now + 0.1);
    } catch (_) {
      // Sound is a nicety; ignore browsers that refuse audio.
    }
  }

  function switchTheme(point) {
    const next = theme.current() === "dark" ? "light" : "dark";
    const update = () => theme.apply(next, true);

    if (next === "dark") {
      all("[data-lamp]").forEach((lamp) => {
        lamp.classList.remove("is-flicker");
        void lamp.offsetWidth;
        lamp.classList.add("is-flicker");
        window.setTimeout(() => lamp.classList.remove("is-flicker"), 700);
      });
    }

    if (typeof document.startViewTransition !== "function" || reduceMotion.matches || document.hidden) {
      update();
      return;
    }

    // The new theme spreads out in a circle from the lamp.
    const x = point ? point.x : window.innerWidth / 2;
    const y = point ? point.y : 0;
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    root.style.setProperty("--vt-x", `${Math.round(x)}px`);
    root.style.setProperty("--vt-y", `${Math.round(y)}px`);
    root.style.setProperty("--vt-r", `${Math.ceil(radius) + 8}px`);
    root.classList.add("theme-vt");
    try {
      const transition = document.startViewTransition(update);
      transition.finished.finally(() => root.classList.remove("theme-vt"));
    } catch (_) {
      root.classList.remove("theme-vt");
      update();
    }
  }

  function initTheme() {
    let initial = root.dataset.theme;
    const saved = store.get(THEME_KEY);
    if (saved === "light" || saved === "dark") initial = saved;
    theme.apply(initial);

    window.addEventListener("storage", (event) => {
      if (event.key === THEME_KEY && (event.newValue === "light" || event.newValue === "dark")) {
        theme.apply(event.newValue);
      }
    });
  }

  function initLamps() {
    const lamps = all("[data-lamp]");
    if (!lamps.length) return;
    const hinting = store.get(LAMP_KEY) !== "1";

    function markUsed() {
      store.set(LAMP_KEY, "1");
      lamps.forEach((lamp) => lamp.classList.remove("is-hinting"));
    }

    lamps.forEach((lamp) => {
      if (hinting) lamp.classList.add("is-hinting");
      createLamp(lamp, markUsed);
    });
  }

  function createLamp(lamp, onUse) {
    const scope = lamp.closest("[data-lamp-scope]") || lamp;
    const pull = $("[data-lamp-pull]", lamp);
    const cord = $(".lamp__cord path", lamp);
    if (!pull || !cord) return;

    // Geometry in the lamp's own 80 × 64 drawing; CSS may scale the lamp.
    const PIVOT_X = 40;
    const ANCHOR = { x: 64, y: 50 };
    const CORD = 28;
    const BEAD_DROP = 8;
    const HALF = 22;
    const THRESHOLD = 20;
    const BULB = { x: 40, y: 51 };

    const s = { x: 0, y: 0, vx: 0, vy: 0, angle: 0, spin: 0 };
    let dragging = false;
    let autoPull = null;
    let running = false;
    let last = 0;
    let pointer = null;
    let start = { x: 0, y: 0 };
    let scale = 1;
    let moved = false;
    let armed = false;
    let lastDrag = -Infinity;

    function lampScale() {
      const rect = lamp.getBoundingClientRect();
      return rect.width / 80 || 1;
    }

    function render() {
      const cos = Math.cos(s.angle);
      const sin = Math.sin(s.angle);
      const rx = ANCHOR.x - PIVOT_X;
      const ry = ANCHOR.y;
      const ax = PIVOT_X + rx * cos - ry * sin;
      const ay = rx * sin + ry * cos;
      const bx = ax + s.x;
      const by = ay + CORD + s.y;
      const cx = (ax + bx) / 2 - s.x * 0.22;
      const cy = (ay + by) / 2;
      const tilt = Math.atan2(bx - ax, by - ay) * (-180 / Math.PI);
      const dirX = Math.sin(-tilt * Math.PI / 180);
      const dirY = Math.cos(-tilt * Math.PI / 180);

      cord.setAttribute("d", `M${ax.toFixed(2)} ${ay.toFixed(2)} Q${cx.toFixed(2)} ${cy.toFixed(2)} ${bx.toFixed(2)} ${by.toFixed(2)}`);
      pull.style.transform = `translate(${(bx + dirX * BEAD_DROP - HALF).toFixed(2)}px, ${(by + dirY * BEAD_DROP - HALF).toFixed(2)}px)`;
      pull.style.setProperty("--bead-tilt", `${tilt.toFixed(2)}deg`);
      scope.style.setProperty("--lamp-angle", `${(s.angle * 180 / Math.PI).toFixed(3)}deg`);
      scope.style.setProperty("--lamp-shift", `${(-BULB.y * sin * scale).toFixed(2)}px`);
    }

    function bulbPoint() {
      const rect = lamp.getBoundingClientRect();
      const k = rect.width / 80 || 1;
      return { x: rect.left + BULB.x * k, y: rect.top + BULB.y * k };
    }

    function toggle() {
      playClick(theme.current() === "light");
      switchTheme(bulbPoint());
      onUse();
    }

    function settled() {
      return !dragging && !autoPull
        && Math.abs(s.x) < 0.04 && Math.abs(s.y) < 0.04
        && Math.abs(s.vx) < 0.04 && Math.abs(s.vy) < 0.04
        && Math.abs(s.angle) < 0.0004 && Math.abs(s.spin) < 0.0008;
    }

    function step(now) {
      const dt = Math.min(0.032, Math.max(0.001, (now - last) / 1000));
      last = now;

      if (autoPull) {
        const t = clamp((now - autoPull.start) / 150, 0, 1);
        const eased = 1 - (1 - t) ** 3;
        s.y = autoPull.from + (34 - autoPull.from) * eased;
        s.x *= 0.85;
        if (t >= 1) {
          autoPull = null;
          s.vy = 0;
          toggle();
        }
      } else if (!dragging) {
        // Under-damped spring: the cord bounces back up a few times.
        const k = 260;
        const c = 9;
        s.vx += (-k * s.x - c * s.vx) * dt;
        s.vy += (-k * s.y - c * s.vy) * dt;
        s.x += s.vx * dt;
        s.y += s.vy * dt;
      }

      // The shade swings like a pendulum, pushed by the cord's tension.
      const torque = 24 * Math.max(s.y, 0) - 50 * s.x;
      s.spin += (-38 * s.angle - 3.2 * s.spin + torque * 0.0013) * dt;
      s.angle += s.spin * dt;

      render();

      if (settled()) {
        Object.assign(s, { x: 0, y: 0, vx: 0, vy: 0, angle: 0, spin: 0 });
        render();
        running = false;
        lamp.classList.remove("is-active");
        return;
      }
      window.requestAnimationFrame(step);
    }

    function kick() {
      if (running) return;
      running = true;
      last = performance.now();
      lamp.classList.add("is-active");
      window.requestAnimationFrame(step);
    }

    function startAutoPull() {
      if (reduceMotion.matches) {
        toggle();
        return;
      }
      scale = lampScale();
      autoPull = { start: performance.now(), from: Math.max(0, s.y) };
      kick();
    }

    pull.addEventListener("pointerdown", (event) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      scale = lampScale();
      pointer = event.pointerId;
      start = { x: event.clientX - s.x * scale, y: event.clientY - s.y * scale };
      dragging = true;
      autoPull = null;
      moved = false;
      armed = false;
      try {
        pull.setPointerCapture(event.pointerId);
      } catch (_) {
        // Capture is optional.
      }
      kick();
    });

    pull.addEventListener("pointermove", (event) => {
      if (!dragging || event.pointerId !== pointer) return;
      const dx = (event.clientX - start.x) / scale;
      const dy = (event.clientY - start.y) / scale;
      if (!moved && Math.hypot(dx, dy) > 4) moved = true;
      // Rubber-band resistance makes the cord feel springy.
      const down = dy <= 0 ? Math.max(dy * 0.25, -6) : dy <= 44 ? dy : 44 + (dy - 44) * 0.3;
      s.x = clamp(dx * 0.55, -30, 30);
      s.y = Math.min(down, 70);
      s.vx = 0;
      s.vy = 0;
      const nowArmed = s.y >= THRESHOLD;
      if (nowArmed !== armed) {
        armed = nowArmed;
        lamp.classList.toggle("is-armed", armed);
      }
    });

    function release(event, cancelled) {
      if (!dragging || event.pointerId !== pointer) return;
      dragging = false;
      pointer = null;
      lamp.classList.remove("is-armed");
      if (moved) {
        lastDrag = performance.now();
        if (armed && !cancelled) toggle();
      }
      armed = false;
      kick();
    }

    pull.addEventListener("pointerup", (event) => release(event, false));
    pull.addEventListener("pointercancel", (event) => release(event, true));
    pull.addEventListener("lostpointercapture", (event) => release(event, true));

    // Taps, clicks, Enter and Space all perform a full pull.
    pull.addEventListener("click", () => {
      if (performance.now() - lastDrag < 450) return;
      startAutoPull();
    });

    render();
  }

  /* 2. Small helpers across pages ----------------------------------------- */

  function initClock() {
    const nodes = all("[data-local-time]");
    if (!nodes.length) return;
    let format;
    try {
      format = new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
        timeZone: CONFIG.timeZone || "Asia/Manila"
      });
    } catch (_) {
      return;
    }
    let timer = 0;

    function tick() {
      window.clearTimeout(timer);
      if (document.hidden) return;
      const now = new Date();
      const text = format.format(now);
      nodes.forEach((node) => {
        setText(node, text);
        node.dateTime = now.toISOString();
      });
      timer = window.setTimeout(tick, 60000 - (Date.now() % 60000) + 40);
    }

    document.addEventListener("visibilitychange", tick);
    tick();
  }

  function initSpotlight() {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!fine.matches || reduceMotion.matches) return;
    root.classList.add("has-spotlight");
    let frame = 0;
    let latest = null;
    document.addEventListener("pointermove", (event) => {
      latest = event;
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const card = latest.target instanceof Element ? latest.target.closest(".card") : null;
        if (!card) return;
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${latest.clientX - rect.left}px`);
        card.style.setProperty("--my", `${latest.clientY - rect.top}px`);
      });
    }, { passive: true });
  }

  function initMediaFallbacks() {
    all("img[data-fallback]").forEach((image) => {
      const fail = () => {
        image.hidden = true;
        image.closest("[data-media]")?.classList.add("is-missing");
      };
      image.addEventListener("error", fail, { once: true });
      if (image.complete && image.naturalWidth === 0) fail();
    });
  }

  function initPageState() {
    const update = () => {
      root.classList.toggle("is-page-hidden", document.hidden);
      if (document.hidden) pauseMedia();
    };
    document.addEventListener("visibilitychange", update);
    update();
    all("[data-year]").forEach((node) => setText(node, String(new Date().getFullYear())));

    // One video at a time.
    document.addEventListener("play", (event) => {
      all("video, audio").forEach((media) => {
        if (media !== event.target && !media.paused) media.pause();
      });
    }, true);
  }

  function initWaizLinks() {
    const url = safeUrl(PROJECTS.waiz?.url);
    all("[data-waiz-link]").forEach((link) => {
      if (url) {
        link.href = url;
      } else if (!link.hasAttribute("data-open-project")) {
        // No public address configured: hide actions that would lead nowhere.
        link.hidden = true;
      } else {
        link.removeAttribute("target");
        link.href = "works.html#waiz";
      }
    });
  }

  /* 3. Project viewer ------------------------------------------------------ */

  const viewer = { openProject: null, openMedia: null };

  function initViewer() {
    const dialog = $("#viewer");
    if (!dialog || typeof dialog.showModal !== "function") return;

    const el = {
      title: $("#viewer-title", dialog),
      desc: $("#viewer-desc", dialog),
      icon: $("[data-viewer-icon]", dialog),
      tools: $("[data-viewer-tools]", dialog),
      bar: $("[data-viewer-bar]", dialog),
      size: $("[data-viewer-size]", dialog),
      stage: $("[data-viewer-stage]", dialog),
      fit: $("[data-viewer-fit]", dialog),
      device: $("[data-viewer-device]", dialog),
      host: $("[data-viewer-host]", dialog),
      shot: $("[data-viewer-shot]", dialog),
      frameSlot: $("[data-viewer-frame]", dialog),
      loading: $("[data-viewer-loading]", dialog),
      loadingText: $("[data-viewer-loading-text]", dialog),
      media: $("[data-viewer-media]", dialog),
      empty: $("[data-viewer-empty]", dialog),
      emptyTitle: $("[data-viewer-empty-title]", dialog),
      emptyText: $("[data-viewer-empty-text]", dialog),
      emptyActions: $("[data-viewer-empty-actions]", dialog),
      status: $("[data-viewer-status]", dialog),
      external: $("[data-viewer-external]", dialog),
      reload: $("[data-viewer-reload]", dialog)
    };
    if (Object.values(el).some((node) => !node)) return;

    const deviceButtons = all("[data-device]", dialog);
    const sourceButtons = all("[data-source]", dialog);
    const liveButton = sourceButtons.find((button) => button.dataset.source === "live");

    const state = {
      mode: "device",
      project: null,
      url: "",
      device: "desktop",
      source: "shot",
      opener: null,
      frame: null,
      version: 0,
      liveTimer: 0,
      fitFrame: 0,
      mediaKey: "",
      mediaIndex: 0
    };

    function pressed(buttons, attribute, value) {
      buttons.forEach((button) => {
        const on = button.dataset[attribute] === value;
        button.setAttribute("aria-pressed", String(on));
      });
    }

    function setStatus(text, action) {
      el.status.replaceChildren(document.createTextNode(text));
      if (action) {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = action.label;
        button.addEventListener("click", action.run);
        el.status.append(" ", button);
      }
    }

    function showLoading(on, text) {
      el.loading.hidden = !on;
      if (text) setText(el.loadingText, text);
      el.stage.setAttribute("aria-busy", String(on));
    }

    function removeFrame() {
      window.clearTimeout(state.liveTimer);
      state.liveTimer = 0;
      if (state.frame) {
        // Removing the iframe stops the embedded page and any media inside it.
        state.frame.remove();
        state.frame = null;
      }
      el.frameSlot.hidden = true;
    }

    function clearMedia() {
      pauseMedia(el.media);
      all("video", el.media).forEach((video) => {
        video.removeAttribute("src");
        all("source", video).forEach((source) => source.remove());
        video.load();
      });
      el.media.replaceChildren();
      el.media.hidden = true;
    }

    function fit() {
      state.fitFrame = 0;
      if (!dialog.open || el.fit.hidden) return;
      const style = window.getComputedStyle(el.stage);
      const px = (value) => Number.parseFloat(value) || 0;
      const availableWidth = el.stage.clientWidth - px(style.paddingLeft) - px(style.paddingRight);
      const availableHeight = el.stage.clientHeight - px(style.paddingTop) - px(style.paddingBottom);
      const width = el.device.offsetWidth;
      const height = el.device.offsetHeight;
      if (availableWidth <= 0 || availableHeight <= 0 || !width || !height) return;
      const scale = Math.min(1, availableWidth / width, availableHeight / height);
      el.device.style.setProperty("--scale", scale.toFixed(4));
      el.fit.style.width = `${Math.floor(width * scale)}px`;
      el.fit.style.height = `${Math.floor(height * scale)}px`;
    }

    function scheduleFit() {
      if (!state.fitFrame && dialog.open) state.fitFrame = window.requestAnimationFrame(fit);
    }

    function showEmpty(title, text, actions) {
      el.fit.hidden = true;
      el.empty.hidden = false;
      setText(el.emptyTitle, title);
      setText(el.emptyText, text);
      el.emptyActions.replaceChildren(...actions.map((action) => {
        const node = document.createElement(action.href ? "a" : "button");
        node.className = `btn ${action.primary ? "btn--primary" : "btn--ghost"} btn--sm`;
        node.textContent = action.label;
        if (action.href) {
          node.href = action.href;
          node.target = "_blank";
          node.rel = "noopener noreferrer";
        } else {
          node.type = "button";
          node.addEventListener("click", action.run);
        }
        return node;
      }));
    }

    function setSize(width, height, note) {
      el.device.style.setProperty("--w", String(width));
      el.device.style.setProperty("--h", String(height));
      setText(el.size, `${width} × ${height} ${note}`);
    }

    function hostOf(url) {
      try {
        return new URL(url).host;
      } catch (_) {
        return "";
      }
    }

    function renderDevice() {
      state.version += 1;
      const version = state.version;
      const project = state.project;
      const spec = project[state.device];
      const label = state.device === "mobile" ? "Mobile" : "Desktop";

      pressed(deviceButtons, "device", state.device);
      pressed(sourceButtons, "source", state.source);
      el.device.classList.toggle("device--desktop", state.device === "desktop");
      el.device.classList.toggle("device--mobile", state.device === "mobile");
      el.empty.hidden = true;
      el.fit.hidden = false;
      el.reload.hidden = state.source !== "live";

      if (state.source === "live" && state.url) {
        setSize(spec.width, spec.height, "· live");
        el.shot.hidden = true;
        el.shot.removeAttribute("src");
        if (!state.frame) {
          const frame = document.createElement("iframe");
          frame.src = state.url;
          frame.referrerPolicy = "strict-origin-when-cross-origin";
          // No top-level navigation, camera, microphone or other permissions.
          frame.setAttribute("sandbox", "allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox");
          frame.addEventListener("load", () => {
            if (state.frame !== frame) return;
            window.clearTimeout(state.liveTimer);
            showLoading(false);
            // A cross-origin load event cannot prove the page rendered.
            setStatus(`Live site at a real ${state.device} width. Having trouble?`, {
              label: "View screenshot",
              run: () => chooseSource("shot")
            });
          });
          state.frame = frame;
          el.frameSlot.replaceChildren(frame);
          showLoading(true, `Loading ${hostOf(state.url)}…`);
          setStatus("Loading the live website…");
          state.liveTimer = window.setTimeout(() => {
            if (state.frame !== frame) return;
            showLoading(false);
            setStatus("Still blank? The site may block previews.", {
              label: "View screenshot",
              run: () => chooseSource("shot")
            });
          }, LIVE_TIMEOUT);
        } else {
          setStatus(`Live site at a real ${state.device} width. Having trouble?`, {
            label: "View screenshot",
            run: () => chooseSource("shot")
          });
        }
        state.frame.title = `${project.title} — live ${state.device} preview`;
        el.frameSlot.hidden = false;
        scheduleFit();
        return;
      }

      removeFrame();
      setSize(spec.shotWidth, spec.shotHeight, "· capture");
      el.shot.hidden = true;
      showLoading(true, "Loading screenshot…");
      setStatus(`Loading the ${label.toLowerCase()} screenshot…`);
      scheduleFit();

      const request = new Image();
      request.decoding = "async";
      request.onload = () => {
        if (version !== state.version || !dialog.open) return;
        el.shot.src = spec.screenshot;
        el.shot.alt = `${label} screenshot of the ${project.title} website`;
        el.shot.hidden = false;
        showLoading(false);
        setStatus(state.url
          ? `${label} screenshot of ${hostOf(state.url)}. Choose Live site to explore it.`
          : `${label} screenshot of ${project.title}.`);
        scheduleFit();
      };
      request.onerror = () => {
        if (version !== state.version || !dialog.open) return;
        showLoading(false);
        const actions = [];
        if (state.url) {
          actions.push({ label: "Try live site", primary: true, run: () => chooseSource("live") });
          actions.push({ label: "Open website", href: state.url });
        }
        showEmpty("Screenshot unavailable", "This capture could not be loaded.", actions);
        setStatus("The screenshot is missing.");
      };
      request.src = spec.screenshot;
    }

    function chooseDevice(value) {
      if (state.mode !== "device" || !["desktop", "mobile"].includes(value) || value === state.device) return;
      state.device = value;
      renderDevice();
    }

    function chooseSource(value) {
      if (state.mode !== "device" || !["shot", "live"].includes(value) || value === state.source) return;
      if (value === "live" && !state.url) return;
      state.source = value;
      renderDevice();
    }

    function beginOpen(opener) {
      state.opener = opener || null;
      document.body.classList.add("has-dialog");
      pauseMedia();
      try {
        dialog.showModal();
        return true;
      } catch (_) {
        document.body.classList.remove("has-dialog");
        return false;
      }
    }

    function openProject(key, opener) {
      const project = PROJECTS[key];
      if (!project || !project.desktop || !project.mobile) return false;
      state.mode = "device";
      state.project = project;
      state.url = safeUrl(project.url);
      state.source = "shot";
      state.device = window.matchMedia("(max-width: 47.99rem)").matches ? "mobile" : "desktop";

      setText(el.title, project.title);
      setText(el.desc, project.label || "");
      el.icon.setAttribute("href", "#i-globe");
      el.tools.hidden = false;
      el.bar.hidden = false;
      el.stage.classList.remove("is-media");
      clearMedia();
      setText(el.host, hostOf(state.url) || project.title);
      el.external.hidden = !state.url;
      if (state.url) el.external.href = state.url;
      if (liveButton) {
        liveButton.disabled = !state.url;
        liveButton.title = state.url ? "" : "No public address is configured";
      }

      if (!dialog.open && !beginOpen(opener)) return false;
      renderDevice();
      return true;
    }

    function renderMedia() {
      const project = PROJECTS[state.mediaKey];
      const items = project.media;
      const index = (state.mediaIndex + items.length) % items.length;
      const item = items[index];
      state.mediaIndex = index;
      clearMedia();
      el.media.hidden = false;

      let main;
      if (item.type === "video") {
        main = document.createElement("video");
        main.controls = true;
        main.playsInline = true;
        main.preload = "metadata";
        if (item.poster) main.poster = item.poster;
        const source = document.createElement("source");
        source.src = item.src;
        if (/\.mp4$/i.test(item.src)) source.type = "video/mp4";
        else if (/\.webm$/i.test(item.src)) source.type = "video/webm";
        main.append(source);
        main.setAttribute("aria-label", item.title || `${project.title} sample`);
        source.addEventListener("error", () => setStatus("This video could not be loaded."));
      } else {
        main = document.createElement("img");
        main.className = "gallery__main";
        main.src = item.src;
        main.alt = item.alt || `${project.title} sample ${index + 1}`;
        main.decoding = "async";
        main.addEventListener("error", () => setStatus("This image could not be loaded."));
      }
      if (item.type === "video") main.classList.add("gallery__main");
      el.media.append(main);

      if (items.length > 1) {
        const bar = document.createElement("div");
        bar.className = "gallery__bar";
        const prev = iconButton("Previous sample", "#i-chev-l", () => { state.mediaIndex -= 1; renderMedia(); });
        const next = iconButton("Next sample", "#i-chev-r", () => { state.mediaIndex += 1; renderMedia(); });
        const thumbs = document.createElement("div");
        thumbs.className = "gallery__thumbs";
        items.forEach((entry, i) => {
          const thumb = document.createElement("button");
          thumb.type = "button";
          thumb.setAttribute("aria-label", `Show sample ${i + 1}`);
          if (i === index) thumb.setAttribute("aria-current", "true");
          const preview = entry.type === "video" ? entry.poster : entry.src;
          if (preview) {
            const img = document.createElement("img");
            img.src = preview;
            img.alt = "";
            thumb.append(img);
          } else {
            thumb.textContent = String(i + 1);
          }
          thumb.addEventListener("click", () => { state.mediaIndex = i; renderMedia(); });
          thumbs.append(thumb);
        });
        bar.append(prev, thumbs, next);
        el.media.append(bar);
      }
      setStatus(`${project.title} · sample ${index + 1} of ${items.length}.`);
    }

    function iconButton(label, symbol, run) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "icon-btn";
      button.setAttribute("aria-label", label);
      button.innerHTML = `<svg class="icon" aria-hidden="true"><use href="${symbol}"></use></svg>`;
      button.addEventListener("click", run);
      return button;
    }

    function openMedia(key, opener) {
      const project = PROJECTS[key];
      if (!project || !Array.isArray(project.media) || !project.media.length) return false;
      state.mode = "media";
      state.mediaKey = key;
      state.mediaIndex = 0;
      removeFrame();
      setText(el.title, project.title);
      setText(el.desc, project.media.length > 1 ? `${project.media.length} samples` : "Sample");
      el.icon.setAttribute("href", key === "photo" ? "#i-camera" : key === "promo" ? "#i-clapper" : "#i-film");
      el.tools.hidden = true;
      el.bar.hidden = true;
      el.fit.hidden = true;
      el.empty.hidden = true;
      el.external.hidden = true;
      el.stage.classList.add("is-media");
      showLoading(false);
      if (!dialog.open && !beginOpen(opener)) return false;
      renderMedia();
      return true;
    }

    viewer.openProject = openProject;
    viewer.openMedia = openMedia;

    document.addEventListener("click", (event) => {
      const trigger = event.target instanceof Element ? event.target.closest("[data-open-project], [data-open-media]") : null;
      if (!trigger || event.defaultPrevented || event.button !== 0
        || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const opened = trigger.dataset.openProject
        ? openProject(trigger.dataset.openProject, trigger)
        : openMedia(trigger.dataset.openMedia, trigger);
      if (opened) event.preventDefault();
    });

    all("[data-open-project]").forEach((trigger) => trigger.setAttribute("aria-haspopup", "dialog"));
    deviceButtons.forEach((button) => button.addEventListener("click", () => chooseDevice(button.dataset.device)));
    sourceButtons.forEach((button) => button.addEventListener("click", () => chooseSource(button.dataset.source)));
    el.reload.addEventListener("click", () => {
      if (state.source !== "live") return;
      removeFrame();
      renderDevice();
    });
    $("[data-viewer-close]", dialog)?.addEventListener("click", () => dialog.close());

    // Backdrop click closes, but only when the press started on the backdrop.
    let downOutside = false;
    const outside = (event) => {
      const rect = dialog.getBoundingClientRect();
      return event.clientX < rect.left || event.clientX > rect.right
        || event.clientY < rect.top || event.clientY > rect.bottom;
    };
    dialog.addEventListener("pointerdown", (event) => {
      downOutside = event.target === dialog && outside(event);
    });
    dialog.addEventListener("click", (event) => {
      if (downOutside && event.target === dialog && outside(event)) dialog.close();
      downOutside = false;
    });

    dialog.addEventListener("keydown", (event) => {
      if (state.mode !== "media" || !["ArrowLeft", "ArrowRight"].includes(event.key)) return;
      const items = PROJECTS[state.mediaKey]?.media || [];
      if (items.length < 2 || event.target instanceof HTMLVideoElement) return;
      state.mediaIndex += event.key === "ArrowRight" ? 1 : -1;
      renderMedia();
    });

    dialog.addEventListener("close", () => {
      state.version += 1;
      removeFrame();
      clearMedia();
      showLoading(false);
      el.shot.hidden = true;
      el.shot.removeAttribute("src");
      window.cancelAnimationFrame(state.fitFrame);
      state.fitFrame = 0;
      document.body.classList.remove("has-dialog");
      const opener = state.opener;
      state.opener = null;
      if (opener && opener.isConnected) {
        // Hidden visual triggers hand focus to the card's visible button.
        const target = opener.getAttribute("tabindex") === "-1"
          ? opener.closest(".card")?.querySelector("button[data-open-project], a.btn[data-open-project]") || opener
          : opener;
        target.focus({ preventScroll: true });
      }
    });

    if (typeof ResizeObserver === "function") {
      new ResizeObserver(scheduleFit).observe(el.stage);
    }
    window.addEventListener("resize", scheduleFit, { passive: true });
    window.addEventListener("pagehide", () => {
      if (dialog.open) dialog.close();
    });
  }

  /* 4. Works selector ------------------------------------------------------ */

  function initWorks() {
    const works = $("[data-works]");
    if (!works) return;
    const tabs = all('[role="tab"][data-tab]', works);
    const panels = all("[data-panel]", works);
    const pairs = tabs.map((tab) => ({
      tab,
      key: tab.dataset.tab,
      panel: panels.find((panel) => panel.dataset.panel === tab.dataset.tab)
    })).filter((pair) => pair.panel);
    if (!pairs.length) return;

    const pos = $("[data-pos]", works);
    const dots = all(".pager__dots i", works);
    let current = pairs.find((pair) => !pair.panel.hidden)?.key || pairs[0].key;

    function select(key, { focus = false, history = false } = {}) {
      const index = pairs.findIndex((pair) => pair.key === key);
      if (index < 0) return;
      const changed = key !== current;
      pairs.forEach(({ tab, panel, key: panelKey }) => {
        const active = panelKey === key;
        tab.setAttribute("aria-selected", String(active));
        tab.tabIndex = active ? 0 : -1;
        if (!active) pauseMedia(panel);
        panel.hidden = !active;
        panel.classList.toggle("is-entering", active && changed);
      });
      current = key;
      if (pos) setText(pos, String(index + 1).padStart(2, "0"));
      dots.forEach((dot, i) => dot.classList.toggle("is-on", i === index));
      if (focus) pairs[index].tab.focus({ preventScroll: true });

      if (history) {
        try {
          const url = new URL(window.location.href);
          url.searchParams.delete("project");
          url.hash = key;
          window.history.replaceState(window.history.state, "", url);
        } catch (_) {
          // Some local-file browsers refuse history updates; selection still works.
        }
      }
    }

    function step(delta, focus = false) {
      const index = pairs.findIndex((pair) => pair.key === current);
      const next = pairs[(index + delta + pairs.length) % pairs.length];
      select(next.key, { history: true, focus });
    }

    pairs.forEach(({ tab, key }, index) => {
      tab.addEventListener("click", () => select(key, { history: true }));
      tab.addEventListener("keydown", (event) => {
        let next = index;
        if (event.key === "ArrowDown" || event.key === "ArrowRight") next += 1;
        else if (event.key === "ArrowUp" || event.key === "ArrowLeft") next -= 1;
        else if (event.key === "Home") next = 0;
        else if (event.key === "End") next = pairs.length - 1;
        else return;
        event.preventDefault();
        select(pairs[(next + pairs.length) % pairs.length].key, { focus: true, history: true });
      });
    });

    $("[data-prev]", works)?.addEventListener("click", () => step(-1));
    $("[data-next]", works)?.addEventListener("click", () => step(1));

    // Swipe is a shortcut on touch screens; the buttons and tabs remain.
    const stages = $(".stages", works);
    let touch = null;
    stages?.addEventListener("pointerdown", (event) => {
      if (event.pointerType !== "touch") return;
      touch = { x: event.clientX, y: event.clientY, t: performance.now() };
    }, { passive: true });
    stages?.addEventListener("pointerup", (event) => {
      if (!touch || event.pointerType !== "touch") return;
      const dx = event.clientX - touch.x;
      const dy = event.clientY - touch.y;
      const quick = performance.now() - touch.t < 700;
      touch = null;
      if (quick && Math.abs(dx) > 56 && Math.abs(dx) > Math.abs(dy) * 1.4) step(dx < 0 ? 1 : -1);
    }, { passive: true });
    stages?.addEventListener("pointercancel", () => { touch = null; }, { passive: true });

    function fromLocation() {
      let key = "";
      try {
        key = decodeURIComponent(window.location.hash.slice(1));
      } catch (_) {
        key = "";
      }
      if (!key) key = new URLSearchParams(window.location.search).get("project") || "";
      return pairs.some((pair) => pair.key === key) ? key : "";
    }

    select(fromLocation() || current);
    pairs.forEach(({ panel }) => panel.classList.remove("is-entering"));
    window.addEventListener("hashchange", () => {
      const key = fromLocation();
      if (key && key !== current) select(key);
    });

    // Real samples from config.js replace the illustration automatically.
    pairs.forEach(({ key, panel }) => {
      const items = PROJECTS[key]?.media;
      const visual = $("[data-stage-visual]", panel);
      if (!visual || !Array.isArray(items) || !items.length) return;
      const first = items[0];
      const cover = document.createElement("button");
      cover.type = "button";
      cover.className = "media-cover";
      cover.dataset.openMedia = key;
      cover.setAttribute("aria-haspopup", "dialog");
      const preview = first.type === "video" ? first.poster : first.src;
      if (preview) {
        const img = document.createElement("img");
        img.src = preview;
        img.alt = "";
        img.decoding = "async";
        cover.append(img);
      }
      const label = document.createElement("span");
      label.className = "media-cover__label";
      label.innerHTML = `<svg class="icon" aria-hidden="true"><use href="${first.type === "video" ? "#i-play" : "#i-images"}"></use></svg>`;
      label.append(first.type === "video" ? "Watch the edit" : `Open gallery (${items.length})`);
      cover.append(label);
      visual.replaceChildren(cover);
      const pill = $("[data-samples-pill]", panel);
      if (pill) setText(pill, items.length === 1 ? "1 sample" : `${items.length} samples`);
    });
  }

  /* 5. Contact ------------------------------------------------------------- */

  async function copyText(text) {
    if (navigator.clipboard?.writeText && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (_) {
        // Fall through to the selection-based copy below.
      }
    }
    const focused = document.activeElement;
    const field = document.createElement("textarea");
    field.value = text;
    field.readOnly = true;
    field.setAttribute("aria-hidden", "true");
    field.style.cssText = "position:fixed;left:-9999px;top:0;opacity:0;font-size:16px";
    document.body.append(field);
    let copied = false;
    try {
      field.select();
      copied = typeof document.execCommand === "function" && document.execCommand("copy");
    } catch (_) {
      copied = false;
    } finally {
      field.remove();
      if (focused instanceof HTMLElement) focused.focus({ preventScroll: true });
    }
    return copied;
  }

  function flash(button, text) {
    const label = $("span", button);
    if (!label) return;
    const original = button.dataset.label || label.textContent;
    button.dataset.label = original;
    setText(label, text);
    button.classList.add("is-done");
    window.clearTimeout(Number(button.dataset.timer));
    button.dataset.timer = String(window.setTimeout(() => {
      setText(label, original);
      button.classList.remove("is-done");
    }, 2200));
  }

  function initContact() {
    const email = CONFIG.email || "urcloyd@gmail.com";
    const copyStatus = $("[data-copy-status]");

    all("[data-copy-email]").forEach((button) => {
      button.addEventListener("click", async () => {
        const ok = await copyText(email);
        flash(button, ok ? "Copied" : "Select it");
        setText(copyStatus, ok ? "Email address copied." : `Copy is unavailable. The address is ${email}.`);
      });
    });

    const grid = $("[data-contact-grid]");
    const viewButtons = all("[data-contact-view]");
    viewButtons.forEach((button) => {
      button.addEventListener("click", () => {
        if (!grid) return;
        grid.dataset.view = button.dataset.contactView;
        viewButtons.forEach((other) => other.setAttribute("aria-pressed", String(other === button)));
      });
    });

    const form = $("form[data-contact-form]");
    if (!form) return;
    const name = form.elements.namedItem("name");
    const from = form.elements.namedItem("email");
    const message = form.elements.namedItem("message");
    const status = $("[data-form-status]", form);
    if (![name, from, message].every((field) => field && "value" in field)) return;

    const TOPICS = {
      video: "video editing",
      photo: "photo editing",
      promo: "a promo video",
      waiz: "Waiz Earn"
    };
    const topic = new URLSearchParams(window.location.search).get("topic");
    if (TOPICS[topic] && !message.value) {
      message.value = `Hi Kevin, I'd like to ask about ${TOPICS[topic]}. `;
    }

    [name, from, message].forEach((field) => {
      field.addEventListener("input", () => {
        field.setCustomValidity("");
        field.removeAttribute("aria-invalid");
      });
    });
    form.addEventListener("invalid", (event) => {
      event.target.setAttribute("aria-invalid", "true");
      setText(status, "Please check the highlighted fields.");
    }, true);

    function draft() {
      [name, from, message].forEach((field) => field.setCustomValidity(""));
      if (!name.value.trim()) name.setCustomValidity("Please enter your name.");
      if (!message.value.trim()) message.setCustomValidity("Please write a short message.");
      if (!form.reportValidity()) return null;
      const sender = name.value.trim().replace(/[\r\n]+/g, " ");
      return {
        subject: `Portfolio inquiry from ${sender}`,
        body: [
          "Hi Kevin,",
          "",
          message.value.trim(),
          "",
          `— ${sender}`,
          from.value.trim()
        ].join("\n")
      };
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const value = draft();
      if (!value) return;
      const href = `mailto:${email}?subject=${encodeURIComponent(value.subject)}&body=${encodeURIComponent(value.body)}`;
      window.location.href = href;
      setText(status, href.length > 1900
        ? "Your email app should open. Long messages can be cut short, so use Copy message if needed."
        : "Your email app should open with this draft. Nothing is sent until you press send there.");
    });

    $("[data-copy-message]", form)?.addEventListener("click", async (event) => {
      const value = draft();
      if (!value) return;
      const ok = await copyText(`To: ${email}\nSubject: ${value.subject}\n\n${value.body}`);
      flash(event.currentTarget, ok ? "Copied" : "Copy failed");
      setText(status, ok
        ? `Message copied. Paste it into an email to ${email}.`
        : "Copy is unavailable here. Please select your message and copy it.");
    });
  }

  /* Start ------------------------------------------------------------------ */

  function init() {
    if (root.dataset.ready === "true") return;
    root.dataset.ready = "true";
    root.classList.add("js");
    initTheme();
    initLamps();
    initPageState();
    initClock();
    initSpotlight();
    initMediaFallbacks();
    initWaizLinks();
    initViewer();
    initWorks();
    initContact();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
