/* Funções comuns das histórias (biblioteca, leitura e editor).
   Modelo de uma história em contents.js:
     { id, type:"story", title:{pt,en}, author, cover:"cover-01", season, synopsis:{pt,en},
       chapters:[ { title:{pt,en}, text:{pt,en} } ], templateId }
   O texto de cada capítulo é texto simples: uma linha em branco separa os parágrafos. */
(function () {
  var SV = (window.StoryVerse = window.StoryVerse || {});

  function lang() { return SV.language && SV.language.get() === 'en' ? 'en' : 'pt'; }
  function pick(obj) { return obj ? (obj[lang()] || obj.pt || obj.en || '') : ''; }

  function all() { return (window.SV_CONTENTS || []).filter(function (x) { return x.type === 'story'; }); }
  function byId(id) { return all().filter(function (x) { return x.id === id; })[0] || null; }

  function coverSrc(id, base) {
    if (!id) return '';
    return (base || '../') + 'assets/covers/' + id + (/\.(jpe?g|png|webp)$/i.test(id) ? '' : '.svg');
  }

  function paragraphs(text) {
    return String(text || '').replace(/\r/g, '').split(/\n\s*\n/).map(function (p) { return p.replace(/\s+$/, '').replace(/^\s+/, ''); }).filter(Boolean);
  }

  /* Texto simples -> HTML seguro (parágrafos). Nunca usa innerHTML com texto não tratado. */
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function textToHtml(text) {
    return paragraphs(text).map(function (p) { return '<p>' + esc(p).replace(/\n/g, '<br>') + '</p>'; }).join('');
  }

  /* Limpa o HTML escrito no editor: só permite formatação simples. */
  var ALLOWED = { P: 1, BR: 1, B: 1, STRONG: 1, I: 1, EM: 1, U: 1, UL: 1, OL: 1, LI: 1, DIV: 1, SPAN: 1 };
  function sanitize(html) {
    var doc = new DOMParser().parseFromString('<body>' + String(html || '') + '</body>', 'text/html');
    var out = document.createElement('div');
    function align(node) {
      var cm = /(?:^|\s)ta-(center|right|justify)(?:\s|$)/.exec(node.getAttribute('class') || '');
      var a = (node.style && node.style.textAlign) || node.getAttribute('align') || (cm ? cm[1] : '');
      return /^(left|center|right|justify)$/.test(a) ? a : '';
    }
    function walk(src, dst) {
      Array.prototype.forEach.call(src.childNodes, function (n) {
        if (n.nodeType === 3) { dst.appendChild(document.createTextNode(n.nodeValue)); return; }
        if (n.nodeType !== 1) return;
        var tag = n.tagName;
        if (!ALLOWED[tag]) { walk(n, dst); return; }
        var map = { STRONG: 'b', EM: 'i', DIV: 'p', SPAN: null };
        var name = tag in map ? map[tag] : tag.toLowerCase();
        if (name === null) {
          // <span style="font-weight:bold"> etc. que alguns navegadores criam
          var st = n.style || {}, inner = dst;
          if (st.fontWeight === 'bold' || parseInt(st.fontWeight, 10) >= 600) { var b = document.createElement('b'); inner.appendChild(b); inner = b; }
          if (st.fontStyle === 'italic') { var i = document.createElement('i'); inner.appendChild(i); inner = i; }
          if ((st.textDecoration || '').indexOf('underline') !== -1) { var u = document.createElement('u'); inner.appendChild(u); inner = u; }
          walk(n, inner); return;
        }
        var el = document.createElement(name);
        var al = (name === 'p' || name === 'li' || name === 'ul' || name === 'ol') ? align(n) : '';
        if (al && al !== 'left') el.className = 'ta-' + al;
        walk(n, el);
        dst.appendChild(el);
      });
    }
    walk(doc.body, out);
    // texto solto no topo -> parágrafo
    var res = document.createElement('div'), loose = null;
    Array.prototype.forEach.call(out.childNodes, function (n) {
      var block = n.nodeType === 1 && /^(P|UL|OL)$/.test(n.tagName);
      if (block) { loose = null; res.appendChild(n.cloneNode(true)); }
      else if (n.nodeType === 3 && !n.nodeValue.trim() && !loose) { /* ignora espaços entre blocos */ }
      else { if (!loose) { loose = document.createElement('p'); res.appendChild(loose); } loose.appendChild(n.cloneNode(true)); }
    });
    return res.innerHTML;
  }

  function hrefWithParams(page, params) {
    var q = new URLSearchParams();
    Object.keys(params || {}).forEach(function (k) { if (params[k]) q.set(k, params[k]); });
    var cur = new URLSearchParams(location.search);
    ['lang', 'theme'].forEach(function (k) { if (cur.get(k) && !q.get(k)) q.set(k, cur.get(k)); });
    var s = q.toString();
    return page + (s ? '?' + s : '');
  }

  /* Definições de leitura (tamanho, espaço entre linhas, letra, tema): só em memória */
  function bindReaderSettings(box) {
    var panel = document.getElementById('reader-settings');
    var toggle = document.getElementById('reader-settings-toggle');
    if (toggle && panel) toggle.addEventListener('click', function () {
      panel.hidden = !panel.hidden; toggle.setAttribute('aria-expanded', String(!panel.hidden));
    });
    var size = document.getElementById('rs-size'), sizeOut = document.getElementById('rs-size-out');
    var lh = document.getElementById('rs-lh'), lhOut = document.getElementById('rs-lh-out');
    function applyType() {
      box.style.setProperty('--reader-size', size.value + 'px'); sizeOut.textContent = size.value;
      box.style.setProperty('--reader-lh', lh.value); lhOut.textContent = lh.value;
    }
    size.addEventListener('input', applyType); lh.addEventListener('input', applyType); applyType();
    function seg(attr, prefix, all) {
      document.querySelectorAll('[' + attr + ']').forEach(function (b) {
        b.addEventListener('click', function () {
          var val = b.getAttribute(attr);
          all.forEach(function (v) { box.classList.remove(prefix + v); });
          box.classList.add(prefix + val);
          document.querySelectorAll('[' + attr + ']').forEach(function (o) { var on = o === b; o.classList.toggle('is-selected', on); o.setAttribute('aria-pressed', String(on)); });
        });
      });
    }
    seg('data-font', 'font-', ['serif', 'sans']);
    seg('data-theme-r', 'theme-', ['light', 'dark', 'sepia']);

  }

  SV.story = {
    lang: lang, pick: pick, all: all, byId: byId, coverSrc: coverSrc,
    paragraphs: paragraphs, bindReaderSettings: bindReaderSettings, textToHtml: textToHtml, sanitize: sanitize, href: hrefWithParams
  };
})();
