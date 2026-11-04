/* Pré-visualização em tempo real do Template 01. Sem armazenamento permanente. */
(function () {
  var SV = (window.StoryVerse = window.StoryVerse || {});
  function init() {
    var input = document.getElementById('meme-text');
    var output = document.getElementById('meme-preview-text');
    var canvas = document.getElementById('meme-canvas');
    var count = document.getElementById('char-count');
    if (!input || !output || !canvas) return;

    var params = new URLSearchParams(window.location.search);
    var cat = SV.editorCategory || { param: 'meme', type: 'meme', defaults: null };
    var selectedMemeId = params.get(cat.param);
    var selectedMeme = (window.SV_CONTENTS || []).find(function (item) { return item.id === selectedMemeId && item.type === cat.type; });
    var selectedMemeText = selectedMeme && selectedMeme.text;
    if (selectedMemeText) input.value = selectedMemeText[(SV.language && SV.language.get()) || 'pt'] || selectedMemeText.pt;
    var defaultPT = cat.defaults ? cat.defaults[0] : 'Eu a dizer que vou dormir cedo…\nTambém eu às 02:00 a ver mais um vídeo.';
    var defaultEN = cat.defaults ? cat.defaults[1] : 'Me saying I will go to bed early…\nAlso me at 2 AM watching one more video.';
    var originalText = input.value;
    if (SV.language && SV.language.get() === 'en' && input.value === defaultPT) {
      input.value = defaultEN;
      originalText = defaultEN;
    }
    var currentBackground = '#F8F3E9';
    var imageObjectUrl = null;

    function setTextColor(color) {
      var rgb = color.match(/[\da-f]{2}/gi);
      if (!rgb || rgb.length < 3) { canvas.style.color = '#ffffff'; return; }
      var channels = rgb.slice(0, 3).map(function (value) {
        var c = parseInt(value, 16) / 255;
        return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      var luminance = 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
      canvas.style.color = luminance < 0.32 ? '#FFFFFF' : '#17192B';
    }

    function clearSelected() {
      document.querySelectorAll('[data-bg-color], [data-bg-gradient], [data-bg-preset], [data-season-preset]').forEach(function (button) {
        button.classList.remove('is-selected');
        button.setAttribute('aria-pressed', 'false');
      });
    }

    function setSolidColor(button) {
      clearSelected();
      button.classList.add('is-selected');
      button.setAttribute('aria-pressed', 'true');
      currentBackground = button.dataset.bgColor;
      canvas.classList.remove('has-image', 'has-gradient', 'has-preset-background');
      canvas.style.backgroundImage = 'none';
      canvas.style.backgroundColor = currentBackground;
      setTextColor(currentBackground);
      var imageInput = document.getElementById('background-image');
      var removeImage = document.getElementById('remove-background-image');
      if (imageInput) imageInput.value = '';
      if (removeImage) removeImage.hidden = true;
      if (imageObjectUrl) { URL.revokeObjectURL(imageObjectUrl); imageObjectUrl = null; }
    }

    function setGradient(button) {
      clearSelected();
      button.classList.add('is-selected');
      button.setAttribute('aria-pressed', 'true');
      canvas.classList.remove('has-image', 'has-preset-background');
      canvas.style.backgroundImage = button.dataset.bgGradient;
      canvas.style.backgroundColor = 'transparent';
      /* A cor clara mantém contraste nos gradientes escuros; o texto tem sombra discreta. */
      canvas.style.color = /#111936|#222222/i.test(button.dataset.bgGradient) ? '#FFFFFF' : '#17192B';
      canvas.classList.add('has-gradient');
      var imageInput = document.getElementById('background-image');
      var removeImage = document.getElementById('remove-background-image');
      if (imageInput) imageInput.value = '';
      if (removeImage) removeImage.hidden = true;
      if (imageObjectUrl) { URL.revokeObjectURL(imageObjectUrl); imageObjectUrl = null; }
    }

    function updateText() {
      output.textContent = input.value || (SV.language && SV.language.get() === 'en' ? 'Your text goes here.' : 'O teu texto aparece aqui.');
      if (count) count.textContent = input.value.length + '/' + (input.maxLength > 0 ? input.maxLength : 260);
      canvas.classList.toggle('is-empty', !input.value.trim());
    }
    input.addEventListener('input', updateText);

    document.querySelectorAll('[data-bg-color]').forEach(function (button) {
      button.addEventListener('click', function () { setSolidColor(button); });
    });
    document.querySelectorAll('[data-bg-gradient]').forEach(function (button) {
      button.addEventListener('click', function () { setGradient(button); });
    });

    var imageInput = document.getElementById('background-image');
    var removeImage = document.getElementById('remove-background-image');
    if (imageInput) imageInput.addEventListener('change', function () {
      var file = imageInput.files && imageInput.files[0];
      if (!file) return;
      if (!file.type || file.type.indexOf('image/') !== 0) {
        imageInput.value = '';
        return;
      }
      if (imageObjectUrl) URL.revokeObjectURL(imageObjectUrl);
      imageObjectUrl = URL.createObjectURL(file);
      clearSelected();
      canvas.classList.remove('has-gradient', 'has-preset-background');
      canvas.classList.add('has-image');
      canvas.style.backgroundImage = 'linear-gradient(rgba(0,0,0,.25), rgba(0,0,0,.25)), url("' + imageObjectUrl + '")';
      canvas.style.backgroundColor = '#222222';
      canvas.style.color = '#ffffff';
      if (removeImage) removeImage.hidden = false;
    });
    if (removeImage) removeImage.addEventListener('click', function () {
      var selected = document.querySelector('[data-bg-color][data-default="true"]') || document.querySelector('[data-bg-color]');
      if (selected) setSolidColor(selected);
    });

    var showLabel = document.getElementById('show-meme-label');
    var label = document.getElementById('meme-label-text');
    var separator = document.querySelector('.meme-separator');
    function updateLabelVisibility() {
      var visible = !showLabel || showLabel.checked;
      if (label) label.hidden = !visible;
      if (separator) separator.hidden = !visible;
    }
    if (showLabel) showLabel.addEventListener('change', updateLabelVisibility);
    updateLabelVisibility();

    var font = document.getElementById('meme-font');
    if (font) font.addEventListener('change', function () {
      canvas.classList.remove('font-poppins', 'font-merriweather', 'font-system');
      canvas.classList.add('font-' + font.value);
    });
    var size = document.getElementById('meme-size');
    if (size) size.addEventListener('change', function () {
      canvas.classList.remove('size-small', 'size-medium', 'size-large');
      canvas.classList.add('size-' + size.value);
    });
    document.querySelectorAll('[data-align]').forEach(function (button) {
      button.addEventListener('click', function () {
        canvas.classList.remove('align-left', 'align-center', 'align-right');
        canvas.classList.add('align-' + button.dataset.align);
        document.querySelectorAll('[data-align]').forEach(function (other) {
          var selected = other === button;
          other.classList.toggle('is-selected', selected);
          other.setAttribute('aria-pressed', String(selected));
        });
      });
    });

    document.addEventListener('sv:languagechange', function (event) {
      var lang = event.detail && event.detail.lang;
      if (selectedMemeText) {
        var translated = selectedMemeText[lang] || selectedMemeText.pt;
        if (input.value === originalText || input.value === selectedMemeText.pt || input.value === selectedMemeText.en) {
          input.value = translated;
          originalText = translated;
        }
      } else if (input.value === defaultPT || input.value === defaultEN || input.value === originalText) {
        input.value = lang === 'en' ? defaultEN : defaultPT;
        originalText = input.value;
      }
      updateText();
    });
    updateText();
    setTextColor(currentBackground);
    if (imageObjectUrl) URL.revokeObjectURL(imageObjectUrl);
  }
  document.addEventListener('DOMContentLoaded', init);
})();
