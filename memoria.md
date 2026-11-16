# Memória do projeto

Decisões, alternativas descartadas e aprendizados. Ordem cronológica inversa (mais recente
no topo). Antes de propor qualquer coisa, conferir se já foi decidido aqui.

---

## 2026-11-16 — Pacote de publicação e SEO

Preparado tudo para o site sair do localhost. Guia completo em `PUBLICAR.md`.

### Onde o domínio está

`gjviagens.com.br` → `162.240.81.81`, DNS na **HostGator Brasil** (`dns3`/`dns4`),
com `www` em CNAME para o domínio raiz.

> 🚨 **O domínio não responde.** Timeout em `http://gjviagens.com.br` e em
> `https://www.gjviagens.com.br`. DNS configurado, mas nada escutando no IP. Provável
> hospedagem vencida, suspensa ou domínio não apontado dentro da conta. **Confirmar o
> plano na HostGator antes de qualquer upload** — sem servidor ligado não há onde subir.

### Criado nesta rodada

- `favicon.svg` — monograma branco sobre quadrado navy com cantos arredondados. O
  monograma sozinho vira mancha a 16px; o fundo navy resolve e ainda carrega a cor da marca.
- `assets/img/apple-touch-icon.png` (180), `icone-192.png`, `icone-512.png` — gerados com
  **Edge headless** a partir de um HTML temporário, já que não há conversor de imagem aqui.
- `site.webmanifest`, `robots.txt`, `sitemap.xml`.
- Links de ícone, `manifest` e `theme-color` no `<head>` do index.html.

### Confirmado: zero dependência do Lovable

As três imagens já estão locais (`hero-desktop.jpg`, `hero-mobile.jpg`, `og-gj-viagens.jpg`)
e nenhuma URL do Lovable sobrou no HTML. Fecha a pendência aberta em 2026-08-20.
Externos que restam: Google Fonts (Manrope), `wa.me` e Instagram.

### Pacote de publicação

`gj-viagens-site.zip`, 23 arquivos, 490 KB. **Só 4 dos 9 pesos da Saira entraram** —
os que o CSS realmente referencia (Regular, SemiBold, Bold, ExtraBold), lidos por busca
no CSS em vez de escolhidos a olho. Os `.md`, o PDF do comparativo, os arquivos da Oura e
o zip das fontes ficam fora: são material de trabalho, não vão para o ar.

### Servidor de preview recriado

O `servidor.ps1` da sessão anterior sumiu (scratchpad é limpo periodicamente). Recriado e
o `.claude/launch.json` repontado. **Aprendizado: o launch.json aponta para um caminho
temporário e vai quebrar de novo.** Se o preview falhar com arquivo não encontrado, é isso.

### Verificado no preview

Todos os recursos novos em 200, hero carregando local, 10 seções, console limpo.

### 🚨 Armadilha: ZIP do PowerShell quebra em hospedagem Linux

O primeiro pacote subiu na Netlify e o site apareceu **sem CSS, sem imagem e sem fonte** —
só HTML cru. O `index.html` carregava; tudo em subpasta dava 404.

**Causa:** `[System.IO.Compression.ZipFile]::CreateFromDirectory` no PowerShell 5.1 (.NET
Framework) grava os nomes das entradas com **barra invertida** (`assets\css\tokens.css`).
Isso viola a especificação do ZIP. Windows extrai assim mesmo, mas servidor Linux lê o
nome inteiro como **um arquivo só na raiz**, então a pasta `assets/` nunca existe.

**Correção:** montar o ZIP entrada por entrada com `ZipArchive.CreateEntry()`, passando o
caminho com barra normal:

```powershell
$arq = New-Object System.IO.Compression.ZipArchive($fs, [IO.Compression.ZipArchiveMode]::Create)
$entry = $arq.CreateEntry("assets/css/tokens.css", [IO.Compression.CompressionLevel]::Optimal)
```

**Regra para qualquer pacote futuro desta máquina:** depois de gerar o ZIP, conferir que
nenhuma entrada tem `\` no nome, extrair numa pasta limpa e servir de lá — não basta testar
a pasta do projeto, porque o defeito só aparece depois de extrair.

> O deploy do Netlify Drop fica com **HTTP 401 para quem está de fora** enquanto não é
> vinculado a uma conta. Não dá para diagnosticar por fora nesse estado; só pelo navegador
> do próprio Gabriel ou reproduzindo local.

### Planejado: rebranding de logo, fontes e cores (sem mexer em conteúdo)

O Gabriel avisou que haverá um **rebranding futuro**: logo, tipografia e paleta mudam.
**O conteúdo não muda** — textos, case e estrutura das seções ficam como estão.

Isso define o que precisa estar trocável sem reescrever o site.

#### Estado atual: estruturado, com 3 furos

O `tokens.css` já centraliza paleta, fontes, escala tipográfica e espaçamento em custom
properties. Trocar `--accent` muda o dourado do site quase todo. Mas a auditoria de
16/11/2026 achou cor escrita à mão fora da paleta:

| Cor | Onde | Ocorrências |
|---|---|---|
| `#8A6A22` | coluna de % das tabelas | 2 |
| `#7A5C1B` | "ECONOMIA TOTAL", passos numerados | 4 |
| `#FBF5E8` | fundo da linha de total | 2 |

