/* Renderização da biblioteca de status do Arquivo 10. */
(function () {
  var SV = window.StoryVerse = window.StoryVerse || {};
  var palettes = [
    ["background-01.svg","#182b5c"],["background-07.svg","#542b63"],["background-12.svg","#203d68"],
    ["background-18.svg","#633b43"],["background-23.svg","#1f5060"],["background-29.svg","#533f76"],
    ["background-04.svg","#34416d"],["background-15.svg","#604b38"],["background-20.svg","#293b56"],
    ["background-09.svg","#603c58"],["background-26.svg","#244e57"],["background-05.svg","#483a69"]
  ];
  var seasonImages = {
    christmas:["christmas-01.svg","christmas-02.svg","christmas-03.svg","christmas-04.svg","christmas-05.svg","christmas-06.svg"],
    newyear:["newyear-01.svg","newyear-02.svg","newyear-03.svg","newyear-04.svg","newyear-05.svg","newyear-06.svg"]
  };
  function textFor(item, lang) { return item.text && (item.text[lang] || item.text.pt) || ""; }
  function titleFor(item, lang) { return item.title && (item.title[lang] || item.title.pt) || item.id; }
  function previewBackground(item, index) {
    if (item.season === "christmas") {
      var c = seasonImages.christmas[index % seasonImages.christmas.length];
      return "url('../assets/backgrounds/christmas/" + c + "')";
    }
    if (item.season === "newyear") {
      var n = seasonImages.newyear[index % seasonImages.newyear.length];
      return "url('../assets/backgrounds/newyear/" + n + "')";
    }
    return "url('../assets/backgrounds/" + palettes[index % palettes.length][0] + "')";
  }
  function init() {
    var grid = document.getElementById("status-grid");
    var search = document.getElementById("status-search");
    var empty = document.getElementById("status-empty");
    if (!grid) return;
    var all = (window.SV_CONTENTS || []).filter(function (item) { return item.type === "status"; });
    var lang = SV.language ? SV.language.get() : "pt";

    function render() {
      lang = SV.language ? SV.language.get() : lang;
      var query = (search && search.value || "").trim().toLocaleLowerCase();
      var normalized = query.normalize ? query.normalize("NFD").replace(/[\u0300-\u036f]/g, "") : query;
      grid.innerHTML = "";
      var visible = all.filter(function (item) {
        var haystack = (titleFor(item, lang) + " " + textFor(item, lang)).toLocaleLowerCase();
        if (haystack.normalize) haystack = haystack.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        return !normalized || haystack.indexOf(normalized) !== -1;
      });
      visible.forEach(function (item) {
        var index = all.indexOf(item);
        var card = document.createElement("article");
        card.className = "meme-card";
        var preview = document.createElement("div");
        preview.className = "meme-card-preview";
        preview.style.backgroundImage = previewBackground(item, index);
        var brand = document.createElement("span");
        brand.className = "meme-preview-brand";
        brand.textContent = "STORYVERSE";
        var sample = document.createElement("p");
        sample.textContent = textFor(item, lang);
        var id = document.createElement("span");
        id.className = "meme-preview-id";
        id.textContent = item.id;
        preview.append(brand, sample, id);

        var body = document.createElement("div");
        body.className = "meme-card-body";
        var heading = document.createElement("h3");
        heading.textContent = titleFor(item, lang);
        var excerpt = document.createElement("p");
        excerpt.textContent = textFor(item, lang);
        var actions = document.createElement("div");
        actions.className = "meme-card-actions";
        var copy = document.createElement("button");
        copy.type = "button";
        copy.innerHTML = '<i data-lucide="copy"></i><span>' + (lang === "en" ? "Copy text" : "Copiar texto") + '</span>';
        copy.addEventListener("click", function () {
          var value = textFor(item, lang);
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(value).then(function () {
              copy.querySelector("span").textContent = lang === "en" ? "Copied" : "Copiado";
              window.setTimeout(function () { copy.querySelector("span").textContent = lang === "en" ? "Copy text" : "Copiar texto"; }, 1500);
            }).catch(function () { copy.querySelector("span").textContent = lang === "en" ? "Copy unavailable" : "Cópia indisponível"; });
          } else {
            copy.querySelector("span").textContent = lang === "en" ? "Copy unavailable" : "Cópia indisponível";
          }
        });
        var customize = document.createElement("a");
        customize.href = "modelos.html?category=status&status=" + encodeURIComponent(item.id);
        if (SV.language && SV.language.isExplicit()) customize.href += "&lang=" + encodeURIComponent(lang);
        if (SV.navigation && SV.navigation.getTheme) customize.href += "&theme=" + encodeURIComponent(SV.navigation.getTheme());
        customize.innerHTML = '<span>' + (lang === "en" ? "Customize" : "Personalizar") + '</span><i data-lucide="arrow-up-right"></i>';
        actions.append(copy, customize);
        body.append(heading, excerpt, actions);
        card.append(preview, body);
        grid.appendChild(card);
      });
      if (empty) empty.hidden = visible.length !== 0;
      if (window.lucide && window.lucide.createIcons) window.lucide.createIcons();
    }
    if (search) search.addEventListener("input", render);
    document.addEventListener("sv:languagechange", render);
    render();
  }
  document.addEventListener("DOMContentLoaded", init);
})();
