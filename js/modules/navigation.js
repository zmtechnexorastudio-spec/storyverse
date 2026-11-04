/* Navegação comum. Preferências de tema e idioma passam pelas ligações internas via URL. */
(function () {
  var SV = (window.StoryVerse = window.StoryVerse || {});
  var root = document.documentElement;
  var themeExplicit = false;
  var activeTheme = 'light';
  function readTheme() {
    var value = new URLSearchParams(window.location.search).get('theme');
    if (value === 'light' || value === 'dark') { themeExplicit = true; activeTheme = value; }
    else activeTheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    root.setAttribute('data-theme', activeTheme);
  }
  function setTheme(next) {
    activeTheme = next; themeExplicit = true; root.setAttribute('data-theme', next);
    try { var url = new URL(window.location.href); url.searchParams.set('theme', next); window.history.replaceState(null, '', url); } catch (e) {}
    decorateLinks();
  }
  function initTheme() {
    readTheme();
    document.querySelectorAll('.theme-toggle').forEach(function(btn){btn.addEventListener('click',function(){setTheme(activeTheme==='dark'?'light':'dark');if(SV.track)SV.track('theme_toggle',{theme:activeTheme});});});
  }
  function initMenu() {
    var btn=document.querySelector('.menu-toggle'),nav=document.getElementById('main-nav'); if(!btn||!nav)return;
    function setOpen(open){nav.classList.toggle('is-open',open);btn.setAttribute('aria-expanded',String(open));}
    btn.addEventListener('click',function(){setOpen(!nav.classList.contains('is-open'));});nav.addEventListener('click',function(e){if(e.target.closest('a'))setOpen(false);});document.addEventListener('keydown',function(e){if(e.key==='Escape')setOpen(false);});
  }
  function isInternal(href){return href&&!/^(https?:|mailto:|tel:|#|javascript:)/i.test(href);}
  function decorateLinks(){
    document.querySelectorAll('a[href]').forEach(function(a){
      if(!a.dataset.baseHref){var raw=a.getAttribute('href');if(!isInternal(raw)){a.dataset.baseHref='';return;}a.dataset.baseHref=raw;}
      var base=a.dataset.baseHref;if(!base)return;
      var hashIdx=base.indexOf('#'),hash=hashIdx>=0?base.slice(hashIdx):'',path=hashIdx>=0?base.slice(0,hashIdx):base;
      path=path.replace(/([?&])(lang|theme)=[^&]*&?/g,'$1').replace(/[?&]$/,'');
      var params=[];if(SV.language&&SV.language.isExplicit())params.push('lang='+encodeURIComponent(SV.language.get()));if(themeExplicit)params.push('theme='+encodeURIComponent(activeTheme));
      a.setAttribute('href',path+(params.length?(path.indexOf('?')>=0?'&':'?')+params.join('&'):'')+hash);
    });
  }
  function init(){initTheme();initMenu();document.addEventListener('sv:languagechange',decorateLinks);decorateLinks();}
  SV.navigation={init:init,getTheme:function(){return activeTheme;},setTheme:setTheme};
})();
