/* Biblioteca de poemas e exportação individual PNG/JPG/PDF. */
(function(){
  var SV=window.StoryVerse=window.StoryVerse||{};
  function init(){
    var grid=document.getElementById('poems-grid'), search=document.getElementById('poems-search'), empty=document.getElementById('poems-empty');
    if(!grid)return;
    var all=(window.SV_CONTENTS||[]).filter(function(x){return x.type==='poem';});
    var lang=SV.language?SV.language.get():'pt';
    function title(x){return x.title[lang]||x.title.pt;}
    function text(x){return x.text[lang]||x.text.pt;}
    function exportPoem(item,format,button){
      if(typeof window.html2canvas!=='function'){button.textContent=lang==='en'?'Export library unavailable':'Exportação indisponível';return;}
      var card=document.createElement('article');card.className='poem-export-card';
      var brand=document.createElement('small');brand.textContent='STORYVERSE';
      var h=document.createElement('h2');h.textContent=title(item);
      var body=document.createElement('p');body.textContent=text(item);
      var ref=document.createElement('small');ref.textContent=item.id;
      card.append(brand,h,body,ref);document.body.appendChild(card);
      button.disabled=true;var old=button.textContent;button.textContent=lang==='en'?'Preparing…':'A preparar…';
      window.html2canvas(card,{scale:2,backgroundColor:null,useCORS:true}).then(function(canvas){
        var filename=item.id.toLowerCase();
        if(format==='pdf'){
          if(!window.jspdf||!window.jspdf.jsPDF)throw new Error('PDF library unavailable');
          var pdf=new window.jspdf.jsPDF({orientation:'portrait',unit:'px',format:[canvas.width,canvas.height]});
          pdf.addImage(canvas.toDataURL('image/png'),'PNG',0,0,canvas.width,canvas.height);pdf.save(filename+'.pdf');
        }else{
          var mime=format==='jpg'?'image/jpeg':'image/png';var link=document.createElement('a');link.download=filename+'.'+format;link.href=canvas.toDataURL(mime,0.94);link.click();
        }
      }).catch(function(){button.textContent=lang==='en'?'Export failed':'Falha na exportação';}).finally(function(){card.remove();button.disabled=false;if(button.isConnected){window.setTimeout(function(){button.textContent=old;},1800);}});
    }
    function render(){
      lang=SV.language?SV.language.get():lang;var q=(search&&search.value||'').trim().toLocaleLowerCase();
      var norm=function(v){return v.normalize?v.normalize('NFD').replace(/[\u0300-\u036f]/g,''):v;};q=norm(q);grid.innerHTML='';
      var visible=all.filter(function(x){return !q||norm((title(x)+' '+text(x)+' '+x.id).toLocaleLowerCase()).indexOf(q)!==-1;});
      visible.forEach(function(item){
        var card=document.createElement('article');card.className='poem-library-card';
        var meta=document.createElement('div');meta.className='poem-card-meta';meta.textContent=item.season==='christmas'?(lang==='en'?'CHRISTMAS':'NATAL'):item.season==='newyear'?(lang==='en'?'NEW YEAR':'ANO NOVO'):(lang==='en'?'POEM':'POEMA');
        var h=document.createElement('h2');h.textContent=title(item);
        var body=document.createElement('p');body.className='poem-excerpt';body.textContent=text(item).split('\n').slice(0,4).join('\n');
        var id=document.createElement('small');id.textContent=item.id;
        var actions=document.createElement('div');actions.className='poem-actions';var edit=document.createElement('a');edit.className='poem-edit-link';edit.href='modelos.html?category=poems&poem='+encodeURIComponent(item.id);edit.textContent=lang==='en'?'Edit poem':'Editar poema';var read=document.createElement('a');read.className='poem-edit-link poem-read-link';read.href='poema-leitura.html?poem='+encodeURIComponent(item.id)+(SV.language&&SV.language.isExplicit()?'&lang='+lang:'');read.textContent=lang==='en'?'Read':'Ler';actions.appendChild(read);actions.appendChild(edit);
        [['png','PNG'],['jpg','JPG'],['pdf','PDF']].forEach(function(pair){var b=document.createElement('button');b.type='button';b.textContent=lang==='en'?'Export '+pair[1]:'Exportar '+pair[1];b.addEventListener('click',function(){exportPoem(item,pair[0],b);});actions.appendChild(b);});
        card.append(meta,h,body,id,actions);grid.appendChild(card);
      });if(empty)empty.hidden=visible.length!==0;
      if(window.lucide&&window.lucide.createIcons)window.lucide.createIcons();
    }
    if(search)search.addEventListener('input',render);document.addEventListener('sv:languagechange',render);render();
  }
  document.addEventListener('DOMContentLoaded',init);
})();