As três são variações do dourado, criadas porque `--accent` (`#DCB05B`) não passa no
contraste em texto pequeno sobre fundo claro (ver 2026-09-04). A decisão era certa; só não
virou token.

Além disso, **16 ocorrências reescrevem um token à mão como rgba**: `rgba(243, 250, 255, .78)`
é `--on-primary`, `rgba(2, 19, 46, .35)` é `--navy-deep`, `rgba(220, 176, 91, .12)` é
`--accent`. O `index.html` está limpo (só `currentColor` nos ícones).

**Consequência no rebranding:** trocar `--accent` deixaria os números das duas tabelas de
economia na cor antiga — justamente as seções que provam o resultado da GJ.

#### Arrumação proposta (ainda não feita)

Promover as 3 cores a tokens (`--accent-escuro`, `--accent-escuro-forte`, `--accent-fundo`),
publicar os valores RGB dos tokens usados com alpha, e trocar os rgba manuais por
`rgba(var(--token-rgb), .78)`. **Zero mudança visual** — mesmos valores, só saem do
componente e vão para a paleta. Depois disso o rebranding de cor vira edição de um arquivo.

> Quando o rebranding acontecer, o `specs/design.md` §1 (paleta), §2 (tipografia) e §5
> (logo) precisam ser reescritos **junto**, não depois. Caso contrário a spec passa a
> descrever uma marca que não existe mais.

### Repositório Git criado e publicado no GitHub

Git não existia nesta máquina. Instalado via `winget install Git.Git` (2.56.0.4).
**O `git` não entra no PATH desta sessão** — chamar sempre por
`& 'C:\Program Files\Git\cmd\git.exe'`.

- Identidade definida **local ao repositório**, não global: `GJ Viagens` /
  `viagensgj@gmail.com`.
- Remoto: `https://github.com/viagensgj-gif/www.gjviagens.com.git`, branch `main`.
  Primeiro commit: 39 arquivos, 3.720 linhas, 6,28 MiB enviados.

**O push não funciona pelo terminal interno** (`fatal: Cannot prompt because user
interactivity has been disabled`). O Git Credential Manager precisa abrir o navegador para
autenticar. **Caminho que funcionou: `run_in_terminal`**, no terminal do próprio usuário.

### ⚠ Decisão do Gabriel: repositório público com os documentos internos

Levantei antes do push que o repositório é **público** e que isso expõe:

1. `specs/conteudo.md` com as anotações internas: "a tabela não fecha na conta", "os 30%
   vêm de emissões fora do recorte... o PDF prova 25,64% no máximo".
2. `memoria.md` com o primeiro nome de um cliente ("Douglas e sua família") e os valores
   das viagens dele.
3. O e-mail do autor em todo commit, coletável por robôs de spam.

**O Gabriel escolheu manter público e subir tudo**, ciente disso. Decisão dele, registrada.

> **O que não subiu:** `docs/comparativo-economia.pdf`, por ter nome e sobrenome de 12
> colaboradores de um cliente — terceiros que não participaram dessa decisão. Confirmado
> por API que `docs/` responde 404 no GitHub. Está no `.gitignore`, com o motivo escrito
> dentro do arquivo.
>
> **Lembrete para qualquer mudança futura:** no Git, apagar não resolve. O arquivo
> permanece no histórico e em qualquer cópia já feita. Remover de verdade exige reescrever
> o histórico (`git filter-repo`) e forçar o push.

### Decidido: hospedagem gratuita na Netlify

O plano da HostGator não responde e o Gabriel optou por não pagar hospedagem.

- **Domínio está ativo e pago**, conferido no RDAP do Registro.br: registrado em
  10/07/2026, **vence em 10/07/2027**. Nameservers ainda apontam para a HostGator.
- Próximo passo: adicionar `www.gjviagens.com.br` na Netlify e trocar os nameservers no
  Registro.br pelos que a Netlify indicar.
#### ✅ Respondido em 16/11/2026: existe e-mail, e por isso NÃO se troca o nameserver

Consulta de DNS resolveu a pendência:

```
MX   10 mx1.titan.email
MX   20 mx2.titan.email
TXT  v=spf1 include:spf.titan.email ~all
```

**O domínio tem e-mail ativo no Titan Email** (serviço que a HostGator revende). Trocar os
nameservers para a Netlify apagaria esses registros e **derrubaria o e-mail da empresa**.

**Decisão: manter o DNS onde está e usar DNS externo na Netlify.** Mexe só em dois
registros, e os MX ficam intocados:

| Registro | Tipo | Valor |
|---|---|---|
| `www` | CNAME | `<nome-do-site>.netlify.app` |
| `@` (raiz) | A | `75.2.60.5` |

IP confirmado resolvendo `apex-loadbalancer.netlify.com` (responde `75.2.60.5` e
`99.83.231.61`) — não copiado de memória nem de tutorial.

> **Nunca tocar nos registros MX nem no TXT do SPF.** Site e e-mail dividem o mesmo
> domínio, mas são registros independentes.

