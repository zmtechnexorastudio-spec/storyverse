/* Inicialização do editor visual; não guarda alterações de forma permanente. */
(function () {
  function init() {
    var template = window.SV_TEMPLATES && window.SV_TEMPLATES['meme-classico-01'];
    if (!template) return;
    var input = document.getElementById('meme-text');
    if (input && !input.value) input.value = template.defaultText;
    if (window.lucide && window.lucide.createIcons) window.lucide.createIcons();
  }
  document.addEventListener('DOMContentLoaded', init);
})();
