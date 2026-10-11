import { Cinnamon } from '../src/js/cinnamon.js';

// Setup view switching (Desktop vs Gallery)
const btnDesktop = document.getElementById('btnViewDesktop');
const btnGallery = document.getElementById('btnViewGallery');
const desktopView = document.getElementById('desktopView');
const galleryView = document.getElementById('galleryView');

btnDesktop.addEventListener('click', () => {
  btnDesktop.classList.add('is-active');
  btnGallery.classList.remove('is-active');
  desktopView.style.display = 'flex';
  galleryView.style.display = 'none';
});

btnGallery.addEventListener('click', () => {
  btnGallery.classList.add('is-active');
  btnDesktop.classList.remove('is-active');
  desktopView.style.display = 'none';
  galleryView.style.display = 'block';
});

// Setup Dark/Light mode toggle
const btnThemeToggle = document.getElementById('btnThemeToggle');
const switchDarkMode = document.getElementById('switchDarkMode');

function updateThemeUI(isDark) {
  btnThemeToggle.textContent = isDark ? '☀️ Light' : '🌙 Dark';
  if (switchDarkMode) switchDarkMode.checked = isDark;
}

btnThemeToggle.addEventListener('click', () => {
  Cinnamon.toggleTheme();
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  updateThemeUI(isDark);
});

if (switchDarkMode) {
  switchDarkMode.addEventListener('change', (e) => {
    Cinnamon.setTheme(e.target.checked ? 'dark' : 'light');
    updateThemeUI(e.target.checked);
  });
}

// Setup Accent Swatches
const swatches = document.querySelectorAll('.cin-accent-swatch');
swatches.forEach(swatch => {
  swatch.addEventListener('click', () => {
    swatches.forEach(s => s.classList.remove('is-active'));
    swatch.classList.add('is-active');
    const accent = swatch.getAttribute('data-accent');
    Cinnamon.setAccent(accent);
  });
});