#### Quem controla o domínio

RDAP do Registro.br:

- **Titular:** GJ VIAGENS LTDA (CNPJ 58.624.931/0001-40)
- **Contato técnico:** Gabriel de Oliveira Jactchak
- **Registrador:** NEWFOLD (handle `p43`) — grupo dono da HostGator

Ou seja, o domínio foi registrado **através da HostGator**. O painel para editar DNS é o
dela. Se o acesso estiver perdido, alternativa é mover o DNS para a Cloudflare (grátis),
**recriando os MX e o SPF do Titan lá** antes de apontar para a Netlify.

#### ✅ Site publicado no GitHub Pages (não na Netlify)

**No ar em `https://viagensgj-gif.github.io/www.gjviagens.com/`.** Custo zero, sem cartão.

**Por que GitHub Pages e não Netlify:** a conta já existe, o repositório é público (que é o
requisito do plano gratuito) e o site é estático. Um serviço a menos para manter. O cadastro
da Netlify empurra planos pagos, o que incomodou. **Trade-off registrado:** quando o domínio
mudar, redirecionar o antigo para o novo é mais fácil na Netlify. Se um dia pesar, é só
conectar a Netlify neste mesmo repositório — nada precisa ser refeito.

**Publicação: pelo branch (`principal` / `raiz`), configurado na tela do GitHub.**

##### Três tropeços que custaram tempo, e o que aprender deles

1. **O botão "Salvar" só acende quando algo muda.** `principal` e `raiz` já são o padrão,
   então reescolher não habilitava nada e parecia que a tela estava quebrada. Estava
   funcionando; faltava o sinal de que já estava certo.

2. **CNAME com erro de digitação derrubou o site inteiro.** Foi cadastrado
   `www.gjviage**sn**.com.br` (n e s trocados). O GitHub passou a redirecionar todo acesso
   para um domínio inexistente, **inclusive o endereço do github.io**. Sintoma: "o site não
   abre", sem relação aparente com a causa. Resolvido removendo o arquivo `CNAME`.
   **Ordem correta, que não pode ser invertida:** primeiro apontar o DNS para o GitHub,
   só depois cadastrar o domínio na tela do Pages.

3. **Dois publicadores brigando.** Achei que a configuração do usuário não tinha salvado e
   adicionei um workflow (`.github/workflows/publicar.yml`). As duas rodavam a cada push, e
   a do branch terminava ~19s depois e ganhava — publicando o repositório inteiro, com
   `memoria.md` e `specs/` acessíveis pela web. **Eu havia afirmado o contrário ao usuário;
   estava errado e foi corrigido.**

##### Solução final: um publicador só + `_config.yml`

Workflow removido, `.nojekyll` removido (é ele que faz o GitHub ignorar o `_config.yml`), e
criado `_config.yml` com `exclude:` listando o que não vai para o ar: `CLAUDE.md`,
`memoria.md`, `PUBLICAR.md`, `specs/`, `docs/`, o PDF da Oura, o zip das fontes e os 5 pesos
da Saira que o CSS não usa.

Verificado: arquivos do site em 200, arquivos de trabalho em 404. **Cuidado ao conferir:**
o GitHub devolve **503 por excesso de requisições seguidas** — um 503 não significa que o
arquivo saiu do ar. Espaçar as requisições, e só tratar **200** como "está publicado".

> `.nojekyll` e `_config.yml` são mutuamente excludentes. Se alguém readicionar `.nojekyll`,
> o `exclude` para de valer **em silêncio** e os arquivos internos voltam ao ar.

#### Estado do deploy anterior (Netlify Drop, descartado)

O deploy do Netlify Drop continua **HTTP 401** (não vinculado a conta). O caminho melhor
agora é descartar esse drop e **conectar a Netlify ao repositório do GitHub**: publica
sozinha a cada commit e já nasce pública.

---

## 2026-09-05 — Revisão de pré-publicação

Auditoria completa antes de publicar. O que passou e o que não passou.

### 🚨 Achado grave: a tabela do Douglas não fecha na conta

Duas das três linhas têm "economia" diferente de preço normal menos valor pago:

- **Recife:** 8.243,00 − 300,00 = **7.943,00**, mas está escrito **5.943,00**. Erro de
  R$ 2.000,00, grande demais para ser digitação.
- **São Paulo:** 1.436,00 − 200,00 = **1.236,00**, mas está escrito **1.263,00**. Parece
  dígito trocado.

O total (R$ 7.864,32) fecha com a coluna de economia, mas não com a subtração das outras
duas. **Os números vêm do site do Lovable e já estão publicados lá.** Não corrigi: regra
do projeto é não alterar número de cliente sem fonte. Conferir na origem.

> A tabela de resultados corporativa foi conferida no mesmo teste e está **100% correta**:
> as seis linhas fecham em economia e em porcentagem, e o total bate com a soma das linhas.

### Corrigido nesta revisão

- **Alvo de toque da logo.** O link do monograma tinha 32px (header) e 28px (rodapé), abaixo
  do mínimo de 44px. Resolvido com `min-height: 44px` em `.marca`.
