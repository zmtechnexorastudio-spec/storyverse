/* Lógica de idioma (PT/EN).
   Regra da V1: sem LocalStorage. O idioma vem do URL (?lang=en) ou do navegador,
   e é mantido entre páginas através do parâmetro "lang" nas ligações internas. */
(function () {
  var SV = (window.StoryVerse = window.StoryVerse || {});
  var SUPPORTED = ['pt', 'en'];
  var explicit = false;
  var current = detect();

  function detect() {
    var fromUrl = new URLSearchParams(window.location.search).get('lang');
    if (SUPPORTED.indexOf(fromUrl) !== -1) { explicit = true; return fromUrl; }
    var nav = (navigator.language || 'pt').toLowerCase();
    return nav.indexOf('en') === 0 ? 'en' : 'pt';
  }

  function t(key) {
    var dict = window.SV_LANGUAGES || {};
    if (dict[current] && dict[current][key] != null) return dict[current][key];
    if (dict.pt && dict.pt[key] != null) return dict.pt[key];
    return key;
  }

  function apply() {
    var d = document;
    d.documentElement.lang = current === 'pt' ? 'pt-PT' : 'en';
    if (!d.querySelector('title[data-i18n]')) d.title = t('meta.title');

    d.querySelectorAll('[data-i18n]').forEach(function (el) { el.textContent = t(el.dataset.i18n); });
    d.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) { el.setAttribute('placeholder', t(el.dataset.i18nPlaceholder)); });
    d.querySelectorAll('[data-i18n-aria-label]').forEach(function (el) { el.setAttribute('aria-label', t(el.dataset.i18nAriaLabel)); });
    d.querySelectorAll('[data-i18n-title]').forEach(function (el) { el.setAttribute('title', t(el.dataset.i18nTitle)); });
    d.querySelectorAll('[data-i18n-content]').forEach(function (el) { el.setAttribute('content', t(el.dataset.i18nContent)); });
    d.querySelectorAll('[data-lang]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.lang === current)); });

    d.dispatchEvent(new CustomEvent('sv:languagechange', { detail: { lang: current } }));
  }

  function set(lang) {
    if (SUPPORTED.indexOf(lang) === -1 || lang === current) return;
    current = lang;
    explicit = true;
    try {
      var url = new URL(window.location.href);
      url.searchParams.set('lang', lang);
      window.history.replaceState(null, '', url);
    } catch (e) { /* ex.: ficheiro aberto localmente — ignora */ }
    apply();
  }

  function init() {
    document.querySelectorAll('[data-lang]').forEach(function (b) {
      b.addEventListener('click', function () {
        set(b.dataset.lang);
        if (SV.track) SV.track('language_change', { language: current });
      });
    });
    apply();
  }

  SV.language = {
    init: init,
    apply: apply,
    set: set,
    t: t,
    get: function () { return current; },
    isExplicit: function () { return explicit; }
  };
})();
