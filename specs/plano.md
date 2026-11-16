# Plano de construção — Site GJ Viagens

Plano técnico anterior à primeira linha de código. Segue @specs/design.md (forma),
@specs/conteudo.md (texto) e @memoria.md (histórico). Medidas levantadas do DOM da base
(travel-magic-craft.lovable.app) em 2026-08-20, nos três breakpoints.

> **"Red lines" aqui = spec de medidas** — grid, margens, gutters, espaçamento vertical e
> dimensões de componente. É a leitura que fez sentido no contexto; se você quis dizer
> filetes/divisórias visuais, me avise que reescrevo a seção 3.

---

## 1. Escopo

**Uma página, rolagem única, 9 seções + header + rodapé.** Sem rotas internas, sem CMS,
sem área logada. Todo CTA leva a WhatsApp ou âncora interna.

| # | Seção | id | Fundo | Altura desktop |
|---|---|---|---|---|
| 0 | Header | — | transparente → sólido no scroll | 72px |
| 1 | Hero | `#hero` | imagem + overlay navy | 92vh (mín. 662px) |
| 2 | Quem somos | `#quem-somos` | claro | ~696px |
| 3 | Desafios | `#desafios` | secondary | ~703px |
| 4 | Atuação | `#atuacao` | claro | ~1083px+ |
| 5 | Parceria | `#parceria` | **navy** | ~657px |
| 6 | Resultados / case | `#resultados` | secondary | ~1037px |
| 7 | Atendimento | `#atendimento` | **navy** | ~1071px |
| 8 | Metodologia | `#metodologia` | secondary | ~672px |
| 9 | Contato / CTA | `#contato` | **navy** | ~837px |
| — | Rodapé | — | navy-deep | ~120px |

Altura total estimada: ~7.500px desktop, ~14.000px mobile.

**Atenção:** a seção 4 cresce. A base tem 3 frentes; o briefing pede 6. Com 6 cards a
seção passa de ~1.080px para ~1.900px desktop. Ver pendência P1.

---

## 2. Stack e arquivos

**HTML + CSS + JS puro.** Sem framework: é uma landing estática de 9 seções, e React/Vite
aqui só adiciona build e peso. CSS com custom properties (a paleta já está em tokens).

```
index.html
assets/
  css/  tokens.css · base.css · componentes.css · secoes.css
  js/   header-scroll.js · reveal.js · menu-mobile.js
  fonts/Saira_Condensed/   (converter TTF → WOFF2)
  logo/ gj-monograma.svg · gj-monograma-branco.svg
  img/  hero-*.webp (+ jpg fallback)
```

**Tarefa de build:** os 9 TTF pesam ~88KB cada. Converter para WOFF2 os 4 pesos usados
(400, 600, 700, 800) → ~35KB cada. Os outros 5 pesos não vão para o site.

---

## 3. Red lines — grid e medidas

### Breakpoints

| Nome | Faixa | Container | Padding lateral | Colunas de card |
|---|---|---|---|---|
| Mobile | < 768px | 100% | 24px | 1 |
| Tablet | 768–1023px | 753px | 24px | 2 |
| Desktop | ≥ 1024px | **1152px** | 24px | 3 |

Container máximo de 1152px, centralizado. Padding lateral **fixo em 24px** nos três —
confirmado no DOM da base, não muda com o breakpoint.

### Escala de espaçamento

Base 8px. Só usar estes degraus:

`4 · 8 · 12 · 16 · 24 · 32 · 40 · 56 · 72 · 80 · 112`

### Espaçamento vertical

| Medida | Desktop/Tablet | Mobile |
|---|---|---|
| Padding vertical de seção | **112px** | **80px** |
| Eyebrow → H2 | 16px | 12px |
| H2 → subtítulo | 24px | 16px |
| Subtítulo → grid | 56px | 40px |
| Gap entre cards | 24px | 24px |
| Padding interno do card | 28px | 24px |
| Grupo de botões (gap) | 16px | 12px |

Tablet mantém os 112px de seção — o corte para 80px acontece só abaixo de 768px.

