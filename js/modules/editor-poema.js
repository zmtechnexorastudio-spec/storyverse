/* Editor de poemas.
   Funciona sobre o mesmo motor do editor de memes (fundos, cores, ícones, ilustrações,
   imagem própria, exportação) e acrescenta o texto estruturado de um poema:
   título, subtítulo/dedicatória, estrofes, versos, autor e ornamento.

   - O poema da biblioteca é copiado: o original (contents.js) nunca é alterado.
   - Nada é guardado automaticamente; o utilizador exporta para conservar o trabalho.
   - PNG/JPG: uma imagem. PDF: várias páginas se o poema for longo.
   - Todo o texto do utilizador entra no DOM com textContent (nunca innerHTML). */
(function () {
  var SV = (window.StoryVerse = window.StoryVerse || {});

  function $(id) { return document.getElementById(id); }
  function isEn() { return !!(SV.language && SV.language.get() === 'en'); }
  function tr(key, fallback) {
    var v = SV.language && SV.language.t ? SV.language.t(key) : key;
    return v === key ? (fallback || key) : v;
  }

  /* Ornamentos: pequenos SVG (não dependem de tipos de letra) */
  var ORNAMENTS = {
    line: '<svg viewBox="0 0 120 10" aria-hidden="true"><path d="M2 5h42M76 5h42" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" fill="none"/><path d="M60 1l4 4-4 4-4-4z" fill="currentColor"/></svg>',
    stars: '<svg viewBox="0 0 100 20" aria-hidden="true"><g fill="currentColor"><path d="M20 3l1.8 5.2L27 10l-5.2 1.8L20 17l-1.8-5.2L13 10l5.2-1.8z"/><path d="M50 1l2.3 6.7L59 10l-6.7 2.3L50 19l-2.3-6.7L41 10l6.7-2.3z"/><path d="M80 3l1.8 5.2L87 10l-5.2 1.8L80 17l-1.8-5.2L73 10l5.2-1.8z"/></g></svg>',
    flower: '<svg viewBox="0 0 120 20" aria-hidden="true"><path d="M4 10h38M78 10h38" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" fill="none"/><g fill="currentColor"><circle cx="60" cy="4.5" r="3.3"/><circle cx="60" cy="15.5" r="3.3"/><circle cx="54.5" cy="10" r="3.3"/><circle cx="65.5" cy="10" r="3.3"/></g><circle cx="60" cy="10" r="2" fill="#fff" opacity=".85"/></svg>',
    heart: '<svg viewBox="0 0 120 20" aria-hidden="true"><path d="M4 10h40M76 10h40" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" fill="none"/><path d="M60 17C47 9 52 2.5 57 3.3c2 .3 3 1.8 3 2.7 0-.9 1-2.4 3-2.7 5-.8 10 5.7-3 13.7z" fill="currentColor"/></svg>'
  };

  var state = {
    title: '', subtitle: '', author: '', ornament: 'line',
    stanzas: [['', '']],
    bold: false, italic: false, underline: false,
    size: 16, lh: 1.7, gap: 1.2, ratio: '45'
  };
  var dirty = false;          // o utilizador já mexeu no conteúdo?
  var loadedItem = null;      // poema da biblioteca (cópia só de leitura)
  var libId = new URLSearchParams(location.search).get('poem') || '';

  var canvas, flow, sheet, editorBox, fitNote, sink;

  /* ------------------------------------------------------------------ */
  /* Dados                                                               */
  /* ------------------------------------------------------------------ */
  function parsePoem(text) {
    var blocks = String(text || '').replace(/\r/g, '').split(/\n\s*\n/);
    var stanzas = blocks.map(function (b) {
      return b.split('\n').map(function (l) { return l.replace(/\s+$/, ''); }).filter(function (l, i, arr) { return l !== '' || arr.length === 1; });
    }).filter(function (s) { return s.length; });
    return stanzas.length ? stanzas : [['']];
  }

  function findLibraryItem() {
    return (window.SV_CONTENTS || []).find(function (x) { return x.id === libId && x.type === 'poem'; }) || null;
  }

  function loadFromLibrary() {
    if (!loadedItem) return;
    var lang = isEn() ? 'en' : 'pt';
    state.title = (loadedItem.title && (loadedItem.title[lang] || loadedItem.title.pt)) || '';
    state.stanzas = parsePoem(loadedItem.text && (loadedItem.text[lang] || loadedItem.text.pt));
  }

  function flatItems() {
    var items = [];
    state.stanzas.forEach(function (st, si) {
      st.forEach(function (v, vi) { if (String(v).trim() !== '') items.push({ s: si, v: vi }); });
    });
    return items;
  }

  function plainText() {
    return state.stanzas.map(function (st) { return st.join('\n'); }).join('\n\n');
  }

  /* ------------------------------------------------------------------ */
  /* Pré-visualização                                                    */
  /* ------------------------------------------------------------------ */
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function ornamentNode() {
    if (state.ornament === 'none' || !ORNAMENTS[state.ornament]) return null;
    var d = el('div', 'poem-orn');
    d.setAttribute('aria-hidden', 'true');
    d.innerHTML = ORNAMENTS[state.ornament]; // markup fixo do StoryVerse, sem texto do utilizador
    return d;
  }

  /* page: null = poema inteiro; { items:[{s,v}], first:bool, last:bool, no:int, total:int } */
  function renderPreview(page, noFit) {
    if (!flow) return;
    flow.textContent = '';
    var showHead = !page || page.first;
    var showFoot = !page || page.last;

    if (showHead) {
      if (state.title.trim()) flow.appendChild(el('h2', 'poem-title', state.title.trim()));
      if (state.subtitle.trim()) flow.appendChild(el('p', 'poem-subtitle', state.subtitle.trim()));
      if (state.title.trim() || state.subtitle.trim()) { var o = ornamentNode(); if (o) flow.appendChild(o); }
    }

    var body = el('div', 'poem-body');
    var list = page ? page.items : flatItems();
    if (!list.length && !page) {
      body.appendChild(el('p', 'poem-stanza poem-placeholder', tr('poem.placeholder', 'Os teus versos aparecem aqui.')));
    } else {
      var current = null, lastS = -1;
      list.forEach(function (it) {
        if (it.s !== lastS) { current = el('p', 'poem-stanza'); body.appendChild(current); lastS = it.s; }
        current.appendChild(el('span', 'poem-verse', state.stanzas[it.s][it.v]));
      });
    }
    flow.appendChild(body);

    if (showFoot && state.author.trim()) flow.appendChild(el('p', 'poem-author', '— ' + state.author.trim()));
    if (page && page.total > 1) flow.appendChild(el('span', 'poem-pageno', page.no + ' / ' + page.total));

    flow.classList.toggle('fmt-bold', state.bold);
    flow.classList.toggle('fmt-italic', state.italic);
    flow.classList.toggle('fmt-underline', state.underline);
    canvas.style.setProperty('--poem-size', state.size + 'px');
    canvas.style.setProperty('--poem-lh', String(state.lh));
    canvas.style.setProperty('--poem-gap', String(state.gap));
    canvas.classList.toggle('ratio-916', state.ratio === '916');

    // O motor visual (preview.js) lê este campo para saber se há texto
    var raw = $('meme-text');
    if (raw) raw.value = plainText() + (state.title ? '\n' + state.title : '');
    canvas.classList.toggle('is-empty', !raw || !raw.value.trim());
    if (!page && !noFit) updateFit();
  }

  function overflows() {
    return flow.offsetHeight > sheet.clientHeight + 1;
  }

  var pager = null, pagerLabel = null, viewPages = [], viewIdx = 0;
  function showViewPage() {
    renderPreview(viewPages[viewIdx], true);
    if (pagerLabel) pagerLabel.textContent = (viewIdx + 1) + ' / ' + viewPages.length;
  }
  function ensurePager() {
    if (pager || !fitNote) return;
    pager = document.createElement('div'); pager.className = 'poem-pager'; pager.hidden = true;
    function btn(txt, label, d) {
      var b = document.createElement('button'); b.type = 'button'; b.className = 'poem-btn'; b.textContent = txt; b.setAttribute('aria-label', label);
      b.addEventListener('click', function () { viewIdx = Math.min(viewPages.length - 1, Math.max(0, viewIdx + d)); showViewPage(); });
      return b;
    }
    pagerLabel = document.createElement('span'); pagerLabel.className = 'poem-pager-label';
    pager.appendChild(btn('‹', tr('poem.prevPage', 'Página anterior'), -1)); pager.appendChild(pagerLabel); pager.appendChild(btn('›', tr('poem.nextPage', 'Página seguinte'), 1));
    fitNote.parentNode.insertBefore(pager, fitNote.nextSibling);
  }
  /* Se o poema não cabe numa imagem, o preview mostra-o por páginas (como no PDF),
     para que o fim do poema e o autor nunca fiquem cortados. */
  function updateFit() {
    if (!fitNote) return;
    ensurePager();
    var over = overflows();
    fitNote.hidden = !over;
    if (pager) pager.hidden = !over;
    if (over) {
      viewPages = paginate();
      if (viewIdx > viewPages.length - 1) viewIdx = viewPages.length - 1;
      showViewPage();
      fitNote.textContent = tr('poem.fitWarn', 'O poema não cabe numa só imagem.') + ' ' + tr('poem.pdfInfo', 'O PDF terá {n} páginas.').replace('{n}', String(viewPages.length));
    } else { viewIdx = 0; }
  }

  /* ------------------------------------------------------------------ */
  /* Paginação (PDF)                                                     */
  /* ------------------------------------------------------------------ */
  function paginate() {
    var items = flatItems();
    if (!items.length) return [{ items: [], first: true, last: true, no: 1, total: 1 }];
    var pages = [];
    var cur = [];
    var first = true;
    function fits(list, isFirst, isLast) {
      renderPreview({ items: list, first: isFirst, last: isLast, no: 1, total: 1 });
      return !overflows();
    }
    for (var i = 0; i < items.length; i++) {
      var trial = cur.concat([items[i]]);
      var isLastItem = i === items.length - 1;
      if (fits(trial, first, isLastItem)) { cur = trial; }
      else if (cur.length) {
        pages.push({ items: cur, first: first });
        first = false;
        cur = [items[i]];
      } else { cur = trial; } // um verso sozinho nunca é partido
    }
    pages.push({ items: cur, first: first });
    pages.forEach(function (p, idx) { p.last = idx === pages.length - 1; p.no = idx + 1; p.total = pages.length; });
    return pages;
  }

  /* ------------------------------------------------------------------ */
  /* Editor de versos e estrofes                                         */
  /* ------------------------------------------------------------------ */
  function touch() { dirty = true; renderPreview(null); }

  function icon(name) { var i = document.createElement('i'); i.setAttribute('data-lucide', name); return i; }

  function iconButton(name, label, onClick, disabled, danger) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'poem-icon-btn' + (danger ? ' is-danger' : '');
    b.title = label; b.setAttribute('aria-label', label);
    b.disabled = !!disabled;
    b.appendChild(icon(name));
    b.addEventListener('click', onClick);
    return b;
  }

  function focusVerse(si, vi) {
    var inp = editorBox.querySelector('input[data-s="' + si + '"][data-v="' + vi + '"]');
    if (inp) inp.focus();
  }

  function renderEditor() {
    editorBox.textContent = '';
    state.stanzas.forEach(function (stanza, si) {
      var card = el('div', 'poem-stanza-card');
      var head = el('div', 'poem-stanza-head');
      head.appendChild(el('strong', null, tr('poem.stanza', 'Estrofe') + ' ' + (si + 1)));
      var tools = el('div', 'poem-tools');
      tools.appendChild(iconButton('arrow-up', tr('poem.moveUp', 'Subir'), function () {
        var t = state.stanzas[si - 1]; state.stanzas[si - 1] = state.stanzas[si]; state.stanzas[si] = t; dirty = true; renderEditor(); renderPreview(null);
      }, si === 0));
      tools.appendChild(iconButton('arrow-down', tr('poem.moveDown', 'Descer'), function () {
        var t = state.stanzas[si + 1]; state.stanzas[si + 1] = state.stanzas[si]; state.stanzas[si] = t; dirty = true; renderEditor(); renderPreview(null);
      }, si === state.stanzas.length - 1));
      tools.appendChild(iconButton('trash-2', tr('poem.removeStanza', 'Apagar estrofe'), function () {
        state.stanzas.splice(si, 1); if (!state.stanzas.length) state.stanzas.push(['']); dirty = true; renderEditor(); renderPreview(null);
      }, false, true));
      head.appendChild(tools);
      card.appendChild(head);

      stanza.forEach(function (verse, vi) {
        var row = el('div', 'poem-verse-row');
        row.appendChild(el('span', 'poem-verse-no', String(vi + 1)));
        var inp = document.createElement('input');
        inp.type = 'text'; inp.value = verse; inp.maxLength = 200;
        inp.placeholder = tr('poem.versePh', 'Escreve um verso');
        inp.setAttribute('aria-label', tr('poem.stanza', 'Estrofe') + ' ' + (si + 1) + ' · ' + (vi + 1));
        inp.dataset.s = si; inp.dataset.v = vi;
        inp.addEventListener('input', function () { state.stanzas[si][vi] = inp.value; touch(); });
        inp.addEventListener('keydown', function (e) {
          if (e.key === 'Enter') {            // novo verso logo abaixo
            e.preventDefault();
            state.stanzas[si].splice(vi + 1, 0, ''); dirty = true; renderEditor(); renderPreview(null); focusVerse(si, vi + 1);
          } else if (e.key === 'Backspace' && inp.value === '' && state.stanzas[si].length > 1) {
            e.preventDefault();                // apaga o verso vazio
            state.stanzas[si].splice(vi, 1); dirty = true; renderEditor(); renderPreview(null); focusVerse(si, Math.max(0, vi - 1));
          }
        });
        row.appendChild(inp);
        row.appendChild(iconButton('arrow-up', tr('poem.moveUp', 'Subir'), function () {
          var a = state.stanzas[si]; var t = a[vi - 1]; a[vi - 1] = a[vi]; a[vi] = t; dirty = true; renderEditor(); renderPreview(null); focusVerse(si, vi - 1);
        }, vi === 0));
        row.appendChild(iconButton('arrow-down', tr('poem.moveDown', 'Descer'), function () {
          var a = state.stanzas[si]; var t = a[vi + 1]; a[vi + 1] = a[vi]; a[vi] = t; dirty = true; renderEditor(); renderPreview(null); focusVerse(si, vi + 1);
        }, vi === stanza.length - 1));
        row.appendChild(iconButton('x', tr('poem.removeVerse', 'Apagar verso'), function () {
          state.stanzas[si].splice(vi, 1); if (!state.stanzas[si].length) state.stanzas[si].push(''); dirty = true; renderEditor(); renderPreview(null);
        }, false, true));
        card.appendChild(row);
      });

      var add = document.createElement('button');
      add.type = 'button'; add.className = 'poem-btn poem-add-verse';
      add.appendChild(icon('plus')); add.appendChild(el('span', null, tr('poem.addVerse', 'Adicionar verso')));
      add.addEventListener('click', function () {
        state.stanzas[si].push(''); dirty = true; renderEditor(); renderPreview(null); focusVerse(si, state.stanzas[si].length - 1);
      });
      card.appendChild(add);
      editorBox.appendChild(card);
    });
    if (window.lucide && window.lucide.createIcons) window.lucide.createIcons();
  }

  /* ------------------------------------------------------------------ */
  /* Exportação                                                          */
  /* ------------------------------------------------------------------ */
  function say(text, isError) {
    var s = $('export-status');
    if (!s) return;
    s.textContent = text;
    s.classList.toggle('is-error', !!isError);
  }

  function fileBase() {
    var select = $('template-choice');
    var slug = (state.title || 'poema').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40);
    return 'storyverse-poema' + (slug && slug !== 'poema' ? '-' + slug : '') + (select ? '' : '');
  }

  function setBusy(busy) {
    ['export-png', 'export-jpg', 'export-pdf', 'share-poem'].forEach(function (id) { var b = $(id); if (b) b.disabled = busy; });
  }

  function download(dataUrl, name) {
    var a = document.createElement('a');
    a.href = dataUrl; a.download = name; a.style.display = 'none';
    document.body.appendChild(a); a.click(); a.remove();
  }

  function renderer() {
    if (!SV.exportTools || !SV.exportTools.render) throw new Error('export');
    return SV.exportTools.render;
  }

  async function exportImage(format) {
    setBusy(true); say(tr('poem.preparing', 'A preparar a exportação…'), false);
    try {
      renderPreview(null, true);
      if (overflows()) { say(tr('poem.fitWarn', 'O poema não cabe numa só imagem.'), true); return; }
      var dataUrl = await renderer()(format);
      download(dataUrl, fileBase() + '.' + format);
      say(tr('poem.exportOk'), false); if (SV.showNextSteps) SV.showNextSteps();
      if (SV.track) SV.track('content_export', { format: format, template: 'poem' });
    } catch (err) {
      console.error('StoryVerse poem export:', err);
      say(tr('poem.exportFail'), true);
    } finally { renderPreview(null); setBusy(false); }
  }

  async function exportPdf() {
    setBusy(true); say(tr('poem.preparing', 'A preparar a exportação…'), false);
    try {
      if (!window.jspdf || !window.jspdf.jsPDF) { say(tr('poem.noPdf'), true); return; }
      var pages = paginate();
      var rect = canvas.getBoundingClientRect();
      var w = 1080, h = Math.round(1080 * rect.height / rect.width);
      var pdf = null;
      for (var i = 0; i < pages.length; i++) {
        renderPreview(pages[i]);
        var url = await renderer()('jpg');
        if (!pdf) pdf = new window.jspdf.jsPDF({ orientation: h >= w ? 'portrait' : 'landscape', unit: 'px', format: [w, h], compress: true });
        else pdf.addPage([w, h], h >= w ? 'portrait' : 'landscape');
        pdf.addImage(url, 'JPEG', 0, 0, w, h);
      }
      pdf.save(fileBase() + '.pdf');
      say(tr('poem.exportOk'), false); if (SV.showNextSteps) SV.showNextSteps();
      if (SV.track) SV.track('content_export', { format: 'pdf', template: 'poem', pages: pages.length });
    } catch (err) {
      console.error('StoryVerse poem pdf:', err);
      say(tr('poem.exportFail'), true);
    } finally { renderPreview(null); setBusy(false); }
  }

  async function sharePoem() {
    setBusy(true); say(tr('poem.preparing', 'A preparar a exportação…'), false);
    try {
      renderPreview(null, true);
      if (overflows()) { say(tr('poem.fitWarn', 'O poema não cabe numa só imagem.'), true); return; }
      var dataUrl = await renderer()('png');
      var blob = await (await fetch(dataUrl)).blob();
      var file = new File([blob], fileBase() + '.png', { type: 'image/png' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: state.title || 'StoryVerse' });
        say(tr('poem.shareOpened'), false);   // só diz que a janela abriu; nunca que foi partilhado
      } else {
        download(dataUrl, fileBase() + '.png');
        say(tr('poem.exportOk'), false); if (SV.showNextSteps) SV.showNextSteps();
      }
    } catch (err) {
      if (err && err.name === 'AbortError') { say('', false); }
      else { console.error('StoryVerse poem share:', err); say(tr('poem.exportFail'), true); }
    } finally { renderPreview(null); setBusy(false); }
  }

  /* Ajusta o tamanho dos versos para o poema caber (só enquanto o utilizador não o mudar) */
  var sizeTouched = false, ratioTouched = false;
  function setRatio(r) {
    state.ratio = r;
    document.querySelectorAll('.poem-ratio-btn').forEach(function (o) {
      var on = o.dataset.ratio === r; o.classList.toggle('is-selected', on); o.setAttribute('aria-pressed', String(on));
    });
    var pill = $('format-pill'); if (pill) pill.textContent = r === '916' ? '1080 × 1920 · 9:16' : '1080 × 1350 · 4:5';
  }
  function shrinkToFit(min) {
    var size = 16;
    state.size = size; renderPreview(null, true);
    while (overflows() && size > min) { size -= 0.5; state.size = size; renderPreview(null, true); }
    return !overflows();
  }
  function autoFit() {
    if (!sizeTouched) {
      var ok = shrinkToFit(13);                       // 4:5 com letra confortável
      if (!ok && !ratioTouched && state.ratio !== '916') { setRatio('916'); ok = shrinkToFit(11); }   // poema longo: formato vertical
      if (!ok) shrinkToFit(11);
      var r = $('poem-size'), out = $('poem-size-out');
      if (r) r.value = String(state.size); if (out) out.textContent = String(state.size);
    }
    renderPreview(null);
  }

  /* ------------------------------------------------------------------ */
  /* Arranque                                                            */
  /* ------------------------------------------------------------------ */
  var TEMPLATE_ALIGN = { 'poem-template-01': 'center', 'poem-template-02': 'left', 'poem-template-03': 'left', 'poem-template-04': 'center' };

  function init() {
    canvas = $('meme-canvas'); flow = $('poem-flow'); sheet = $('poem-sheet');
    editorBox = $('poem-stanzas'); fitNote = $('poem-fit');
    if (!canvas || !flow || !sheet || !editorBox) return;

    loadedItem = findLibraryItem();
    loadFromLibrary();

    var title = $('poem-title-in'), sub = $('poem-subtitle-in'), author = $('poem-author-in'), orn = $('poem-ornament');
    title.value = state.title;
    title.addEventListener('input', function () { state.title = title.value; touch(); });
    sub.addEventListener('input', function () { state.subtitle = sub.value; touch(); });
    author.addEventListener('input', function () { state.author = author.value; touch(); });
    orn.addEventListener('change', function () { state.ornament = orn.value; touch(); });

    $('poem-add-stanza').addEventListener('click', function () {
      state.stanzas.push(['', '']); dirty = true; renderEditor(); renderPreview(null);
      focusVerse(state.stanzas.length - 1, 0);
    });
    $('poem-paste-use').addEventListener('click', function () {
      var t = $('poem-paste-text').value;
      if (!t.trim()) return;
      state.stanzas = parsePoem(t); dirty = true; renderEditor(); autoFit();
      $('poem-paste-text').value = ''; var d = document.querySelector('.poem-paste'); if (d) d.open = false;
    });

    [['fmt-bold', 'bold'], ['fmt-italic', 'italic'], ['fmt-underline', 'underline']].forEach(function (p) {
      var b = $(p[0]);
      b.addEventListener('click', function () {
        state[p[1]] = !state[p[1]]; b.setAttribute('aria-pressed', String(state[p[1]])); touch();
      });
    });
    [['poem-size', 'size', 'poem-size-out'], ['poem-lh', 'lh', 'poem-lh-out'], ['poem-gap', 'gap', 'poem-gap-out']].forEach(function (p) {
      var r = $(p[0]), out = $(p[2]);
      r.addEventListener('input', function () { if (p[1] === 'size') sizeTouched = true; state[p[1]] = parseFloat(r.value); out.textContent = r.value; renderPreview(null); });
    });
    document.querySelectorAll('.poem-ratio-btn').forEach(function (b) {
      b.addEventListener('click', function () { ratioTouched = true; setRatio(b.dataset.ratio); autoFit(); });
    });

    $('export-png').addEventListener('click', function () { exportImage('png'); });
    $('export-jpg').addEventListener('click', function () { exportImage('jpg'); });
    $('export-pdf').addEventListener('click', exportPdf);
    var share = $('share-poem');
    if (share && navigator.share) { share.hidden = false; share.addEventListener('click', sharePoem); }

    // Alinhamento por modelo (o utilizador pode mudar depois)
    var select = $('template-choice');
    if (select) select.addEventListener('change', function () {
      var a = TEMPLATE_ALIGN[select.value];
      var btn = a && document.querySelector('[data-align="' + a + '"]');
      if (btn) btn.click();
      autoFit();
    });

    document.addEventListener('sv:languagechange', function () {
      if (loadedItem && !dirty) { loadFromLibrary(); title.value = state.title; renderEditor(); renderPreview(null); autoFit(); }
      else { renderEditor(); renderPreview(null); }
    });

    renderEditor();
    var startAlign = TEMPLATE_ALIGN[select && select.value] || 'center';
    var ab = document.querySelector('[data-align="' + startAlign + '"]'); if (ab) ab.click();
    renderPreview(null);
    autoFit();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { autoFit(); });
    if (window.lucide && window.lucide.createIcons) window.lucide.createIcons();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
