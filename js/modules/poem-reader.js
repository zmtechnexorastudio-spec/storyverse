/* Página de leitura de poemas (pages/poema-leitura.html?poem=ID).
   Mostra o poema com as estrofes e a opção de editar. Definições de leitura só em memória. */
(function () {
  var SV = (window.StoryVerse = window.StoryVerse || {});
  function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }

  function init() {
    var box = document.getElementById('reader');
    if (!box || !SV.story) return;
    var id = new URLSearchParams(location.search).get('poem') || '';
    var item = (window.SV_CONTENTS || []).filter(function (x) { return x.type === 'poem' && x.id === id; })[0] || null;
    var edit = document.getElementById('reader-edit'), back = document.getElementById('reader-back');
    if (back) back.href = SV.story.href('poemas.html', {});

    function render() {
      var en = SV.story.lang() === 'en';
      box.textContent = '';
      if (!item) {
        box.appendChild(el('p', 'reader-missing', en ? 'Poem not found.' : 'Poema não encontrado.'));
        if (edit) edit.hidden = true;
        return;
      }
      if (edit) edit.href = SV.story.href('modelos.html', { category: 'poems', poem: item.id });
      var head = el('header', 'reader-head poem-head');
      var meta = el('div', 'reader-meta');
      meta.appendChild(el('h1', null, SV.story.pick(item.title)));
      var tag = item.season === 'christmas' ? (en ? 'Christmas' : 'Natal') : item.season === 'newyear' ? (en ? 'New Year' : 'Ano Novo') : (en ? 'Poem' : 'Poema');
      meta.appendChild(el('p', 'reader-author', tag));
      head.appendChild(meta); box.appendChild(head);
      SV.story.pick(item.text).replace(/\r/g, '').split(/\n[ \t]*\n/).forEach(function (st) {
        if (!st.trim()) return;
        var p = el('p', 'poem-stanza');
        st.split('\n').forEach(function (line, i) { if (i) p.appendChild(document.createElement('br')); p.appendChild(document.createTextNode(line)); });
        box.appendChild(p);
      });
      if (window.lucide && window.lucide.createIcons) window.lucide.createIcons();
    }
    SV.story.bindReaderSettings(box);
    document.addEventListener('sv:languagechange', render);
    render();
  }
  document.addEventListener('DOMContentLoaded', init);
})();