- **Botão do menu encolhia.** Sem `flex: none`, o flex do cabeçalho espremia o botão para
  12px de largura em telas estreitas. O alvo de toque some justamente onde ele é mais usado.

### Conferido e aprovado

- **Contraste:** 18 pares medidos, todos passam. No hero a medição simples dava falso
  negativo (fundo transparente), então amostrei a foto no canvas, apliquei o alfa do véu
  no ponto e recalculei: o pior caso é 6,29:1 no "24h", contra mínimo de 3:1.
- Âncoras internas: 12, nenhuma quebrada. Links externos: 4, todos com `rel="noopener"`.
- Um `<h1>` só, sem salto de nível de título. `lang="pt-BR"`. Zero travessões.
- Imagem do hero carrega, tem `alt`, `width`/`height` e `fetchpriority="high"`.
- Sem vazamento horizontal em 1280 nem em 375.

### Aberto: peso das fontes

Página com 357 KB, dos quais **259 KB são as três fontes Saira em TTF**. O orçamento do
plano.md é 180 KB para fontes. Converter para WOFF2 cortaria uns 150 KB, mas não há
conversor nesta máquina.

> **Alternativa que resolveria de vez:** servir a Saira pelo Google Fonts, como já é feito
> com a Manrope. Some o peso local e o Google entrega WOFF2. **Mas o design.md §2 manda
> carregar a Saira local via `@font-face`**, então isso é decisão do Gabriel, não minha.

---

## 2026-09-05 — Parceria voltou ao escuro, em navy profundo

O Gabriel pediu a identidade escura de volta ("tinha ficado melhor"). Ele já sabia do
conflito, então isso é decisão dele e vale.

**Como resolvi sem grudar dois blocos escuros:** a Parceria virou `--navy-deep` (`#02132E`)
e o CTA final continua `--primary` (`#032B54`). A página fecha em **escuro → navy →
escuro**: parceria (deep), contato (navy), rodapé (deep). Há um degrau de tom visível
entre as seções, então elas não viram uma mancha só, que é o que a regra "nunca duas navy
seguidas" existe para evitar.

- Criado `.secao--navy-deep`. O design.md descreve `--navy-deep` como cor de "rodapé e
  sobreposições"; usar em seção é extensão, não cor nova.
- **CTA da Parceria continua outline**, não dourado. O botão dourado do diagnóstico vem
  logo abaixo e os dois cairiam na mesma dobra.
- Tabela do Douglas voltou para `.tabela--navy`, e o bloco de indicação ganhou a versão
  translúcida sobre escuro.

> **O design.md continua sem ser alterado.** Duas linhas dele já não descrevem o site:
> a lista de quais seções são navy, e o "nunca duas seções navy seguidas" (agora são duas
> escuras seguidas, em tons diferentes). Atualizar quando o Gabriel confirmar.

### Texto do bloco de indicação mudou

De "Empresas... no cartão corporativo" para **"Empresários... no cartão pessoa física"**.

> ⚠ **Contradição aberta na mesma seção.** O subtítulo da Parceria continua dizendo
> "nos permite gerir as milhas **dos cartões da companhia**", enquanto o bloco logo abaixo
> agora fala em **cartão pessoa física**. As duas frases se contradizem na mesma tela.
> Não mexi no subtítulo porque mudar a tese da seção é maior do que foi pedido.
> **Perguntar ao Gabriel qual das duas vale**, ou se são as duas (cartões da empresa e
> dos sócios).

---

## 2026-09-05 — Parceria desceu para o fim, e virou seção clara

Pedido por comentário na prévia: a Parceria integrada é "um ponto menos focado", então sai
do meio da página e entra **depois de "E quando a viagem é sua", antes do diagnóstico**.

Nova ordem: hero · quem somos · desafios · atuação · resultados · **suporte (navy)** ·
metodologia · viagem pessoal · parceria · **contato (navy)**.

### ⚠ Conflito com o design.md, resolvido assim

O design.md §3 diz duas coisas que, com a Parceria no fim, não cabem juntas:

1. "Navy é reservado para: proposta integrada, diferenciais de atendimento e CTA final."
2. "**Nunca duas seções navy seguidas.**"

Com a Parceria (proposta integrada) colada no CTA final, seguir a regra 1 quebraria a
regra 2. **Mantive a regra 2 e tirei o navy da Parceria**, que passou a `secao--alt`.

O argumento: navy marca os momentos de peso, e o próprio pedido rebaixa a Parceria a ponto
secundário. Fundo claro passou a ser coerente com a nova função dela na página.

**O design.md ainda não foi alterado.** Se o Gabriel concordar, a linha "navy é reservado
para proposta integrada, diferenciais e CTA final" precisa virar "diferenciais de
atendimento e CTA final". Enquanto isso não for confirmado, código e spec estão divergentes
nesse ponto.

> Alternativa descartada: deixar a Parceria navy e clarear o CTA final. Pior, porque o CTA
> final é o fecho da página e perde peso sem o navy.

### Outras mudanças da mesma rodada

