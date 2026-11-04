/* Biblioteca de histórias (pages/historias.html): cartões com capa, pesquisa e ações. */
(function () {
  var SV = (window.StoryVerse = window.StoryVerse || {});

  function norm(s) {
    s = String(s || '').toLocaleLowerCase();
    return s.normalize ? s.normalize('NFD').replace(/[̀-ͯ]/g, '') : s;
  }
  function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }

  function init() {
    var grid = document.getElementById('stories-grid');
    var search = document.getElementById('stories-search');
    var empty = document.getElementById('stories-empty');
    var none = document.getElementById('stories-none');
    var create = document.getElementById('stories-create');
    if (!grid || !SV.story) return;
    var all = SV.story.all();

    function fullText(item) {
      return SV.story.pick(item.title) + ' ' + (item.author || '') + ' ' + SV.story.pick(item.synopsis) + ' ' +
        (item.chapters || []).map(function (c) { return SV.story.pick(c.title) + ' ' + SV.story.pick(c.text); }).join(' ');
    }
    function excerpt(item) {
      var syn = SV.story.pick(item.synopsis);
      if (syn) return syn;
      var first = item.chapters && item.chapters[0];
      return first ? SV.story.paragraphs(SV.story.pick(first.text))[0] || '' : '';
    }

    function render() {
      var en = SV.story.lang() === 'en';
      var q = norm(search && search.value).trim();
      grid.textContent = '';
      var list = all.filter(function (item) { if (!q) return true; var hay = norm(fullText(item)); return q.split(/\s+/).every(function (w) { return hay.indexOf(w) !== -1; }); });
      list.forEach(function (item) {
        var card = el('article', 'story-card');
        var cover = el('div', 'story-cover');
        var src = SV.story.coverSrc(item.cover);
        if (src) { var img = document.createElement('img'); img.src = src; img.alt = ''; img.loading = 'lazy'; cover.appendChild(img); }
        cover.appendChild(el('span', 'story-cover-brand', 'STORYVERSE'));
        cover.appendChild(el('span', 'story-cover-title', SV.story.pick(item.title)));
        var body = el('div', 'story-card-body');
        body.appendChild(el('h3', null, SV.story.pick(item.title)));
        if (item.author) body.appendChild(el('p', 'story-author', (en ? 'by ' : 'por ') + item.author));
        body.appendChild(el('p', 'story-excerpt', excerpt(item)));
        var actions = el('div', 'meme-card-actions');
        var read = document.createElement('a');
        read.href = SV.story.href('historia-leitura.html', { story: item.id });
        read.appendChild(el('span', null, en ? 'Read' : 'Ler'));
        var i = document.createElement('i'); i.setAttribute('data-lucide', 'book-open'); read.appendChild(i);
        var edit = document.createElement('a');
        edit.className = 'story-edit';
        edit.href = SV.story.href('editor-historia.html', { story: item.id });
        edit.appendChild(el('span', null, en ? 'Customize' : 'Personalizar'));
        actions.append(edit, read);
        body.appendChild(actions);
        card.append(cover, body);
        grid.appendChild(card);
      });
      if (empty) empty.hidden = !(all.length && !list.length);
      if (none) none.hidden = all.length !== 0;
      if (create) create.href = SV.story.href('editor-historia.html', {});
      if (window.lucide && window.lucide.createIcons) window.lucide.createIcons();
    }
    if (search) search.addEventListener('input', render);
    document.addEventListener('sv:languagechange', render);
    render();
  }
  document.addEventListener('DOMContentLoaded', init);
})();
