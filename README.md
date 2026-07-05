# UNna Studio & Beleza — Site

Site institucional de página única (one-page), responsivo e **pensado para celular** (a maioria das visitas).
Feito em HTML, CSS e JavaScript puro — sem frameworks. As únicas dependências (anime.js e Lenis)
já estão salvas localmente na pasta `vendor/`, então o site funciona sem depender de internet de terceiros.

---

## 📁 Arquivos do projeto

| Arquivo | O que é | Você edita? |
|---|---|---|
| `index.html` | Todo o conteúdo do site | Às vezes (textos, links) |
| `styles.css` | Toda a aparência (cores, layout) | Raramente |
| `main.js` | Interações (animações, abas, carrossel, modal de agendamento) | 1 linha (link do Trinks) |
| `reviews.js` | **Suas avaliações do Google** | **Sim — sempre que quiser** |
| `vendor/` | Bibliotecas de animação (não mexer) | Não |
| `README.md` | Este guia | Não |

---

## ▶️ Como abrir e testar

- **Rápido:** dê dois cliques em `index.html` — abre no navegador.
- **Recomendado** (para o mapa e o agendamento carregarem certo): use um servidor local simples.
  Com o Python instalado, abra o terminal na pasta do site e rode:
  ```
  python -m http.server 8000
  ```
  Depois acesse `http://localhost:8000` no navegador.

> 💡 **Ver as animações:** se o seu computador estiver com "reduzir movimento" ligado, as animações
> ficam desativadas (acessibilidade). Para visualizar mesmo assim, acesse com `?force-motion=true` no fim
> do endereço, ex.: `http://localhost:8000/?force-motion=true`.

---

## ✅ Checklist antes de publicar

### Já preenchido ✔️
- WhatsApp (`5511989732753`)
- Link do Trinks (`trinks.com/unna-studio/`)
- Endereço, horários e mapa do Google
- Instagram (`@unnastudio.oficial`)
- Telefone e nota (5,0) nos dados do Google
- 5 avaliações no carrossel

### Ainda falta
1. **Domínio do site** — aparece em **4 lugares** no topo do `index.html` (procure por `unnastudio.com.br`):
   `canonical`, `og:url`, `og:image` e dentro do bloco de dados do Google (`url` e `image`).
   Se o domínio final for esse mesmo, é só confirmar; se for outro, troque nos 4.
2. **Fotos** (veja a seção "Como trocar as imagens" abaixo).
3. **Imagem de compartilhamento** `og-image.jpg` — a foto que aparece quando o link é enviado no
   WhatsApp/Instagram. Sem ela, o preview do link fica sem imagem.
4. *(Opcional)* completar `reviews.js` com as 10 avaliações (hoje tem 5).

---

## ⭐ Como atualizar as avaliações do Google (`reviews.js`)

Abra o arquivo `reviews.js`. Cada avaliação é uma linha como esta:

```js
{ name: "Mariana Silva", rating: 5, date: "há 2 semanas", text: "Texto da avaliação aqui." },
```

- `name` → nome de quem avaliou
- `rating` → nota de 1 a 5
- `date` → quando foi feita (opcional)
- `text` → o texto da avaliação

Para adicionar uma, copie uma linha, cole abaixo e edite. **Não esqueça a vírgula** no fim de cada linha
(menos na última). Salve o arquivo — o carrossel se atualiza sozinho e recalcula a nota média.

No fim do arquivo, em `UNNA_REVIEWS_META`, você pode ajustar:
- `total` → total de avaliações no Google (pode ser maior que as exibidas)
- `profileUrl` → link do seu perfil no Google (botão "Ver todas no Google")

> Depois de editar, **suba a versão** (veja a seção "Cache" mais abaixo).

---

## 📅 Como mudar o link do agendamento (Trinks)

Abra `main.js`, no início do arquivo, e troque o endereço em:

```js
var TRINKS_URL = "https://www.trinks.com/unna-studio/";
```

Esse é o endereço que abre no botão "Agendar online". O agendamento abre dentro do site, numa janelinha (modal).

---

## 🖼️ Como trocar as imagens

Todas as imagens hoje são "placeholders" (espaços reservados). Coloque seus arquivos numa pasta `img/`
e substitua conforme abaixo.

**1. Foto principal (topo / hero)** — proporção 16:9. No `index.html`, troque:
```html
<div class="hero-photo"><span>[ FOTO PRINCIPAL... ]</span></div>
```
por:
```html
<img class="hero-photo" src="img/hero.jpg" alt="Ambiente do UNna Studio" />
```

**2. Fotos dos serviços** — proporção 4:3. Em cada card, troque:
```html
<div class="serv-photo"><span>antes · depois</span></div>
```
por:
```html
<div class="serv-photo"><img class="serv-img-zoom" loading="lazy" src="img/cilios-fox.jpg" alt="Cílios Fox" /></div>
```

**3. Antes/Depois (destaques)** — em cada bloco `.ba`, coloque as fotos no `antes` e `depois`:
```html
<div class="ba-img ba-before" style="background-image:url('img/micro-antes.jpg')"><span>ANTES</span></div>
<div class="ba-img ba-after"  style="background-image:url('img/micro-depois.jpg')"><span>DEPOIS</span></div>
```
(o tamanho/posição já estão prontos no CSS)

**4. Galeria** — proporção 3:4. Em cada item, troque o bloco `.gal-ph` por:
```html
<img loading="lazy" src="img/galeria-1.jpg" alt="Recepção do salão" />
```

**5. Imagem de compartilhamento** — salve uma foto **1200×630px** como `og-image.jpg` na raiz do site
(ou ajuste o caminho nas tags `og:image` e `image` no topo do `index.html`).

> Dica: comprima as fotos (ex.: squoosh.app ou tinypng.com) antes de subir — o site abre bem mais rápido no celular.

---

## ⚠️ Cache — IMPORTANTE ao atualizar o site

Os navegadores guardam (cacheiam) os arquivos para abrir o site mais rápido. Por isso, **toda vez que você
editar `styles.css`, `main.js` ou `reviews.js`**, aumente o número da versão no `index.html` para que os
visitantes recebam a versão nova.

Procure no `index.html` por `?v=` (aparece 3 vezes) e troque o número:
```html
<link rel="stylesheet" href="styles.css?v=2" />
...
<script src="reviews.js?v=2"></script>
<script src="main.js?v=2"></script>
```
Ex.: estava `?v=2`, mude tudo para `?v=3`. Pronto — todos verão a versão atualizada.

---

## 🚀 Como publicar (deploy)

É um site estático (só arquivos), então é simples. Opções gratuitas/baratas:

- **Netlify** ou **Vercel**: arraste a pasta do site no painel deles — publica em segundos.
- **Hostinger / hospedagem comum**: suba todos os arquivos (incluindo a pasta `vendor/` e `img/`) via painel/FTP.
- **GitHub Pages**: suba os arquivos num repositório e ative o Pages.

Depois, aponte seu domínio para a hospedagem escolhida e atualize o `unnastudio.com.br` nos 4 lugares citados.

---

## ♿ Já vem pronto

- **Responsivo** (celular, tablet, desktop)
- **Acessibilidade**: respeita "reduzir movimento", navegação por teclado e leitores de tela
- **SEO local**: dados estruturados do Google (aparecer na busca com nota/estrelas) e preview bonito ao compartilhar o link
- **Conversão**: botão flutuante de WhatsApp, agendamento online (Trinks) e prova social (avaliações)

---

Qualquer dúvida na hora de publicar, é só chamar. 💛
# UNnaStudio