### Dimensões fixas

| Elemento | Medida |
|---|---|
| Header | 72px de altura, sticky |
| Card | raio 16px · borda 1px `--border` · padding 28px |
| Botão | altura 46px (padding 14/28) · raio pill (9999px) |
| Input | altura 44px · raio 8px |
| Ícone | 24×24 padrão · 16×16 inline · traço 1.5px |
| Logo no header | 32px de altura (mín. absoluto 28px) |
| Alvo de toque | mínimo 44×44px |
| Foco | contorno 2px `--accent`, offset 2px |

---

## 4. Tipografia

Saira Condensed (títulos/números) + Manrope (corpo). Decisão registrada em @memoria.md.

### Escala por breakpoint

| Papel | Fonte | Peso | Mobile | Tablet/Desktop | Entrelinha | Tracking |
|---|---|---|---|---|---|---|
| H1 | Saira Cond. | 700 | 40px | **68px** | 1.05 | −0.01em |
| H2 | Saira Cond. | 600 | 30px | **40px** | 1.12 | −0.005em |
| H3 (card) | Saira Cond. | 600 | 21px | 24px | 1.2 | 0 |
| Eyebrow | Saira Cond. | 600 | 12px | 13px | 1.2 | **0.18em** ↑ |
| Stat grande | Saira Cond. | 800 | 40px | 56–72px | 1.0 | −0.02em |
| Corpo | Manrope | 400 | 17px | 18px | 1.62 | normal |
| Corpo pequeno | Manrope | 400 | 15px | 16px | 1.6 | normal |
| Texto de card | Manrope | 400 | 15px | 16px | 1.6 | normal |
| Botão | Manrope | 600 | 14px | 14px | 1 | 0.35px |
| Rótulo de tabela | Manrope | 600 | 12px | 13px | 1.4 | 0.06em ↑ |

**A troca de escala acontece em 768px**, num salto — igual à base, que vai de 36px para
60px no H1 sem passo intermediário. Se ficar brusco, usar `clamp()` no H1:
`clamp(40px, 6.5vw, 68px)`.

### Carregamento

```css
@font-face {
  font-family: "Saira Condensed";
  src: url("../fonts/SairaCondensed-Bold.woff2") format("woff2");
  font-weight: 700; font-display: swap;
}
```

- `<link rel="preload">` só no peso 700 (o H1 é o LCP).
- Manrope via Google Fonts com `preconnect`, pesos 400/600.
- **Fallback obrigatório:** `"Arial Narrow", sans-serif` para a Saira. Sem isso, o swap
  troca uma condensada por uma fonte larga e o H1 reflui feio.

---

## 5. Como os textos se comportam

Este é o ponto onde a troca de fonte mais cobra atenção: **condensada cabe mais caractere
na mesma largura**. Os `max-width` medidos na base foram calibrados para Fraunces/Manrope;
mantê-los em px faria a linha crescer de ~52 para ~65 caracteres.

### Medida de linha (o que controla)

| Bloco | Largura na base | Medida | Alvo com Saira |
|---|---|---|---|
| Subtítulo do hero | 576px | 52ch | **manter 52ch** → reduzir para ~500px |
| Parágrafo de corpo | 549px | 56ch | manter 56ch |
| Subtítulo de seção | 768px | **79ch** ⚠ | **baixar para 65ch** (~620px) |
| Texto de card | 200px | 23ch | manter |

⚠ Os 79ch do subtítulo de seção estão acima do confortável. Corrigir na construção.

**Regra:** definir medida em `ch`, não em `px`. Assim a largura se ajusta sozinha à fonte
e o problema não volta se a tipografia mudar.

- Corpo: `max-width: 60ch`
- Subtítulo de seção: `max-width: 65ch`, centralizado
- Título: `max-width: 20ch` (H1) / `24ch` (H2) — segura o título em 2–3 linhas

### Quebras e proteções

- **Sem hifenização automática** em português (`hyphens: none`) — os cortes do navegador
  em pt-BR erram bastante.
