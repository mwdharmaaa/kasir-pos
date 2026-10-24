/**
 * @file theme.js
 * @description Switcher mode gelap (Dark Mode) dengan penyimpanan preferensi di localStorage.
 */

import { storage } from '../storage/storage.js';

class ThemeModule {
  constructor() {
    this.themeKey = 'app_theme';
    this.currentTheme = storage.get(this.themeKey, 'light');
  }

  init() {
    this.applyTheme(this.currentTheme);

    const toggleBtn = document.getElementById('btn-toggle-theme');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => this.toggleTheme());
    }
  }

  toggleTheme() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.applyTheme(newTheme);
  }

  applyTheme(theme) {
    this.currentTheme = theme;
    storage.set(this.themeKey, theme);

    const htmlEl = document.documentElement;
    const themeIcon = document.getElementById('theme-icon');

    if (theme === 'dark') {
      htmlEl.classList.add('dark-theme');
      if (themeIcon) themeIcon.textContent = '☀️';
    } else {
      htmlEl.classList.remove('dark-theme');
      if (themeIcon) themeIcon.textContent = '🌙';
    }
  }
}

export const themeModule = new ThemeModule();