- **Tabela do Douglas voltou ao estilo claro.** Como a seção deixou de ser navy, saíram
  `.tabela--navy` e `.tabela-caixa--navy`. Cabeçalho navy sobre caixa branca, igual à
  tabela de resultados. As duas tabelas do site ficaram idênticas em estilo.
- **CTA da Parceria virou outline** (`btn--linha-clara`). Sobre fundo claro, dois botões
  dourados perto um do outro (Parceria e CTA final) brigariam. Segue a regra de um CTA
  dourado por dobra.
- **Bloco "Para quem rende mais"** (`.indicacao`), pedido no mesmo comentário: caixa branca
  centralizada com o eyebrow de filete dourado já usado no site. Texto: empresas com gasto
  acima de R$ 30 mil no cartão corporativo e equipe viajando com frequência.
  **Escrito como indicação, não como requisito.** O valor de R$ 30 mil veio do Gabriel;
  não está dito se é gasto mensal ou anual, então o texto não afirma o período.
- **Metodologia, passo 02: menção a milhas removida** (comentário anterior). O passo virou
  "Comparamos rotas, datas e formas de emissão para cada trecho".

---

## 2026-09-04 — Alinhamento dos números do hero

O "ATÉ" acima do 30% empurrava só aquele número para baixo, então "30%" e "24h" não
começavam na mesma linha, e os filetes abaixo deles ficavam desencontrados.

**Correção:** o número sem prefixo ganha o mesmo espaço reservado, via pseudo-elemento.

```css
.stat__pre { height: 16px; margin-bottom: 4px; line-height: 16px; }
.stat__n::before { content: ""; display: block; height: 20px; }
.stat__n:has(.stat__pre)::before { content: none; }
```

Alturas fixas em px de propósito: com `line-height` relativo o espaço reservado não bate
com o do rótulo e a diferença volta. Conferido: topo e base dos dois números com
**diferença 0**, e o mesmo para os dois rótulos.

> Se um terceiro número entrar na faixa, ele se alinha sozinho, com ou sem prefixo.

---

## 2026-09-04 — Segunda rodada: grid, totais, WhatsApp e domínio

- **Lacuna do grid de 5 frentes resolvida.** Com 3 colunas, os cards 4 e 5 ficavam
  encostados à esquerda e sobrava um buraco à direita. Criado `.grade--5`: grid com o
  dobro de colunas (6 no desktop, 4 no tablet) e cada card ocupando duas, com os últimos
  deslocados. Conferido: no desktop o centro da última fileira bate com o centro da grade
  (632px nos dois). No tablet o 5º card centraliza sozinho.
- **"Economia total" virou o destaque das duas tabelas.** A célula de economia da linha de
  total saiu do corpo da tabela e virou dado: Saira Condensed 800 a 30px, com rótulo
  "ECONOMIA TOTAL" em caixa alta acima. Vale para a tabela de resultados (R$ 2.618,00, em
  dourado escuro sobre claro) e para a do Douglas (R$ 7.864,32, em `--accent` sobre navy).
  A versão mobile em cards recebeu o mesmo tratamento.
- **Botão flutuante do WhatsApp** (`.zap`), fixo no canto inferior direito, na página
  inteira. 54px no mobile, 58px no desktop, os dois acima do alvo mínimo de 44px.
  Verificado que não cobre nenhum texto, link ou botão.
- **Rodapé ganhou ícones de rede.** Instagram (`https://www.instagram.com/gjviagens/`) e
  WhatsApp, em botões de 44px com borda. O `@gjviagens` escrito saiu: virou o ícone.
- **Domínio do compartilhamento:** `canonical` e `og:url` apontando para
  `https://www.gjviagens.com.br/`, mais `og:site_name` e cartões do Twitter.
  **`og:image` continua pendente** e depende de baixar a foto do hero.

> **Tensão com o design.md, registrada:** a regra "um CTA dourado por dobra" vale para a
> composição de cada seção. O botão flutuante é dourado e fica sobre tudo, então em algumas
> dobras haverá dois elementos dourados na tela. Interpretei que a regra fala de botões
> dentro da seção, e que um atalho permanente é outra categoria de UI. Se incomodar, a
> alternativa é navy com anel dourado, mas aí ele some nas seções navy.

---

## 2026-09-04 — Rodada de ajustes depois da primeira revisão

O site foi aprovado no geral ("amei"), com uma lista de ajustes. Nenhum token de design
mudou: paleta, tipografia e grid seguem os mesmos.

- **Travessão proibido no texto do site.** "Fica muito com cara de IA." Trocado por
  dois-pontos, vírgula ou ponto final. Conferido no DOM: **zero `—` no texto visível**.
  Virou regra em `specs/conteudo.md`.
- **Hero: "até" saiu do tamanho do número.** Era `até 30%` tudo em Saira 68px. Agora "ATÉ"
  é um rótulo Manrope de 13px em `--gold-soft` acima do número. Ele é qualificador, não
  número, e competia com o dado. Os dois valores (30% e 24h) subiram para 68px.
- **Todos os cabeçalhos de seção centralizados.** "Quem somos" era o único fora do padrão;
  depois do ajuste "pessoal" ficou sendo o único, e também foi centralizado.
