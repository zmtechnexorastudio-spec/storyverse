/* Seleção explícita da categoria e do modelo antes de abrir o editor. */
(function(){
  var SV=window.StoryVerse=window.StoryVerse||{};
  function init(){
    var params=new URLSearchParams(location.search), category=params.get('category')||'';
    var grid=document.getElementById('model-grid'), notReady=document.getElementById('models-not-ready');
    var title=document.getElementById('models-title'), subtitle=document.getElementById('models-subtitle');
    var lang=SV.language?SV.language.get():'pt';
    var names={memes:['Memes','Memes'],status:['Status','Status'],thoughts:['Pensamentos','Thoughts'],poems:['Poemas','Poems'],stories:['Histórias','Stories']};
    if(!names[category]){location.replace('criar.html'+location.search);return;}
    var supported=['memes','status','thoughts','poems'];
    if(supported.indexOf(category)===-1){title.textContent=(lang==='en'?'Create ':'Criar ')+names[category][lang==='en'?1:0];grid.hidden=true;notReady.hidden=false;return;}
    var catalog=(window.SV_TEMPLATE_CATALOG||[]).filter(function(t){return t.type===(category==='thoughts'?'thought':category==='memes'?'meme':category==='poems'?'poem':'status');});
    var labels={memes:['Meme','Meme'],status:['Status','Status'],thoughts:['Pensamento','Thought'],poems:['Poema','Poem']};
    function render(){
      var en=SV.language&&SV.language.get()==='en';params=new URLSearchParams(location.search);grid.innerHTML='';grid.hidden=false;notReady.hidden=true;
      catalog.map(function(t,i){return {id:t.id,num:String(i+1).padStart(2,'0'),pt:t.name,en:t.nameEn||t.name,descPt:t.descPt||'Modelo visual para personalizares.',descEn:t.descEn||'A visual template to customize.',style:t.composition||'classic'};}).forEach(function(t){
        var a=document.createElement('a');a.className='model-card';
        var next=new URLSearchParams();next.set('template',t.id);next.set('category',category);['lang','theme','meme','thought','status','poem'].forEach(function(k){var v=params.get(k);if(v)next.set(k,v);});a.href=(category==='poems'?'editor-poema.html':'editor-meme.html')+'?'+next.toString();
        var sample=document.createElement('div');sample.className='model-sample sample-'+t.style;
        var brand=document.createElement('span');brand.className='model-sample-brand';brand.textContent='STORYVERSE';
        var text=document.createElement('strong');text.textContent=en?'YOUR IDEA GOES HERE':'A TUA IDEIA AQUI';
        var tag=document.createElement('span');tag.className='model-sample-tag';tag.textContent=(labels[category][en?1:0]||'')+' '+t.num;
        sample.append(brand,text,tag);
        var meta=document.createElement('div');meta.className='model-card-meta';
        var h=document.createElement('h2');h.textContent=t.num+' · '+(en?t.en:t.pt);
        var p=document.createElement('p');p.textContent=en?t.descEn:t.descPt;
        var action=document.createElement('span');action.className='model-card-action';action.textContent=en?'Choose this template':'Escolher este modelo';
        meta.append(h,p,action);a.append(sample,meta);grid.appendChild(a);
      });
    }
    render();document.addEventListener('sv:languagechange',render);
  }
  document.addEventListener('DOMContentLoaded',init);
})();