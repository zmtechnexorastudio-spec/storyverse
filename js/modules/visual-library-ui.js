/* Biblioteca visual reutilizável: fundos, texturas, formas, ícones, ilustrações e templates. */
(function () {
  var SV = (window.StoryVerse = window.StoryVerse || {});
  var lib = window.SV_VISUAL_LIBRARY;
  function t(key, fallback) { return SV.language ? SV.language.t(key) : fallback; }
  function button(label, attrs, cls) {
    var b = document.createElement('button'); b.type = 'button'; b.className = cls || 'visual-option'; b.setAttribute('aria-label', label); b.title = label;
    Object.keys(attrs || {}).forEach(function(k){ b.setAttribute(k, attrs[k]); }); return b;
  }
  function setSelected(selector, selected) { document.querySelectorAll(selector).forEach(function(b){var yes=b===selected;b.classList.toggle('is-selected',yes);b.setAttribute('aria-pressed',String(yes));}); }
  function init() {
    var canvas = document.getElementById('meme-canvas'); if (!canvas || !lib) return;
    var presetBox=document.getElementById('preset-backgrounds'), seasonalBox=document.getElementById('seasonal-backgrounds'), textureBox=document.getElementById('texture-options'), decoBox=document.getElementById('decoration-options'), iconBox=document.getElementById('icon-options'), illBox=document.getElementById('illustration-options'), gradientBox=document.getElementById('gradient-colors');
    if (gradientBox) { gradientBox.innerHTML=''; lib.gradients.forEach(function(g){ var b=button(g.name, {'data-bg-gradient':g.css,'aria-pressed':'false'}, 'swatch gradient-swatch'); b.style.setProperty('--swatch',g.css); var span=document.createElement('span'); span.style.setProperty('--swatch',g.css); b.appendChild(span); gradientBox.appendChild(b); }); }
    var artLayer=document.getElementById('meme-art-layer'); var decoLayer=document.getElementById('meme-decoration-layer'); var currentSeason='christmas';
    function makeThumb(item, target, kind) {
      var attrs={}; attrs['data-'+kind]=item.src; attrs['aria-pressed']='false'; var b=button(item.name, attrs, 'visual-thumb');
      b.style.backgroundImage='url("'+item.src+'")';
      var span=document.createElement('span'); var ptName=item.name; var enName=item.name; if(kind==='bg-preset'){enName=item.name.replace('Fundo','Background');} else if(item.id.indexOf('christmas-')===0){ptName='Natal '+item.id.slice(-2);enName='Christmas '+item.id.slice(-2);} else if(item.id.indexOf('newyear-')===0){ptName='Ano Novo '+item.id.slice(-2);enName='New Year '+item.id.slice(-2);} span.dataset.labelPt=ptName;span.dataset.labelEn=enName;span.textContent=SV.language&&SV.language.get()==='en'?enName:ptName;b.appendChild(span); target.appendChild(b);
      b.addEventListener('click',function(){
        document.querySelectorAll('[data-bg-color],[data-bg-gradient],[data-bg-preset],[data-season-preset]').forEach(function(x){x.classList.remove('is-selected');x.setAttribute('aria-pressed','false');});
        setSelected('[data-bg-preset]',kind==='bg-preset'?b:null); setSelected('[data-season-preset]',kind==='season-preset'?b:null);
        if(kind==='bg-preset') canvas.style.backgroundImage='url("'+item.src+'")';
        else canvas.style.backgroundImage='url("'+item.src+'")';
        var darkTone=item.tone==='dark'; canvas.style.backgroundColor=darkTone?'#0B1B2B':'#F8F3E9'; canvas.style.color=darkTone?'#FFFFFF':'#17192B'; canvas.style.textShadow='none'; canvas.classList.add('has-preset-background'); canvas.classList.toggle('tone-dark',darkTone); canvas.classList.remove('has-image','has-gradient');
        var img=document.getElementById('background-image'); if(img)img.value=''; var rem=document.getElementById('remove-background-image'); if(rem)rem.hidden=true;
      });
    }
    lib.backgrounds.forEach(function(x){makeThumb(x,presetBox,'bg-preset');});
    function renderSeason(name){ currentSeason=name; seasonalBox.innerHTML=''; lib.seasonal[name].forEach(function(x){makeThumb(x,seasonalBox,'season-preset');}); document.querySelectorAll('[data-season]').forEach(function(b){b.classList.toggle('is-selected',b.dataset.season===name);}); }
    document.querySelectorAll('[data-season]').forEach(function(b){b.addEventListener('click',function(){renderSeason(b.dataset.season);});}); renderSeason('christmas');
    var textureNames={paper:['Papel','Paper'],grain:['Grão','Grain'],linen:['Linho','Linen'],dots:['Pontos','Dots'],lines:['Linhas','Lines'],noise:['Ruído','Noise']};
    lib.textures.forEach(function(x){var label=textureNames[x.id][0];var b=button(label,{'data-texture':x.id,'aria-pressed':'false'},'visual-option texture-option');b.innerHTML='<span class="texture-preview texture-'+x.id+'"></span><span data-label-pt="'+textureNames[x.id][0]+'" data-label-en="'+textureNames[x.id][1]+'">'+label+'</span>';textureBox.appendChild(b);b.addEventListener('click',function(){var active=canvas.dataset.texture===x.id;delete canvas.dataset.texture;canvas.classList.remove('texture-paper','texture-grain','texture-linen','texture-dots','texture-lines','texture-noise');if(!active){canvas.dataset.texture=x.id;canvas.classList.add('texture-'+x.id);}setSelected('[data-texture]',active?null:b);});});
    var decoNames={none:['Nenhuma','None'],circle:['Círculo','Circle'],star:['Estrela','Star'],wave:['Onda','Wave'],corner:['Cantos','Corners'],rings:['Anéis','Rings'],sparkles:['Brilhos','Sparkles'],frame:['Moldura','Frame']};
    lib.decorations.forEach(function(x){var label=decoNames[x.id][0];var b=button(label,{'data-decoration':x.id,'aria-pressed':String(x.id==='none')},'visual-option decoration-option');b.innerHTML='<span class="deco-preview deco-'+x.id+'"></span><span data-label-pt="'+label+'" data-label-en="'+decoNames[x.id][1]+'">'+label+'</span>';decoBox.appendChild(b);b.addEventListener('click',function(){Array.from(canvas.classList).filter(function(c){return c.indexOf('decoration-')===0;}).forEach(function(c){canvas.classList.remove(c);});if(decoLayer){decoLayer.innerHTML='';if(x.id!=='none'){var shape=document.createElement('span');shape.className='decorative-shape shape-'+x.id;shape.setAttribute('aria-hidden','true');decoLayer.appendChild(shape);canvas.classList.add('decoration-'+x.id);}}setSelected('[data-decoration]',b);});});
    var artSequence = 0;
    var activeArt = null;
    function selectArt(el) {
      if (activeArt) activeArt.classList.remove('is-art-selected');
      activeArt = el || null;
      if (activeArt) activeArt.classList.add('is-art-selected');
      syncArtToolbar();
    }
    /* ----- Barra do elemento selecionado: cor (só ícones) e tamanho ----- */
    var artBar = document.getElementById('art-toolbar');
    var artEmpty = document.getElementById('art-empty');
    var artControls = document.getElementById('art-controls');
    var artColorRow = document.getElementById('art-color-row');
    var artNote = document.getElementById('art-note');
    var artSize = document.getElementById('art-size');
    var artSizeOut = document.getElementById('art-size-out');
    var artColorInput = document.getElementById('art-color-input');
    var artSwatchBox = document.getElementById('art-swatches');
    var ART_COLORS = ['#D9A62E','#F6DC8A','#FFFFFF','#111936','#17192B','#6C3FC5','#C4161C','#E8863A','#1F8A4C','#0F5132','#2F8CFF','#EE3D7F','#9AA0B5','#000000'];
    function rgbToHex(rgb) { var m = String(rgb).match(/\d+/g); if (!m || m.length < 3) return '#D9A62E'; return ('#' + m.slice(0, 3).map(function (n) { return ('0' + parseInt(n, 10).toString(16)).slice(-2); }).join('')).toUpperCase(); }
    function isIcon(el) { return !!el && el.classList.contains('picked-icon'); }
    function syncArtToolbar() {
      if (!artBar || !artControls) return;
      var el = activeArt;
      if (artEmpty) artEmpty.hidden = !!el;
      artControls.hidden = !el;
      if (!el) return;
      var icon = isIcon(el);
      if (artColorRow) artColorRow.hidden = !icon;
      if (artNote) artNote.hidden = icon;
      artSize.min = icon ? 6 : 10; artSize.max = icon ? 60 : 80;
      var size = parseFloat(el.dataset.size) || (icon ? 14 : 26);
      artSize.value = size; artSizeOut.textContent = Math.round(size) + '%';
      if (icon) {
        var hex = rgbToHex(window.getComputedStyle(el).color);
        artColorInput.value = hex.toLowerCase();
        artSwatchBox.querySelectorAll('.art-swatch').forEach(function (b) { var on = b.dataset.color === hex; b.classList.toggle('is-selected', on); b.setAttribute('aria-pressed', String(on)); });
      }
    }
    if (artBar && artSwatchBox) {
      ART_COLORS.forEach(function (c) {
        var b = document.createElement('button'); b.type = 'button'; b.className = 'art-swatch'; b.dataset.color = c; b.style.background = c; b.title = c; b.setAttribute('aria-label', c); b.setAttribute('aria-pressed', 'false');
        b.addEventListener('click', function () { if (isIcon(activeArt)) { activeArt.style.color = c; syncArtToolbar(); } });
        artSwatchBox.appendChild(b);
      });
      artColorInput.addEventListener('input', function () { if (isIcon(activeArt)) { activeArt.style.color = artColorInput.value; syncArtToolbar(); } });
      artSize.addEventListener('input', function () {
        if (!activeArt) return; var v = parseFloat(artSize.value);
        activeArt.dataset.size = v; activeArt.style.width = v + '%'; if (!isIcon(activeArt)) activeArt.style.maxHeight = 'none';
        artSizeOut.textContent = Math.round(v) + '%';
      });
      var artRemove = document.getElementById('art-remove');
      if (artRemove) artRemove.addEventListener('click', function () { if (!activeArt) return; var r = activeArt; selectArt(null); r.remove(); });
    }
    function makeDraggable(el) {
      el.addEventListener('pointerdown', function (event) {
        if (event.button !== undefined && event.button !== 0) return;
        event.preventDefault();
        selectArt(el);
        var rect = canvas.getBoundingClientRect();
        var elRect = el.getBoundingClientRect();
        var startX = event.clientX, startY = event.clientY;
        var startLeft = parseFloat(el.style.left) || ((elRect.left + elRect.width / 2 - rect.left) / rect.width * 100);
        var startTop = parseFloat(el.style.top) || ((elRect.top + elRect.height / 2 - rect.top) / rect.height * 100);
        el.setPointerCapture && el.setPointerCapture(event.pointerId);
        function move(e) {
          var left = Math.max(3, Math.min(97, startLeft + ((e.clientX - startX) / rect.width * 100)));
          var top = Math.max(3, Math.min(97, startTop + ((e.clientY - startY) / rect.height * 100)));
          el.style.left = left + '%'; el.style.top = top + '%';
        }
        function finish() {
          el.removeEventListener('pointermove', move);
          el.removeEventListener('pointerup', finish);
          el.removeEventListener('pointercancel', finish);
        }
        el.addEventListener('pointermove', move);
        el.addEventListener('pointerup', finish);
        el.addEventListener('pointercancel', finish);
      });
      el.addEventListener('click', function (event) { event.stopPropagation(); selectArt(el); });
    }
    function addIcon(name) {
      if (!artLayer) return;
      artSequence++;
      var wrap=document.createElement('span'); wrap.className='picked-icon'; wrap.dataset.icon=name; wrap.dataset.size='14'; wrap.style.width='14%';
      wrap.style.left=(42 + ((artSequence-1)%4)*5)+'%'; wrap.style.top=(44 + ((artSequence-1)%3)*6)+'%';
      var icon=document.createElement('i'); icon.setAttribute('data-lucide',name); wrap.appendChild(icon); artLayer.appendChild(wrap);
      if(window.lucide) window.lucide.createIcons({root:wrap});
      makeDraggable(wrap); selectArt(wrap);
    }
    function addIllustration(item) {
      if (!artLayer) return;
      artSequence++;
      var img=document.createElement('img'); img.className='picked-illustration'; img.src=item.src; img.alt=item.name; img.dataset.size='26'; img.style.width='26%';
      img.style.left=(54 + ((artSequence-1)%3)*5)+'%'; img.style.top=(53 + ((artSequence-1)%3)*5)+'%';
      artLayer.appendChild(img); makeDraggable(img); selectArt(img);
    }
    lib.icons.forEach(function(name){
      var b=button(name,{'data-icon-choice':name,'aria-pressed':'false'},'visual-icon-option');
      b.innerHTML='<i data-lucide="'+name+'"></i>'; iconBox.appendChild(b);
      b.addEventListener('click',function(){addIcon(name);setSelected('[data-icon-choice]',b);setSelected('[data-illustration-choice]',null);});
    });
    lib.illustrations.forEach(function(x){
      var b=button(x.name,{'data-illustration-choice':x.id,'aria-pressed':'false'},'visual-thumb illustration-thumb');
      b.style.backgroundImage='url("'+x.src+'")'; var span=document.createElement('span'); span.textContent=x.name; b.appendChild(span); illBox.appendChild(b);
      b.addEventListener('click',function(){addIllustration(x);setSelected('[data-illustration-choice]',b);setSelected('[data-icon-choice]',null);});
    });
    if (artLayer) {
      artLayer.addEventListener('pointerdown',function(event){if(event.target===artLayer)selectArt(null);});
      document.addEventListener('keydown',function(event){
        if ((event.key==='Delete'||event.key==='Backspace') && activeArt && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) {
          event.preventDefault(); var removed=activeArt; selectArt(null); removed.remove();
        }
      });
    }
    var templateSelect=document.getElementById('template-choice'); if(templateSelect){templateSelect.addEventListener('change',function(){var id=templateSelect.value;Array.from(canvas.classList).filter(function(c){return c.indexOf('template-')===0;}).forEach(function(c){canvas.classList.remove(c);});canvas.classList.add('template-'+id);var num=templateSelect.selectedIndex+1;var n=document.querySelector('.template-number');if(n)n.textContent=String(num).padStart(2,'0');labels();var eyebrow=document.querySelector('.editor-eyebrow [data-i18n]');if(eyebrow)eyebrow.textContent=(SV.language&&SV.language.get()==='en'?'CREATION STUDIO · TEMPLATE ':'ESTÚDIO DE CRIAÇÃO · TEMPLATE ')+String(num).padStart(2,'0');if(SV.track)SV.track('visual_template_change',{template:id});});}
    if(templateSelect){var requestedTemplate=new URLSearchParams(location.search).get('template');if(requestedTemplate&&Array.from(templateSelect.options).some(function(o){return o.value===requestedTemplate;})){templateSelect.value=requestedTemplate;templateSelect.dispatchEvent(new Event('change',{bubbles:true}));}}
    function labels(){var en=SV.language&&SV.language.get()==='en';document.querySelectorAll('[data-label-pt][data-label-en]').forEach(function(el){el.textContent=en?el.dataset.labelEn:el.dataset.labelPt;var parent=el.closest('button');if(parent){parent.title=el.textContent;parent.setAttribute('aria-label',el.textContent);}});
      document.querySelectorAll('[data-visual-name-pt][data-visual-name-en]').forEach(function(el){el.textContent=en?el.dataset.visualNameEn:el.dataset.visualNamePt;});
      if(templateSelect){Array.from(templateSelect.options).forEach(function(o){var pt=o.dataset.visualNamePt,enName=o.dataset.visualNameEn;if(pt&&enName)o.textContent=(o.dataset.number?o.dataset.number+' · ':'')+(en?enName:pt);});}
      var selOpt=templateSelect&&templateSelect.options[templateSelect.selectedIndex];if(selOpt){var cat=SV.editorCategory||{};var title=document.querySelector('.editor-intro h1');if(title)title.textContent=en?selOpt.dataset.visualNameEn:selOpt.dataset.visualNamePt;var sub=document.getElementById('editor-subtitle');if(sub&&selOpt.dataset.descPt)sub.textContent=en?selOpt.dataset.descEn:selOpt.dataset.descPt;var num=String((templateSelect.selectedIndex||0)+1).padStart(2,'0');var eyebrow=document.querySelector('.editor-eyebrow [data-i18n]');if(eyebrow)eyebrow.textContent=(en?'CREATION STUDIO · TEMPLATE ':'ESTÚDIO DE CRIAÇÃO · TEMPLATE ')+num;var ml=document.getElementById('meme-label-text');if(ml&&cat.word)ml.textContent=cat.word[en?1:0]+' '+num;}
    }
    document.addEventListener('sv:languagechange',labels); labels(); if(window.lucide)window.lucide.createIcons();
  }
  document.addEventListener('DOMContentLoaded',init);
})();
