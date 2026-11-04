/* Pesquisa global (pages/pesquisa.html?q=...).
   Procura em memes, status, pensamentos, poemas e histórias, pelo título e pelo texto.
   Pesquisa parcial, sem diferenciar maiúsculas nem acentos; várias palavras = todas têm de existir. */
(function () {
  var SV = (window.StoryVerse = window.StoryVerse || {});
  function $(id) { return document.getElementById(id); }
  function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }
  function tr(key, fb) { var v = SV.language && SV.language.t ? SV.language.t(key) : key; return v === key ? (fb || key) : v; }
  function lang() { return SV.language && SV.language.get() === 'en' ? 'en' : 'pt'; }
  function pick(o) { return o ? (o[lang()] || o.pt || o.en || '') : ''; }

  /* normaliza e guarda o mapa de posições para poder destacar no texto original */
  function fold(s) {
    var out = '', map = [];
    String(s).split('').forEach(function (ch, i) {
      var base = ch.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
      for (var k = 0; k < base.length; k++) { out += base[k]; map.push(i); }
    });
    return { text: out, map: map };
  }

  var CATS = {
    meme:    { label: 'nav.memes',    fb: 'Memes',        href: function (id) { return 'modelos.html?category=memes&meme=' + id; } },
    status:  { label: 'nav.status',   fb: 'Status',       href: function (id) { return 'modelos.html?category=status&status=' + id; } },
    thought: { label: 'nav.thoughts', fb: 'Pensamentos',  href: function (id) { return 'modelos.html?category=thoughts&thought=' + id; } },
    poem:    { label: 'nav.poems',    fb: 'Poemas',       href: function (id) { return 'poema-leitura.html?poem=' + id; } },
    story:   { label: 'nav.stories',  fb: 'Histórias',    href: function (id) { return 'historia-leitura.html?story=' + id; } }
  };
  var ORDER = { story: 0, poem: 1, meme: 2, status: 3, thought: 4 };

  function bodyOf(item) {
    if (item.type === 'story') {
      return [item.author || '', pick(item.synopsis)].concat((item.chapters || []).map(function (c) { return pick(c.title) + '\n' + pick(c.text); })).join('\n');
    }
    return pick(item.text);
  }

  function search(q) {
    var words = fold(q.trim()).text.split(/\s+/).filter(Boolean);
    if (!words.length) return [];
    var res = [];
    (window.SV_CONTENTS || []).forEach(function (item) {
      var title = pick(item.title), body = bodyOf(item);
      var ft = fold(title).text, fb = fold(body).text;
      var inTitle = 0, ok = words.every(function (w) {
        var t = ft.indexOf(w) !== -1; if (t) inTitle++;
        return t || fb.indexOf(w) !== -1;
      });
      if (!ok) return;
      var score = inTitle === words.length ? 0 : inTitle ? 1 : 2, phrase = words.join(' ');
      if (words.length > 1) { if (ft.indexOf(phrase) !== -1) score = -2; else if (fb.indexOf(phrase) !== -1) score = Math.min(score, 0.5); }
      res.push({ item: item, title: title, body: body, score: score });
    });
    res.sort(function (a, b) { return a.score - b.score || ORDER[a.item.type] - ORDER[b.item.type]; });
    return res;
  }

  /* trecho à volta da primeira palavra encontrada no texto, com destaque (DOM, sem innerHTML) */
  function snippet(body, words) {
    var flat = body.replace(/\s+/g, ' ').trim();
    var f = fold(flat), pos = -1;
    words.forEach(function (w) { var p = f.text.indexOf(w); if (p !== -1 && (pos === -1 || p < pos)) pos = p; });
    var start = 0;
    if (pos > 60) { start = f.map[pos] - 50; var sp = flat.indexOf(' ', start); if (sp !== -1 && sp < f.map[pos]) start = sp + 1; }
    var piece = flat.slice(Math.max(0, start), Math.max(0, start) + 170);
    var out = el('p', 'sp-snippet');
    if (start > 0) out.appendChild(document.createTextNode('… '));
    var pf = fold(piece), marks = [];
    words.forEach(function (w) {
      var from = 0, p;
      while ((p = pf.text.indexOf(w, from)) !== -1) { marks.push([pf.map[p], pf.map[p + w.length - 1] + 1]); from = p + w.length; }
    });
    marks.sort(function (a, b) { return a[0] - b[0]; });
    var merged = [];
    marks.forEach(function (m) { var l = merged[merged.length - 1]; if (l && m[0] <= l[1]) l[1] = Math.max(l[1], m[1]); else merged.push(m.slice()); });
    var cur = 0;
    merged.forEach(function (m) {
      if (m[0] > cur) out.appendChild(document.createTextNode(piece.slice(cur, m[0])));
      out.appendChild(el('mark', null, piece.slice(m[0], m[1]))); cur = m[1];
    });
    out.appendChild(document.createTextNode(piece.slice(cur) + (start + 170 < flat.length ? ' …' : '')));
    return out;
  }

  function init() {
    var box = $('sp-results'); if (!box || !SV.story) return;
    var input = $('sp-q'), form = $('sp-form'), count = $('search-results-title'), none = $('sp-none');
    input.value = new URLSearchParams(location.search).get('q') || '';

    function render() {
      var q = input.value.trim();
      box.textContent = ''; none.hidden = true; count.textContent = '';
      if (!q) { none.hidden = false; none.textContent = tr('search.prompt', 'Escreve algo para pesquisar.'); return; }
      var words = fold(q).text.split(/\s+/).filter(Boolean);
      var list = search(q);
      if (!list.length) { none.hidden = false; none.textContent = tr('search.none', 'Não encontrámos resultados para “{q}”.').replace('{q}', q); return; }
      count.textContent = (list.length === 1 ? tr('search.countOne', '1 resultado para “{q}”') : tr('search.count', '{n} resultados para “{q}”').replace('{n}', String(list.length))).replace('{q}', q);
      list.forEach(function (r) {
        var cat = CATS[r.item.type]; if (!cat) return;
        var a = document.createElement('a'); a.className = 'sp-item';
        a.href = SV.story.href(cat.href(encodeURIComponent(r.item.id)).split('?')[0], (function () {
          var o = {}; new URLSearchParams(cat.href(encodeURIComponent(r.item.id)).split('?')[1]).forEach(function (v, k) { o[k] = v; }); return o; })());
        if (r.item.type === 'story' && r.item.cover) {
          var th = el('span', 'sp-thumb'); var im = document.createElement('img'); im.src = SV.story.coverSrc(r.item.cover); im.alt = ''; im.loading = 'lazy'; th.appendChild(im); a.appendChild(th);
        }
        var body = el('div', 'sp-body');
        body.appendChild(el('span', 'sp-cat', tr(cat.label, cat.fb)));
        body.appendChild(el('h3', 'sp-title', r.title));
        body.appendChild(snippet(r.body, words));
        a.appendChild(body);
        a.appendChild(el('span', 'sp-go', (r.item.type === 'story' || r.item.type === 'poem') ? tr('search.read', 'Ler') : tr('search.open', 'Abrir')));
        box.appendChild(a);
      });
    }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var u = new URL(location.href); if (input.value.trim()) u.searchParams.set('q', input.value.trim()); else u.searchParams.delete('q');
      try { history.replaceState(null, '', u); } catch (x) {}
      render();
    });
    input.addEventListener('input', render);
    document.addEventListener('sv:languagechange', render);
    render();
  }
  document.addEventListener('DOMContentLoaded', init);
})();
