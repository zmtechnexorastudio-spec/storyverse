/* Editor textual de histórias (pages/editor-historia.html).
   - Título, subtítulo, autor, ano, sinopse, personagens e capa (opcionais).
   - Capítulos: adicionar, editar, apagar e reordenar (subir/descer).
   - Formatação: negrito, itálico, sublinhado, listas e alinhamento (sobre o capítulo ativo).
   - Apresentação: tipo de letra, tamanho, espaço entre linhas e tema (claro, escuro, sépia).
   - Exportação em PDF com várias páginas (capa + capítulos). Partilha quando o dispositivo suporta.
   - A história da biblioteca é copiada: o original (contents.js) nunca é alterado.
   - Nada é guardado automaticamente. */
(function () {
  var SV = (window.StoryVerse = window.StoryVerse || {});
  function $(id) { return document.getElementById(id); }
  function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }
  function isEn() { return !!(SV.language && SV.language.get() === 'en'); }
  function tr(key, fb) { var v = SV.language && SV.language.t ? SV.language.t(key) : key; return v === key ? (fb || key) : v; }

  var state = {
    title: '', subtitle: '', author: '', year: '', synopsis: '', characters: '', cover: '',
    chapters: [{ title: '', html: '' }], coverData: '',
    font: 'serif', size: 15, lh: 1.7, theme: 'light'
  };
  var dirty = false, loaded = null, activeEditor = null;

  /* ------------------------------------------------------------------ */
  /* Dados                                                               */
  /* ------------------------------------------------------------------ */
  function loadFromLibrary() {
    if (!loaded) return;
    var P = SV.story.pick;
    state.title = P(loaded.title);
    state.author = loaded.author || '';
    state.cover = loaded.cover || '';
    state.synopsis = P(loaded.synopsis);
    state.chapters = (loaded.chapters || []).map(function (c) {
      return { title: P(c.title), html: SV.story.textToHtml(P(c.text)) };
    });
    if (!state.chapters.length) state.chapters = [{ title: '', html: '' }];
  }

  function chapterName(i) {
    var t = (state.chapters[i].title || '').trim();
    return t || (tr('st.chapter', 'Capítulo') + ' ' + (i + 1));
  }
  function showHeading(i) { return state.chapters.length > 1 || (state.chapters[i].title || '').trim() !== ''; }
  function hasContent() {
    return state.chapters.some(function (c) { return SV.story.sanitize(c.html).replace(/<[^>]*>/g, '').trim() !== ''; });
  }

  /* ------------------------------------------------------------------ */
  /* Documento (usado na pré-visualização e na exportação)               */
  /* ------------------------------------------------------------------ */
  function appendHtml(target, html) { target.insertAdjacentHTML('beforeend', SV.story.sanitize(html)); }

  function buildDocument(target) {
    target.textContent = '';
    var head = el('header', 'reader-head');
    var src = state.coverData || SV.story.coverSrc(state.cover);
    if (src) { var img = document.createElement('img'); img.className = 'reader-cover'; img.src = src; img.alt = ''; head.appendChild(img); }
    var meta = el('div', 'reader-meta');
    meta.appendChild(el('h1', null, state.title.trim() || tr('st.untitled', 'História sem título')));
    if (state.subtitle.trim()) meta.appendChild(el('p', 'reader-subtitle', state.subtitle.trim()));
    var by = [state.author.trim() ? (isEn() ? 'by ' : 'por ') + state.author.trim() : '', state.year.trim()].filter(Boolean).join(' · ');
    if (by) meta.appendChild(el('p', 'reader-author', by));
    if (state.synopsis.trim()) meta.appendChild(el('p', 'reader-synopsis', state.synopsis.trim()));
    var chars = state.characters.split(',').map(function (s) { return s.trim(); }).filter(Boolean);
    if (chars.length) {
      var cp = el('p', 'reader-characters');
      cp.appendChild(el('strong', null, (isEn() ? 'Characters: ' : 'Personagens: ')));
      cp.appendChild(document.createTextNode(chars.join(', ')));
      meta.appendChild(cp);
    }
    head.appendChild(meta); target.appendChild(head);
    state.chapters.forEach(function (c, i) {
      var sec = el('section', 'reader-chapter');
      if (showHeading(i)) sec.appendChild(el('h2', null, chapterName(i)));
      appendHtml(sec, c.html);
      target.appendChild(sec);
    });
  }

  function applyLook(node) {
    node.classList.remove('font-serif', 'font-sans', 'theme-light', 'theme-dark', 'theme-sepia');
    node.classList.add('font-' + state.font, 'theme-' + state.theme);
    node.style.setProperty('--reader-size', state.size + 'px');
    node.style.setProperty('--reader-lh', String(state.lh));
  }

  var previewBox;
  function renderPreview() {
    buildDocument(previewBox);
    applyLook(previewBox);
  }
  function touch() { dirty = true; renderPreview(); }

  /* ------------------------------------------------------------------ */
  /* Capítulos                                                           */
  /* ------------------------------------------------------------------ */
  function icon(name) { var i = document.createElement('i'); i.setAttribute('data-lucide', name); return i; }
  function iconButton(name, label, onClick, disabled, danger) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'poem-icon-btn' + (danger ? ' is-danger' : '');
    b.title = label; b.setAttribute('aria-label', label); b.disabled = !!disabled;
    b.appendChild(icon(name)); b.addEventListener('click', onClick); return b;
  }
  function swap(a, b) { var t = state.chapters[a]; state.chapters[a] = state.chapters[b]; state.chapters[b] = t; }

  function renderChapters() {
    var box = $('st-chapters');
    box.textContent = '';
    activeEditor = null;
    state.chapters.forEach(function (ch, i) {
      var card = el('div', 'poem-stanza-card st-chapter-card');
      var head = el('div', 'poem-stanza-head');
      head.appendChild(el('strong', null, tr('st.chapter', 'Capítulo') + ' ' + (i + 1)));
      var tools = el('div', 'poem-tools');
      tools.appendChild(iconButton('arrow-up', tr('poem.moveUp', 'Subir'), function () { swap(i, i - 1); dirty = true; renderChapters(); renderPreview(); }, i === 0));
      tools.appendChild(iconButton('arrow-down', tr('poem.moveDown', 'Descer'), function () { swap(i, i + 1); dirty = true; renderChapters(); renderPreview(); }, i === state.chapters.length - 1));
      tools.appendChild(iconButton('trash-2', tr('st.deleteChapter', 'Apagar capítulo'), function () {
        state.chapters.splice(i, 1); if (!state.chapters.length) state.chapters.push({ title: '', html: '' });
        dirty = true; renderChapters(); renderPreview();
      }, false, true));
      head.appendChild(tools); card.appendChild(head);

      var t = document.createElement('input');
      t.type = 'text'; t.className = 'poem-input'; t.maxLength = 120; t.value = ch.title;
      t.placeholder = tr('st.chapterTitle', 'Título do capítulo');
      t.setAttribute('aria-label', tr('st.chapterTitle', 'Título do capítulo') + ' ' + (i + 1));
      t.addEventListener('input', function () { ch.title = t.value; touch(); });
      card.appendChild(t);

      var ed = document.createElement('div');
      ed.className = 'st-editable'; ed.contentEditable = 'true'; ed.spellcheck = true;
      ed.setAttribute('role', 'textbox'); ed.setAttribute('aria-multiline', 'true');
      ed.setAttribute('aria-label', tr('st.chapterText', 'Texto do capítulo') + ' ' + (i + 1));
      ed.setAttribute('data-placeholder', tr('st.textPh', 'Escreve aqui o texto do capítulo…'));
      ed.innerHTML = SV.story.sanitize(ch.html);               // já limpo
      ed.addEventListener('focus', function () { activeEditor = ed; });
      ed.addEventListener('input', function () { ch.html = SV.story.sanitize(ed.innerHTML); touch(); });
      ed.addEventListener('paste', function (e) {               // cola sempre como texto simples
        e.preventDefault();
        var text = (e.clipboardData || window.clipboardData).getData('text');
        document.execCommand('insertText', false, text);
      });
      card.appendChild(ed);
      box.appendChild(card);
    });
    if (window.lucide && window.lucide.createIcons) window.lucide.createIcons();
  }

  /* ------------------------------------------------------------------ */
  /* Exportação PDF (várias páginas)                                     */
  /* ------------------------------------------------------------------ */
  var PW = 794, PH = 1123, PAD = 72;

  function say(text, isError) {
    var s = $('st-status'); if (!s) return;
    s.textContent = text; s.classList.toggle('is-error', !!isError);
  }
  function setBusy(b) { ['st-export-pdf', 'st-share'].forEach(function (id) { var n = $(id); if (n) n.disabled = b; }); }

  function coverDataUrl(id) {
    if (state.coverData) return Promise.resolve(state.coverData);
    if (!id) return Promise.resolve('');
    if (/\.(jpe?g|png|webp)$/i.test(id)) {     // foto de capa guardada em assets/covers
      return fetch(SV.story.coverSrc(id)).then(function (r) { return r.blob(); }).then(function (bl) {
        return new Promise(function (ok) { var fr = new FileReader(); fr.onload = function () { ok(fr.result); }; fr.onerror = function () { ok(''); }; fr.readAsDataURL(bl); });
      }).catch(function () { return ''; });
    }
    var key = 'assets/covers/' + id + '.svg';
    var emb = window.SV_EMBEDDED_SVGS && window.SV_EMBEDDED_SVGS[key];
    if (emb) return Promise.resolve('data:image/svg+xml;charset=utf-8,' + encodeURIComponent(emb));
    return fetch(SV.story.coverSrc(id)).then(function (r) { return r.text(); })
      .then(function (t) { return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(t); })
      .catch(function () { return ''; });
  }

  function newPage(withNumber) {
    var page = el('div', 'pdf-page reader');
    applyLook(page);
    page.style.width = PW + 'px'; page.style.height = PH + 'px'; page.style.padding = PAD + 'px';
    var body = el('div', 'pdf-body'); body.style.height = (PH - PAD * 2) + 'px';
    page.appendChild(body);
    page._body = body; page._numbered = !!withNumber;
    return page;
  }
  function fits(page) { return page._body.scrollHeight <= page._body.clientHeight + 1; }

  /* Divide um bloco de HTML sanitizado em unidades que não se partem (parágrafos e itens de lista) */
  function unitsFromHtml(html) {
    var tmp = el('div'); tmp.innerHTML = SV.story.sanitize(html);
    var units = [];
    Array.prototype.forEach.call(tmp.children, function (n) {
      if (n.tagName === 'UL' || n.tagName === 'OL') {
        var start = 1;
        Array.prototype.forEach.call(n.children, function (li) {
          var w = document.createElement(n.tagName.toLowerCase());
          w.className = n.className; if (n.tagName === 'OL') w.setAttribute('start', String(start));
          w.appendChild(li.cloneNode(true)); units.push(w); start++;
        });
      } else units.push(n.cloneNode(true));
    });
    return units;
  }

  /* Parágrafo maior do que uma página: parte por palavras */
  function splitByWords(unit, page) {
    var words = unit.textContent.split(/\s+/).filter(Boolean), pieces = [], rest = words;
    while (rest.length) {
      var lo = 1, hi = rest.length, best = 1;
      while (lo <= hi) {
        var mid = (lo + hi) >> 1, p = el(unit.tagName.toLowerCase(), unit.className, rest.slice(0, mid).join(' '));
        page._body.appendChild(p); var ok = fits(page); p.remove();
        if (ok) { best = mid; lo = mid + 1; } else hi = mid - 1;
      }
      var piece = el(unit.tagName.toLowerCase(), unit.className, rest.slice(0, best).join(' '));
      pieces.push(piece); rest = rest.slice(best);
    }
    return pieces;
  }

  function buildPages(host) {
    var pages = [];
    var cur = null;
    function start() { cur = newPage(true); host.appendChild(cur); pages.push(cur); }
    function place(node, keepWithPrev) {
      cur._body.appendChild(node);
      if (fits(cur)) return;
      cur._body.removeChild(node);
      var last = cur._body.lastElementChild, carry = null;
      if (last && last.classList.contains('pdf-h') && cur._body.children.length > 1) { carry = last; cur._body.removeChild(last); }
      else if (!cur._body.children.length) {                     // sozinho já não cabe
        var pieces = node.tagName === 'P' ? splitByWords(node, cur) : [node];
        pieces.forEach(function (p, i) { if (i) start(); cur._body.appendChild(p); });
        return;
      }
      start();
      if (carry) cur._body.appendChild(carry);
      cur._body.appendChild(node);
      if (!fits(cur) && node.tagName === 'P') {                  // continua demasiado grande
        cur._body.removeChild(node);
        splitByWords(node, cur).forEach(function (p, i) { if (i) start(); cur._body.appendChild(p); });
      }
    }

    start();
    var syn = state.synopsis.trim();
    if (syn) {
      var h = el('h2', 'pdf-h', isEn() ? 'Synopsis' : 'Sinopse'); place(h);
      place(el('p', null, syn));
    }
    var chars = state.characters.split(',').map(function (s) { return s.trim(); }).filter(Boolean);
    if (chars.length) { place(el('h2', 'pdf-h', isEn() ? 'Characters' : 'Personagens')); place(el('p', null, chars.join(', '))); }

    state.chapters.forEach(function (c, i) {
      var empty = !SV.story.sanitize(c.html).replace(/<[^>]*>/g, '').trim() && !(c.title || '').trim();
      if (empty) return;
      if (cur._body.children.length) start();                    // cada capítulo começa numa página nova
      if (showHeading(i)) place(el('h2', 'pdf-h pdf-ch', chapterName(i)));
      unitsFromHtml(c.html).forEach(function (u) { place(u); });
    });
    return pages;
  }

  async function coverPage(url) {
    var page = el('div', 'pdf-page pdf-cover reader');
    applyLook(page);
    page.style.width = PW + 'px'; page.style.height = PH + 'px';
    if (url) { var img = document.createElement('img'); img.className = 'pdf-cover-img'; img.src = url; img.alt = ''; page.appendChild(img); }
    var band = el('div', 'pdf-cover-band');
    band.appendChild(el('h1', null, state.title.trim() || tr('st.untitled', 'História sem título')));
    if (state.subtitle.trim()) band.appendChild(el('p', 'pdf-cover-sub', state.subtitle.trim()));
    var by = [state.author.trim() ? (isEn() ? 'by ' : 'por ') + state.author.trim() : '', state.year.trim()].filter(Boolean).join(' · ');
    if (by) band.appendChild(el('p', 'pdf-cover-by', by));
    page.appendChild(band);
    return page;
  }

  async function renderPdf() {
    if (!window.jspdf || !window.jspdf.jsPDF) { var e = new Error('nopdf'); e.code = 'nopdf'; throw e; }
    if (typeof window.html2canvas !== 'function') { var e2 = new Error('noh2c'); e2.code = 'noh2c'; throw e2; }
    if (!hasContent()) { var e3 = new Error('empty'); e3.code = 'empty'; throw e3; }
    var host = el('div', 'pdf-host'); host.setAttribute('aria-hidden', 'true');
    document.body.appendChild(host);
    try {
      if (document.fonts && document.fonts.ready) await document.fonts.ready;
      var url = await coverDataUrl(state.cover);
      var cover = await coverPage(url); host.appendChild(cover);
      var pages = buildPages(host);
      var all = [cover].concat(pages);
      pages.forEach(function (p, i) { if (p._numbered) p.appendChild(el('span', 'pdf-pageno', String(i + 2))); });
      var pdf = new window.jspdf.jsPDF({ orientation: 'portrait', unit: 'px', format: [PW, PH], compress: true });
      for (var i = 0; i < all.length; i++) {
        var canvas = await window.html2canvas(all[i], { scale: 1.6, width: PW, height: PH, useCORS: true, allowTaint: false, logging: false, backgroundColor: '#ffffff' });
        if (i) pdf.addPage([PW, PH], 'portrait');
        pdf.addImage(canvas.toDataURL('image/jpeg', 0.9), 'JPEG', 0, 0, PW, PH);
      }
      return pdf;
    } finally { host.remove(); }
  }

  function fileName() {
    var slug = (state.title || 'historia').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40);
    return 'storyverse-historia' + (slug && slug !== 'historia' ? '-' + slug : '') + '.pdf';
  }

  function failMessage(err) {
    if (err && err.code === 'nopdf') return tr('poem.noPdf');
    if (err && err.code === 'empty') return tr('st.needText', 'Escreve pelo menos um capítulo antes de exportar.');
    return tr('poem.exportFail');
  }

  async function exportPdf() {
    setBusy(true); say(tr('poem.preparing', 'A preparar a exportação…'), false);
    try {
      var pdf = await renderPdf();
      pdf.save(fileName());
      say(tr('poem.exportOk'), false); if (SV.showNextSteps) SV.showNextSteps();
      if (SV.track) SV.track('content_export', { format: 'pdf', template: 'story' });
    } catch (err) {
      console.error('StoryVerse story export:', err);
      say(failMessage(err), true);
    } finally { setBusy(false); }
  }

  async function sharePdf() {
    setBusy(true); say(tr('poem.preparing', 'A preparar a exportação…'), false);
    try {
      var pdf = await renderPdf();
      var blob = pdf.output('blob');
      var file = new File([blob], fileName(), { type: 'application/pdf' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: state.title || 'StoryVerse' });
        say(tr('poem.shareOpened'), false);      // só diz que a janela abriu
      } else { pdf.save(fileName()); say(tr('poem.exportOk'), false); if (SV.showNextSteps) SV.showNextSteps(); }
    } catch (err) {
      if (err && err.name === 'AbortError') say('', false);
      else { console.error('StoryVerse story share:', err); say(failMessage(err), true); }
    } finally { setBusy(false); }
  }

  /* ------------------------------------------------------------------ */
  /* Arranque                                                            */
  /* ------------------------------------------------------------------ */
  function init() {
    previewBox = $('st-preview');
    if (!previewBox || !SV.story) return;
    loaded = SV.story.byId(new URLSearchParams(location.search).get('story') || '');
    loadFromLibrary();

    function bind(id, key) {
      var n = $(id); n.value = state[key];
      n.addEventListener('input', function () { state[key] = n.value; touch(); });
    }
    function syncFields() { ['title', 'subtitle', 'author', 'year', 'synopsis', 'characters'].forEach(function (k) { $('st-' + k).value = state[k]; }); }
    ['title', 'subtitle', 'author', 'year', 'synopsis', 'characters'].forEach(function (k) { bind('st-' + k, k); });

    var uploadBtn = null;
    function syncCover() {
      document.querySelectorAll('.cover-opt').forEach(function (b) {
        var on = b === uploadBtn ? !!state.coverData : (!state.coverData && (b.dataset.cover || '') === state.cover);
        b.classList.toggle('is-selected', on); b.setAttribute('aria-pressed', String(on));
      });
    }
    document.querySelectorAll('.cover-opt').forEach(function (b) {
      b.addEventListener('click', function () {
        if (b === uploadBtn) return;
        state.cover = b.dataset.cover || ''; state.coverData = ''; syncCover(); touch();
      });
    });

    /* Capa da galeria do dispositivo: lida no navegador, reduzida e mantida só em memória */
    var fileIn = $('st-cover-file');
    if (fileIn) fileIn.addEventListener('change', function () {
      var f = fileIn.files && fileIn.files[0]; fileIn.value = '';
      if (!f || !/^image\//.test(f.type)) { if (f) say(tr('st.coverBad', 'Escolhe um ficheiro de imagem.'), true); return; }
      var rd = new FileReader();
      rd.onerror = function () { say(tr('st.coverBad', 'Escolhe um ficheiro de imagem.'), true); };
      rd.onload = function () {
        var im = new Image();
        im.onerror = function () { say(tr('st.coverBad', 'Escolhe um ficheiro de imagem.'), true); };
        im.onload = function () {
          var max = 1400, k = Math.min(1, max / Math.max(im.naturalWidth, im.naturalHeight));
          var c = document.createElement('canvas'); c.width = Math.round(im.naturalWidth * k); c.height = Math.round(im.naturalHeight * k);
          var cx = c.getContext('2d'); cx.fillStyle = '#fff'; cx.fillRect(0, 0, c.width, c.height); cx.drawImage(im, 0, 0, c.width, c.height);
          state.coverData = c.toDataURL('image/jpeg', 0.88); state.cover = '';
          if (!uploadBtn) {
            uploadBtn = document.createElement('button'); uploadBtn.type = 'button'; uploadBtn.className = 'cover-opt';
            uploadBtn.setAttribute('aria-label', tr('st.coverUpload', 'Escolher da galeria'));
            uploadBtn.appendChild(document.createElement('img'));
            $('st-covers').appendChild(uploadBtn);
          }
          uploadBtn.firstChild.src = state.coverData;
          say('', false); syncCover(); touch();
        };
        im.src = rd.result;
      };
      rd.readAsDataURL(f);
    });

    $('st-add-chapter').addEventListener('click', function () {
      state.chapters.push({ title: '', html: '' }); dirty = true; renderChapters(); renderPreview();
      var eds = document.querySelectorAll('.st-editable'); if (eds.length) eds[eds.length - 1].focus();
    });

    /* formatação sobre o capítulo ativo (sem perder a seleção do texto) */
    var bar = $('st-toolbar'), lastRange = null, lastEd = null;
    /* guarda a seleção: em telemóvel, tocar num botão pode tirá-la do texto */
    document.addEventListener('selectionchange', function () {
      var sel = window.getSelection();
      if (!sel || !sel.rangeCount) return;
      var node = sel.anchorNode && (sel.anchorNode.nodeType === 1 ? sel.anchorNode : sel.anchorNode.parentNode);
      var ed = node && node.closest ? node.closest('.st-editable') : null;
      if (ed) { lastEd = ed; activeEditor = ed; lastRange = sel.getRangeAt(0).cloneRange(); }
    });
    /* só mousedown: cancelar touchstart/pointerdown em ecrãs tácteis também cancelaria o clique */
    bar.addEventListener('mousedown', function (e) { if (e.target.closest('[data-cmd]')) e.preventDefault(); });
    bar.querySelectorAll('[data-cmd]').forEach(function (b) {
      b.addEventListener('click', function () {
        var ed = (lastEd && document.body.contains(lastEd)) ? lastEd : document.querySelector('.st-editable');
        if (!ed) return;
        ed.focus();
        var sel = window.getSelection();
        if (lastRange && ed === lastEd) { sel.removeAllRanges(); sel.addRange(lastRange); }
        var cmd = b.dataset.cmd;
        // negrito/itálico/sublinhado sem texto selecionado: aplica ao capítulo todo
        if (/^(bold|italic|underline)$/.test(cmd) && (!sel.rangeCount || sel.isCollapsed)) document.execCommand('selectAll', false, null);
        document.execCommand(cmd, false, null);
        ed.dispatchEvent(new Event('input', { bubbles: true }));
        lastRange = sel.rangeCount ? sel.getRangeAt(0).cloneRange() : lastRange;
      });
    });

    /* apresentação */
    document.querySelectorAll('[data-sfont]').forEach(function (b) {
      b.addEventListener('click', function () {
        state.font = b.dataset.sfont;
        document.querySelectorAll('[data-sfont]').forEach(function (o) { var on = o === b; o.classList.toggle('is-selected', on); o.setAttribute('aria-pressed', String(on)); });
        renderPreview();
      });
    });
    document.querySelectorAll('[data-stheme]').forEach(function (b) {
      b.addEventListener('click', function () {
        state.theme = b.dataset.stheme;
        document.querySelectorAll('[data-stheme]').forEach(function (o) { var on = o === b; o.classList.toggle('is-selected', on); o.setAttribute('aria-pressed', String(on)); });
        renderPreview();
      });
    });
    [['st-size', 'size', 'st-size-out'], ['st-lh', 'lh', 'st-lh-out']].forEach(function (p) {
      var r = $(p[0]), out = $(p[2]);
      r.addEventListener('input', function () { state[p[1]] = parseFloat(r.value); out.textContent = r.value; renderPreview(); });
    });

    $('st-export-pdf').addEventListener('click', exportPdf);
    var share = $('st-share');
    if (share && navigator.share && navigator.canShare) { share.hidden = false; share.addEventListener('click', sharePdf); }

    document.addEventListener('sv:languagechange', function () {
      if (loaded && !dirty) { loadFromLibrary(); syncFields(); }
      renderChapters(); renderPreview();
    });

    syncCover(); renderChapters(); renderPreview();
    setTimeout(function () { if (SV.track) SV.track('editor_open', { type: 'story' }); }, 0);
    if (window.lucide && window.lucide.createIcons) window.lucide.createIcons();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
