// script.js
// Funcionalidades:
// - Lazy-load dos players quando o usuário clicar "Tocar" ou quando o card ficar visível e o usuário clicar play.
// - Botão parar por card e "Parar todos" global.
// - Efeito fade-in/zoom com IntersectionObserver.
// - Tema automático (prefers-color-scheme) + toggle com persistência em localStorage.

document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.card');
  const stopAllBtn = document.getElementById('stop-all');
  const toggleThemeBtn = document.getElementById('toggle-theme');

  // -------- Theme handling (auto + toggle) ----------
  const stored = localStorage.getItem('theme-preference'); // 'light' | 'dark' | null
