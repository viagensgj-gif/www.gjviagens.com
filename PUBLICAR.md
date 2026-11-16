# Como publicar o site

Passo a passo para colocar o site no ar em `www.gjviagens.com.br` e fazer ele aparecer
no Google. Pacote pronto: `gj-viagens-site.zip` (23 arquivos, 490 KB).

---

## Antes de começar: o domínio não está respondendo

Checado em 16/11/2026:

- O domínio **existe e o DNS está configurado**: `gjviagens.com.br` aponta para
  `162.240.81.81`, com DNS na **HostGator Brasil** (`dns3`/`dns4.hostgator.com.br`).
- **Mas nada responde** nesse endereço. Tanto `http://gjviagens.com.br` quanto
  `https://www.gjviagens.com.br` dão timeout.

Isso normalmente significa uma destas três coisas:

1. A hospedagem na HostGator está **vencida ou suspensa** (falta de pagamento);
2. O plano foi cancelado e só o registro do domínio continua ativo;
3. A conta existe, mas o domínio ainda não foi apontado para ela lá dentro.

**Primeiro passo, então: entrar no painel da HostGator e confirmar que o plano de
hospedagem está ativo.** Sem isso, não adianta subir arquivo: não há servidor ligado
para recebê-los.

> Se o plano estiver cancelado, dá para publicar de graça na Vercel ou na Netlify e só
> apontar o DNS para lá. Nesse caso me avise que eu passo o passo a passo dessa rota.

---

## Rota A — HostGator (o que você já tem)

### 1. Entrar no cPanel

Acesse `https://gjviagens.com.br:2083` ou entre pelo painel do cliente da HostGator e
clique em **cPanel**.

### 2. Abrir o Gerenciador de Arquivos

No cPanel, procure **Gerenciador de Arquivos** (File Manager) e entre na pasta
**`public_html`**. É essa pasta que vira o site.

### 3. Limpar o que estiver lá

Se houver arquivos de um site antigo (`index.php`, `default.html`, pasta do WordPress),
**faça backup antes**: selecione tudo, botão direito → Compress → baixe o .zip. Só depois
apague.

> Não apague a pasta `cgi-bin` nem arquivos `.well-known` se existirem.

### 4. Subir o pacote

1. Botão **Upload** (Carregar), envie o `gj-viagens-site.zip`.
2. Volte para `public_html`, clique com o botão direito no zip → **Extract** (Extrair).
3. Apague o `.zip` depois de extrair.

**Confira que o `index.html` ficou direto em `public_html/index.html`**, e não em
`public_html/site-publicar/index.html`. Se tiver criado uma subpasta, mova o conteúdo
para cima, senão o site não abre.

Estrutura correta:

```
public_html/
  index.html
  favicon.svg
  robots.txt
  sitemap.xml
  site.webmanifest
  assets/
    css/ js/ img/ logo/ fonts/
```

### 5. Ligar o HTTPS (cadeado)

No cPanel, procure **SSL/TLS Status** e clique em **Run AutoSSL**. A HostGator emite um
certificado grátis (Let's Encrypt). Leva alguns minutos.

Depois que o cadeado estiver funcionando, force todo acesso para HTTPS: crie um arquivo
`.htaccess` dentro de `public_html` com este conteúdo:

```apache
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://www.gjviagens.com.br/$1 [R=301,L]

RewriteCond %{HTTP_HOST} ^gjviagens\.com\.br$ [NC]
RewriteRule ^(.*)$ https://www.gjviagens.com.br/$1 [R=301,L]
```

Isso faz duas coisas: manda todo mundo para o endereço seguro, e unifica `gjviagens.com.br`
e `www.gjviagens.com.br` num endereço só. O Google trata os dois como sites diferentes se
você não fizer isso, e a força de busca fica dividida entre eles.

### 6. Testar

Abra `https://www.gjviagens.com.br` numa aba anônima. Confira:

- A foto do avião aparece no topo
- O cadeado aparece na barra de endereço
- O ícone azul com o GJ aparece na aba
- No celular, o menu hambúrguer abre
- O botão verde do WhatsApp abre a conversa no `(41) 98760-5800`

---

## Aparecer no Google

Subir o site não coloca ele no Google. Faltam dois passos.

### 1. Google Search Console

1. Acesse `search.google.com/search-console` com a conta do Google da GJ.
2. **Adicionar propriedade** → escolha **Prefixo do URL** → digite
   `https://www.gjviagens.com.br`.
3. Para confirmar que o site é seu, escolha **Tag HTML**. O Google dá uma linha parecida
   com `<meta name="google-site-verification" content="...">`.
4. **Me mande essa linha** que eu coloco no lugar certo do `index.html`. Ou cole você
   mesmo, logo abaixo da linha `<meta name="viewport"...>`.
5. Depois de verificar, vá em **Sitemaps** e envie: `sitemap.xml`.
6. Em **Inspeção de URL**, cole `https://www.gjviagens.com.br/` e clique em
   **Solicitar indexação**.

O site costuma aparecer nas buscas em alguns dias a duas semanas.

### 2. Perfil da Empresa no Google (Google Meu Negócio)

Isso é o que faz a GJ aparecer **no mapa e no quadro lateral** quando alguém busca
"agência de viagens corporativas Curitiba". Para uma empresa local, costuma trazer mais
cliente que a busca comum.

1. Acesse `business.google.com`.
2. Cadastre **GJ Viagens**, categoria **Agência de viagens** (pode adicionar
   "Serviço de consultoria" como secundária).
3. Preencha telefone `(41) 98760-5800`, site `https://www.gjviagens.com.br` e horário.
4. O Google envia um código de verificação (carta, telefone ou vídeo).

> Se a GJ não atende cliente no endereço físico, marque como **empresa de prestação de
> serviços** e defina a região atendida, em vez de mostrar o endereço.

---

## O que ficou pendente

Nada disso impede publicar, mas vale resolver.

### 1. Os números da tabela do Douglas não fecham

Na seção Parceria, duas linhas têm a economia diferente da subtração das outras colunas:

| Destino | Deveria dar | Está escrito | Diferença |
|---|---|---|---|
| Recife | R$ 7.943,00 | R$ 5.943,00 | R$ 2.000,00 |
| São Paulo | R$ 1.236,00 | R$ 1.263,00 | R$ 27,00 |

Qualquer visitante confere isso na calculadora em dez segundos, e numa página que vende
economia isso derruba a confiança justamente onde ela deveria ser construída. Os números
vieram do site do Lovable e não foram alterados por mim, porque a regra do projeto é não
mexer em número de cliente sem conferir na origem. **Confira na fonte antes de publicar.**

### 2. O telefone não aparece escrito em lugar nenhum

Ele está só nos links do WhatsApp. Comprador corporativo às vezes procura telefone visível
antes de confiar. Vale decidir se incomoda.

### 3. "Até 30%" no hero

O número veio de você, mas o comparativo anexado (`docs/comparativo-economia.pdf`) prova
no máximo 25,64%. Se alguém pedir comprovação, a fonte é um histórico de emissões que
ainda não está documentado. Vale anexar.

### 4. Peso das fontes

A página tem 357 KB, dos quais 259 KB são as fontes Saira em TTF. Converter para WOFF2
cortaria uns 150 KB, mas não há conversor nesta máquina. Alternativa: servir a Saira pelo
Google Fonts, como já é feito com a Manrope. Isso contraria o `specs/design.md` §2, que
manda carregar local, então é decisão sua.
