/*
 * ============================================================
 * WORKFLOW OS — REAL DASHBOARD CONTROLLER
 * Vanilla JavaScript
 *
 * Works with the HTML provided by the user.
 *
 * FEATURES
 * ------------------------------------------------------------
 * 1. Sidebar navigation
 * 2. Mobile sidebar
 * 3. Local Mode
 * 4. Privacy Mode
 * 5. Hero tabs
 * 6. File upload
 * 7. Drag & Drop
 * 8. Task execution
 * 9. Paste data processing
 * 10. Example chips
 * 11. Theme toggle
 * 12. Tool modal system
 * 13. GST Calculator / Checker
 * 14. Invoice Maker
 * 15. QR Code Generator
 * 16. PDF Merge
 * 17. PDF Compress / Optimize
 * 18. Excel export
 * 19. Recent work saved in localStorage
 * 20. View / Download / Delete actions
 * 21. How it Works modal
 * 22. Keyboard shortcuts
 * ============================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  /* ============================================================
     HELPERS
  ============================================================ */

  const $ = (selector, root = document) => root.querySelector(selector);

  const $$ = (selector, root = document) =>
    Array.from(root.querySelectorAll(selector));

  const safeText = (value) =>
    String(value ?? "")
      .replace(/[<>]/g, "")
      .trim();

  const formatNumber = (value) => {
    const number = Number(value) || 0;
    return number.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  /* ============================================================
     TOAST
  ============================================================ */

  let toastTimer = null;

  function showToast(message, duration = 2600) {
    const toast = $("#toast");

    if (!toast) return;

    toast.textContent = message;
    toast.classList.remove("hidden");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
      toast.classList.add("hidden");
    }, duration);
  }

  /* ============================================================
     MODAL SYSTEM
  ============================================================ */

  const toolModal = $("#toolModal");
  const toolModalTitle = $("#toolModalTitle");
  const toolModalSubtitle = $("#toolModalSubtitle");
  const toolModalBody = $("#toolModalBody");
  const toolModalClose = $("#toolModalClose");

  function openToolModal(title, subtitle, html) {
    if (!toolModal) return;

    toolModalTitle.textContent = title;
    toolModalSubtitle.textContent = subtitle || "";
    toolModalBody.innerHTML = html;

    toolModal.classList.remove("hidden");
    toolModal.classList.add("flex");

    document.body.classList.add("overflow-hidden");
  }

  function closeToolModal() {
    if (!toolModal) return;

    toolModal.classList.add("hidden");
    toolModal.classList.remove("flex");

    document.body.classList.remove("overflow-hidden");
  }

  toolModalClose?.addEventListener("click", closeToolModal);

  toolModal?.addEventListener("click", (event) => {
    if (event.target === toolModal) {
      closeToolModal();
    }
  });

  /* ============================================================
     SIDEBAR
  ============================================================ */

  const sidebar = $("#sidebar");
  const app = $("#app");

  function setActiveSection(section) {
    $$(".sidebar-item").forEach((item) => {
      const active = item.dataset.section === section;

      item.classList.toggle("active", active);

      if (active) {
        item.classList.remove("text-slate-400");
        item.classList.add("text-white");
      } else {
        item.classList.remove("text-white");
        item.classList.add("text-slate-400");
      }
    });
  }

  function openSidebar() {
    sidebar?.classList.remove("-translate-x-full");
    app?.classList.add("sidebar-open");
    document.body.classList.add("overflow-hidden");
  }

  function closeSidebar() {
    sidebar?.classList.add("-translate-x-full");
    app?.classList.remove("sidebar-open");
    document.body.classList.remove("overflow-hidden");
  }

  $$(".sidebar-item").forEach((item) => {
    item.addEventListener("click", () => {
      setActiveSection(item.dataset.section);
      closeSidebar();
    });
  });

  $("#openSidebar")?.addEventListener("click", openSidebar);
  $("#closeSidebar")?.addEventListener("click", closeSidebar);
  $("#mobileOverlay")?.addEventListener("click", closeSidebar);

  /* ============================================================
     LOCAL MODE
  ============================================================ */

  let localMode =
    localStorage.getItem("workflowOS_localMode") !== "false";

  function renderLocalMode() {
    const track = $("#localModeTrack");
    const knob = $("#localModeKnob");
    const label = $("#localModeLabel");
    const button = $("#localModeBtn");

    if (!track || !knob || !label || !button) return;

    button.setAttribute("aria-pressed", String(localMode));

    if (localMode) {
      track.className =
        "relative h-5 w-10 rounded-full bg-emerald-500/20 ring-1 ring-emerald-400/20";

      knob.className =
        "absolute right-0.5 top-0.5 h-4 w-4 rounded-full bg-emerald-400 shadow-lg transition-all";

      label.textContent = "ON";
      label.className =
        "hidden font-semibold text-emerald-300 sm:inline";
    } else {
      track.className =
        "relative h-5 w-10 rounded-full bg-slate-800 ring-1 ring-slate-700";

      knob.className =
        "absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-slate-500 shadow-lg transition-all";

      label.textContent = "OFF";
      label.className =
        "hidden font-semibold text-slate-500 sm:inline";
    }
  }

  $("#localModeBtn")?.addEventListener("click", () => {
    localMode = !localMode;

    localStorage.setItem(
      "workflowOS_localMode",
      String(localMode)
    );

    renderLocalMode();

    showToast(
      localMode
        ? "Local Mode enabled"
        : "Local Mode disabled"
    );
  });

  /* ============================================================
     PRIVACY MODE
  ============================================================ */

  let privacyEnabled =
    localStorage.getItem("workflowOS_privacy") !== "false";

  function renderPrivacy() {
    const toggle = $("#privacyToggle");
    const knob = $("#privacyKnob");

    if (!toggle || !knob) return;

    toggle.setAttribute(
      "aria-pressed",
      String(privacyEnabled)
    );

    if (privacyEnabled) {
      toggle.className =
        "relative h-5 w-10 rounded-full bg-emerald-500/20 ring-1 ring-emerald-400/20";

      knob.className =
        "absolute right-0.5 top-0.5 h-4 w-4 rounded-full bg-emerald-400 transition-all";
    } else {
      toggle.className =
        "relative h-5 w-10 rounded-full bg-slate-800 ring-1 ring-slate-700";

      knob.className =
        "absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-slate-500 transition-all";
    }
  }

  $("#privacyToggle")?.addEventListener("click", () => {
    privacyEnabled = !privacyEnabled;

    localStorage.setItem(
      "workflowOS_privacy",
      String(privacyEnabled)
    );

    renderPrivacy();

    showToast(
      privacyEnabled
        ? "Privacy-first local processing is ON"
        : "Privacy-first mode is OFF"
    );
  });

  /* ============================================================
     HERO TABS
  ============================================================ */

  const panels = {
    describe: $("#tabDescribe"),
    upload: $("#tabUpload"),
    paste: $("#tabPaste")
  };

  function switchHeroTab(tabName) {
    $$(".hero-tab").forEach((tab) => {
      const active = tab.dataset.tab === tabName;

      tab.classList.toggle("bg-gradient-to-r", active);
      tab.classList.toggle("from-indigo-500", active);
      tab.classList.toggle("to-purple-600", active);
      tab.classList.toggle("text-white", active);
      tab.classList.toggle("shadow-lg", active);

      if (!active) {
        tab.classList.add("text-slate-400");
      } else {
        tab.classList.remove("text-slate-400");
      }
    });

    Object.entries(panels).forEach(([name, panel]) => {
      panel?.classList.toggle(
        "hidden",
        name !== tabName
      );
    });
  }

  $$(".hero-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      switchHeroTab(tab.dataset.tab);
    });
  });

  /* ============================================================
     FILE STORAGE
  ============================================================ */

  let selectedHeroFiles = [];
  let selectedDropFiles = [];

  function showSelectedFiles(files, targetElement) {
    if (!files || !files.length || !targetElement) return;

    const list = Array.from(files);

    targetElement.textContent =
      list.length === 1
        ? list[0].name
        : `${list.length} files selected`;

    showToast(
      `${list.length} file${list.length > 1 ? "s" : ""} ready`
    );
  }

  $("#heroFileInput")?.addEventListener(
    "change",
    (event) => {
      selectedHeroFiles = Array.from(
        event.target.files || []
      );

      showSelectedFiles(
        selectedHeroFiles,
        $("#heroFileName")
      );

      if (selectedHeroFiles.length) {
        showToast(
          "File ready — now describe what you want done"
        );
      }
    }
  );

  $("#dropFileInput")?.addEventListener(
    "change",
    (event) => {
      selectedDropFiles = Array.from(
        event.target.files || []
      );

      showSelectedFiles(
        selectedDropFiles,
        $("#dropFileName")
      );

      if (selectedDropFiles.length) {
        processDroppedFiles(selectedDropFiles);
      }
    }
  );

  /* ============================================================
     DRAG & DROP
  ============================================================ */

  const dropZone = $("#dropZone");

  ["dragenter", "dragover"].forEach((eventName) => {
    dropZone?.addEventListener(eventName, (event) => {
      event.preventDefault();

      dropZone.classList.add(
        "border-indigo-400",
        "bg-indigo-500/10"
      );
    });
  });

  ["dragleave", "drop"].forEach((eventName) => {
    dropZone?.addEventListener(eventName, (event) => {
      event.preventDefault();

      dropZone.classList.remove(
        "border-indigo-400",
        "bg-indigo-500/10"
      );
    });
  });

  dropZone?.addEventListener("drop", (event) => {
    const files = Array.from(
      event.dataTransfer?.files || []
    );

    selectedDropFiles = files;

    showSelectedFiles(
      files,
      $("#dropFileName")
    );

    if (files.length) {
      processDroppedFiles(files);
    }
  });

  async function processDroppedFiles(files) {
    const file = files[0];

    if (!file) return;

    const extension =
      file.name.split(".").pop()?.toLowerCase();

    showToast(
      `Detected ${extension?.toUpperCase() || "file"}: ${file.name}`
    );

    if (
      extension === "pdf"
    ) {
      openPDFToolFromFile(file);
      return;
    }

    if (
      ["xlsx", "xls", "csv"].includes(extension)
    ) {
      openSpreadsheetTool(file);
      return;
    }

    if (
      ["jpg", "jpeg", "png"].includes(extension)
    ) {
      openImageTool(file);
      return;
    }

    if (extension === "txt") {
      const text = await file.text();

      openTextTool(file.name, text);
      return;
    }

    showToast("File loaded successfully");
  }

  /* ============================================================
     EXAMPLE CHIPS
  ============================================================ */

  $$(".example-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      const input = $("#taskInput");

      if (!input) return;

      input.value = chip.textContent.trim();

      switchHeroTab("describe");

      input.focus();
    });
  });

  $("#refreshExamples")?.addEventListener(
    "click",
    () => {
      const examples = [
        "Purchase bill ka complete record bana do",
        "GST invoice banao",
        "Resume ko ATS friendly improve karo",
        "Mere data se monthly report bana do"
      ];

      $$(".example-chip").forEach(
        (chip, index) => {
          chip.textContent =
            examples[index % examples.length];
        }
      );

      showToast("Examples refreshed");
    }
  );

  /* ============================================================
     TASK ENGINE
  ============================================================ */

  $("#runTaskBtn")?.addEventListener(
    "click",
    async () => {
      const input = $("#taskInput");
      const value = safeText(input?.value);

      if (!value) {
        showToast("Pehle apna task describe karein");
        input?.focus();
        return;
      }

      await executeTask(value);
    }
  );

  async function executeTask(task) {
    const lower = task.toLowerCase();

    showToast("Analyzing your task...");

    await sleep(500);

    if (
      lower.includes("gst") &&
      (
        lower.includes("invoice") ||
        lower.includes("bill") ||
        lower.includes("tax")
      )
    ) {
      openGSTTool();
      return;
    }

    if (
      lower.includes("invoice") ||
      lower.includes("bill")
    ) {
      openInvoiceTool();
      return;
    }

    if (
      lower.includes("qr")
    ) {
      openQRTool();
      return;
    }

    if (
      lower.includes("excel") ||
      lower.includes("spreadsheet")
    ) {
      openExcelTool();
      return;
    }

    if (
      lower.includes("pdf")
    ) {
      openPDFTool();
      return;
    }

    openGenericTaskResult(task);
  }

  function sleep(ms) {
    return new Promise((resolve) =>
      setTimeout(resolve, ms)
    );
  }

  /* ============================================================
     PASTE DATA
  ============================================================ */

  $("#processPasteBtn")?.addEventListener(
    "click",
    () => {
      const input = $("#pasteInput");
      const value = safeText(input?.value);

      if (!value) {
        showToast(
          "Paste some data or a URL first"
        );
        input?.focus();
        return;
      }

      processPastedData(value);
    }
  );

  function processPastedData(value) {
    const lower = value.toLowerCase();

    if (
      lower.startsWith("http://") ||
      lower.startsWith("https://")
    ) {
      openURLTool(value);
      return;
    }

    if (
      value.includes(",") ||
      value.includes("\t")
    ) {
      openCSVPreview(value);
      return;
    }

    if (
      value.trim().startsWith("{") ||
      value.trim().startsWith("[")
    ) {
      try {
        const parsed = JSON.parse(value);
        openJSONTool(parsed);
        return;
      } catch {
        showToast("Invalid JSON data");
        return;
      }
    }

    openTextTool("Pasted Data", value);
  }

  /* ============================================================
     THEME
  ============================================================ */

  let lightMode =
    localStorage.getItem("workflowOS_theme") === "light";

  function applyTheme() {
    const icon = $("#themeIcon");

    document.documentElement.classList.toggle(
      "light",
      lightMode
    );

    if (lightMode) {
      document.body.classList.remove(
        "bg-[#070b14]",
        "text-slate-200"
      );

      document.body.classList.add(
        "bg-slate-100",
        "text-slate-800"
      );

      if (icon) {
        icon.className = "fa-regular fa-sun";
      }
    } else {
      document.body.classList.remove(
        "bg-slate-100",
        "text-slate-800"
      );

      document.body.classList.add(
        "bg-[#070b14]",
        "text-slate-200"
      );

      if (icon) {
        icon.className = "fa-regular fa-moon";
      }
    }
  }

  $("#themeBtn")?.addEventListener(
    "click",
    () => {
      lightMode = !lightMode;

      localStorage.setItem(
        "workflowOS_theme",
        lightMode ? "light" : "dark"
      );

      applyTheme();

      showToast(
        lightMode
          ? "Light mode enabled"
          : "Dark mode enabled"
      );
    }
  );

  /* ============================================================
     TOOL ROUTER
  ============================================================ */

  $$(".tool-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const tool = button.dataset.tool;

      openTool(tool);
    });
  });

  $("#allToolsBtn")?.addEventListener(
    "click",
    openAllTools
  );

  function openTool(tool) {
    switch (tool) {
      case "PDF to Excel":
        openPDFToExcelTool();
        break;

      case "Image to Text":
        openImageToTextTool();
        break;

      case "GST Check":
        openGSTTool();
        break;

      case "Invoice Maker":
        openInvoiceTool();
        break;

      case "Merge PDF":
        openMergePDFTool();
        break;

      case "Compress PDF":
        openCompressPDFTool();
        break;

      case "QR Code":
        openQRTool();
        break;

      case "All Tools":
        openAllTools();
        break;

      default:
        showToast(`${tool} opened`);
    }
  }

  /* ============================================================
     ALL TOOLS
  ============================================================ */

  function openAllTools() {
    openToolModal(
      "Workflow OS Tools",
      "Choose a tool to start working",
      `
      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">

        ${toolCard(
          "PDF to Excel",
          "Convert PDF data into an Excel workbook.",
          "fa-file-excel",
          "emerald",
          "PDF to Excel"
        )}

        ${toolCard(
          "Image to Text",
          "Extract readable text from an image.",
          "fa-image",
          "violet",
          "Image to Text"
        )}

        ${toolCard(
          "GST Check",
          "Calculate CGST, SGST, IGST and total.",
          "fa-receipt",
          "cyan",
          "GST Check"
        )}

        ${toolCard(
          "Invoice Maker",
          "Create a professional GST invoice.",
          "fa-file-invoice",
          "red",
          "Invoice Maker"
        )}

        ${toolCard(
          "Merge PDF",
          "Combine multiple PDF files into one.",
          "fa-layer-group",
          "pink",
          "Merge PDF"
        )}

        ${toolCard(
          "Compress PDF",
          "Optimize a PDF and download the result.",
          "fa-file-zipper",
          "amber",
          "Compress PDF"
        )}

        ${toolCard(
          "QR Code",
          "Generate a QR code from text or URL.",
          "fa-qrcode",
          "orange",
          "QR Code"
        )}

        ${toolCard(
          "Excel Export",
          "Create Excel files from table data.",
          "fa-table",
          "blue",
          "Excel Export"
        )}

      </div>
      `
    );

    $$(".modal-tool-card").forEach((card) => {
      card.addEventListener("click", () => {
        openTool(card.dataset.tool);
      });
    });
  }

  function toolCard(
    title,
    description,
    icon,
    color,
    tool
  ) {
    return `
      <button
        class="modal-tool-card rounded-xl border border-slate-800 bg-slate-950/50 p-4 text-left transition hover:-translate-y-0.5 hover:border-indigo-400/50 hover:bg-slate-900"
        data-tool="${tool}"
      >
        <div class="flex items-start gap-3">

          <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-${color}-500/10 text-${color}-400">
            <i class="fa-solid ${icon}"></i>
          </div>

          <div>
            <div class="text-sm font-bold text-white">
              ${title}
            </div>

            <div class="mt-1 text-[10px] leading-4 text-slate-500">
              ${description}
            </div>
          </div>

        </div>
      </button>
    `;
  }

  /* ============================================================
     GST TOOL
  ============================================================ */

  function openGSTTool() {
    openToolModal(
      "GST Calculator",
      "Calculate CGST, SGST, IGST and invoice total",
      `
      <div class="grid gap-4 md:grid-cols-2">

        <div class="space-y-4">

          <div>
            <label class="mb-1.5 block text-xs font-medium text-slate-400">
              Taxable Amount
            </label>

            <input
              id="gstAmount"
              type="number"
              min="0"
              step="0.01"
              value="10000"
              class="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-white outline-none focus:border-indigo-400"
            />
          </div>

          <div>
            <label class="mb-1.5 block text-xs font-medium text-slate-400">
              GST Rate
            </label>

            <select
              id="gstRate"
              class="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-white outline-none"
            >
              <option value="0">0%</option>
              <option value="5">5%</option>
              <option value="12">12%</option>
              <option value="18" selected>18%</option>
              <option value="28">28%</option>
            </select>
          </div>

          <div>
            <label class="mb-1.5 block text-xs font-medium text-slate-400">
              Transaction Type
            </label>

            <select
              id="gstType"
              class="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-white outline-none"
            >
              <option value="intra">Same State — CGST + SGST</option>
              <option value="inter">Inter State — IGST</option>
            </select>
          </div>

          <button
            id="calculateGST"
            class="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 py-3 text-xs font-bold text-white shadow-lg"
          >
            Calculate GST
          </button>

        </div>

        <div
          id="gstResult"
          class="rounded-xl border border-slate-800 bg-slate-950/60 p-5"
        >
          <div class="text-xs text-slate-500">
            Calculation Result
          </div>

          <div class="mt-5 space-y-3">

            <div class="flex justify-between text-xs">
              <span class="text-slate-500">Taxable Amount</span>
              <strong id="gstTaxable" class="text-white">₹10,000.00</strong>
            </div>

            <div class="flex justify-between text-xs">
              <span class="text-slate-500">CGST</span>
              <strong id="gstCGST" class="text-white">₹900.00</strong>
            </div>

            <div class="flex justify-between text-xs">
              <span class="text-slate-500">SGST</span>
              <strong id="gstSGST" class="text-white">₹900.00</strong>
            </div>

            <div class="flex justify-between text-xs">
              <span class="text-slate-500">IGST</span>
              <strong id="gstIGST" class="text-white">₹0.00</strong>
            </div>

            <div class="my-3 h-px bg-slate-800"></div>

            <div class="flex justify-between">
              <span class="text-sm font-semibold text-slate-300">
                Grand Total
              </span>

              <strong
                id="gstTotal"
                class="text-xl font-extrabold text-white"
              >
                ₹11,800.00
              </strong>
            </div>

          </div>
        </div>

      </div>
      `
    );

    const calculate = () => {
      const amount =
        Number($("#gstAmount")?.value) || 0;

      const rate =
        Number($("#gstRate")?.value) || 0;

      const type =
        $("#gstType")?.value || "intra";

      const totalGST =
        amount * rate / 100;

      let cgst = 0;
      let sgst = 0;
      let igst = 0;

      if (type === "intra") {
        cgst = totalGST / 2;
        sgst = totalGST / 2;
      } else {
        igst = totalGST;
      }

      const total = amount + totalGST;

      $("#gstTaxable").textContent =
        `₹${formatNumber(amount)}`;

      $("#gstCGST").textContent =
        `₹${formatNumber(cgst)}`;

      $("#gstSGST").textContent =
        `₹${formatNumber(sgst)}`;

      $("#gstIGST").textContent =
        `₹${formatNumber(igst)}`;

      $("#gstTotal").textContent =
        `₹${formatNumber(total)}`;
    };

    $("#calculateGST")?.addEventListener(
      "click",
      calculate
    );

    calculate();
  }

  /* ============================================================
     INVOICE MAKER
  ============================================================ */

  function openInvoiceTool() {
    openToolModal(
      "GST Invoice Maker",
      "Create a simple professional invoice",
      `
      <form id="invoiceForm" class="space-y-5">

        <div class="grid gap-4 md:grid-cols-2">

          <div>
            <label class="mb-1.5 block text-xs text-slate-400">
              Seller Name
            </label>
            <input
              id="invSeller"
              required
              placeholder="Your Business Name"
              class="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-white outline-none focus:border-indigo-400"
            />
          </div>

          <div>
            <label class="mb-1.5 block text-xs text-slate-400">
              GSTIN
            </label>
            <input
              id="invGSTIN"
              placeholder="22AAAAA0000A1Z5"
              class="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-white outline-none focus:border-indigo-400"
            />
          </div>

          <div>
            <label class="mb-1.5 block text-xs text-slate-400">
              Customer Name
            </label>
            <input
              id="invCustomer"
              required
              placeholder="Customer Name"
              class="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-white outline-none focus:border-indigo-400"
            />
          </div>

          <div>
            <label class="mb-1.5 block text-xs text-slate-400">
              Invoice Number
            </label>
            <input
              id="invNumber"
              value="${getNextInvoiceNumber()}"
              class="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-white outline-none focus:border-indigo-400"
            />
          </div>

        </div>

        <div class="overflow-x-auto rounded-xl border border-slate-800">

          <table class="w-full min-w-[600px]">

            <thead class="bg-slate-950 text-[10px] uppercase text-slate-500">
              <tr>
                <th class="p-3 text-left">Item</th>
                <th class="p-3">Qty</th>
                <th class="p-3">Rate</th>
                <th class="p-3">GST %</th>
                <th class="p-3">Amount</th>
              </tr>
            </thead>

            <tbody id="invoiceItems">

              ${invoiceRow(1)}

            </tbody>

          </table>

        </div>

        <button
          type="button"
          id="addInvoiceItem"
          class="rounded-lg border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800"
        >
          + Add Item
        </button>

        <div class="flex justify-end">

          <div class="w-full max-w-sm space-y-2 rounded-xl border border-slate-800 bg-slate-950/50 p-4">

            <div class="flex justify-between text-xs">
              <span class="text-slate-500">Subtotal</span>
              <span id="invoiceSubtotal" class="text-white">₹0.00</span>
            </div>

            <div class="flex justify-between text-xs">
              <span class="text-slate-500">GST</span>
              <span id="invoiceGST" class="text-white">₹0.00</span>
            </div>

            <div class="my-2 h-px bg-slate-800"></div>

            <div class="flex justify-between">
              <span class="font-bold text-slate-200">
                Grand Total
              </span>
              <strong id="invoiceTotal" class="text-xl text-white">
                ₹0.00
              </strong>
            </div>

          </div>

        </div>

        <div class="flex gap-2">

          <button
            type="button"
            id="previewInvoice"
            class="flex-1 rounded-xl border border-slate-700 py-3 text-xs font-bold text-slate-300 hover:bg-slate-800"
          >
            Preview
          </button>

          <button
            type="submit"
            class="flex-1 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 py-3 text-xs font-bold text-white"
          >
            Create Invoice
          </button>

        </div>

      </form>
      `
    );

    bindInvoiceEvents();
    calculateInvoice();
  }

  function invoiceRow(index) {
    return `
      <tr class="invoice-row border-t border-slate-800">

        <td class="p-2">
          <input
            class="inv-item w-full rounded-lg border border-slate-800 bg-slate-950 p-2 text-xs text-white outline-none"
            placeholder="Product / Service"
          />
        </td>

        <td class="p-2">
          <input
            class="inv-qty w-20 rounded-lg border border-slate-800 bg-slate-950 p-2 text-xs text-white outline-none"
            type="number"
            min="0"
            value="1"
          />
        </td>

        <td class="p-2">
          <input
            class="inv-rate w-24 rounded-lg border border-slate-800 bg-slate-950 p-2 text-xs text-white outline-none"
            type="number"
            min="0"
            value="0"
          />
        </td>

        <td class="p-2">
          <select
            class="inv-gst rounded-lg border border-slate-800 bg-slate-950 p-2 text-xs text-white outline-none"
          >
            <option value="0">0%</option>
            <option value="5">5%</option>
            <option value="12">12%</option>
            <option value="18" selected>18%</option>
            <option value="28">28%</option>
          </select>
        </td>

        <td class="p-2">
          <div class="inv-line-total text-xs font-bold text-white">
            ₹0.00
          </div>
        </td>

      </tr>
    `;
  }

  function bindInvoiceEvents() {
    $("#addInvoiceItem")?.addEventListener(
      "click",
      () => {
        $("#invoiceItems").insertAdjacentHTML(
          "beforeend",
          invoiceRow(
            $$(".invoice-row").length + 1
          )
        );

        bindInvoiceInputs();
      }
    );

    bindInvoiceInputs();

    $("#invoiceForm")?.addEventListener(
      "submit",
      (event) => {
        event.preventDefault();

        calculateInvoice();

        const data = getInvoiceData();

        localStorage.setItem(
          "workflowOS_lastInvoice",
          JSON.stringify(data)
        );

        addRecentWork({
          name: `Invoice_${data.number}.pdf`,
          type: "Invoice",
          status: "Completed"
        });

        showToast("Invoice created successfully");

        renderInvoicePreview(data);
      }
    );

    $("#previewInvoice")?.addEventListener(
      "click",
      () => {
        calculateInvoice();
        renderInvoicePreview(
          getInvoiceData()
        );
      }
    );
  }

  function bindInvoiceInputs() {
    $$(".invoice-row input, .invoice-row select")
      .forEach((input) => {
        input.oninput = calculateInvoice;
        input.onchange = calculateInvoice;
      });
  }

  function calculateInvoice() {
    let subtotal = 0;
    let gstTotal = 0;

    $$(".invoice-row").forEach((row) => {
      const qty =
        Number($(".inv-qty", row)?.value) || 0;

      const rate =
        Number($(".inv-rate", row)?.value) || 0;

      const gst =
        Number($(".inv-gst", row)?.value) || 0;

      const line =
        qty * rate;

      const tax =
        line * gst / 100;

      subtotal += line;
      gstTotal += tax;

      const output =
        $(".inv-line-total", row);

      if (output) {
        output.textContent =
          `₹${formatNumber(line + tax)}`;
      }
    });

    $("#invoiceSubtotal").textContent =
      `₹${formatNumber(subtotal)}`;

    $("#invoiceGST").textContent =
      `₹${formatNumber(gstTotal)}`;

    $("#invoiceTotal").textContent =
      `₹${formatNumber(subtotal + gstTotal)}`;
  }

  function getInvoiceData() {
    const items = [];

    $$(".invoice-row").forEach((row) => {
      const item =
        safeText($(".inv-item", row)?.value);

      const qty =
        Number($(".inv-qty", row)?.value) || 0;

      const rate =
        Number($(".inv-rate", row)?.value) || 0;

      const gst =
        Number($(".inv-gst", row)?.value) || 0;

      if (item || rate > 0) {
        items.push({
          item,
          qty,
          rate,
          gst,
          amount: qty * rate,
          tax: qty * rate * gst / 100
        });
      }
    });

    const subtotal =
      items.reduce(
        (sum, item) => sum + item.amount,
        0
      );

    const gst =
      items.reduce(
        (sum, item) => sum + item.tax,
        0
      );

    return {
      seller: safeText($("#invSeller")?.value),
      gstin: safeText($("#invGSTIN")?.value),
      customer: safeText($("#invCustomer")?.value),
      number: safeText($("#invNumber")?.value),
      date: new Date().toLocaleDateString("en-IN"),
      items,
      subtotal,
      gst,
      total: subtotal + gst
    };
  }

  function renderInvoicePreview(data) {
    openToolModal(
      "Invoice Preview",
      `Invoice ${data.number}`,
      `
      <div id="invoicePreviewArea" class="rounded-xl bg-white p-6 text-slate-900">

        <div class="flex justify-between border-b-2 border-slate-900 pb-5">

          <div>
            <h1 class="text-2xl font-black">
              ${safeText(data.seller) || "Your Business"}
            </h1>

            <p class="mt-1 text-xs">
              GSTIN: ${safeText(data.gstin) || "N/A"}
            </p>
          </div>

          <div class="text-right">
            <h2 class="text-xl font-bold">
              TAX INVOICE
            </h2>

            <p class="text-xs">
              Invoice No: ${data.number}
            </p>

            <p class="text-xs">
              Date: ${data.date}
            </p>
          </div>

        </div>

        <div class="py-5">
          <div class="text-xs font-bold uppercase">
            Bill To
          </div>

          <div class="mt-1 text-sm font-semibold">
            ${safeText(data.customer) || "Customer"}
          </div>
        </div>

        <table class="w-full border-collapse text-xs">

          <thead>
            <tr class="border-y border-slate-300">
              <th class="p-2 text-left">Item</th>
              <th class="p-2 text-right">Qty</th>
              <th class="p-2 text-right">Rate</th>
              <th class="p-2 text-right">GST</th>
              <th class="p-2 text-right">Total</th>
            </tr>
          </thead>

          <tbody>

            ${
              data.items.length
                ? data.items.map((item) => `
                  <tr class="border-b border-slate-200">
                    <td class="p-2">${safeText(item.item) || "Item"}</td>
                    <td class="p-2 text-right">${item.qty}</td>
                    <td class="p-2 text-right">₹${formatNumber(item.rate)}</td>
                    <td class="p-2 text-right">${item.gst}%</td>
                    <td class="p-2 text-right">
                      ₹${formatNumber(item.amount + item.tax)}
                    </td>
                  </tr>
                `).join("")
                : `
                  <tr>
                    <td colspan="5" class="p-5 text-center text-slate-500">
                      No items added
                    </td>
                  </tr>
                `
            }

          </tbody>

        </table>

        <div class="mt-6 flex justify-end">

          <div class="w-64 space-y-2 text-sm">

            <div class="flex justify-between">
              <span>Subtotal</span>
              <strong>₹${formatNumber(data.subtotal)}</strong>
            </div>

            <div class="flex justify-between">
              <span>GST</span>
              <strong>₹${formatNumber(data.gst)}</strong>
            </div>

            <div class="border-t border-slate-300 pt-2 text-base">
              <div class="flex justify-between">
                <strong>Grand Total</strong>
                <strong>₹${formatNumber(data.total)}</strong>
              </div>
            </div>

          </div>

        </div>

      </div>

      <div class="mt-4 flex gap-2">

        <button
          id="downloadInvoicePDF"
          class="flex-1 rounded-xl bg-slate-800 py-3 text-xs font-bold text-white"
        >
          <i class="fa-solid fa-download mr-1"></i>
          Print / Save PDF
        </button>

        <button
          id="invoiceExcel"
          class="flex-1 rounded-xl bg-emerald-600 py-3 text-xs font-bold text-white"
        >
          <i class="fa-solid fa-file-excel mr-1"></i>
          Excel
        </button>

      </div>
      `
    );

    $("#downloadInvoicePDF")?.addEventListener(
      "click",
      () => {
        printElementAsPDF(
          $("#invoicePreviewArea"),
          `Invoice-${data.number}`
        );
      }
    );

    $("#invoiceExcel")?.addEventListener(
      "click",
      () => {
        exportInvoiceExcel(data);
      }
    );
  }

  function printElementAsPDF(element, filename) {
    if (!element) {
      showToast("Nothing to print");
      return;
    }

    const printWindow =
      window.open("", "_blank");

    if (!printWindow) {
      showToast("Popup blocked. Allow popups to save PDF.");
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${safeText(filename)}</title>

        <style>
          body {
            margin: 0;
            padding: 30px;
            font-family: Arial, sans-serif;
            background: white;
          }

          table {
            width: 100%;
          }

          @media print {
            body {
              padding: 10px;
            }
          }
        </style>
      </head>

      <body>
        ${element.outerHTML}
      </body>

      </html>
    `);

    printWindow.document.close();

    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
    }, 500);
  }

  function exportInvoiceExcel(data) {
    if (!window.XLSX) {
      showToast("Excel library not loaded");
      return;
    }

    const rows = data.items.map((item) => ({
      Item: item.item,
      Quantity: item.qty,
      Rate: item.rate,
      GST: item.gst,
      Tax: item.tax,
      Total: item.amount + item.tax
    }));

    rows.push({});
    rows.push({
      Item: "Subtotal",
      Total: data.subtotal
    });

    rows.push({
      Item: "GST",
      Total: data.gst
    });

    rows.push({
      Item: "Grand Total",
      Total: data.total
    });

    const worksheet =
      XLSX.utils.json_to_sheet(rows);

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Invoice"
    );

    XLSX.writeFile(
      workbook,
      `Invoice-${data.number}.xlsx`
    );

    showToast("Excel invoice downloaded");
  }

  function getNextInvoiceNumber() {
    let counter =
      Number(
        localStorage.getItem(
          "workflowOS_invoiceCounter"
        )
      ) || 0;

    counter++;

    localStorage.setItem(
      "workflowOS_invoiceCounter",
      String(counter)
    );

    return `INV-${String(counter).padStart(4, "0")}`;
  }

  /* ============================================================
     QR CODE
  ============================================================ */

  function openQRTool() {
    openToolModal(
      "QR Code Generator",
      "Generate a QR code from text, URL or payment information",
      `
      <div class="space-y-5">

        <textarea
          id="qrInput"
          rows="4"
          placeholder="Enter URL, text, UPI information..."
          class="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 text-sm text-white outline-none focus:border-indigo-400"
        ></textarea>

        <button
          id="generateQR"
          class="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 py-3 text-xs font-bold text-white"
        >
          Generate QR Code
        </button>

        <div
          id="qrResult"
          class="flex min-h-[220px] items-center justify-center rounded-xl border border-slate-800 bg-white p-5"
        >
          <span class="text-xs text-slate-400">
            Your QR code will appear here
          </span>
        </div>

        <button
          id="downloadQR"
          class="hidden w-full rounded-xl bg-slate-800 py-3 text-xs font-bold text-white"
        >
          Download QR
        </button>

      </div>
      `
    );

    $("#generateQR")?.addEventListener(
      "click",
      () => {
        const value =
          safeText($("#qrInput")?.value);

        if (!value) {
          showToast("Enter something first");
          return;
        }

        const result =
          $("#qrResult");

        result.innerHTML = "";

        if (!window.QRCode) {
          result.innerHTML =
            `<span class="text-red-500 text-xs">QR library not loaded</span>`;

          return;
        }

        new QRCode(result, {
          text: value,
          width: 180,
          height: 180,
          correctLevel: QRCode.CorrectLevel.H
        });

        $("#downloadQR")?.classList.remove(
          "hidden"
        );

        showToast("QR code generated");

        $("#downloadQR").onclick = () => {
          const canvas =
            result.querySelector("canvas");

          const image =
            result.querySelector("img");

          let dataURL = "";

          if (canvas) {
            dataURL =
              canvas.toDataURL("image/png");
          } else if (image) {
            dataURL = image.src;
          }

          if (!dataURL) {
            showToast("QR image not ready");
            return;
          }

          const link =
            document.createElement("a");

          link.href = dataURL;
          link.download = "workflow-os-qr.png";

          link.click();

          showToast("QR downloaded");
        };
      }
    );
  }

  /* ============================================================
     MERGE PDF
  ============================================================ */

  function openMergePDFTool() {
    openToolModal(
      "Merge PDF",
      "Select two or more PDF files and combine them",
      `
      <div class="space-y-5">

        <label
          class="flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-950/50 text-center hover:border-indigo-400"
        >

          <i class="fa-solid fa-layer-group text-3xl text-pink-400"></i>

          <div class="mt-3 text-sm font-bold text-white">
            Choose PDF files
          </div>

          <div class="mt-1 text-[10px] text-slate-500">
            Select multiple PDFs
          </div>

          <input
            id="mergePDFInput"
            type="file"
            accept=".pdf"
            multiple
            class="hidden"
          />

        </label>

        <div id="mergePDFList" class="space-y-2"></div>

        <button
          id="mergePDFButton"
          class="w-full rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 py-3 text-xs font-bold text-white"
        >
          Merge PDFs
        </button>

      </div>
      `
    );

    $("#mergePDFInput")?.addEventListener(
      "change",
      (event) => {
        const files =
          Array.from(
            event.target.files || []
          );

        const list =
          $("#mergePDFList");

        list.innerHTML = files
          .map(
            (file, index) => `
              <div class="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-950 p-3">
                <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 text-red-400">
                  <i class="fa-solid fa-file-pdf"></i>
                </span>

                <div class="min-w-0 flex-1">
                  <div class="truncate text-xs font-medium text-white">
                    ${safeText(file.name)}
                  </div>

                  <div class="text-[9px] text-slate-500">
                    ${formatFileSize(file.size)}
                  </div>
                </div>

                <span class="text-[10px] text-slate-600">
                  ${index + 1}
                </span>
              </div>
            `
          )
          .join("");
      }
    );

    $("#mergePDFButton")?.addEventListener(
      "click",
      async () => {
        const files =
          Array.from(
            $("#mergePDFInput")?.files || []
          );

        if (files.length < 2) {
          showToast(
            "Select at least 2 PDF files"
          );
          return;
        }

        if (!window.PDFLib) {
          showToast("PDF library not loaded");
          return;
        }

        try {
          showToast("Merging PDFs...");

          const merged =
            await PDFLib.PDFDocument.create();

          for (const file of files) {
            const bytes =
              await file.arrayBuffer();

            const source =
              await PDFLib.PDFDocument.load(
                bytes
              );

            const pages =
              await merged.copyPages(
                source,
                source.getPageIndices()
              );

            pages.forEach((page) => {
              merged.addPage(page);
            });
          }

          const output =
            await merged.save();

          downloadBlob(
            new Blob(
              [output],
              { type: "application/pdf" }
            ),
            "workflow-os-merged.pdf"
          );

          addRecentWork({
            name: "workflow-os-merged.pdf",
            type: "PDF Merge",
            status: "Completed"
          });

          showToast(
            `${files.length} PDFs merged successfully`
          );
        } catch (error) {
          console.error(error);

          showToast(
            "Unable to merge these PDFs"
          );
        }
      }
    );
  }

  /* ============================================================
     COMPRESS PDF
  ============================================================ */

  function openCompressPDFTool() {
    openToolModal(
      "PDF Optimizer",
      "Re-save a PDF locally with PDF-lib",
      `
      <div class="space-y-5">

        <label
          class="flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-950/50"
        >

          <i class="fa-solid fa-file-zipper text-3xl text-amber-400"></i>

          <div class="mt-3 text-sm font-bold text-white">
            Select PDF
          </div>

          <div class="mt-1 text-[10px] text-slate-500">
            File stays in your browser
          </div>

          <input
            id="compressPDFInput"
            type="file"
            accept=".pdf"
            class="hidden"
          />

        </label>

        <div
          id="compressInfo"
          class="rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs text-slate-400"
        >
          No file selected.
        </div>

        <button
          id="compressPDFButton"
          class="w-full rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 py-3 text-xs font-bold text-white"
        >
          Optimize PDF
        </button>

      </div>
      `
    );

    let selectedFile = null;

    $("#compressPDFInput")?.addEventListener(
      "change",
      (event) => {
        selectedFile =
          event.target.files?.[0] || null;

        if (selectedFile) {
          $("#compressInfo").innerHTML = `
            <div class="font-semibold text-white">
              ${safeText(selectedFile.name)}
            </div>

            <div class="mt-1">
              Original size:
              ${formatFileSize(selectedFile.size)}
            </div>
          `;
        }
      }
    );

    $("#compressPDFButton")?.addEventListener(
      "click",
      async () => {
        if (!selectedFile) {
          showToast("Select a PDF first");
          return;
        }

        if (!window.PDFLib) {
          showToast("PDF library not loaded");
          return;
        }

        try {
          showToast("Optimizing PDF...");

          const bytes =
            await selectedFile.arrayBuffer();

          const pdf =
            await PDFLib.PDFDocument.load(
              bytes
            );

          const output =
            await pdf.save({
              useObjectStreams: true
            });

          downloadBlob(
            new Blob(
              [output],
              { type: "application/pdf" }
            ),
            `optimized-${selectedFile.name}`
          );

          const oldSize =
            selectedFile.size;

          const newSize =
            output.length;

          $("#compressInfo").innerHTML += `
            <div class="mt-3 border-t border-slate-800 pt-3 text-emerald-400">
              Optimized file:
              ${formatFileSize(newSize)}
            </div>
          `;

          addRecentWork({
            name: `optimized-${selectedFile.name}`,
            type: "PDF Optimizer",
            status: "Completed"
          });

          showToast(
            `PDF optimized. ${formatFileSize(oldSize)} → ${formatFileSize(newSize)}`
          );
        } catch (error) {
          console.error(error);

          showToast(
            "Could not process this PDF"
          );
        }
      }
    );
  }

  /* ============================================================
     PDF TO EXCEL
  ============================================================ */

  function openPDFToExcelTool() {
    openToolModal(
      "PDF to Excel",
      "Upload a PDF and prepare a spreadsheet workspace",
      `
      <div class="space-y-5">

        <label
          class="flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-950/50"
        >

          <i class="fa-solid fa-file-excel text-3xl text-emerald-400"></i>

          <div class="mt-3 text-sm font-bold text-white">
            Choose PDF
          </div>

          <div class="mt-1 text-[10px] text-slate-500">
            PDF data extraction workspace
          </div>

          <input
            id="pdfExcelInput"
            type="file"
            accept=".pdf"
            class="hidden"
          />

        </label>

        <div id="pdfExcelInfo"
          class="rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs text-slate-400">
          Select a PDF to begin.
        </div>

        <button
          id="pdfExcelExport"
          class="w-full rounded-xl bg-emerald-600 py-3 text-xs font-bold text-white"
        >
          Create Excel
        </button>

        <div class="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-[10px] leading-4 text-amber-200">
          Browser-side PDF libraries do not reliably extract arbitrary
          PDF text. For structured CSV/table input, Excel export works
          directly. Scanned/image PDFs need OCR.
        </div>

      </div>
      `
    );

    let file = null;

    $("#pdfExcelInput")?.addEventListener(
      "change",
      (event) => {
        file =
          event.target.files?.[0] || null;

        if (file) {
          $("#pdfExcelInfo").innerHTML = `
            <strong class="text-white">
              ${safeText(file.name)}
            </strong>

            <div class="mt-1">
              ${formatFileSize(file.size)}
            </div>
          `;
        }
      }
    );

    $("#pdfExcelExport")?.addEventListener(
      "click",
      async () => {
        if (!file) {
          showToast("Select a PDF first");
          return;
        }

        if (!window.XLSX) {
          showToast("Excel library not loaded");
          return;
        }

        const rows = [
          {
            File: file.name,
            Size: formatFileSize(file.size),
            Status: "Imported locally",
            Date: new Date().toLocaleString("en-IN")
          }
        ];

        const ws =
          XLSX.utils.json_to_sheet(rows);

        const wb =
          XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(
          wb,
          ws,
          "PDF Import"
        );

        XLSX.writeFile(
          wb,
          `${file.name.replace(/\.pdf$/i, "")}.xlsx`
        );

        addRecentWork({
          name: `${file.name.replace(/\.pdf$/i, "")}.xlsx`,
          type: "PDF to Excel",
          status: "Completed"
        });

        showToast(
          "Excel workbook created"
        );
      }
    );
  }

  /* ============================================================
     IMAGE TO TEXT
  ============================================================ */

  function openImageToTextTool() {
    openToolModal(
      "Image to Text",
      "Select an image for local OCR",
      `
      <div class="space-y-5">

        <label
          class="flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-950/50"
        >

          <i class="fa-regular fa-image text-3xl text-violet-400"></i>

          <div class="mt-3 text-sm font-bold text-white">
            Choose Image
          </div>

          <div class="mt-1 text-[10px] text-slate-500">
            JPG, PNG or JPEG
          </div>

          <input
            id="ocrInput"
            type="file"
            accept="image/*"
            class="hidden"
          />

        </label>

        <div
          id="ocrStatus"
          class="rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs text-slate-400"
        >
          No image selected.
        </div>

        <textarea
          id="ocrOutput"
          rows="8"
          placeholder="Extracted text will appear here..."
          class="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 text-sm text-white outline-none"
        ></textarea>

        <button
          id="copyOCR"
          class="w-full rounded-xl bg-slate-800 py-3 text-xs font-bold text-white"
        >
          Copy Text
        </button>

      </div>
      `
    );

    $("#ocrInput")?.addEventListener(
      "change",
      async (event) => {
        const file =
          event.target.files?.[0];

        if (!file) return;

        $("#ocrStatus").textContent =
          `Image selected: ${file.name}`;

        /*
         * Tesseract is loaded only when the user
         * actually requests OCR.
         */
        if (!window.Tesseract) {
          $("#ocrStatus").textContent =
            "Loading OCR engine...";

          await loadScript(
            "https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js"
          );
        }

        if (!window.Tesseract) {
          showToast(
            "OCR engine could not be loaded"
          );
          return;
        }

        try {
          $("#ocrStatus").textContent =
            "Reading image...";

          const result =
            await Tesseract.recognize(
              file,
              "eng",
              {
                logger: (info) => {
                  if (
                    info.status === "recognizing text"
                  ) {
                    const percent =
                      Math.round(
                        (info.progress || 0) * 100
                      );

                    $("#ocrStatus").textContent =
                      `OCR processing: ${percent}%`;
                  }
                }
              }
            );

          $("#ocrOutput").value =
            result.data.text || "";

          $("#ocrStatus").textContent =
            "Text extraction completed.";

          showToast("Image text extracted");
        } catch (error) {
          console.error(error);

          $("#ocrStatus").textContent =
            "OCR failed.";

          showToast("Could not read image");
        }
      }
    );

    $("#copyOCR")?.addEventListener(
      "click",
      async () => {
        const text =
          $("#ocrOutput")?.value || "";

        if (!text) {
          showToast("No text to copy");
          return;
        }

        try {
          await navigator.clipboard.writeText(
            text
          );

          showToast("Text copied");
        } catch {
          showToast(
            "Clipboard permission denied"
          );
        }
      }
    );
  }

  /* ============================================================
     FILE SPECIFIC OPENERS
  ============================================================ */

  function openPDFToolFromFile(file) {
    openCompressPDFTool();

    setTimeout(() => {
      const input =
        $("#compressPDFInput");

      if (!input) return;

      /*
       * Browser security prevents programmatically
       * setting input.files directly.
       */
      showToast(
        `PDF detected: ${file.name}. Select it in the tool.`
      );
    }, 100);
  }

  function openSpreadsheetTool(file) {
    openToolModal(
      "Spreadsheet",
      "Excel / CSV file",
      `
      <div class="space-y-4">

        <div class="rounded-xl border border-slate-800 bg-slate-950 p-4">
          <div class="text-sm font-bold text-white">
            ${safeText(file.name)}
          </div>

          <div class="mt-1 text-xs text-slate-500">
            ${formatFileSize(file.size)}
          </div>
        </div>

        <button
          id="downloadSpreadsheetCopy"
          class="w-full rounded-xl bg-emerald-600 py-3 text-xs font-bold text-white"
        >
          Create Excel Copy
        </button>

      </div>
      `
    );

    $("#downloadSpreadsheetCopy")?.addEventListener(
      "click",
      async () => {
        if (!window.XLSX) {
          showToast("Excel library not loaded");
          return;
        }

        try {
          const ext =
            file.name
              .split(".")
              .pop()
              .toLowerCase();

          let workbook;

          if (ext === "csv") {
            const text =
              await file.text();

            workbook =
              XLSX.read(text, {
                type: "string"
              });
          } else {
            const buffer =
              await file.arrayBuffer();

            workbook =
              XLSX.read(buffer, {
                type: "array"
              });
          }

          XLSX.writeFile(
            workbook,
            `copy-${file.name.replace(
              /\.(xlsx|xls|csv)$/i,
              ""
            )}.xlsx`
          );

          showToast(
            "Excel copy created"
          );
        } catch (error) {
          console.error(error);

          showToast(
            "Could not read spreadsheet"
          );
        }
      }
    );
  }

  function openImageTool(file) {
    openImageToTextTool();

    showToast(
      `${file.name} selected — choose the image again for OCR`
    );
  }

  function openTextTool(name, text) {
    openToolModal(
      "Text Workspace",
      name,
      `
      <div class="space-y-4">

        <div class="flex items-center justify-between">

          <div class="text-xs text-slate-500">
            ${text.length.toLocaleString("en-IN")} characters
          </div>

          <button
            id="copyTextWorkspace"
            class="rounded-lg border border-slate-700 px-3 py-2 text-[10px] font-bold text-slate-300"
          >
            Copy
          </button>

        </div>

        <textarea
          id="workspaceText"
          rows="16"
          class="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 text-sm leading-6 text-slate-200 outline-none"
        ></textarea>

      </div>
      `
    );

    $("#workspaceText").value =
      text;

    $("#copyTextWorkspace")?.addEventListener(
      "click",
      async () => {
        await navigator.clipboard.writeText(
          $("#workspaceText").value
        );

        showToast("Text copied");
      }
    );
  }

  /* ============================================================
     JSON TOOL
  ============================================================ */

  function openJSONTool(data) {
    openToolModal(
      "JSON Data",
      "Parsed locally",
      `
      <div class="space-y-4">

        <div class="rounded-xl border border-slate-800 bg-slate-950 p-4">

          <div class="mb-2 text-xs font-semibold text-slate-400">
            JSON Preview
          </div>

          <pre
            id="jsonPreview"
            class="max-h-[500px] overflow-auto whitespace-pre-wrap text-xs leading-5 text-slate-300"
          ></pre>

        </div>

        <button
          id="jsonExcel"
          class="w-full rounded-xl bg-emerald-600 py-3 text-xs font-bold text-white"
        >
          Export to Excel
        </button>

      </div>
      `
    );

    $("#jsonPreview").textContent =
      JSON.stringify(data, null, 2);

    $("#jsonExcel")?.addEventListener(
      "click",
      () => {
        if (!window.XLSX) {
          showToast("Excel library not loaded");
          return;
        }

        const array =
          Array.isArray(data)
            ? data
            : [data];

        const ws =
          XLSX.utils.json_to_sheet(
            array
          );

        const wb =
          XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(
          wb,
          ws,
          "Data"
        );

        XLSX.writeFile(
          wb,
          "workflow-os-data.xlsx"
        );

        showToast("Excel exported");
      }
    );
  }

  /* ============================================================
     CSV PREVIEW
  ============================================================ */

  function openCSVPreview(csv) {
    const rows =
      csv
        .trim()
        .split(/\r?\n/)
        .map((line) =>
          line.split(",")
        );

    const headers =
      rows[0] || [];

    const body =
      rows.slice(1);

    openToolModal(
      "CSV Data",
      `${rows.length} rows detected`,
      `
      <div class="space-y-4">

        <div class="overflow-auto rounded-xl border border-slate-800">

          <table class="w-full min-w-[600px] text-left text-xs">

            <thead class="bg-slate-950 text-slate-500">
              <tr>
                ${headers
                  .map(
                    (header) =>
                      `<th class="p-3">${safeText(header)}</th>`
                  )
                  .join("")}
              </tr>
            </thead>

            <tbody class="divide-y divide-slate-800">

              ${body
                .slice(0, 100)
                .map(
                  (row) => `
                    <tr>
                      ${headers
                        .map(
                          (_, index) =>
                            `<td class="p-3 text-slate-300">${safeText(row[index] || "")}</td>`
                        )
                        .join("")}
                    </tr>
                  `
                )
                .join("")}

            </tbody>

          </table>

        </div>

        <button
          id="csvExcelExport"
          class="w-full rounded-xl bg-emerald-600 py-3 text-xs font-bold text-white"
        >
          Export Excel
        </button>

      </div>
      `
    );

    $("#csvExcelExport")?.addEventListener(
      "click",
      () => {
        if (!window.XLSX) {
          showToast("Excel library not loaded");
          return;
        }

        const ws =
          XLSX.utils.aoa_to_sheet(
            rows
          );

        const wb =
          XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(
          wb,
          ws,
          "CSV Data"
        );

        XLSX.writeFile(
          wb,
          "workflow-os-data.xlsx"
        );

        showToast("Excel downloaded");
      }
    );
  }

  /* ============================================================
     URL TOOL
  ============================================================ */

  function openURLTool(url) {
    let valid = false;

    try {
      const parsed =
        new URL(url);

      valid =
        parsed.protocol === "http:" ||
        parsed.protocol === "https:";
    } catch {
      valid = false;
    }

    openToolModal(
      "URL Workspace",
      valid
        ? "Valid web URL detected"
        : "Invalid URL",
      `
      <div class="space-y-4">

        <div class="rounded-xl border border-slate-800 bg-slate-950 p-4">

          <div class="text-[10px] uppercase tracking-wider text-slate-500">
            URL
          </div>

          <div class="mt-2 break-all text-sm text-white">
            ${safeText(url)}
          </div>

        </div>

        ${
          valid
            ? `
              <button
                id="openURL"
                class="w-full rounded-xl bg-indigo-600 py-3 text-xs font-bold text-white"
              >
                Open URL
              </button>
            `
            : `
              <div class="rounded-xl bg-red-500/10 p-4 text-xs text-red-300">
                Please enter a valid http:// or https:// URL.
              </div>
            `
        }

      </div>
      `
    );

    $("#openURL")?.addEventListener(
      "click",
      () => {
        window.open(
          url,
          "_blank",
          "noopener,noreferrer"
        );
      }
    );
  }

  /* ============================================================
     GENERIC TASK RESULT
  ============================================================ */

  function openGenericTaskResult(task) {
    openToolModal(
      "Task Workspace",
      "Task received successfully",
      `
      <div class="space-y-5">

        <div class="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-5">

          <div class="flex items-center gap-3">

            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-300">
              <i class="fa-solid fa-wand-magic-sparkles"></i>
            </div>

            <div>
              <div class="text-sm font-bold text-white">
                Task Ready
              </div>

              <div class="text-[10px] text-slate-500">
                Your instruction has been captured locally.
              </div>
            </div>

          </div>

          <div class="mt-4 rounded-lg bg-slate-950 p-4 text-xs leading-5 text-slate-300">
            ${safeText(task)}
          </div>

        </div>

        <div class="grid grid-cols-2 gap-2">

          <button
            id="taskExcel"
            class="rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs font-bold text-white hover:bg-slate-900"
          >
            <i class="fa-solid fa-file-excel mb-2 block text-emerald-400"></i>
            Export Data
          </button>

          <button
            id="taskSave"
            class="rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs font-bold text-white hover:bg-slate-900"
          >
            <i class="fa-solid fa-floppy-disk mb-2 block text-indigo-400"></i>
            Save Task
          </button>

        </div>

      </div>
      `
    );

    $("#taskSave")?.addEventListener(
      "click",
      () => {
        addRecentWork({
          name: task.slice(0, 40),
          type: "Custom Task",
          status: "Completed"
        });

        showToast(
          "Task saved to Recent Work"
        );
      }
    );

    $("#taskExcel")?.addEventListener(
      "click",
      () => {
        if (!window.XLSX) {
          showToast("Excel library not loaded");
          return;
        }

        const ws =
          XLSX.utils.json_to_sheet([
            {
              Task: task,
              Created:
                new Date().toLocaleString(
                  "en-IN"
                )
            }
          ]);

        const wb =
          XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(
          wb,
          ws,
          "Task"
        );

        XLSX.writeFile(
          wb,
          "workflow-os-task.xlsx"
        );

        showToast(
          "Task exported to Excel"
        );
      }
    );
  }

  /* ============================================================
     RECENT WORK
  ============================================================ */

  const RECENT_KEY =
    "workflowOS_recentWork";

  function getRecentWork() {
    try {
      return JSON.parse(
        localStorage.getItem(
          RECENT_KEY
        ) || "[]"
      );
    } catch {
      return [];
    }
  }

  function saveRecentWork(items) {
    localStorage.setItem(
      RECENT_KEY,
      JSON.stringify(
        items.slice(0, 20)
      )
    );
  }

  function addRecentWork(item) {
    const current =
      getRecentWork();

    const newItem = {
      id:
        Date.now().toString(),
      name:
        item.name || "Untitled Work",
      type:
        item.type || "Workflow",
      date:
        new Date().toLocaleString(
          "en-IN"
        ),
      status:
        item.status || "Completed"
    };

    saveRecentWork([
      newItem,
      ...current
    ]);

    renderRecentWork();
  }

  function renderRecentWork() {
    const body =
      $("#recentTableBody");

    if (!body) return;

    const items =
      getRecentWork();

    if (!items.length) return;

    body.innerHTML =
      items
        .slice(0, 10)
        .map(
          (item) => `
            <tr class="group hover:bg-slate-800/25">

              <td class="px-4 py-3">

                <div class="flex items-center gap-3">

                  <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                    <i class="fa-solid fa-file"></i>
                  </span>

                  <div>
                    <div class="text-xs font-medium text-slate-200">
                      ${safeText(item.name)}
                    </div>

                    <div class="text-[9px] text-slate-500">
                      Local
                    </div>
                  </div>

                </div>

              </td>

              <td class="px-4 py-3 text-[10px] text-slate-400">
                ${safeText(item.type)}
              </td>

              <td class="px-4 py-3 text-[10px] text-slate-400">
                ${safeText(item.date)}
              </td>

              <td class="px-4 py-3">

                <span class="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[9px] font-semibold text-emerald-300">
                  ${safeText(item.status)}
                </span>

              </td>

              <td class="px-4 py-3">

                <div class="flex justify-end gap-1.5">

                  <button
                    class="dynamic-action h-7 w-7 rounded-lg border border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white"
                    data-action="view"
                    data-id="${item.id}"
                    title="View"
                  >
                    <i class="fa-regular fa-eye text-[10px]"></i>
                  </button>

                  <button
                    class="dynamic-action h-7 w-7 rounded-lg border border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white"
                    data-action="delete"
                    data-id="${item.id}"
                    title="Delete"
                  >
                    <i class="fa-solid fa-trash text-[10px]"></i>
                  </button>

                </div>

              </td>

            </tr>
          `
        )
        .join("");

    $$(".dynamic-action").forEach(
      (button) => {
        button.addEventListener(
          "click",
          () => {
            const id =
              button.dataset.id;

            const action =
              button.dataset.action;

            handleRecentAction(
              action,
              id
            );
          }
        );
      }
    );
  }

  function handleRecentAction(
    action,
    id
  ) {
    const items =
      getRecentWork();

    const item =
      items.find(
        (entry) =>
          entry.id === id
      );

    if (!item) return;

    if (action === "view") {
      openTextTool(
        item.name,
        `Work Name: ${item.name}\nType: ${item.type}\nDate: ${item.date}\nStatus: ${item.status}`
      );
    }

    if (action === "delete") {
      saveRecentWork(
        items.filter(
          (entry) =>
            entry.id !== id
        )
      );

      renderRecentWork();

      showToast(
        "Recent work deleted"
      );
    }
  }

  /* ============================================================
     OLD STATIC TABLE ACTIONS
  ============================================================ */

  $$(".table-action").forEach(
    (button) => {
      button.addEventListener(
        "click",
        () => {
          const action =
            button.getAttribute("title") ||
            "Action";

          const row =
            button.closest("tr");

          const name =
            row?.querySelector(
              ".text-xs.font-medium"
            )?.textContent?.trim() ||
            "Work";

          if (action === "View") {
            openTextTool(
              name,
              `Name: ${name}\n\nThis item is available in your local dashboard.`
            );

            return;
          }

          if (action === "Download") {
            showToast(
              "Download action requires the original generated file"
            );

            return;
          }

          showToast(
            `${action} clicked for ${name}`
          );
        }
      );
    }
  );

  /* ============================================================
     WORKFLOW CARDS
  ============================================================ */

  $$(".workflow-card").forEach(
    (card) => {
      card.addEventListener(
        "click",
        () => {
          const title =
            card.querySelector(
              ".text-xs.font-bold"
            )?.textContent?.trim() ||
            "Workflow";

          $("#taskInput").value =
            getWorkflowInstruction(
              title
            );

          switchHeroTab(
            "describe"
          );

          $("#taskInput").focus();

          showToast(
            `${title} workflow selected`
          );
        }
      );
    }
  );

  function getWorkflowInstruction(
    title
  ) {
    const map = {
      "Purchase to Record":
        "Purchase bill ka data nikal ke complete purchase record bana do",
      "Invoice Generator":
        "GST invoice banao",
      "Resume Booster":
        "Resume ko ATS friendly improve karo",
      "Video SEO Toolkit":
        "YouTube video ke liye title, description, tags aur SEO ideas do"
    };

    return (
      map[title] ||
      `${title} workflow start karo`
    );
  }

  /* ============================================================
     HEADER BUTTONS
  ============================================================ */

  $("#upgradeBtn")?.addEventListener(
    "click",
    openUpgradeModal
  );

  $("#upgradeBottomBtn")?.addEventListener(
    "click",
    openUpgradeModal
  );

  function openUpgradeModal() {
    openToolModal(
      "Workflow OS Pro",
      "Unlock advanced workflows",
      `
      <div class="space-y-5">

        <div class="rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-500/10 to-indigo-500/5 p-6">

          <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300">
            <i class="fa-solid fa-crown"></i>
          </div>

          <h3 class="mt-4 text-xl font-extrabold text-white">
            Pro Workspace
          </h3>

          <p class="mt-2 text-xs leading-5 text-slate-400">
            Advanced automation, more workflows,
            larger processing limits and premium exports.
          </p>

        </div>

        <div class="grid gap-2 sm:grid-cols-2">

          <div class="rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs text-slate-300">
            ✓ Unlimited local workflows
          </div>

          <div class="rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs text-slate-300">
            ✓ Advanced exports
          </div>

          <div class="rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs text-slate-300">
            ✓ Premium templates
          </div>

          <div class="rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs text-slate-300">
            ✓ Priority tools
          </div>

        </div>

        <button
          id="proDemoButton"
          class="w-full rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 py-3 text-xs font-bold text-white"
        >
          Continue
        </button>

      </div>
      `
    );

    $("#proDemoButton")?.addEventListener(
      "click",
      () => {
        showToast(
          "Pro checkout can be connected here"
        );
      }
    );
  }

  $("#notificationBtn")?.addEventListener(
    "click",
    () => {
      openToolModal(
        "Notifications",
        "Latest activity",
        `
        <div class="space-y-2">

          <div class="rounded-xl border border-slate-800 bg-slate-950 p-4">
            <div class="flex gap-3">
              <span class="text-emerald-400">
                <i class="fa-solid fa-circle-check"></i>
              </span>

              <div>
                <div class="text-xs font-bold text-white">
                  Workflow OS is ready
                </div>

                <div class="mt-1 text-[10px] text-slate-500">
                  Local processing is available.
                </div>
              </div>
            </div>
          </div>

        </div>
        `
      );
    }
  );

  $("#profileBtn")?.addEventListener(
    "click",
    () => {
      openToolModal(
        "Profile",
        "Your Workflow OS account",
        `
        <div class="space-y-4">

          <div class="flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-950 p-4">

            <div class="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-slate-500 to-slate-800 font-bold text-white">
              AV
            </div>

            <div>
              <div class="font-bold text-white">
                Aman Verma
              </div>

              <div class="text-xs text-slate-500">
                Free Plan
              </div>
            </div>

          </div>

          <button
            id="clearLocalData"
            class="w-full rounded-xl border border-red-500/20 bg-red-500/5 py-3 text-xs font-bold text-red-300"
          >
            Clear Local Dashboard Data
          </button>

        </div>
        `
      );

      $("#clearLocalData")?.addEventListener(
        "click",
        () => {
          const confirmed =
            window.confirm(
              "Clear Workflow OS local data?"
            );

          if (!confirmed) return;

          localStorage.removeItem(
            RECENT_KEY
          );

          localStorage.removeItem(
            "workflowOS_lastInvoice"
          );

          renderRecentWork();

          showToast(
            "Local dashboard data cleared"
          );
        }
      );
    }
  );

  $("#viewAllBtn")?.addEventListener(
    "click",
    () => {
      const items =
        getRecentWork();

      if (!items.length) {
        showToast(
          "No new local work yet"
        );
        return;
      }

      openTextTool(
        "All Recent Work",
        items
          .map(
            (item) =>
              `${item.name} — ${item.type} — ${item.date}`
          )
          .join("\n")
      );
    }
  );

  /* ============================================================
     HOW IT WORKS
  ============================================================ */

  const tourModal =
    $("#tourModal");

  function openTour() {
    tourModal?.classList.remove(
      "hidden"
    );

    tourModal?.classList.add(
      "flex"
    );
  }

  function closeTour() {
    tourModal?.classList.add(
      "hidden"
    );

    tourModal?.classList.remove(
      "flex"
    );
  }

  $("#howWorksBtn")?.addEventListener(
    "click",
    openTour
  );

  $("#closeTour")?.addEventListener(
    "click",
    closeTour
  );

  $("#doneTour")?.addEventListener(
    "click",
    closeTour
  );

  tourModal?.addEventListener(
    "click",
    (event) => {
      if (
        event.target === tourModal
      ) {
        closeTour();
      }
    }
  );

  /* ============================================================
     FOOTER BUTTONS
  ============================================================ */

  const footerButtons =
    $$("footer button");

  footerButtons.forEach(
    (button) => {
      button.addEventListener(
        "click",
        () => {
          const text =
            button.textContent
              .trim()
              .toLowerCase();

          if (text === "privacy") {
            openPrivacyInfo();
          } else if (
            text === "terms"
          ) {
            openTermsInfo();
          } else if (
            text === "help"
          ) {
            openHelpInfo();
          }
        }
      );
    }
  );

  function openPrivacyInfo() {
    openToolModal(
      "Privacy",
      "Local-first processing",
      `
      <div class="space-y-4 text-xs leading-5 text-slate-400">

        <p>
          Workflow OS is designed around local-first processing.
          Files selected in this dashboard are handled by the browser
          unless you explicitly connect an external service.
        </p>

        <div class="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-emerald-200">
          Privacy Mode:
          <strong>
            ${privacyEnabled ? "ON" : "OFF"}
          </strong>
        </div>

      </div>
      `
    );
  }

  function openTermsInfo() {
    openToolModal(
      "Terms",
      "Workflow OS",
      `
      <div class="text-xs leading-6 text-slate-400">

        <p>
          Workflow OS is a productivity interface.
          Always review generated calculations,
          invoices and exported documents before
          using them for business or legal purposes.
        </p>

      </div>
      `
    );
  }

  function openHelpInfo() {
    openToolModal(
      "Help Center",
      "Quick shortcuts",
      `
      <div class="space-y-3">

        <div class="rounded-xl border border-slate-800 bg-slate-950 p-4">
          <strong class="text-white">
            Ctrl / Cmd + K
          </strong>

          <div class="mt-1 text-[10px] text-slate-500">
            Focus the task box
          </div>
        </div>

        <div class="rounded-xl border border-slate-800 bg-slate-950 p-4">
          <strong class="text-white">
            Escape
          </strong>

          <div class="mt-1 text-[10px] text-slate-500">
            Close open modal
          </div>
        </div>

      </div>
      `
    );
  }

  /* ============================================================
     KEYBOARD
  ============================================================ */

  document.addEventListener(
    "keydown",
    (event) => {
      if (event.key === "Escape") {
        closeSidebar();
        closeTour();
        closeToolModal();
      }

      if (
        (event.ctrlKey ||
          event.metaKey) &&
        event.key.toLowerCase() === "k"
      ) {
        event.preventDefault();

        switchHeroTab(
          "describe"
        );

        $("#taskInput")?.focus();
      }
    }
  );

  /* ============================================================
     UTILITIES
  ============================================================ */

  function formatFileSize(bytes) {
    if (!bytes) return "0 Bytes";

    const units = [
      "Bytes",
      "KB",
      "MB",
      "GB"
    ];

    const index =
      Math.floor(
        Math.log(bytes) /
          Math.log(1024)
      );

    return `${(
      bytes /
      Math.pow(1024, index)
    ).toFixed(index ? 2 : 0)} ${units[index]}`;
  }

  function downloadBlob(
    blob,
    filename
  ) {
    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;
    link.download = filename;

    document.body.appendChild(link);

    link.click();

    link.remove();

    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1000);
  }

  function loadScript(src) {
    return new Promise(
      (resolve, reject) => {
        const existing =
          document.querySelector(
            `script[src="${src}"]`
          );

        if (existing) {
          existing.addEventListener(
            "load",
            resolve
          );

          existing.addEventListener(
            "error",
            reject
          );

          return;
        }

        const script =
          document.createElement(
            "script"
          );

        script.src = src;

        script.onload = resolve;
        script.onerror = reject;

        document.head.appendChild(
          script
        );
      }
    );
  }

  /* ============================================================
     INITIALIZATION
  ============================================================ */

  applyTheme();
  renderLocalMode();
  renderPrivacy();
  renderRecentWork();
  switchHeroTab("describe");

  console.log(
    "%cWorkflow OS initialized successfully",
    "font-weight:bold;color:#8b5cf6"
  );

  showToast(
    "Workflow OS ready",
    1800
  );
});
