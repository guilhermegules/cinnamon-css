/**
 * Cinnamon CSS - Demo Event Handlers & Interactive Controller
 * Used exclusively for the interactive demo application
 */

import '../src/index.css';

class CinnamonDemoManager {
  constructor() {
    this.activeZIndex = 30;
    this.windows = new Map();
    this.init();
  }

  init() {
    if (typeof document === 'undefined') return;

    const setup = () => {
      this.initWindows();
      this.initMenu();
      this.initTabs();
      this.initClock();
      this.initControls();
    };

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      setup();
    } else {
      document.addEventListener('DOMContentLoaded', setup);
    }
  }

  /* ========================================================================
     Theming & View Switching Controls (Demo UI)
     ======================================================================== */
  initControls() {
    // 1. View Switching (Desktop vs Gallery)
    const btnDesktop = document.getElementById('btnViewDesktop');
    const btnGallery = document.getElementById('btnViewGallery');
    const desktopView = document.getElementById('desktopView');
    const galleryView = document.getElementById('galleryView');

    if (btnDesktop && btnGallery && desktopView && galleryView) {
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
    }

    // 2. Dark/Light Theme Toggle
    const btnThemeToggle = document.getElementById('btnThemeToggle');
    const switchDarkMode = document.getElementById('switchDarkMode');

    const updateThemeUI = (isDark) => {
      if (btnThemeToggle) btnThemeToggle.textContent = isDark ? '☀️ Light' : '🌙 Dark';
      if (switchDarkMode) switchDarkMode.checked = isDark;
    };

    if (btnThemeToggle) {
      btnThemeToggle.addEventListener('click', () => {
        this.toggleTheme();
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        updateThemeUI(isDark);
      });
    }

    if (switchDarkMode) {
      switchDarkMode.addEventListener('change', (e) => {
        this.setTheme(e.target.checked ? 'dark' : 'light');
        updateThemeUI(e.target.checked);
      });
    }

    // 3. Accent Swatches
    const swatches = document.querySelectorAll('.cin-accent-swatch');
    swatches.forEach(swatch => {
      swatch.addEventListener('click', () => {
        swatches.forEach(s => s.classList.remove('is-active'));
        swatch.classList.add('is-active');
        const accent = swatch.getAttribute('data-accent');
        this.setAccent(accent);
      });
    });
  }

  setTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }

  toggleTheme() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    this.setTheme(isDark ? 'light' : 'dark');
  }

  setAccent(accent) {
    if (!accent || accent === 'mint') {
      document.documentElement.removeAttribute('data-accent');
    } else {
      document.documentElement.setAttribute('data-accent', accent);
    }
  }

  /* ========================================================================
     Window Management
     ======================================================================== */
  initWindows() {
    const windows = document.querySelectorAll('.cin-window');
    windows.forEach(win => this.registerWindow(win));
  }

  registerWindow(win) {
    const id = win.id || `cin-win-${Math.random().toString(36).substr(2, 9)}`;
    win.id = id;

    const titlebar = win.querySelector('.cin-titlebar, .cin-window-header');
    const btnClose = win.querySelector('.cin-win-btn-close');
    const btnMin = win.querySelector('.cin-win-btn-min');
    const btnMax = win.querySelector('.cin-win-btn-max');

    // Bring to front on mousedown
    win.addEventListener('mousedown', () => this.bringToFront(win));

    // Dragging logic
    if (titlebar) {
      let isDragging = false;
      let startX, startY, initialX, initialY;

      titlebar.addEventListener('mousedown', (e) => {
        if (e.target.closest('.cin-win-btn') || win.classList.contains('is-maximized')) return;
        
        isDragging = true;
        this.bringToFront(win);
        startX = e.clientX;
        startY = e.clientY;
        const rect = win.getBoundingClientRect();
        initialX = rect.left;
        initialY = rect.top;

        const onMouseMove = (ev) => {
          if (!isDragging) return;
          const dx = ev.clientX - startX;
          const dy = ev.clientY - startY;
          win.style.left = `${Math.max(0, initialX + dx)}px`;
          win.style.top = `${Math.max(0, initialY + dy)}px`;
          win.style.right = 'auto';
          win.style.bottom = 'auto';
        };

        const onMouseUp = () => {
          isDragging = false;
          window.removeEventListener('mousemove', onMouseMove);
          window.removeEventListener('mouseup', onMouseUp);
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
      });
    }

    if (btnClose) {
      btnClose.addEventListener('click', (e) => {
        e.stopPropagation();
        this.closeWindow(win);
      });
    }

    if (btnMin) {
      btnMin.addEventListener('click', (e) => {
        e.stopPropagation();
        this.minimizeWindow(win);
      });
    }

    if (btnMax) {
      btnMax.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleMaximize(win);
      });
    }

    this.windows.set(id, win);
    this.syncTaskbar();
  }

  bringToFront(win) {
    document.querySelectorAll('.cin-window').forEach(w => w.classList.remove('is-active'));
    win.classList.add('is-active');
    this.activeZIndex += 1;
    win.style.zIndex = this.activeZIndex;
    this.syncTaskbar();
  }

  closeWindow(win) {
    win.style.display = 'none';
    win.classList.remove('is-active');
    this.syncTaskbar();
  }

  minimizeWindow(win) {
    win.style.display = 'none';
    win.classList.remove('is-active');
    this.syncTaskbar();
  }

  restoreWindow(win) {
    win.style.display = 'flex';
    this.bringToFront(win);
  }

  toggleMaximize(win) {
    win.classList.toggle('is-maximized');
    this.bringToFront(win);
  }

  /* ========================================================================
     Taskbar Synchronization
     ======================================================================== */
  syncTaskbar() {
    const taskContainer = document.querySelector('.cin-panel-tasks');
    if (!taskContainer) return;

    taskContainer.innerHTML = '';

    this.windows.forEach((win) => {
      const isVisible = win.style.display !== 'none';
      const isActive = win.classList.contains('is-active') && isVisible;
      const title = win.querySelector('.cin-titlebar-title')?.textContent || 'Window';
      const icon = win.querySelector('.cin-titlebar-icon')?.innerHTML || '';

      const btn = document.createElement('button');
      btn.className = `cin-task-btn ${isVisible ? 'is-running' : ''} ${isActive ? 'is-active' : ''}`;
      btn.innerHTML = `
        <span class="cin-task-icon">${icon}</span>
        <span class="cin-task-label">${title}</span>
      `;

      btn.addEventListener('click', () => {
        if (!isVisible) {
          this.restoreWindow(win);
        } else if (isActive) {
          this.minimizeWindow(win);
        } else {
          this.bringToFront(win);
        }
      });

      taskContainer.appendChild(btn);
    });
  }

  /* ========================================================================
     Start Menu (Mint Menu)
     ======================================================================== */
  initMenu() {
    const menuBtn = document.querySelector('.cin-panel-menu-btn');
    const menu = document.querySelector('.cin-app-menu');

    if (!menuBtn || !menu) return;

    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = menu.style.display === 'flex';
      menu.style.display = isOpen ? 'none' : 'flex';
      menuBtn.classList.toggle('is-active', !isOpen);
    });

    document.addEventListener('click', (e) => {
      if (!menu.contains(e.target) && !menuBtn.contains(e.target)) {
        menu.style.display = 'none';
        menuBtn.classList.remove('is-active');
      }
    });

    const categoryBtns = menu.querySelectorAll('.cin-category-btn');
    categoryBtns.forEach(btn => {
      btn.addEventListener('mouseenter', () => {
        categoryBtns.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
      });
    });
  }

  /* ========================================================================
     Tabs Navigation
     ======================================================================== */
  initTabs() {
    document.querySelectorAll('.cin-tabs').forEach(tabGroup => {
      const tabs = tabGroup.querySelectorAll('.cin-tab');
      tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          const target = tab.getAttribute('data-target');
          tabs.forEach(t => t.classList.remove('is-active'));
          tab.classList.add('is-active');

          if (target) {
            const container = tabGroup.closest('.cin-window') || tabGroup.parentElement;
            container.querySelectorAll('.cin-tab-pane').forEach(p => p.classList.remove('is-active'));
            const activePane = container.querySelector(target);
            if (activePane) activePane.classList.add('is-active');
          }
        });
      });
    });
  }

  /* ========================================================================
     Clock Applet
     ======================================================================== */
  initClock() {
    const clock = document.querySelector('.cin-panel-clock');
    if (!clock) return;

    const updateTime = () => {
      const now = new Date();
      clock.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    updateTime();
    setInterval(updateTime, 1000);
  }

  /* ========================================================================
     Notification & OSD Toast Helpers
     ======================================================================== */
  notify({ title, text, icon = 'ℹ️', duration = 4000 }) {
    const notification = document.createElement('div');
    notification.className = 'cin-notification';
    notification.innerHTML = `
      <div class="cin-notification-icon">${icon}</div>
      <div class="cin-notification-body">
        <div class="cin-notification-title">${title}</div>
        <div class="cin-notification-text">${text}</div>
      </div>
      <button class="cin-notification-close">✕</button>
    `;

    notification.querySelector('.cin-notification-close').addEventListener('click', () => {
      notification.remove();
    });

    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), duration);
  }

  showOSD({ icon = '🔊', level = 75, duration = 1800 }) {
    let osd = document.querySelector('.cin-osd');
    if (!osd) {
      osd = document.createElement('div');
      osd.className = 'cin-osd';
      document.body.appendChild(osd);
    }

    osd.innerHTML = `
      <div class="cin-osd-icon">${icon}</div>
      <div class="cin-osd-level">
        <div class="cin-osd-level-bar" style="width: ${level}%"></div>
      </div>
    `;
    osd.style.display = 'flex';

    clearTimeout(this.osdTimer);
    this.osdTimer = setTimeout(() => {
      osd.style.display = 'none';
    }, duration);
  }
}

// Global Export for demo
export const Cinnamon = new CinnamonDemoManager();
if (typeof window !== 'undefined') {
  window.Cinnamon = Cinnamon;
}
