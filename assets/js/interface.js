/* ==========================================================================
   Interface — cabeçalho no scroll, menu mobile e revelação
   ========================================================================== */

(function () {
  'use strict';

  /* --- Cabeçalho ganha fundo depois de 80px de rolagem -------------------- */

  const cabecalho = document.getElementById('cabecalho');
  const LIMITE = 80;

  function aoRolar() {
    cabecalho.classList.toggle('is-preso', window.scrollY > LIMITE);
  }

  window.addEventListener('scroll', aoRolar, { passive: true });
  aoRolar();

  /* --- Menu mobile -------------------------------------------------------- */

  const botao = document.getElementById('menu-btn');
  const nav = document.getElementById('nav');

  function fecharMenu() {
    nav.classList.remove('is-aberto');
    botao.setAttribute('aria-expanded', 'false');
    botao.setAttribute('aria-label', 'Abrir menu');
  }

  botao.addEventListener('click', function () {
    const aberto = nav.classList.toggle('is-aberto');
    botao.setAttribute('aria-expanded', String(aberto));
    botao.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
  });

  // Clicar num link fecha o menu; Esc também
  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') fecharMenu();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('is-aberto')) {
      fecharMenu();
      botao.focus();
    }
  });

  /* --- Cards interativos --------------------------------------------------
     Clicar fixa o destaque (o hover já dá o mesmo visual ao passar o mouse).
     Clicar de novo desfaz. Só cor: nenhuma informação depende disso.
     ------------------------------------------------------------------------ */

  document.querySelectorAll('.card--interativo').forEach(function (card) {
    card.addEventListener('click', function () {
      card.classList.toggle('is-ativo');
    });
  });

  /* --- Revelação suave ---------------------------------------------------
     Respeita prefers-reduced-motion: se o usuário pediu menos movimento,
     mostra tudo de uma vez sem animar.
     ------------------------------------------------------------------------ */

  const alvos = document.querySelectorAll('.revela');
  const menosMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (menosMovimento || !('IntersectionObserver' in window)) {
    alvos.forEach(function (el) { el.classList.add('is-visivel'); });
    return;
  }

  const observador = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (entrada) {
      if (!entrada.isIntersecting) return;
      entrada.target.classList.add('is-visivel');
      observador.unobserve(entrada.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  alvos.forEach(function (el, i) {
    el.style.transitionDelay = Math.min(i * 70, 350) + 'ms';
    observador.observe(el);
  });
})();
