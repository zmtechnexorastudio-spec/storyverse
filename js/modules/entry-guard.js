/* Protecção de entrada dos editores.
   Quem abre o link de um editor vindo de fora (WhatsApp, redes sociais, endereço escrito à mão)
   é levado para a página inicial, porque um editor aberto "a frio" é só uma página vazia.
   Continuam a funcionar normalmente: navegar dentro do site, recarregar a página e voltar atrás.
   Mantém o idioma e o tema do link. Corre no <head>, antes de a página aparecer. */
(function () {
  try {
    var nav = performance.getEntriesByType && performance.getEntriesByType('navigation')[0];
    var type = nav && nav.type;
    if (type === 'reload' || type === 'back_forward') return;

    var ref = document.referrer || '';
    if (ref && new URL(ref).origin === location.origin) return;

    var q = new URLSearchParams(location.search);
    var keep = new URLSearchParams();
    ['lang', 'theme'].forEach(function (k) { if (q.get(k)) keep.set(k, q.get(k)); });
    var home = new URL('../index.html', location.href);
    home.search = keep.toString();
    location.replace(home.href);
  } catch (e) { /* se algo falhar, o editor abre normalmente */ }
})();
