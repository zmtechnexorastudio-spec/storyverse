/* Cabeçalho, rodapé e barra de percurso PARTILHADOS por todas as páginas.

   Está tudo definido AQUI, num único sítio. Para mudar o cabeçalho ou o rodapé de todas
   as páginas de uma vez, edita este ficheiro.

   Como usar numa página (as linhas são iguais em todas; só muda o caminho "../" nas páginas
   que estão dentro da pasta pages/):

     <script src="../js/modules/layout.js" data-part="header"></script>     <- onde fica o cabeçalho
     <script src="../js/modules/layout.js" data-part="footer"></script>     <- onde fica o rodapé

   Este script é síncrono de propósito: assim o cabeçalho aparece logo, sem "salto" no ecrã. */
(function () {
  var script = document.currentScript;
  if (!script) return;

  var part = script.getAttribute('data-part');
  var src = script.getAttribute('src') || '';
  // "../js/modules/layout.js" -> "../"   |   "js/modules/layout.js" -> ""
  var root = src.replace(/js\/modules\/layout\.js.*$/, '');
  // Onde ficam as páginas, vistas a partir da página atual
  var pages = root ? '' : 'pages/';
  var file = (location.pathname.split('/').pop() || 'index.html').toLowerCase();

  function esc(text) {
    return String(text).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  }

  function current(target) {
    var t = target.toLowerCase();
    if (t === 'index.html') return file === 'index.html' || file === '';
    return file === t;
  }

  /* ---------------- Cabeçalho (igual ao da página inicial) ---------------- */
  function header() {
    var items = [
      ['index.html', root + 'index.html', 'nav.home', 'Início'],
      ['historias.html', pages + 'historias.html', 'nav.stories', 'Histórias'],
      ['poemas.html', pages + 'poemas.html', 'nav.poems', 'Poemas'],
      ['memes.html', pages + 'memes.html', 'nav.memes', 'Memes'],
      ['status.html', pages + 'status.html', 'nav.status', 'Status'],
      ['pensamentos.html', pages + 'pensamentos.html', 'nav.thoughts', 'Pensamentos']
    ];
    var links = items.map(function (it) {
      return '<li><a href="' + it[1] + '"' + (current(it[0]) ? ' aria-current="page"' : '') +
        ' data-i18n="' + it[2] + '">' + it[3] + '</a></li>';
    }).join('');

    return '' +
      '<header class="site-header">' +
        '<div class="container header-inner">' +
          '<a class="brand" href="' + root + 'index.html" aria-label="StoryVerse — página inicial" data-i18n-aria-label="brand.home">' +
            '<img src="' + root + 'assets/logo/icone.svg" width="36" height="36" alt="">' +
            '<span class="brand-name">Story<span>Verse</span></span>' +
          '</a>' +
          '<form class="search search--header" role="search" action="' + pages + 'pesquisa.html" method="get" data-search>' +
            '<label class="sr-only" for="q-header" data-i18n="search.label">Pesquisar</label>' +
            '<input id="q-header" name="q" type="search" autocomplete="off" placeholder="Pesquisar no StoryVerse..." data-i18n-placeholder="search.header">' +
            '<button type="submit" aria-label="Pesquisar" data-i18n-aria-label="search.label"><i data-lucide="search"></i></button>' +
          '</form>' +
          '<nav id="main-nav" class="main-nav" aria-label="Principal" data-i18n-aria-label="nav.label">' +
            '<ul>' + links + '</ul>' +
            '<a class="btn-create' + '' + '" href="' + pages + 'criar.html"' + '' + '>' +
              '<i data-lucide="square-pen"></i><span data-i18n="nav.create">Criar</span></a>' +
          '</nav>' +
          '<div class="header-tools">' +
            '<div class="lang-switch" role="group" aria-label="Idioma" data-i18n-aria-label="lang.label">' +
              '<button type="button" data-lang="pt" aria-pressed="true">PT</button>' +
              '<span aria-hidden="true">|</span>' +
              '<button type="button" data-lang="en" aria-pressed="false">EN</button>' +
            '</div>' +
            '<button type="button" class="icon-btn theme-toggle" aria-label="Alternar tema" data-i18n-aria-label="theme.toggle">' +
              '<i data-lucide="sun" class="icon-sun"></i><i data-lucide="moon" class="icon-moon"></i>' +
            '</button>' +
            '<button type="button" class="icon-btn menu-toggle" aria-expanded="false" aria-controls="main-nav" aria-label="Menu" data-i18n-aria-label="menu.label">' +
              '<i data-lucide="menu"></i>' +
            '</button>' +
          '</div>' +
        '</div>' +
      '</header>';
  }

  /* ---------------- Rodapé (igual ao da página inicial) ---------------- */
  function footer() {
    return '' +
      '<footer class="site-footer">' +
        '<div class="container footer-inner">' +
          '<a class="brand brand--sm" href="' + root + 'index.html" aria-label="StoryVerse — página inicial" data-i18n-aria-label="brand.home">' +
            '<img src="' + root + 'assets/logo/icone.svg" width="28" height="28" alt="">' +
            '<span class="brand-name">Story<span>Verse</span></span>' +
          '</a>' +
          '<p class="footer-copy"><span>© 2026 StoryVerse</span> · <span data-i18n="footer.tagline">Cria. Partilha. Inspira.</span></p>' +
          '<p class="footer-made"><span aria-hidden="true"><img src="' + root + 'assets/icons/angola.png" width="30px" height="30px" alt=""></span><span data-i18n="footer.made">Feito em Angola</span></p>' +
          '<p class="footer-version">V1.0</p>' +
          '<ul class="footer-links">' +
            '<li><a href="' + pages + 'sobre.html" target="_blank" rel="noopener" data-i18n="footer.about">Sobre</a></li>' +
            '<li><a href="' + pages + 'termos.html" target="_blank" rel="noopener" data-i18n="footer.terms">Termos</a></li>' +
            '<li><a href="' + pages + 'privacidade.html" target="_blank" rel="noopener" data-i18n="footer.privacy">Privacidade</a></li>' +
            '<li><a href="' + pages + 'contactos.html" target="_blank" rel="noopener" data-i18n="footer.contact">Contacto</a></li>' +
          '</ul>' +
        '</div>' +
      '</footer>';
  }

  var html = part === 'header' ? header() : part === 'footer' ? footer() : '';
  if (html) script.insertAdjacentHTML('beforebegin', html);
})();