- **Eyebrow ganhou filete dourado.** Um traço de 28px antes do rótulo (dois traços quando
  centralizado). Era o "algo mais rústico" pedido para os títulos, resolvido sem inventar
  cor nova: filete dourado já é uso previsto no design.md §1.
- **Cards ficaram interativos.** Hover e clique viram o card para navy, com o ícone em
  dourado e o filete do título esticando de 26px para 44px. O clique fixa o estado
  (`.is-ativo`) e clicar de novo desfaz. Só cor: nenhuma informação depende do estado,
  então não vira problema de acessibilidade.
- **Atuação: 6 frentes viraram 5.** "Suporte em viagem" foi absorvido pela Frente 01.
  Era redundante com a seção inteira de suporte, e suporte não é frente contratável à
  parte, é como a GJ opera.
- **Parceria: os 4 cards (Frente 1 / Frente 2 / Resultado / Bônus) saíram.** Repetiam a
  seção de atuação. No lugar entrou o **case do Douglas**, a pedido: prova em vez de
  repetição. Tabela em versão navy (`.tabela--navy`).
- **Resultados: os 3 cards de destaque saíram.** Repetiam a linha de total da tabela.
- **Título do case reescrito:** de "R$ 2.618,00 economizados em 40 dias e 13 emissões"
  para **"Mesmo voo, mesma data, R$ 2.618,00 a menos"**. O anterior anunciava um case
  isolado; o novo diz o que a comparação prova. Eyebrow virou RESULTADOS.
- **Tabela redesenhada** no estilo da referência enviada: cabeçalho navy com rótulo em
  caixa alta, "preço normal" riscado, linha de total com fundo creme e filete dourado.
- **Duas tabelas, dois fundos.** A de resultados vive sobre `--secondary`; a do Douglas
  sobre navy. Criado `.tabela--navy` em vez de forçar a mesma folha nos dois.

> **Nota de ferramenta:** o screenshot do painel travou num frame branco depois de rolar a
> página (o DOM estava correto o tempo todo). A verificação foi feita por
> `getComputedStyle` e `elementFromPoint`, que aliás dá resultado mais exato. Se o
> screenshot falhar de novo, ir direto por esse caminho.

---

## 2026-09-04 — Site completo construído (10 seções + rodapé)

Da etapa 3 à 5 do plano de uma vez, a pedido. `index.html` com as 10 seções, CSS de
componentes e seções ampliado.

- **Alternância de fundo conferida no DOM:** claro → alt → claro → **navy** → alt →
  **navy** → alt → claro → **navy** → rodapé navy-deep. Nenhuma navy seguida de navy.
- **Tabela do case: dois HTMLs, um conteúdo.** `.tabela-caixa` (≥768px) e `.tabela-cards`
  (<768px), alternados por CSS. Confirmado: no mobile a tabela some e os cards aparecem,
  sem rolagem horizontal em 375px.
- **Coluna de % adicionada à tabela** e linhas ordenadas da maior para a menor redução.
  A porcentagem é o que responde "isso é muito ou pouco?" sem o leitor fazer conta.
- **"40 dias · 13 emissões" subiu para o H2 e o subtítulo** do case. Pedido explícito: sem
  isso o leitor entende R$ 2.618,00 como economia total da GJ, não como recorte de período.
- **Dourado não passa contraste em texto pequeno sobre branco.** A coluna de economia e a
  de % usam `#8A6A22` (dourado escurecido), não `--accent`. O `--accent` continua nos
  números grandes sobre navy, onde passa.
- Case do Douglas (família) saiu do site. Lazer virou seção curta (`#pessoal`).
- Rodapé e CTA final apontam para `wa.me/5541987605800`. **Confirmar o número.**

### Decidido: "até 30%" no hero

Levantei que o comparativo anexado prova no máximo **25,64%** numa passagem e **13,3%** de
redução média, e que o design.md proíbe número sem origem real. **O Gabriel confirmou que
houve passagens com 30% de redução** — fora do recorte desse PDF. Número mantido por
decisão dele, com essa origem registrada aqui.

> Se alguém pedir comprovação dos 30%, a fonte não é `docs/comparativo-economia.pdf` —
> é histórico de emissões que ainda não está documentado no projeto. Vale anexar.

---

## 2026-09-04 — Virada para foco corporativo

Pedido do Gabriel (CEO): o site tem que falar com empresa, não com pessoa física. **O
design não mudou em nada** — paleta, tipografia, grid, componentes, tudo intacto. Só o
conteúdo virou.

- **Não foi mudança de rumo, foi correção.** O briefing original já dizia "público
  principal: empresas". Quem puxou o site para milhas/lazer foi o texto herdado do
  Lovable. A frase central da marca ("Você cuida do seu negócio…") já era corporativa.
- **H1 novo: a própria frase da marca** — "Você cuida do seu negócio. A GJ cuida da sua
  viagem." Substituiu "Maximize suas milhas…", que falava só de milhas. Fecha a P4.
- **Case corporativo real chegou:** `docs/comparativo-economia.pdf` (comparativo enviado a
  cliente). 13 voos em 40 dias, maior redução de 25,64%. Substitui o case do Douglas no
  lugar de destaque.
