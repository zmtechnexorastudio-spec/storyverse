/* Feedback: botão fixo + painel com três opções que abrem o WhatsApp
   com mensagem preenchida. Abrir o WhatsApp NÃO significa que o feedback foi enviado,
   por isso a interface não afirma envio. */
(function () {
  var SV = (window.StoryVerse = window.StoryVerse || {});
  var popup, toggle;

  /* Preenche os contentores de opções a partir do <template> (reutilização do componente) */
  function mount() {
    var tpl = document.getElementById('tpl-feedback-options');
    if (!tpl) return;
    document.querySelectorAll('[data-feedback-options]').forEach(function (box) {
      box.appendChild(tpl.content.cloneNode(true));
    });
  }

  function setOpen(open) {
    if (!popup || !toggle) return;
    popup.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    if (open) {
      var first = popup.querySelector('.fb-option');
      if (first) first.focus();
    }
  }

  function openWhatsApp(type) {
    var cfg = window.SV_CONFIG || {};
    var number = String(cfg.whatsappNumber || '').replace(/\D/g, '');
    var text = SV.language ? SV.language.t('wa.' + type) : '';
    var url = 'https://wa.me/' + number + '?text=' + encodeURIComponent(text);

    if (SV.track) {
      SV.track('feedback_option', { option: type });
      SV.track('whatsapp_open', { option: type }); // abertura do WhatsApp, não envio
    }
    window.open(url, '_blank', 'noopener');
  }

  function init() {
    mount();
    popup = document.getElementById('feedback-popup');
    toggle = document.querySelector('[data-feedback-toggle]');

    if (toggle) {
      toggle.addEventListener('click', function () {
        var willOpen = popup.hidden;
        setOpen(willOpen);
        if (willOpen && SV.track) SV.track('feedback_click');
      });
    }

    document.addEventListener('click', function (e) {
      var opt = e.target.closest('[data-feedback]');
      if (opt) { openWhatsApp(opt.dataset.feedback); return; }

      if (e.target.closest('[data-feedback-close]')) { setOpen(false); if (toggle) toggle.focus(); return; }

      // clique fora fecha o painel
      if (popup && !popup.hidden && !e.target.closest('.fab-wrap')) setOpen(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && popup && !popup.hidden) { setOpen(false); if (toggle) toggle.focus(); }
    });
  }

  SV.feedback = { init: init };
})();
