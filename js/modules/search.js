/* Pesquisa global — formulários encaminham para pages/pesquisa.html?q=...
   (a lógica de resultados fica na página de pesquisa). */
(function () {
  var SV = (window.StoryVerse = window.StoryVerse || {});

  function init() {
    document.querySelectorAll('[data-search]').forEach(function (form) {
      form.addEventListener('submit', function (e) {
        var input = form.querySelector('input[name="q"]');
        var q = input ? input.value.trim() : '';
        e.preventDefault();
        if (!q) { if (input) input.focus(); return; }

        if (SV.track) SV.track('search', { search_term: q });

        var target = form.getAttribute('action') + '?q=' + encodeURIComponent(q);
        if (SV.language) target += '&lang=' + SV.language.get();
        var theme = document.documentElement.getAttribute('data-theme');
        if (theme === 'light' || theme === 'dark') target += '&theme=' + theme;
        window.location.href = target;
      });
    });
  }

  SV.search = { init: init };
})();
