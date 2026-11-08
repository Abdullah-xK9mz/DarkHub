(() => {
  const pages = {
    wallpapers: { title: "مكتبة الخلفيات", kicker: "DARK HUB / VISUALS", label: "WALLPAPER LIBRARY", src: "pages/wallpapers.html", group: "wallpapers" },
    games: { title: "ساحة الألعاب", kicker: "DARK HUB / ARCADE", label: "GAME ARCADE", src: "pages/games.html", group: "games" },
    tools: { title: "صندوق الأدوات", kicker: "DARK HUB / UTILITY", label: "DIGITAL TOOLKIT", src: "pages/Tools.html", group: "tools" },
    downloader: { title: "TikTok Downloader", kicker: "DARK HUB / QUICK TOOL", label: "TIKTOK DOWNLOADER", src: "pages/Tik_Downloader.html", group: "tools" },
    ox: { title: "إكس أو", kicker: "DARK HUB / GAME", label: "TIC-TAC-TOE", src: "pages/ox.html", group: "games" },
    memory: { title: "تحدي الذاكرة", kicker: "DARK HUB / GAME", label: "MEMORY GAME", src: "pages/memory.html", group: "games" },
    flappy: { title: "Flappy Bird", kicker: "DARK HUB / GAME", label: "FLAPPY BIRD", src: "pages/flappy.html", group: "games" },
    space: { title: "حارس المجرة", kicker: "DARK HUB / GAME", label: "GALAXY SHOOTER", src: "pages/space_shooter.html", group: "games" }
  };

  const homeScreen = document.getElementById("screenHome");
  const workspaceScreen = document.getElementById("screenWorkspace");
  const frame = document.getElementById("featureFrame");
  const title = document.getElementById("workspaceTitle");
  const kicker = document.getElementById("workspaceKicker");
  const frameLabel = document.getElementById("frameLabel");
  const nav = document.getElementById("mainNav");
  const menuToggle = document.getElementById("menuToggle");

  function setActiveNav(group) {
    nav.querySelectorAll("[data-route]").forEach((button) => {
      const active = button.dataset.route === group;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
  }

  function setHash(value, replace = false) {
    const nextHash = "#" + value;
    if (location.hash === nextHash) return;
    if (replace) history.replaceState(null, "", nextHash);
    else history.pushState(null, "", nextHash);
  }

  function showHome({ updateHash = true } = {}) {
    homeScreen.hidden = false;
    workspaceScreen.hidden = true;
    setActiveNav("home");
    document.title = "Dark Hub — عالمك الرقمي";
    if (updateHash) setHash("home");
    closeMenu();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openPage(pageId, { updateHash = true } = {}) {
    const page = pages[pageId];
    if (!page) return showHome({ updateHash: true });

    homeScreen.hidden = true;
    workspaceScreen.hidden = false;
    setActiveNav(page.group);
    title.textContent = page.title;
    kicker.textContent = page.kicker;
    frameLabel.textContent = page.label;
    frame.title = "Dark Hub — " + page.title;
    frame.setAttribute("aria-busy", "true");

    let frameIsOnRequestedPage = false;
    try {
      const requestedFile = page.src.slice("pages/".length);
      frameIsOnRequestedPage = frame.contentWindow.location.pathname.endsWith("/" + requestedFile);
    } catch (_) {}
    if (frame.getAttribute("src") !== page.src || !frameIsOnRequestedPage) frame.setAttribute("src", page.src);
    document.title = page.title + " — Dark Hub";
    if (updateHash) setHash("page=" + encodeURIComponent(pageId));
    closeMenu();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function closeMenu() {
    nav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "فتح قائمة التنقل");
  }

  function renderHash() {
    const hash = decodeURIComponent(location.hash.slice(1));
    if (!hash || hash === "home") return showHome({ updateHash: false });
    if (hash.startsWith("page=")) return openPage(hash.slice(5), { updateHash: false });
    if (pages[hash]) return openPage(hash, { updateHash: false });
    showHome({ updateHash: true });
  }

  document.addEventListener("click", (event) => {
    const routeControl = event.target.closest("[data-route]");
    const pageControl = event.target.closest("[data-open-page]");

    if (routeControl) {
      event.preventDefault();
      const route = routeControl.dataset.route;
      if (route === "home") showHome();
      else openPage(route);
      return;
    }

    if (pageControl) {
      event.preventDefault();
      openPage(pageControl.dataset.openPage);
    }
  });

  frame.addEventListener("load", () => frame.setAttribute("aria-busy", "false"));
  menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "إغلاق قائمة التنقل" : "فتح قائمة التنقل");
  });
  window.addEventListener("hashchange", renderHash);
  window.addEventListener("popstate", renderHash);

  renderHash();
})();