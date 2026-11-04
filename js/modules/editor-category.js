/* Um só editor visual para Memes, Status e Pensamentos.
   Os três usam exatamente os mesmos controlos (cores, gradientes, fundos, texturas, formas,
   ícones, ilustrações, imagem própria, alinhamento, exportação). Este ficheiro só ajusta o que
   muda de uma categoria para outra: os 8 modelos, os textos de apoio e o texto inicial.
   Corre logo que carrega (antes do resto) para que o resto do editor já encontre tudo pronto. */
(function () {
  var SV = (window.StoryVerse = window.StoryVerse || {});
  var q = new URLSearchParams(location.search);

  var CATEGORIES = {
    memes: {
      type: 'meme', param: 'meme', suffix: '',
      word: ['MEME', 'MEME'],
      defaults: ['Eu a dizer que vou dormir cedo…\nTambém eu às 02:00 a ver mais um vídeo.', 'Me saying I will go to bed early…\nAlso me at 2 AM watching one more video.'],
      aria: ['Pré-visualização do meme', 'Meme preview']
    },
    status: {
      type: 'status', param: 'status', suffix: '.status',
      word: ['STATUS', 'STATUS'],
      defaults: ['Nem tudo o que perdemos era para ficar.', 'Not everything we lose was meant to stay.'],
      aria: ['Pré-visualização do status', 'Status preview']
    },
    poems: {
      type: 'poem', param: 'poem', suffix: '.poems',
      word: ['POEMA', 'POEM'],
      defaults: ['', ''],
      aria: ['Pré-visualização do poema', 'Poem preview']
    },
    thoughts: {
      type: 'thought', param: 'thought', suffix: '.thoughts',
      word: ['PENSAMENTO', 'THOUGHT'],
      defaults: ['Às vezes, o silêncio diz tudo o que as palavras não conseguem.', 'Sometimes silence says everything words cannot.'],
      aria: ['Pré-visualização do pensamento', 'Thought preview']
    }
  };

  var key = q.get('category');
  if (!CATEGORIES[key]) {
    var tid = q.get('template') || '';
    key = /^status/.test(tid) ? 'status' : /^thought/.test(tid) ? 'thoughts' : /^poem/.test(tid) ? 'poems' : 'memes';
  }
  var cat = CATEGORIES[key];
  cat.key = key;
  SV.editorCategory = cat;

  function $(id) { return document.getElementById(id); }
  function setKey(el, k) { if (el) el.setAttribute('data-i18n', k); }

  /* 1) Os 8 modelos da categoria */
  var select = $('template-choice');
  var catalog = (window.SV_TEMPLATE_CATALOG || []).filter(function (t) { return t.type === cat.type; });
  if (select && catalog.length) {
    select.innerHTML = '';
    catalog.forEach(function (t, i) {
      var o = document.createElement('option');
      var num = String(i + 1).padStart(2, '0');
      o.value = t.id;
      o.dataset.number = num;
      o.dataset.visualNamePt = t.name;
      o.dataset.visualNameEn = t.nameEn || t.name;
      o.dataset.descPt = t.descPt || '';
      o.dataset.descEn = t.descEn || '';
      o.textContent = num + ' · ' + t.name;
      select.appendChild(o);
    });
  }

  /* 2) Textos de apoio específicos da categoria (continuam traduzíveis) */
  if (cat.suffix) {
    setKey($('controls-title'), 'editor.controls' + cat.suffix);
    setKey(document.querySelector('label[for="meme-text"]'), 'editor.text' + cat.suffix);
    setKey(document.querySelector('label[for="show-meme-label"] span'), 'editor.showLabel' + cat.suffix);
  }
  var sub = document.querySelector('.editor-intro > p:last-child');
  if (sub) { sub.removeAttribute('data-i18n'); sub.id = 'editor-subtitle'; }

  /* 3) Texto inicial */
  var input = $('meme-text');
  var en = !!(SV.language && SV.language.get() === 'en') || /[?&]lang=en/.test(location.search);
  if (input && key !== 'poems' && !q.get(cat.param)) input.value = cat.defaults[en ? 1 : 0];

  var canvas = $('meme-canvas');
  if (canvas) canvas.setAttribute('aria-label', cat.aria[en ? 1 : 0]);

  /* 4) Ligações do fim da exportação (outro estilo → categorias → início) */
  var styles = document.querySelector('#export-next a[href^="modelos.html"]');
  if (styles) styles.setAttribute('href', 'modelos.html?category=' + key);

  /* 5) Quem abre esta página sem escolher modelo volta ao ecrã dos modelos */
  SV.editorCategory.stylesUrl = 'modelos.html?category=' + key;

  /* Métricas: abertura do editor (ação observável) */
  setTimeout(function () { if (SV.track) SV.track('editor_open', { type: key }); }, 0);
})();