- `text-wrap: balance` nos H1/H2/H3 para distribuir as linhas; `text-wrap: pretty` nos
  parágrafos, evitando palavra órfã na última linha.
- **Nada de truncar com reticências.** Card com texto maior cresce em altura; os cards da
  fileira igualam altura por grid, não por corte.
- Valores em real (`R$ 7.864,32`) e telefone com `white-space: nowrap` — nunca quebram.
- Números de stat: `font-variant-numeric: tabular-nums`, para não dançar em animação de
  contagem.

### Comportamentos por bloco

**Header** — 5 links no desktop. Abaixo de 768px vira menu hambúrguer (na base, sobra 1
link visível no mobile). Fundo transparente sobre o hero, vira `--navy-deep` com sombra
sutil após 80px de scroll.

**Hero** — texto alinhado à esquerda, dentro do container. Ordem: eyebrow → H1 → subtítulo
→ 2 botões → faixa de 3 stats. No mobile os botões viram largura total, empilhados.

**Faixa de stats** — 3 colunas nos três breakpoints. ⚠ No mobile isso dá **93px por
coluna**, e "R$ 50k" mal cabe. Reduzir o stat mobile para 32px, ou empilhar 3 linhas.
Ver pendência P3.

**Tabela do case** — 6 colunas, ~720px de largura mínima. Já estoura no tablet. Envolver
em `overflow-x: auto` com `min-width: 640px` na tabela e uma sombra de borda indicando que
rola. **No mobile, virar cards**: um bloco por destino, com rótulo e valor em pares — ler
uma tabela de 6 colunas rolando lateralmente em 375px é ruim.

**Grid de cards** — 1 col (mobile) → 2 (tablet) → 3 (desktop). Na seção Atendimento são 9
itens: 3×3 no desktop fecha certo; no tablet dá 4 fileiras com 1 órfão — aceitável.

---

## 6. Imagens

**Achado central: a base tem uma única imagem** — o hero. Todo o resto é SVG e tipografia.
O ar premium vem de navy, dourado, espaço e escala de título, não de fotografia.

**Recomendação: manter assim.** No máximo 2 imagens no site todo. Isso deixa o site rápido,
evita o visual de banco de imagens e concentra o esforço numa foto boa em vez de oito medianas.

### Inventário

| # | Onde | Origem na base | Proporção | Entrega |
|---|---|---|---|---|
| 1 | Hero (fundo) | `hero-viagem.jpg` 1920×1088 | 16:9 (1.76) | obrigatória |
| 2 | Parceria ou Case | não existe | — | opcional, decidir |

Hero da base: *vista aérea da asa de um avião sobre ilhas tropicais ao pôr do sol*.

### Tamanhos de entrega

O hero é `object-fit: cover`, então a proporção do arquivo não manda — o recorte manda.

| Variante | Dimensão | Peso alvo | Uso |
|---|---|---|---|
| Desktop 2x | 2560×1440 | ≤ 220KB | telas ≥ 1440px |
| Desktop 1x | 1920×1080 | ≤ 140KB | 1024–1439px |
| Tablet | 1280×1024 | ≤ 100KB | 768–1023px |
| **Mobile (recorte próprio)** | 828×1200 | ≤ 90KB | < 768px |

**WebP com JPG de fallback.** AVIF opcional (ganha ~20%, mas dobra o trabalho de export).

### ⚠ Problema de recorte no mobile

Medido: a imagem 1920×1088 (paisagem, 1.76) é renderizada em **375×880** (retrato, 0.43)
com `object-position: 50% 50%`. É um corte de mais de 70% da largura — a composição da foto
se perde e sobra o miolo.

**Solução:** `<picture>` com recorte vertical próprio para mobile, não a mesma imagem
espremida:

```html
<picture>
  <source media="(max-width: 767px)" srcset="hero-mobile.webp" type="image/webp">
  <source srcset="hero-desktop.webp" type="image/webp">
  <img src="hero-desktop.jpg" alt="…" fetchpriority="high" decoding="async">
</picture>
```

### Regras

- Hero: `fetchpriority="high"`, **sem** `loading="lazy"` (é o LCP). Qualquer outra imagem:
  `loading="lazy"`.
