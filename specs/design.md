# Design — GJ Viagens

Decisões de design do site. **Este arquivo manda.** Pedido que contradiga o que está aqui
deve parar e ser discutido antes de qualquer mudança (ver regra 1 do CLAUDE.md).

**Base:** https://travel-magic-craft.lovable.app — material da própria GJ, feito por IA
para a empresa. Dela vêm **estrutura, paleta, ritmo, tom e conteúdo** — textos e case
inclusive (ver @specs/conteudo.md). Tipografia e logo **não** vêm dela: vêm dos arquivos
do projeto.

**Clima alvo:** corporativo premium, sóbrio, confiável. Navy profundo + dourado discreto.
Nada de "promoção de agência de turismo": sem laranja, sem vermelho, sem carimbo de oferta.

---

## 1. Paleta

Extraída da referência. Valores canônicos em HEX; o oklch original está ao lado porque a
referência é construída nele e a conversão pode variar em 1–2 pontos.

| Token | HEX | oklch | Uso |
|---|---|---|---|
| `--bg` | `#F8FCFF` | `oklch(98.8% .006 240)` | Fundo padrão das seções claras |
| `--surface` | `#FFFFFF` | `oklch(100% 0 0)` | Cards, caixas sobre fundo claro |
| `--muted` | `#EAF1F8` | `oklch(95.5% .012 245)` | Fundos secundários, linhas zebradas de tabela |
| `--secondary` | `#E3F1FB` | `oklch(95% .02 240)` | Fundo das seções alternadas |
| `--border` | `#D7DFE8` | `oklch(90% .015 250)` | Bordas de card, divisórias |
| `--text` | `#0B1A31` | `oklch(22% .05 258)` | Texto principal sobre claro |
| `--text-soft` | `#5D6E80` | `oklch(53% .035 250)` | Texto de apoio, legendas |
| `--primary` | `#032B54` | `oklch(29% .085 253)` | Navy — fundo das seções de peso |
| `--navy-deep` | `#02132E` | `oklch(19% .06 258)` | Navy profundo — rodapé, sobreposições |
| `--on-primary` | `#F3FAFF` | `oklch(98% .01 240)` | Texto sobre navy |
| `--accent` | `#DCB05B` | `oklch(78% .115 82)` | Dourado — CTA, eyebrow, destaques |
| `--on-accent` | `#0B1F3B` | `oklch(24% .06 258)` | Texto sobre dourado |
| `--gold-soft` | `#F0DCB1` | `oklch(90% .06 85)` | Dourado suave — bordas, ícones sobre navy |

### Regras de cor

- **Dourado é acento, não superfície.** Só CTA primário, eyebrow, número de destaque,
  ícone e filete. Nunca fundo de seção inteira, nunca bloco grande de texto.
- **Um CTA dourado por dobra.** Se houver dois botões, o segundo é outline.
- **Sem modo escuro por enquanto.** A referência publica só o tema claro; as seções navy
  são parte da composição, não um tema alternativo.
- Texto sobre navy: `--on-primary`. Texto sobre dourado: `--on-accent` (nunca branco —
  branco sobre `#DCB05B` não passa em contraste).

---

## 2. Tipografia

A referência usa Fraunces + Manrope. **Aqui a serifada sai e entra a Saira Condensed**,
que é a fonte do projeto. Decisão de 2026-08-20: Saira nos títulos, Manrope no corpo —
mantém o contraste display/texto da referência sem colocar parágrafo longo em condensada.

- **Display / títulos / números:** Saira Condensed — `assets/fonts/Saira_Condensed/` (9 pesos, OFL)
- **Corpo / UI / botões:** Manrope — Google Fonts, pesos 400/500/600/700

```css
--font-display: "Saira Condensed", "Arial Narrow", sans-serif;
--font-body: "Manrope", system-ui, -apple-system, sans-serif;
```

### Escala

Condensada ocupa menos largura, então os títulos crescem ~10% em relação à referência
para segurar o mesmo peso óptico.

| Papel | Fonte | Desktop | Mobile | Peso | Entrelinha | Tracking |
|---|---|---|---|---|---|---|
| H1 (hero) | Saira Cond. | 68px | 40px | 700 | 1.05 | −0.01em |
| H2 (seção) | Saira Cond. | 40px | 30px | 600 | 1.12 | −0.005em |
| H3 (card) | Saira Cond. | 24px | 21px | 600 | 1.2 | 0 |
| Eyebrow | Saira Cond. | 13px | 12px | 600 | 1.2 | **0.18em**, caixa alta |
| Número/stat | Saira Cond. | 56–72px | 40px | 800 | 1.0 | −0.02em |
| Corpo | Manrope | 18px | 17px | 400 | 1.62 | normal |
| Corpo pequeno | Manrope | 16px | 15px | 400 | 1.6 | normal |
| Botão | Manrope | 14px | 14px | 600 | 1 | 0.35px |
| Rótulo de tabela | Manrope | 13px | 12px | 600 | 1.4 | 0.06em, caixa alta |

### Regras de tipografia

- **Nunca parágrafo em Saira Condensed.** Condensada é para título, número e eyebrow.
- **Eyebrow sempre curto** (2–4 palavras) e em `--accent` sobre navy, `--text-soft` sobre claro.
- Números de resultado são o segundo protagonista da página, depois dos títulos — usar
  Saira ExtraBold/Black e deixar respirar.
- Carregar Saira Condensed local via `@font-face` com `font-display: swap`; só os pesos
  usados (400, 600, 700, 800).

---

## 3. Layout e ritmo

