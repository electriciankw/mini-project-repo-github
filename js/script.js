"use strict";

// Elemen yang dipilih lewat DOM
const root = document.documentElement;
const menuToggle = document.getElementById("menu-toggle");
const navMenu = document.getElementById("nav-menu");
const themeToggle = document.getElementById("theme-toggle");
const searchInput = document.getElementById("search-input");
const categoryFilter = document.getElementById("category-filter");
const productGrid = document.getElementById("product-grid");
const productStatus = document.getElementById("product-status");
const emptyState = document.getElementById("empty-state");
const products = productGrid.querySelectorAll(".product");
const sizeKnob = document.getElementById("size-knob");
const sizePanel = document.getElementById("size-panel");
const sizeRange = document.getElementById("size-range");
const sizeOutput = document.getElementById("size-output");

// Fitur: menu hamburger
function setMenu(open) {
  navMenu.classList.toggle("is-open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
}
menuToggle.addEventListener("click", function () {
  setMenu(!navMenu.classList.contains("is-open"));
});
navMenu.addEventListener("click", function (event) {
  if (event.target.tagName === "A") setMenu(false);
});

// Fitur: switch mode terang/gelap
themeToggle.addEventListener("click", function () {
  const dark = root.classList.toggle("dark");
  themeToggle.setAttribute("aria-checked", String(dark));
});

// Fitur: tampil/sembunyikan spesifikasi dan ganti tampilan info
function toggleDetail(button) {
  const detail = document.getElementById(button.getAttribute("aria-controls"));
  const willOpen = detail.hidden;
  detail.hidden = !willOpen;
  button.setAttribute("aria-expanded", String(willOpen));
  button.textContent = willOpen ? "Sembunyikan spesifikasi" : "Lihat spesifikasi";
}

function switchTab(tab) {
  const detail = tab.closest(".detail");
  detail.querySelectorAll(".tab").forEach(function (item) {
    const active = item === tab;
    item.classList.toggle("is-active", active);
    item.setAttribute("aria-pressed", String(active));
  });
  detail.querySelectorAll(".panel").forEach(function (panel) {
    panel.hidden = panel.dataset.panel !== tab.dataset.panel;
  });
}

productGrid.addEventListener("click", function (event) {
  const detailButton = event.target.closest(".btn-detail");
  const tab = event.target.closest(".tab");
  if (detailButton) toggleDetail(detailButton);
  else if (tab) switchTab(tab);
});

// Fitur: cari dan filter produk
function filterProducts() {
  const keyword = searchInput.value.trim().toLowerCase();
  const category = categoryFilter.value;
  let visible = 0;
  products.forEach(function (product) {
    const show = product.dataset.nama.includes(keyword) &&
      (category === "semua" || product.dataset.kategori === category);
    product.hidden = !show;
    if (show) visible++;
  });
  productStatus.textContent = "Menampilkan " + visible + " dari " + products.length + " produk";
  emptyState.hidden = visible !== 0;
}
searchInput.addEventListener("input", filterProducts);
categoryFilter.addEventListener("change", filterProducts);

// Fitur: pengatur ukuran teks lewat knob + slider
const SIZE_LEVELS = [90, 100, 115, 130, 150];

function applySize(level) {
  const percent = SIZE_LEVELS[level];
  root.style.fontSize = percent + "%";
  sizeOutput.textContent = percent + "%";
  sizeKnob.style.setProperty("--angle", (level * 60 - 120) + "deg");
  sizeRange.style.setProperty("--fill", (level / (SIZE_LEVELS.length - 1) * 100) + "%");
}

function setSizePanel(open) {
  sizePanel.hidden = !open;
  sizeKnob.setAttribute("aria-expanded", String(open));
}

sizeKnob.addEventListener("click", function () {
  setSizePanel(sizePanel.hidden);
});
sizeRange.addEventListener("input", function () {
  applySize(Number(sizeRange.value));
});
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape" && !sizePanel.hidden) {
    setSizePanel(false);
    sizeKnob.focus();
  }
});

// Event load
window.addEventListener("load", function () {
  document.getElementById("tahun").textContent = new Date().getFullYear();
  applySize(Number(sizeRange.value));
  filterProducts();
});
