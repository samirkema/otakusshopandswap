/**
 * OTAKU SHOP — Theme switcher (dark / light)
 * Technique : CSS filter invert sur body, contre-inversé sur les images.
 */
(function () {
  const STORAGE_KEY = 'otaku_theme';

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
    const btn = document.getElementById('theme-toggle');
    if (btn) btn.textContent = theme === 'light' ? '🌙' : '☀️';
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    applyTheme(current === 'dark' ? 'light' : 'dark');
  }

  // Appliquer immédiatement (avant paint) pour éviter le flash
  const saved = localStorage.getItem(STORAGE_KEY) || 'dark';
  document.documentElement.setAttribute('data-theme', saved);

  document.addEventListener('DOMContentLoaded', () => {
    // Injecter le bouton flottant
    const btn = document.createElement('button');
    btn.id = 'theme-toggle';
    btn.setAttribute('aria-label', 'Changer le thème');
    btn.textContent = saved === 'light' ? '🌙' : '☀️';
    btn.onclick = toggleTheme;
    document.body.appendChild(btn);
  });
})();
