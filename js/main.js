/* Inicialização e ligação dos módulos. */
(function () {
  var SV = (window.StoryVerse = window.StoryVerse || {});

  /* ---- Google Analytics 4 (só carrega se houver ID em config.js) ---- */
  function initAnalytics() {
    var id = (window.SV_CONFIG && window.SV_CONFIG.gaMeasurementId) || '';
    if (!/^G-[A-Z0-9]+$/i.test(id)) return;

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', id);

    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
    document.head.appendChild(s);
  }

  // Regista apenas ações observáveis (clique, abertura) — nunca "conclusão" de ações externas.
  SV.track = function (name, params) {
    if (typeof window.gtag === 'function') window.gtag('event', name, params || {});
  };

  // Depois de exportar: mostra os próximos passos (outro estilo → categorias → início)
  SV.showNextSteps = function () { var n = document.getElementById('export-next'); if (n) n.hidden = false; };

  function icons() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') window.lucide.createIcons();
  }

  document.addEventListener('DOMContentLoaded', function () {
    initAnalytics();
    SV.feedback.init();      // monta as opções antes de traduzir e criar ícones
    SV.language.init();
    SV.navigation.init();
    SV.search.init();
    icons();
  });
})();
