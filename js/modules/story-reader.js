/* Página de leitura (pages/historia-leitura.html).
   Definições de leitura (tamanho, espaço entre linhas, tipo de letra e tema) ficam só em memória. */
(function () {
  var SV = (window.StoryVerse = window.StoryVerse || {});
  function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }

  function init() {
    var box = document.getElementById('reader');
    if (!box || !SV.story) return;
    var id = new URLSearchParams(location.search).get('story') || '';
    var item = SV.story.byId(id);
    var edit = document.getElementById('reader-edit');
    var back = document.getElementById('reader-back');
    if (back) back.href = SV.story.href('historias.html', {});

    function render() {
      var en = SV.story.lang() === 'en';
      box.textContent = '';
      if (!item) {
        box.appendChild(el('p', 'reader-missing', en ? 'Story not found.' : 'História não encontrada.'));
        if (edit) edit.hidden = true;
        return;
      }
      if (edit) edit.href = SV.story.href('editor-historia.html', { story: item.id });
      var head = el('header', 'reader-head');
      var src = SV.story.coverSrc(item.cover);
      if (src) { var img = document.createElement('img'); img.className = 'reader-cover'; img.src = src; img.alt = ''; head.appendChild(img); }
      var meta = el('div', 'reader-meta');
      meta.appendChild(el('h1', null, SV.story.pick(item.title)));
      if (item.author) meta.appendChild(el('p', 'reader-author', (en ? 'by ' : 'por ') + item.author));
      var syn = SV.story.pick(item.synopsis);
      if (syn) meta.appendChild(el('p', 'reader-synopsis', syn));
      head.appendChild(meta);
      box.appendChild(head);

      var chapters = item.chapters || [];
      if (chapters.length > 1) {
        var toc = el('nav', 'reader-toc');
        toc.setAttribute('aria-label', en ? 'Chapters' : 'Capítulos');
        toc.appendChild(el('strong', null, en ? 'Chapters' : 'Capítulos'));
        var ol = el('ol');
        chapters.forEach(function (c, i) {
          var li = el('li'); var a = document.createElement('a'); a.href = '#cap-' + (i + 1); a.textContent = SV.story.pick(c.title) || ((en ? 'Chapter ' : 'Capítulo ') + (i + 1));
          li.appendChild(a); ol.appendChild(li);
        });
        toc.appendChild(ol); box.appendChild(toc);
      }
      chapters.forEach(function (c, i) {
        var sec = el('section', 'reader-chapter'); sec.id = 'cap-' + (i + 1);
        var ct = SV.story.pick(c.title);
        if (ct || item.chapters.length > 1) sec.appendChild(el('h2', null, ct || ((en ? 'Chapter ' : 'Capítulo ') + (i + 1))));
        SV.story.paragraphs(SV.story.pick(c.text)).forEach(function (p) { sec.appendChild(el('p', null, p)); });
        box.appendChild(sec);
      });
      if (window.lucide && window.lucide.createIcons) window.lucide.createIcons();
    }

    SV.story.bindReaderSettings(box);

    document.addEventListener('sv:languagechange', render);
    render();
  }
  document.addEventListener('DOMContentLoaded', init);
})();