- **Como o PDF foi lido:** sem poppler e sem Python, o `Read` de PDF não funciona. As
  fontes embutidas tinham codificação embaralhada (deslocamento de +29/+62), então extrair
  o texto cru do stream não resolveu. **O caminho que funcionou: servir o PDF pelo servidor
  local e renderizar com PDF.js numa página temporária**, usando `getTextContent()`. Usar
  esse caminho para qualquer outro PDF.
- **Decidido: nome de passageiro não entra no site.** O PDF traz 12 colaboradores de um
  cliente com nome e sobrenome. Nenhum vai para o ar — a tabela mostra só trecho e valores.
  Vale como regra permanente.
- **Decidido: tabela agrupada por trecho, não voo a voo.** 13 linhas viravam planilha e
  ficavam confusas. Agrupadas em 6 linhas + total, no mesmo formato do case do Douglas.
  Nenhum voo ficou de fora.
- **Decidido: suporte ganha seção própria e ampliada.** É o diferencial que o Gabriel quer
  em destaque. Dividida em "o que o colaborador recebe" e "o que a empresa recebe".
- **Aberto (P10): o total do PDF não fecha.** As linhas somam R$ 2.618,00; o slide de total
  diz R$ 2.573,00 — R$ 45,00 de diferença. Adotei R$ 2.618,00 no site porque uma tabela
  precisa fechar com as próprias linhas. Conferir na origem.
- Lazer/pessoal desce para uma seção curta no fim. Case do Douglas sai do destaque (P11).

---

## 2026-08-20 — Etapa 1 e 2 construídas (cabeçalho + hero)

Primeira parte do site no ar localmente. Arquivos: `index.html`, `assets/css/`
(tokens · base · componentes · secoes), `assets/js/interface.js`.

- **Decidido: 6 frentes**, não 3. As três que faltam (hospedagem, soluções completas,
  suporte em viagem) serão escritas por mim no mesmo formato. Fecha a pendência P1.
- **Decidido: foto do hero é a do Lovable** — asa de avião sobre ilhas ao pôr do sol.
  É material da própria GJ. Fecha a P2. Aprovadas as duas versões (deitada no computador,
  em pé no celular).
- **Decidido: stats no mobile a 32px em 3 colunas** (não empilhados). Cabe "R$ 50k".
  Fecha a P3.
- **Sem Node e sem Python nesta máquina.** Preview local roda com um servidor estático
  em PowerShell puro (`scratchpad/servidor.ps1`, porta 8080), apontado por
  `.claude/launch.json`. Abrir o HTML por `file://` não funciona — vira snapshot e quebra
  os caminhos relativos do CSS.
- Fontes carregando como TTF por enquanto. **Converter para WOFF2 continua pendente**
  (~50KB a menos por peso).
- **A imagem do hero ainda é servida do site do Lovable por URL.** Provisório: baixar os
  dois recortes para `assets/img/` antes de publicar.
- Bugs corrigidos na construção: `<dd>` vinha com 40px de margem padrão do navegador
  desalinhando os rótulos dos números; e o véu do hero no celular estava a 0.88–0.97,
  cobrindo a foto quase por completo — baixado para 0.74–0.96.

---

## 2026-08-20 — Plano de construção (specs/plano.md)

Medidas levantadas do DOM da base nos três breakpoints (375 / 768 / 1280), não estimadas.

- **A base tem uma única imagem** — só o hero (1920×1088). Os outros 20 elementos gráficos
  são SVG. O clima premium vem de tipografia, navy/dourado e espaço, não de fotografia.
  **Decidido manter:** no máximo 2 imagens no site inteiro.
- **Stack: HTML/CSS/JS puro.** Landing estática de 9 seções não justifica framework.
- **Breakpoint único de tipografia em 768px.** A base salta H1 de 36px para 60px sem passo
  intermediário; tablet e desktop compartilham a escala grande e os 112px de seção.
- **Medida de linha em `ch`, não em `px`.** Condensada cabe mais caractere na mesma largura,
  então os max-widths em px da base inflariam a linha com a Saira.
- Três defeitos da base a corrigir, não copiar: subtítulo de seção com 79ch (largo demais),
  hero cortado de 1.76 para 0.43 no mobile sem recorte próprio, e stats em 93px por coluna
  no mobile.
- Tabela do case vira cards no mobile — 6 colunas rolando lateralmente em 375px não serve.
- 8 pendências mapeadas; **P1 (3 ou 6 frentes), P2 (foto do hero) e P3 (stats mobile)**
  travam a primeira etapa de construção.

---

## 2026-08-20 — Conteúdo do Lovable liberado para reuso

O site do Lovable **é material da própria GJ**, feito por IA para a empresa — não é
referência de terceiro. Isso muda o escopo do que se aproveita: além de estrutura, paleta
e tom, os **textos e o case** também entram.

- **Conflito registrado e resolvido:** `design.md` dizia "não clonar layout nem textos" e a
  regra 5 do CLAUDE.md falava em "identidade de outra marca". As duas foram escritas
  assumindo referência externa. Reescritas — a proibição de clonagem continua valendo para
  marcas de fora.