- `width` e `height` sempre declarados — evita layout shift (meta CLS < 0.1).
- Foto sempre sob o gradiente navy do design.md. Nunca foto crua sob texto.
- `alt` descritivo em português. Imagem puramente decorativa: `alt=""`.
- Sem foto de rosto genérica de banco de imagens ("executivo sorrindo com laptop").
- Se houver material próprio da GJ, ele ganha da foto de banco.

### Ícones

20 SVGs inline, 24×24 na maioria. **Inline no HTML, não em `<img>`** — assim herdam
`currentColor` e trocam de cor entre seção clara e navy sem arquivo duplicado. Traço 1.5px,
não preenchidos.

---

## 7. Performance e acessibilidade

**Orçamento:** HTML+CSS+JS ≤ 150KB · fontes ≤ 180KB (4 WOFF2) · imagens ≤ 250KB.
Total da primeira dobra **abaixo de 600KB**.

Metas: LCP < 2,5s · CLS < 0,1 · Lighthouse ≥ 95 em Performance e Acessibilidade.

- Contraste mínimo 4.5:1 em texto corrido — conferir todo par novo.
- Foco visível em tudo que é clicável (2px `--accent`, offset 2px).
- HTML semântico: `<header> <main> <section> <footer>`, um `<h1>` só.
- `prefers-reduced-motion`: desliga as animações de entrada.
- Movimento discreto — fade + 8px de deslocamento, 400ms. Sem parallax, sem carrossel.
- `lang="pt-BR"`, meta description, Open Graph, favicon a partir do monograma.

---

## 8. Sequência de construção

1. **Fundação** — `index.html` semântico, `tokens.css` com a paleta, `@font-face`,
   reset, container e escala de espaçamento. *Entrega: página em branco com tokens válidos.*
2. **Header + Hero** — a dobra completa, com `<picture>`, overlay, stats e menu mobile.
   *É a parte mais cara; validar aqui antes de seguir.*
3. **Componentes** — card, botão, eyebrow, passo numerado, ícones. Numa página de teste.
4. **Seções 2 a 4** — Quem somos, Desafios, Atuação (depende da P1).
5. **Seções 5 a 9** — Parceria, Case (tabela + versão card mobile), Atendimento,
   Metodologia, CTA, rodapé.
6. **Passada responsiva** — 375 / 768 / 1024 / 1440, medida de linha, órfãos, tabela.
7. **Polimento** — reveal no scroll, foco, contraste, Lighthouse, meta tags.

Do 2 em diante, cada etapa fecha com revisão sua antes da próxima.

---

## 9. Pendências que travam

| # | Pendência | Trava | Impacto |
|---|---|---|---|
| **P1** | 6 frentes ou 3? Hospedagem, locação/seguros/encargos e suporte viram FRENTE 04/05/06, ou entram dentro de "soluções completas"? | Etapa 4 | Muda o grid e ~800px de altura |
| **P2** | Foto do hero: material próprio da GJ ou banco de imagens? | Etapa 2 | Trava a dobra inicial |
| **P3** | Stats no mobile: reduzir para 32px ou empilhar em 3 linhas? | Etapa 2 | Layout da dobra |
| **P4** | H1 fala só de milhas; com 6 frentes, revisar? | Etapa 2 | Texto da dobra |
| **P5** | Case do Douglas: cliente autoriza o primeiro nome no site público? | Etapa 5 | Texto do case |
| **P6** | Contato do rodapé (Gestor Gabriel, (41) 98760-5800, @gjviagens) confirma? | Etapa 5 | Rodapé e CTAs |
| **P7** | Formulário de diagnóstico no site, ou todo contato via WhatsApp? | Etapa 5 | Existe ou não o componente de form |
| **P8** | Lockup "GJ VIAGENS" ao lado do monograma: existe versão aprovada? | Etapa 2 | Header e rodapé |

**P1, P2 e P3 travam a etapa 2**, que é a primeira coisa a construir. As demais podem ser
respondidas durante o caminho.
