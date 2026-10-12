import '../src/index.css';

/**
 * Cinnamon CSS - Demo Controller
 * Focuses purely on component interactivity, accent tinting, and theme toggling
 */

class CinnamonDemoManager {
  constructor() {
    this.init();
  }

  init() {
    if (typeof document === 'undefined') return;

    const setup = () => {
      this.initThemeAndTint();
      this.initTabs();
      this.initSlider();
    };

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      setup();
    } else {
      document.addEventListener('DOMContentLoaded', setup);
    }
  }

  /* ========================================================================
     Tint / Accent & Theme Switching
     ======================================================================== */
  initThemeAndTint() {
    // 1. Accent Swatches (Tint Switching)
    const swatches = document.querySelectorAll('.cin-accent-swatch');
    swatches.forEach(swatch => {
      swatch.addEventListener('click', () => {
        swatches.forEach(s => s.classList.remove('is-active'));
        swatch.classList.add('is-active');
        const accent = swatch.getAttribute('data-accent');
        this.setAccent(accent);
      });
    });

    // 2. Dark / Light Theme Toggle
    const btnThemeToggle = document.getElementById('btnThemeToggle');
    if (btnThemeToggle) {
      btnThemeToggle.addEventListener('click', () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        if (isDark) {
          document.documentElement.removeAttribute('data-theme');
          btnThemeToggle.textContent = '🌙 Dark Theme';
        } else {
          document.documentElement.setAttribute('data-theme', 'dark');
          btnThemeToggle.textContent = '☀️ Light Theme';
        }
      });
    }
  }

  setAccent(accent) {
    if (!accent || accent === 'mint') {
      document.documentElement.removeAttribute('data-accent');
    } else {
      document.documentElement.setAttribute('data-accent', accent);
    }
  }

  /* ========================================================================
     Tabs Navigation
     ======================================================================== */
  initTabs() {
    const tabGroups = document.querySelectorAll('.cin-tabs');
    tabGroups.forEach(group => {
      const tabs = group.querySelectorAll('.cin-tab');
      tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          tabs.forEach(t => t.classList.remove('is-active'));
          tab.classList.add('is-active');

          const target = tab.getAttribute('data-target');
          if (target) {
            const container = group.parentElement;
            container.querySelectorAll('.cin-tab-pane').forEach(p => p.style.display = 'none');
            const targetPane = container.querySelector(target);
            if (targetPane) targetPane.style.display = 'block';
          }
        });
      });
    });
  }

  /* ========================================================================
     Interactive slider demo label
     ======================================================================== */
  initSlider() {
    const slider = document.getElementById('demoSlider');
    const label = document.getElementById('sliderValueText');
    if (slider && label) {
      slider.addEventListener('input', (e) => {
        label.textContent = `${e.target.value}%`;
      });
    }
  }
}

export const Cinnamon = new CinnamonDemoManager();
if (typeof window !== 'undefined') {
  window.Cinnamon = Cinnamon;
}