- **Container:** máx. `1152px`, padding lateral `24px`.
- **Padding vertical de seção:** `112px` desktop / `72px` mobile.
- **Grid de cards:** 3 colunas desktop, 2 tablet, 1 mobile. Gap `24px`.
- **Raio:** card `16px` · botão pill (`9999px`) · input/campo `8px`.
- **Sombra:** quase nenhuma. Card se define por borda `1px solid var(--border)`, não por sombra.

### Alternância de fundo

A referência alterna fundo para criar respiração e marcar os momentos de peso:

```
claro → secondary → claro → NAVY → secondary → NAVY → secondary → NAVY(CTA final)
```

- **Nunca duas seções navy seguidas.**
- Navy é reservado para: proposta integrada, diferenciais de atendimento e CTA final.
- Card sobre navy: fundo `rgba(255,255,255,.06)` com borda `rgba(255,255,255,.12)` —
  não usar card branco sólido sobre navy.

### Hero

Imagem full-bleed com sobreposição navy em gradiente da esquerda para a direita:

```css
background: linear-gradient(to right,
  rgba(3,43,84,.95) 0%, rgba(3,43,84,.80) 50%, rgba(3,43,84,.30) 100%);
```

Texto alinhado à esquerda, dentro do container. Ordem: eyebrow → H1 → subtítulo (1 frase)
→ dois botões (dourado + outline) → faixa de 3 números-prova.

---

## 4. Componentes

**Botão primário** — fundo `--accent`, texto `--on-accent`, `14px 28px`, pill, Manrope 600/14px.
**Botão secundário** — transparente, borda `1px rgba(255,255,255,.4)` sobre navy ou
`1px var(--border)` sobre claro, mesmo tamanho.
**Card** — `--surface`, borda `1px var(--border)`, raio `16px`, padding `28px`.
**Ícone** — traço (não preenchido), 1.5px, cor `--accent` sobre navy, `--primary` sobre claro.
**Tabela de resultados** — cabeçalho em rótulo caixa alta, linhas zebradas com `--muted`,
coluna de economia em `--accent`, linha de total em peso 700.
**Passo numerado** — número em Saira 800 grande e `--accent` a 30% de opacidade atrás do título.

---

## 5. Logo

Arquivos em `assets/logo/`:

- `gj-monograma.svg` — `fill="currentColor"`, cor definida por CSS. **Use este por padrão.**
- `gj-monograma-branco.svg` — branco fixo, para quando não der para herdar cor.
- `logo gj vetorizada.svg` (raiz) — original do Illustrator, mantido como fonte. Não usar
  no site: o viewBox é `339×735` com a arte ocupando só um pedaço, então escala errado.

O monograma é **G + avião + J**: o avião ocupa o miolo entre as duas letras e é o elemento
que conta a marca. Arte: `128.74 × 116.86`; o viewBox dos arquivos é `90 250 137 125`,
com um respiro em volta — proporção final ≈ 1.1:1.

- Sobre navy: **branco inteiro** (decisão de 2026-08-20). O dourado fica reservado para
  CTA e destaques — logo dourada competiria com os botões.
- Sobre fundo claro: `--primary` (`#032B54`). Preto puro só em material impresso.
- Altura mínima: 28px. Abaixo disso o avião fecha e vira mancha.
- Área de respiro: metade da altura do monograma em todos os lados.
- Nunca: distorcer, rotacionar, aplicar sombra, recolorir o avião separado das letras,
  ou colocar sobre foto sem sobreposição escura.

---

## 6. Tom

**Ideia central:** *Você cuida do seu negócio. A GJ cuida da sua viagem.*

- **Afirmativo e direto.** Título é promessa, não descrição. Frases curtas.
- **Primeira pessoa do plural** para o que a GJ faz: "Cuidamos", "Auditamos", "Emitimos".
- **Número no lugar de adjetivo.** "R$ 7.864,32 em 15 dias" vale mais que "grande economia".
  Todo número exibido precisa de origem real — nunca inventar caso ou valor.
- **Estrutura de seção:** eyebrow curto em caixa alta → título afirmativo → uma frase de
  contexto → prova (número, card ou tabela).
- **Evitar:** jargão de agência ("pacotes imperdíveis", "o melhor preço"), superlativo
  vazio, exclamação, emoji.
- **Calibragem:** a referência usa vocabulário mais agressivo ("economia brutal",
  "estratégias implacáveis"). Manter a confiança, baixar a agressividade — o
  posicionamento é *parceira estratégica*, e os cinco eixos são praticidade,
  inteligência, economia, segurança e suporte.

---

## 7. Acessibilidade

- Contraste mínimo 4.5:1 em texto corrido. `--text-soft` sobre `--bg` e `--on-accent`
  sobre `--accent` já passam; conferir qualquer par novo antes de usar.
- Foco visível em tudo que é clicável: contorno `2px var(--accent)` com `2px` de offset.
- Alvo de toque mínimo 44×44px.
- Respeitar `prefers-reduced-motion`: sem animação de entrada quando ativo.
- Movimento é discreto — fade e deslocamento de poucos pixels. Sem parallax, sem carrossel
  automático.

---

## 8. Ainda em aberto

Perguntar antes de decidir:

- Fotografia: banco de imagens ou material próprio da GJ? Define o hero e as seções de frente.
- Formulário de diagnóstico no site ou tudo via WhatsApp?
- Assinatura tipográfica ao lado do monograma (lockup "GJ VIAGENS") — existe versão
  aprovada ou monta a partir da Saira Condensed?
