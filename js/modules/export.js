/* Exportação PNG/JPG do meme.

   Há três tipos de fundo e cada um segue o seu caminho:
   1. Cor sólida / gradiente / imagem da galeria do utilizador -> captura normal (html2canvas).
   2. Fundo da biblioteca (predefinido ou temático, ficheiros SVG do StoryVerse) ->
      rota própria: o fundo é desenhado num canvas limpo, por baixo da captura do texto.
      Para o fundo nunca contaminar o canvas, tenta-se por esta ordem (ver loadLibraryImage):
        a) carregar o ficheiro diretamente (funciona num servidor http/https);
        b) ler o ficheiro com fetch() e converter para data URL;
        c) usar a cópia embutida em js/data/embedded-svgs.js (funciona sempre,
           incluindo quando o site é aberto como ficheiro, file://).
      Cada tentativa é verificada antes de ser usada.
*/
(function () {
  function init() {
    var artwork = document.getElementById('meme-canvas');
    var status = document.getElementById('export-status');
    if (!artwork) return;

    var embeddedSvgs = window.SV_EMBEDDED_SVGS || {};

    // "../assets/backgrounds/x.svg" ou URL completo -> "assets/backgrounds/x.svg"
    function embeddedKey(href) {
      var path;
      try { path = decodeURIComponent(new URL(href, document.baseURI).pathname); }
      catch (_) { return null; }
      var i = path.lastIndexOf('/assets/');
      return i >= 0 ? path.slice(i + 1) : null;
    }

    function svgTextToDataURL(svgText) {
      return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgText);
    }

    function embeddedDataURL(href) {
      var key = embeddedKey(href);
      return key && embeddedSvgs[key] ? svgTextToDataURL(embeddedSvgs[key]) : null;
    }

    // Uma imagem só serve se o canvas continuar "limpo" depois de a desenhar.
    function isCanvasSafe(img) {
      try {
        var probe = document.createElement('canvas');
        probe.width = probe.height = 2;
        probe.getContext('2d').drawImage(img, 0, 0, 2, 2);
        probe.toDataURL();
        return true;
      } catch (_) { return false; }
    }

    function message(text, isError) {
      if (!status) return;
      status.textContent = text;
      status.classList.toggle('is-error', Boolean(isError));
    }

    function waitForImages(root) {
      var images = Array.prototype.slice.call(root.querySelectorAll('img'));
      return Promise.all(images.map(function (img) {
        if (img.complete && img.naturalWidth > 0) return Promise.resolve();
        return new Promise(function (resolve) {
          var done = function () { img.removeEventListener('load', done); img.removeEventListener('error', done); resolve(); };
          img.addEventListener('load', done, { once: true });
          img.addEventListener('error', done, { once: true });
          window.setTimeout(done, 10000);
        });
      }));
    }


    // Converte fundos e imagens locais em data URLs antes da captura. Isto evita
    // que imagens SVG/fundos CSS sejam tratados como recursos externos pelo canvas.
    async function inlineImageResources(root) {
      var restore = [];
      function blobToDataURL(blob) {
        return new Promise(function (resolve, reject) {
          var reader = new FileReader();
          reader.onload = function () { resolve(reader.result); };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      }
      async function toDataURL(source) {
        if (!source || /^(data:|blob:|#)/i.test(source)) return source;
        var url;
        try { url = new URL(source, document.baseURI); } catch (_) { return source; }
        if (url.origin !== location.origin) return source;
        try {
          var response = await fetch(url.href, { credentials: 'same-origin', cache: 'force-cache' });
          if (!response.ok) throw new Error('Não foi possível carregar um recurso local: ' + url.pathname);
          return await blobToDataURL(await response.blob());
        } catch (error) {
          // fetch() falha quando o site é aberto como ficheiro (file://): usa a cópia embutida.
          var embedded = embeddedDataURL(url.href);
          if (embedded) return embedded;
          throw error;
        }
      }
      var nodes = [root].concat(Array.prototype.slice.call(root.querySelectorAll('*')));
      for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        if (node.tagName === 'IMG' && node.getAttribute('src')) {
          var oldSrc = node.getAttribute('src');
          try {
            var newSrc = await toDataURL(oldSrc);
            if (newSrc !== oldSrc) { restore.push(function (el, value) { return function () { el.setAttribute('src', value); }; }(node, oldSrc)); node.setAttribute('src', newSrc); }
          } catch (e) { console.warn('StoryVerse: imagem não incorporada:', oldSrc, e); }
        }
        var computed = window.getComputedStyle(node).backgroundImage;
        if (!computed || computed === 'none' || computed.indexOf('url(') === -1) continue;
        var originalInline = node.style.backgroundImage;
        var replaced = computed;
        var matches = Array.from(computed.matchAll(/url\(["']?(.*?)["']?\)/g));
        for (var j = 0; j < matches.length; j++) {
          var source = matches[j][1];
          try {
            var data = await toDataURL(source);
            if (data !== source) replaced = replaced.replace(matches[j][0], 'url("' + data + '")');
          } catch (e) { console.warn('StoryVerse: fundo não incorporado:', source, e); }
        }
        if (replaced !== computed) {
          restore.push(function (el, value) { return function () { el.style.backgroundImage = value; }; }(node, originalInline));
          node.style.backgroundImage = replaced;
        }
      }
      return function () { restore.reverse().forEach(function (undo) { try { undo(); } catch (_) {} }); };
    }

    function getCssImageUrl(backgroundImage) {
      if (!backgroundImage || backgroundImage === 'none') return null;
      var match = backgroundImage.match(/url\((?:"|')?(.*?)(?:"|')?\)/i);
      return match ? match[1] : null;
    }

    function loadImage(src) {
      return new Promise(function (resolve, reject) {
        var img = new Image();
        img.onload = function () { resolve(img); };
        img.onerror = function () { reject(new Error('Não foi possível carregar o fundo da biblioteca para exportação.')); };
        img.src = src;
      });
    }

    // Devolve uma imagem do fundo da biblioteca que NÃO contamina o canvas.
    async function loadLibraryImage(href) {
      // a) diretamente pelo URL (servidor http/https)
      try {
        var direct = await loadImage(href);
        if (isCanvasSafe(direct)) return direct;
      } catch (_) { /* tenta a seguinte */ }

      // b) fetch() -> data URL
      try {
        var response = await fetch(href, { cache: 'force-cache' });
        if (response.ok) {
          var blob = await response.blob();
          var dataUrl = await new Promise(function (resolve, reject) {
            var reader = new FileReader();
            reader.onload = function () { resolve(reader.result); };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
          var viaFetch = await loadImage(dataUrl);
          if (isCanvasSafe(viaFetch)) return viaFetch;
        }
      } catch (_) { /* tenta a seguinte */ }

      // c) cópia embutida no projeto (não depende de rede nem de servidor)
      var embedded = embeddedDataURL(href);
      if (embedded) {
        var viaEmbedded = await loadImage(embedded);
        if (isCanvasSafe(viaEmbedded)) return viaEmbedded;
      }

      throw new Error('Não foi possível usar este fundo na exportação. Se acrescentaste fundos novos, corre tools/gerar-svgs-embutidos.py para atualizar js/data/embedded-svgs.js, ou escolhe outro fundo.');
    }

    // Os fundos temáticos e predefinidos da biblioteca são exportados por uma
    // rota própria: retiramos o fundo CSS durante a captura do conteúdo da frente
    // e compomos tudo num canvas limpo. Assim, não dependemos do html2canvas para
    // rasterizar SVGs de fundo.
    async function prepareLibraryBackground() {
      if (!artwork.classList.contains('has-preset-background')) return null;
      var source = getCssImageUrl(window.getComputedStyle(artwork).backgroundImage);
      if (!source) throw new Error('Não foi possível identificar o fundo selecionado. Escolhe novamente o fundo temático.');

      var url;
      try { url = new URL(source, document.baseURI); }
      catch (_) { throw new Error('O endereço do fundo selecionado é inválido.'); }

      var img = await loadLibraryImage(url.href);
      return { image: img, objectUrl: null };
    }

    function drawCover(context, image, width, height) {
      var scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
      var drawWidth = image.naturalWidth * scale;
      var drawHeight = image.naturalHeight * scale;
      var x = (width - drawWidth) / 2;
      var y = (height - drawHeight) / 2;
      context.drawImage(image, x, y, drawWidth, drawHeight);
    }

    /* Desenha a composição e devolve o data URL (usado por PNG, JPG, PDF e Partilhar). */
    async function renderToDataUrl(format) {
      var lang = window.StoryVerse && window.StoryVerse.language && window.StoryVerse.language.get() === 'en';
      var restoreResources = function () {};
      var restoreBackground = function () {};
      var libraryBackground = null;
      try {
        if (typeof window.html2canvas !== 'function') {
          throw new Error(lang
            ? 'The export component did not load. Check your internet connection and reload the page.'
            : 'O componente de exportação não carregou. Verifica a ligação à internet e atualiza a página.');
        }
        var rect = artwork.getBoundingClientRect();
        if (!rect.width || !rect.height) throw new Error(lang ? 'The preview is not visible.' : 'A pré-visualização não está visível.');
        if (document.fonts && document.fonts.ready) await document.fonts.ready;
        await waitForImages(artwork);
        libraryBackground = await prepareLibraryBackground();
        if (libraryBackground) {
          var oldBackgroundImage = artwork.style.backgroundImage;
          var oldBackgroundColor = artwork.style.backgroundColor;
          artwork.style.backgroundImage = 'none';
          artwork.style.backgroundColor = 'transparent';
          restoreBackground = function () {
            artwork.style.backgroundImage = oldBackgroundImage;
            artwork.style.backgroundColor = oldBackgroundColor;
          };
        }
        restoreResources = await inlineImageResources(artwork);

        // Capture the DOM directly. Do not serialize computed CSS into foreignObject:
        // that path can taint the canvas when a background image/font is cross-origin.
        var outputWidth = 1080;
        var scale = outputWidth / rect.width;
        var canvas = await window.html2canvas(artwork, {
          scale: scale,
          width: rect.width,
          height: rect.height,
          windowWidth: Math.max(document.documentElement.clientWidth, rect.width),
          windowHeight: Math.max(document.documentElement.clientHeight, rect.height),
          useCORS: true,
          allowTaint: false,
          imageTimeout: 15000,
          logging: false,
          backgroundColor: format === 'jpg' ? '#FFFFFF' : null,
          removeContainer: true,
          onclone: function (clonedDocument) {
            var clonedArtwork = clonedDocument.getElementById('meme-canvas');
            if (!clonedArtwork) return;
            clonedArtwork.querySelectorAll('.is-art-selected').forEach(function (el) { el.classList.remove('is-art-selected'); });
            clonedArtwork.querySelectorAll('[data-export-ignore="true"]').forEach(function (el) { el.remove(); });
            clonedArtwork.style.boxShadow = 'none';
          }
        });

        // Para fundos da biblioteca, compõe-se primeiro o ficheiro local (SVG/PNG/JPG)
        // e depois a captura transparente dos textos, decorações e ilustrações.
        if (libraryBackground) {
          var composed = document.createElement('canvas');
          composed.width = canvas.width;
          composed.height = canvas.height;
          var composedContext = composed.getContext('2d');
          if (!composedContext) throw new Error('Não foi possível compor o fundo com o conteúdo.');
          drawCover(composedContext, libraryBackground.image, composed.width, composed.height);
          composedContext.drawImage(canvas, 0, 0);
          canvas = composed;
        }

        // Normalize output dimensions to 1080 px wide without changing aspect ratio.
        var expectedHeight = Math.round(outputWidth * rect.height / rect.width);
        if (canvas.width !== outputWidth || canvas.height !== expectedHeight) {
          var normalized = document.createElement('canvas');
          normalized.width = outputWidth;
          normalized.height = expectedHeight;
          var context = normalized.getContext('2d');
          if (!context) throw new Error(lang ? 'Could not prepare the image.' : 'Não foi possível preparar a imagem.');
          if (format === 'jpg') { context.fillStyle = '#FFFFFF'; context.fillRect(0, 0, outputWidth, expectedHeight); }
          context.drawImage(canvas, 0, 0, outputWidth, expectedHeight);
          canvas = normalized;
        }

        var mime = format === 'jpg' ? 'image/jpeg' : 'image/png';
        var dataUrl;
        try { dataUrl = canvas.toDataURL(mime, format === 'jpg' ? 0.94 : undefined); }
        catch (error) {
          throw new Error(lang
            ? 'The browser blocked an image used in the preview. Choose a built-in background or a local image and try again.'
            : 'O navegador bloqueou uma imagem usada na pré-visualização. Escolhe um fundo incluído no StoryVerse ou uma imagem local e tenta novamente.');
        }
        if (dataUrl === 'data:,') throw new Error(lang ? 'The image could not be generated.' : 'Não foi possível gerar a imagem.');

        return dataUrl;
      } finally {
        restoreResources();
        restoreBackground();
        if (libraryBackground && libraryBackground.objectUrl) URL.revokeObjectURL(libraryBackground.objectUrl);
      }
    }

    async function exportImage(format) {
      var lang = window.StoryVerse && window.StoryVerse.language && window.StoryVerse.language.get() === 'en';
      var buttons = document.querySelectorAll('#export-png, #export-jpg');
      buttons.forEach(function (button) { button.disabled = true; });
      message(lang ? 'Preparing your image…' : 'A preparar a imagem…', false);
      var nextSteps = document.getElementById('export-next');
      if (nextSteps) nextSteps.hidden = true;
      try {
        var dataUrl = await renderToDataUrl(format);
        var select = document.getElementById('template-choice');
        var template = select && select.value ? select.value : 'meme-classico-01';
        var link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'storyverse-' + template + '.' + format;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        link.remove();
        message(window.StoryVerse.language.t('poem.exportOk'), false);
        if (window.StoryVerse.showNextSteps) window.StoryVerse.showNextSteps();
        if (window.StoryVerse && window.StoryVerse.track) window.StoryVerse.track('content_export', { format: format, template: template });
      } catch (error) {
        console.error('StoryVerse export error:', error);
        message(window.StoryVerse.language.t('poem.exportFail'), true);
      } finally {
        buttons.forEach(function (button) { button.disabled = false; });
      }
    }

    var SVx = (window.StoryVerse = window.StoryVerse || {});
    SVx.exportTools = { render: renderToDataUrl, message: message };

    /* Partilhar: só aparece em dispositivos que suportam a partilha de ficheiros.
       Só confirma que a janela de partilha abriu; nunca afirma que foi partilhado. */
    var shareBtn = document.getElementById('share-image');
    if (shareBtn && navigator.share && navigator.canShare) {
      shareBtn.hidden = false;
      shareBtn.addEventListener('click', async function () {
        var en = window.StoryVerse && window.StoryVerse.language && window.StoryVerse.language.get() === 'en';
        var all = document.querySelectorAll('#export-png, #export-jpg, #share-image');
        all.forEach(function (b) { b.disabled = true; });
        message(en ? 'Preparing your image…' : 'A preparar a imagem…', false);
        try {
          var dataUrl = await renderToDataUrl('png');
          var blob = await (await fetch(dataUrl)).blob();
          var select = document.getElementById('template-choice');
          var file = new File([blob], 'storyverse-' + (select && select.value ? select.value : 'imagem') + '.png', { type: 'image/png' });
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({ files: [file], title: 'StoryVerse' });
            message(en ? 'Your device share window was opened.' : 'A janela de partilha do dispositivo foi aberta.', false);
          } else {
            message(en ? 'This device cannot share images. Use Export PNG or JPG and share the file manually.' : 'Este dispositivo não permite partilhar imagens. Usa Exportar PNG ou JPG e partilha o ficheiro manualmente.', true);
          }
        } catch (error) {
          if (error && error.name === 'AbortError') { message('', false); }
          else {
            console.error('StoryVerse share error:', error);
            message(en ? 'Could not prepare the image to share. Try again, or use Export PNG or JPG.' : 'Não foi possível preparar a imagem para partilhar. Tenta novamente ou usa Exportar PNG ou JPG.', true);
          }
        } finally {
          all.forEach(function (b) { b.disabled = false; });
        }
      });
    }

    var png = document.getElementById('export-png');
    var jpg = document.getElementById('export-jpg');
    var ownExport = document.body && document.body.hasAttribute('data-own-export');
    if (png && !ownExport) png.addEventListener('click', function () { exportImage('png'); });
    if (jpg && !ownExport) jpg.addEventListener('click', function () { exportImage('jpg'); });
  }
  document.addEventListener('DOMContentLoaded', init);
})();
