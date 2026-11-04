/* Botão "Escolher imagem" próprio (o botão nativo do navegador não segue o idioma do site).
   Mostra o nome do ficheiro escolhido e volta a "nenhum" quando a imagem é removida. */
(function () {
  var SV = (window.StoryVerse = window.StoryVerse || {});
  function init() {
    var input = document.getElementById('background-image'), name = document.getElementById('background-file-name');
    if (!input || !name) return;
    function sync() {
      var f = input.files && input.files[0];
      if (f) { name.removeAttribute('data-i18n'); name.textContent = f.name; }
      else { name.setAttribute('data-i18n', 'editor.noFile'); name.textContent = SV.language ? SV.language.t('editor.noFile') : ''; }
    }
    input.addEventListener('change', sync);
    // remover imagem ou escolher um fundo predefinido limpa o campo sem disparar "change"
    document.addEventListener('click', function () { setTimeout(sync, 0); });
    document.addEventListener('sv:languagechange', sync);
    sync();
  }
  document.addEventListener('DOMContentLoaded', init);
})();