- **Decidido:** base do Lovable + escrever as frentes que faltam. O material de lá cobre 3
  frentes (agenciamento corporativo, gestão de milhas, agenciamento de lazer); o briefing
  lista 6. Faltam hospedagem, soluções completas (locação, seguros, encargos) e suporte em
  viagem.
- **Descartado:** usar só as 3 frentes do Lovable (deixaria metade do produto fora da
  comunicação) e reescrever tudo aproveitando só o case (jogaria fora texto que já funciona).
- Conteúdo salvo em `specs/conteudo.md` — quarto arquivo, criado porque texto não cabe no
  design.md e o site do Lovable pode mudar ou sair do ar.
- **Case do Douglas: números reais.** Não alterar, não arredondar, não inventar case novo.
- Pendente: o H1 atual fala só de milhas; se as 6 frentes entrarem, rever o título junto.
- Pendente: o tom do Lovable é mais agressivo que o posicionamento ("economia brutal",
  "estratégias implacáveis"). Levantar e suavizar em conjunto, não por conta.

---

## 2026-08-20 — Montagem do cérebro do projeto

### Estrutura criada

`CLAUDE.md` (regras gerais) · `specs/design.md` (design) · `memoria.md` (este arquivo).
CLAUDE.md ficou enxuto de propósito: contexto curto do produto, 5 regras, e ponteiros
`@specs/design.md` e `@memoria.md`.

### Referência visual: mudou de Oura para o projeto Lovable

O briefing original (nota de 22/07/2026) mandava usar o site da Oura Ring como referência —
por isso os arquivos `screencapture-ouraring-*.pdf` e `Oura Ring.url` estão na pasta.
**O briefing seguinte trocou a referência** para https://travel-magic-craft.lovable.app.

- **Vale a referência nova.** Os arquivos da Oura ficam como histórico, sem efeito sobre
  o design. Se voltarem a valer, é decisão explícita e entra aqui.
- A referência Lovable já é um site da própria GJ Viagens ("Gestão de Milhas e Viagens
  Premium"), não uma marca de fora — então o risco de clonagem é menor, mas a regra
  continua: dela vêm estrutura, paleta, ritmo e tom, não layout nem textos.

### Como a referência foi analisada

Sem screenshot — o painel do navegador não compõe frames nesta máquina e o PDF não
renderiza (falta poppler/Python). A extração foi feita lendo as CSS custom properties e
os estilos computados direto no DOM, o que dá valores exatos em vez de cor estimada a olho.
**Se precisar analisar outra referência, usar o mesmo caminho.**

### Tipografia: Saira Condensed nos títulos + Manrope no corpo

A referência usa Fraunces (serifada) + Manrope. A Saira Condensed foi anexada ao projeto
com instrução de usar.

- **Decidido:** Saira Condensed em títulos, números e eyebrows; Manrope em corpo e UI.
- **Por quê:** preserva o contraste display/texto que dá o clima premium da referência, e
  evita parágrafo longo em condensada, que cansa a 16–18px.
- **Descartado:** Saira em tudo (parágrafo apertado, perde contraste) e Saira nos títulos
  com Fraunces no corpo (fica editorial demais para o posicionamento corporativo).
- Fontes extraídas para `assets/fonts/Saira_Condensed/` (9 pesos + OFL.txt). O `.zip`
  na raiz é o original.
- Títulos crescem ~10% sobre a escala da referência porque condensada ocupa menos largura.

### Logo: monograma G + avião + J

- O SVG original tem viewBox `339×735` com a arte ocupando só `128.74×116.86` a partir de
  `(96.35, 255.96)` — muito espaço morto, escala errado na web. Criado
  `assets/logo/gj-monograma.svg` com viewBox justo e `fill="currentColor"`, mais
  `gj-monograma-branco.svg` de cor fixa. O original fica intocado como fonte.
- **Sobre navy: logo branca inteira.** Descartado avião em dourado e monograma todo
  dourado — competiriam com os botões dourados e o dourado perde contraste em tamanho
  pequeno.
- Autorização dada para ajustar a cor da logo conforme a necessidade do site.

### Paleta

Navy (`#032B54`) + navy profundo (`#02132E`) + dourado (`#DCB05B`) sobre branco azulado
(`#F8FCFF`). Dourado é acento, nunca superfície. Sem modo escuro — as seções navy fazem
parte da composição do tema claro, não são um tema alternativo.

### Ritmo de seções

Alternância `claro → secondary → claro → navy → secondary → navy → secondary → navy`,
com 112px de padding vertical e container de 1152px. Navy reservado para os momentos de
peso (proposta integrada, diferenciais, CTA final). Nunca duas navy seguidas.

---

## Pendências

- Fotografia: banco de imagens ou material próprio da GJ?
- Formulário de diagnóstico no site, ou todo o contato via WhatsApp?
- Existe lockup aprovado "GJ VIAGENS" ao lado do monograma, ou monta a partir da Saira?
- Contato que aparece na referência: Gestor Gabriel, (41) 98760-5800, @gjviagens —
  confirmar se é o que vai para o site novo.
