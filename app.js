/*
 * Workflow OS — Dashboard Controller
 * Vanilla JavaScript only.
 *
 * Included:
 * 1. Sidebar active states + mobile drawer
 * 2. Local Mode toggle
 * 3. Privacy toggle
 * 4. Hero tab switching
 * 5. File upload + drag/drop feedback
 * 6. Example chips
 * 7. Theme toggle
 * 8. Basic buttons/toasts/modal interactions
 */

document.addEventListener("DOMContentLoaded", () => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  /* ----------------------------- Toast ----------------------------- */
  let toastTimer;

  function showToast(message) {
    const toast = $("#toast");
    toast.textContent = message;
    toast.classList.remove("hidden");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.add("hidden"), 2400);
  }

  /* ------------------------- Sidebar states ------------------------- */
  const sidebar = $("#sidebar");
  const app = $("#app");

  function setActiveSection(section) {
    $$(".sidebar-item").forEach(item => {
      item.classList.toggle("active", item.dataset.section === section);
      if (item.dataset.section !== section) {
        item.classList.remove("text-white");
        if (!item.classList.contains("active")) item.classList.add("text-slate-400");
      }
    });
  }

  $$(".sidebar-item").forEach(item => {
    item.addEventListener("click", () => {
      setActiveSection(item.dataset.section);
      closeSidebar();
    });
  });

  function openSidebar() {
    sidebar.classList.remove("-translate-x-full");
    app.classList.add("sidebar-open");
    document.body.classList.add("overflow-hidden");
  }

  function closeSidebar() {
    sidebar.classList.add("-translate-x-full");
    app.classList.remove("sidebar-open");
    document.body.classList.remove("overflow-hidden");
  }

  $("#openSidebar")?.addEventListener("click", openSidebar);
  $("#closeSidebar")?.addEventListener("click", closeSidebar);
  $("#mobileOverlay")?.addEventListener("click", closeSidebar);

  /* -------------------------- Local Mode ---------------------------- */
  let localMode = true;

  function renderLocalMode() {
    const track = $("#localModeTrack");
    const knob = $("#localModeKnob");
    const label = $("#localModeLabel");
    const button = $("#localModeBtn");

    button.setAttribute("aria-pressed", String(localMode));

    if (localMode) {
      track.className = "relative h-5 w-10 rounded-full bg-emerald-500/20 ring-1 ring-emerald-400/20";
      knob.className = "absolute right-0.5 top-0.5 h-4 w-4 rounded-full bg-emerald-400 shadow-lg transition-all";
      label.textContent = "ON";
      label.className = "hidden font-semibold text-emerald-300 sm:inline";
    } else {
      track.className = "relative h-5 w-10 rounded-full bg-slate-800 ring-1 ring-slate-700";
      knob.className = "absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-slate-500 shadow-lg transition-all";
      label.textContent = "OFF";
      label.className = "hidden font-semibold text-slate-500 sm:inline";
    }
  }

  $("#localModeBtn")?.addEventListener("click", () => {
    localMode = !localMode;
    renderLocalMode();
    showToast(localMode ? "Local Mode enabled" : "Local Mode disabled");
  });

  /* -------------------------- Privacy toggle ------------------------ */
  let privacyEnabled = true;

  $("#privacyToggle")?.addEventListener("click", () => {
    privacyEnabled = !privacyEnabled;
    const knob = $("#privacyKnob");
    const toggle = $("#privacyToggle");

    toggle.setAttribute("aria-pressed", String(privacyEnabled));

    if (privacyEnabled) {
      toggle.className = "relative h-5 w-10 rounded-full bg-emerald-500/20 ring-1 ring-emerald-400/20";
      knob.className = "absolute right-0.5 top-0.5 h-4 w-4 rounded-full bg-emerald-400 transition-all";
      showToast("Privacy-first local processing is ON");
    } else {
      toggle.className = "relative h-5 w-10 rounded-full bg-slate-800 ring-1 ring-slate-700";
      knob.className = "absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-slate-500 transition-all";
      showToast("Privacy-first mode is OFF");
    }
  });

  /* ---------------------------- Hero tabs --------------------------- */
  const panels = {
    describe: $("#tabDescribe"),
    upload: $("#tabUpload"),
    paste: $("#tabPaste")
  };

  function switchHeroTab(tabName) {
    $$(".hero-tab").forEach(tab => {
      const active = tab.dataset.tab === tabName;
      tab.classList.toggle("bg-gradient-to-r", active);
      tab.classList.toggle("from-indigo-500", active);
      tab.classList.toggle("to-purple-600", active);
      tab.classList.toggle("text-white", active);
      tab.classList.toggle("shadow-lg", active);
      tab.classList.toggle("text-slate-400", !active);
    });

    Object.entries(panels).forEach(([name, panel]) => {
      panel.classList.toggle("hidden", name !== tabName);
    });
  }

  $$(".hero-tab").forEach(tab => {
    tab.addEventListener("click", () => switchHeroTab(tab.dataset.tab));
  });

  /* ---------------------------- File input --------------------------- */
  function showSelectedFiles(files, targetElement) {
    if (!files || !files.length) return;
    const names = [...files].map(file => file.name);
    targetElement.textContent =
      names.length === 1 ? names[0] : `${names.length} files selected`;
    showToast(`${names.length} file${names.length > 1 ? "s" : ""} ready`);
  }

  $("#heroFileInput")?.addEventListener("change", event => {
    showSelectedFiles(event.target.files, $("#heroFileName"));
  });

  $("#dropFileInput")?.addEventListener("change", event => {
    showSelectedFiles(event.target.files, $("#dropFileName"));
  });

  /* Drag & drop */
  const dropZone = $("#dropZone");

  ["dragenter", "dragover"].forEach(eventName => {
    dropZone?.addEventListener(eventName, event => {
      event.preventDefault();
      dropZone.classList.add("border-indigo-400", "bg-indigo-500/10");
    });
  });

  ["dragleave", "drop"].forEach(eventName => {
    dropZone?.addEventListener(eventName, event => {
      event.preventDefault();
      dropZone.classList.remove("border-indigo-400", "bg-indigo-500/10");
    });
  });

  dropZone?.addEventListener("drop", event => {
    const files = event.dataTransfer.files;
    showSelectedFiles(files, $("#dropFileName"));
  });

  /* -------------------------- Example chips ------------------------- */
  $$(".example-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      $("#taskInput").value = chip.textContent.trim();
      switchHeroTab("describe");
      $("#taskInput").focus();
    });
  });

  $("#refreshExamples")?.addEventListener("click", () => {
    const examples = [
      "Purchase bill ka complete record bana do",
      "GST invoice banao",
      "Resume ko ATS friendly improve karo",
      "Mere data se monthly report bana do"
    ];

    const chips = $$(".example-chip");
    chips.forEach((chip, index) => {
      chip.textContent = examples[index % examples.length];
    });

    showToast("Examples refreshed");
  });

  /* ---------------------------- Task run ---------------------------- */
  $("#runTaskBtn")?.addEventListener("click", () => {
    const value = $("#taskInput").value.trim();

    if (!value) {
      showToast("Pehle apna task describe karein");
      $("#taskInput").focus();
      return;
    }

    showToast("Task queued — ready for your workflow engine");
  });

  $("#processPasteBtn")?.addEventListener("click", () => {
    const value = $("#pasteInput").value.trim();
    showToast(value ? "Data ready for processing" : "Paste some data or a URL first");
  });

  /* ---------------------------- Theme -------------------------------- */
  let lightMode = false;

  $("#themeBtn")?.addEventListener("click", () => {
    lightMode = !lightMode;
    document.documentElement.classList.toggle("light", lightMode);

    if (lightMode) {
      document.body.className = document.body.className
        .replace("bg-[#070b14]", "bg-slate-100")
        .replace("text-slate-200", "text-slate-800");

      $("#themeIcon").className = "fa-regular fa-sun";
      showToast("Light mode preview enabled");
    } else {
      document.body.className = document.body.className
        .replace("bg-slate-100", "bg-[#070b14]")
        .replace("text-slate-800", "text-slate-200");

      $("#themeIcon").className = "fa-regular fa-moon";
      showToast("Dark mode enabled");
    }
  });

  /* -------------------------- Generic buttons ------------------------ */
  $("#upgradeBtn")?.addEventListener("click", () => showToast("Pro upgrade flow opened"));
  $("#upgradeBottomBtn")?.addEventListener("click", () => showToast("Pro upgrade flow opened"));
  $("#notificationBtn")?.addEventListener("click", () => showToast("You have 1 new notification"));
  $("#profileBtn")?.addEventListener("click", () => showToast("Profile menu"));
  $("#viewAllBtn")?.addEventListener("click", () => showToast("Showing all recent work"));

  $$(".tool-btn").forEach(button => {
    button.addEventListener("click", () => {
      showToast(`${button.dataset.tool} selected`);
    });
  });

  $$(".workflow-card").forEach(card => {
    card.addEventListener("click", () => {
      const title = card.querySelector(".text-xs.font-bold")?.textContent || "Workflow";
      showToast(`${title} selected`);
    });
  });

  $$(".table-action").forEach(button => {
    button.addEventListener("click", () => {
      showToast(`${button.getAttribute("title") || "Action"} clicked`);
    });
  });

  $("#allToolsBtn")?.addEventListener("click", () => showToast("All tools opened"));

  /* ---------------------------- Tour modal --------------------------- */
  const tourModal = $("#tourModal");

  function openTour() {
    tourModal.classList.remove("hidden");
    tourModal.classList.add("flex");
  }

  function closeTour() {
    tourModal.classList.add("hidden");
    tourModal.classList.remove("flex");
  }

  $("#howWorksBtn")?.addEventListener("click", openTour);
  $("#closeTour")?.addEventListener("click", closeTour);
  $("#doneTour")?.addEventListener("click", closeTour);

  tourModal?.addEventListener("click", event => {
    if (event.target === tourModal) closeTour();
  });

  /* -------------------------- Keyboard UX ---------------------------- */
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closeSidebar();
      closeTour();
    }

    // Ctrl/Cmd + K focuses the task box.
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      switchHeroTab("describe");
      $("#taskInput")?.focus();
    }
  });

  /* Initial state */
  renderLocalMode();
});

