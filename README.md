<div align="center">

<img src="assets/img/logo_800_150.png" alt="Voccatio Tech" width="420">

# Voccatio Tech — Site Institucional

**Arquitetura estratégica e estruturação de novos negócios.**

![HTML5](https://img.shields.io/badge/HTML5-semântico-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-vanilla-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript&logoColor=black)
![Sem dependências](https://img.shields.io/badge/dependências-nenhuma-1B3A63)
![Licença](https://img.shields.io/badge/licença-proprietária-lightgrey)

</div>

---

## Sumário

- [Sobre o projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Como executar localmente](#como-executar-localmente)
- [Configuração](#configuração)
- [Formulário de contato](#formulário-de-contato)
- [Segurança](#segurança)
- [Acessibilidade e desempenho](#acessibilidade-e-desempenho)
- [Identidade visual](#identidade-visual)
- [Deploy](#deploy)
- [Pendências e melhorias sugeridas](#pendências-e-melhorias-sugeridas)
- [Contato](#contato)
- [Licença](#licença)

---

## Sobre o projeto

Site institucional **one-page** da **Voccatio Tech**, empresa de arquitetura estratégica e estruturação de novos negócios. A Voccatio atua como o elo de governança entre a visão do empreendedor e a execução operacional lucrativa: audita, desenha e valida modelos de negócio antes de qualquer alocação massiva de recursos.

O site apresenta a proposta de valor da empresa, seu núcleo estratégico, o ecossistema integrado de serviços, o diferencial de governança e o método de trabalho, além de reunir os canais de contato e um formulário de captação de leads.

O projeto foi construído com **HTML, CSS e JavaScript puros**, sem frameworks, bundlers ou dependências de build, o que o torna leve, simples de manter e fácil de hospedar em qualquer serviço de hospedagem estática.

## Funcionalidades

**Conteúdo e navegação**
- Página única com 11 blocos: cabeçalho, hero, faixa de disciplinas, quem somos, núcleo estratégico, plano diretor executivo, ecossistema, governança, método, contato e rodapé.
- Menu responsivo com versão móvel (abre/fecha por clique, ao escolher um link ou com `Esc`).
- Destaque automático da seção ativa no menu durante a rolagem.
- Barra de progresso de leitura e cabeçalho que ganha fundo ao rolar.
- Link de atalho "Pular para o conteúdo principal" para navegação por teclado.

**Interface e animações**
- Animações de entrada (*scroll reveal*) via `IntersectionObserver`.
- Parallax leve nas formas geométricas do hero, inspiradas no símbolo "V" da marca.
- Painel ilustrativo de governança com etapas animadas (Auditar → Desenhar → Validar → Estruturar).
- Faixa de disciplinas em formato *marquee*.
- Respeito à preferência do sistema por **movimento reduzido** (`prefers-reduced-motion`).

**Contato**
- Formulário com máscara de telefone brasileiro, contadores de caracteres e validação em tempo real.
- Canais de contato (telefone, WhatsApp, e-mail), horário de atendimento, endereço, mapa incorporado e redes sociais — todos alimentados por um único objeto de configuração.
- Botão de **Login** no rodapé, preparado para a futura área interna da empresa.

## Tecnologias

| Camada | Tecnologia |
| --- | --- |
| Marcação | HTML5 semântico (`lang="pt-BR"`) |
| Estilos | CSS3 puro com variáveis (*design tokens*), Grid e Flexbox |
| Lógica | JavaScript ES6+ em módulo único (IIFE, `'use strict'`) |
| Tipografia | [Montserrat](https://fonts.google.com/specimen/Montserrat) (Google Fonts) |
| Ícones | [Material Symbols Outlined](https://fonts.google.com/icons) (Google Fonts) |
| Formulário | [Formspree](https://formspree.io/) |
| Mapa | Google Maps (iframe incorporado) |

## Estrutura do projeto

```text
Voccatio_site_ok/
├── index.html            # Marcação e conteúdo do site
├── css/
│   └── style.css         # Folha de estilos (tokens, componentes, responsividade)
├── js/
│   └── script.js         # Configuração, módulos de interface, formulário e segurança
└── assets/
    ├── icon/             # Reservado para favicon e ícones (vazio)
    └── img/              # Logotipos e banners
```

### Organização do código

**`css/style.css`** — dividido em seções numeradas:
`1.` Tokens de design · `2.` Reset e base · `3.` Layout · `4.` Componentes · `5.` Cabeçalho · `6.` Hero · `7.` Ticker · `8.` Seções de conteúdo · `9.` Contato · `10.` Rodapé e toast · `11.` Animações · `12.` Responsividade · `13.` Acessibilidade

**`js/script.js`** — dividido em módulos:
`0.` Proteção contra *clickjacking* · `1.` `SITE_CONFIG` · `2.` Utilitários · `3.` Interface · `4.` Conteúdo · `5.` Formulário · `6.` Acesso interno · `7.` Inicialização

## Como executar localmente

Não há etapa de instalação nem build. Basta servir os arquivos estáticos.

**Opção 1 — Abrir diretamente**

Abra o arquivo `index.html` no navegador.

> Nesse modo, alguns recursos dependentes de origem (como a política de segurança e o formulário) podem se comportar de forma diferente do ambiente de produção. Para testes fiéis, prefira um servidor local.

**Opção 2 — Servidor local (recomendado)**

```bash
# Com Python 3
python -m http.server 8080

# Ou com Node.js
npx serve .
```

Em seguida, acesse `http://localhost:8080`.

## Configuração

Todos os dados editáveis da empresa ficam concentrados no objeto `SITE_CONFIG`, no início de `js/script.js`. Não é necessário alterar o HTML para atualizar essas informações.

```js
const SITE_CONFIG = deepFreeze({
  contacts: {
    phone: '+55 (47) 9 3385-3383',
    whatsapp: '+55 (47) 9 3385-3383',
    email: 'voccatio.brasil@gmail.com'
  },
  businessHours: [
    { days: 'Segunda a sexta', hours: '08h às 18h' }
  ],
  location: {
    address: 'Maringá - PR',
    mapEmbedUrl: 'https://www.google.com/maps?q=...&output=embed'
  },
  social: {
    linkedin: '',
    instagram: 'https://www.instagram.com/voccatio/',
    youtube: 'https://www.youtube.com/@Voccatio'
  },
  internalAreaUrl: ''
});
```

| Chave | Descrição |
| --- | --- |
| `contacts` | Telefone, WhatsApp e e-mail. Os links `tel:`, `wa.me` e `mailto:` são gerados automaticamente. |
| `businessHours` | Lista de faixas de atendimento; cada item vira uma linha na seção de contato. |
| `location.address` | Endereço exibido na seção de contato. |
| `location.mapEmbedUrl` | URL `src` do iframe do Google Maps (*Compartilhar → Incorporar um mapa*). |
| `social` | URLs completas dos perfis. Redes com valor vazio ficam desativadas. |
| `internalAreaUrl` | URL da área interna. Enquanto vazio, o botão **Login** exibe um aviso de "em breve". |

### Alterando outros itens

- **Textos e seções:** edite `index.html`. O arquivo traz comentários indicando cada bloco e os pontos de imagem e ícone.
- **Cores e tipografia:** ajuste as variáveis em `:root`, no início de `css/style.css`.
- **Limites de caracteres do formulário:** altere o atributo `maxlength` de cada campo no HTML. O script lê o valor automaticamente.

## Formulário de contato

O envio é feito via **Formspree**, com o endpoint definido no atributo `action` do `<form>` em `index.html`.

**Campos:** nome, WhatsApp, e-mail, assunto e mensagem (opcional).

**Comportamento**
- Envio assíncrono (`fetch`) em JSON, com *fallback*: sem JavaScript, o navegador envia o formulário diretamente ao Formspree.
- Validação por campo, com mensagens de erro acessíveis (`role="alert"`).
- Máscara automática de telefone brasileiro e remoção do código do país (`55`) ao colar.
- Somente os campos conhecidos são enviados; qualquer campo extra injetado no DOM é descartado.

**Para usar outro endpoint**, substitua o `action` do formulário. O script só aceita URLs no formato `https://formspree.io/f/<id>`.

## Segurança

O projeto adota uma série de camadas de proteção, mesmo sendo um site estático:

| Medida | Descrição |
| --- | --- |
| **Content-Security-Policy** | Definida via `<meta>`: bloqueia scripts e estilos inline e restringe origens a `self`, Google Fonts, Formspree e Google Maps. |
| **Referrer-Policy** | `strict-origin-when-cross-origin`. |
| **Anti-clickjacking** | Reforço em JavaScript que impede o carregamento do site dentro de *iframes*. |
| **Validação de URLs** | Links vindos do `SITE_CONFIG` só são aceitos com `https:` e em domínios previamente permitidos (barra `javascript:`, `data:` etc.). |
| **Sanitização de entradas** | Normalização Unicode e remoção de caracteres de controle, invisíveis e de direção de texto. |
| **Anti-spam e abuso** | Campo isca (*honeypot* `_gotcha`), tempo mínimo de preenchimento (3 s), intervalo entre envios (30 s) e limite de 5 envios por sessão. |
| **Requisições** | *Timeout* de 15 s, `credentials: 'omit'`, `cache: 'no-store'` e `redirect: 'error'`. |
| **Mapa isolado** | O iframe do Google Maps roda com `sandbox` restrito. |
| **Objeto de configuração imutável** | `SITE_CONFIG` é congelado com `Object.freeze` recursivo. |

> **Importante:** `frame-ancestors` e outros cabeçalhos de segurança só têm efeito pleno quando enviados como **cabeçalhos HTTP**, não via `<meta>`. Recomenda-se configurá-los no servidor ou na plataforma de hospedagem (ver [Deploy](#deploy)). Os limites de envio no cliente são apenas um reforço; a proteção real contra abuso deve ser feita no Formspree.

## Acessibilidade e desempenho

**Acessibilidade**
- HTML semântico, com `main`, `nav`, `header`, `footer` e seções associadas aos títulos por `aria-labelledby`.
- *Skip link*, estados de foco visíveis (`:focus-visible`) e menu operável por teclado.
- Atributos `aria-*` em menu, formulário, painel ilustrativo, mensagens de status e elementos decorativos.
- Suporte a `prefers-reduced-motion`.

**Desempenho**
- Sem frameworks nem bibliotecas JavaScript de terceiros.
- Eventos de rolagem passivos e throttling por `requestAnimationFrame`.
- `preconnect` para as origens do Google Fonts e `loading="lazy"` no mapa.
- Animações baseadas em `IntersectionObserver`.

**SEO**
- Idioma `pt-BR`, `title` e `meta description` definidos, `theme-color` da marca e hierarquia de títulos consistente (`h1` → `h3`).

## Identidade visual

| Cor | Hex | Uso |
| --- | --- | --- |
| Azul institucional | `#1B3A63` | Cor principal da marca |
| Azul profundo | `#14304F` | Variação escura para fundos e gradientes |
| Cinza-névoa | `#E0E3E8` | Fundos de seção e detalhes |
| Branco | `#FFFFFF` | Fundos e textos sobre áreas escuras |
| Preto | `#000000` | Apoio |

**Tipografia:** Montserrat (400, 500, 600, 700 e 800), família geométrica semelhante à do logotipo.

### Assets

| Arquivo | Dimensões | Situação |
| --- | --- | --- |
| `logo_800_150.png` | 800 × 150 | Em uso (cabeçalho e rodapé) |
| `banner_1200_400.png` | 1200 × 400 | Em uso (seção "Quem somos") |
| `logo_300_350.png` | 300 × 350 | Disponível (versão vertical) |
| `logooo.png` | 1500 × 500 | Disponível |
| `banner_1200_300.png` | 1200 × 300 | Disponível |
| `banner_site.png` | 1500 × 600 | Disponível |
| `Gemini_Generated_Image_…jpg` | 2752 × 1536 | Disponível (≈ 2,9 MB) |

## Deploy

Por ser um site 100% estático, pode ser publicado em qualquer serviço de hospedagem, como **Netlify**, **Vercel**, **Cloudflare Pages**, **GitHub Pages** ou em servidores Apache/Nginx.

Checklist para publicação:

1. Servir o site obrigatoriamente em **HTTPS** (a CSP usa `upgrade-insecure-requests`).
2. Configurar os **cabeçalhos HTTP de segurança** na plataforma, incluindo `Content-Security-Policy` (com `frame-ancestors 'none'`), `X-Content-Type-Options: nosniff` e `Referrer-Policy`.
3. Confirmar o domínio autorizado no painel do **Formspree**.
4. Revisar os dados do `SITE_CONFIG` (contatos, endereço, horário e redes).
5. Otimizar as imagens antes de publicar (ver abaixo).

## Pendências e melhorias sugeridas

Itens identificados durante a análise do projeto:

- [ ] **Favicon:** o `index.html` traz apenas um comentário indicando o local do favicon, e a pasta `assets/icon/` está vazia. Adicionar o ícone e o `<link rel="icon">`.
- [ ] **Arquivos de segurança ausentes:** os comentários do HTML e do JS referenciam `_headers`, `.htaccess` e `nginx-security.conf`, mas esses arquivos não estão no repositório. Criá-los conforme a hospedagem escolhida.
- [ ] **Otimização de imagens:** a imagem `Gemini_Generated_Image_…jpg` (≈ 2,9 MB) e os banners não utilizados aumentam o peso do repositório. Remover o que não for usado e converter as imagens ativas para WebP/AVIF.
- [ ] **Texto alternativo:** o banner da seção "Quem somos" está com `alt=""` (tratado como decorativo). Se for uma imagem informativa, descrevê-la.
- [ ] **Dados provisórios:** o endereço atual é "Maringá - PR" e `internalAreaUrl`, `linkedin` e o item de LinkedIn no HTML estão vazios ou comentados. Revisar antes do lançamento.
- [ ] **Metadados sociais:** incluir *Open Graph* e *Twitter Cards* para melhorar o compartilhamento de links.
- [ ] **SEO técnico:** adicionar `robots.txt`, `sitemap.xml` e URL canônica.
- [ ] **Política de privacidade (LGPD):** como o site coleta nome, e-mail e telefone, recomenda-se incluir política de privacidade e aviso de tratamento de dados.
- [ ] **Controle de versão:** adicionar `.gitignore` e inicializar o repositório Git, se ainda não existir.

## Contato

**Voccatio Tech**

- E-mail: [voccatio.brasil@gmail.com](mailto:voccatio.brasil@gmail.com)
- WhatsApp: [+55 (47) 9 3385-3383](https://wa.me/5547933853383)
- Instagram: [@voccatio](https://www.instagram.com/voccatio/)
- YouTube: [@Voccatio](https://www.youtube.com/@Voccatio)

## Licença

© 2026 Voccatio. Todos os direitos reservados.

Este é um projeto proprietário. O código, o conteúdo e os elementos de identidade visual não podem ser copiados, modificados ou redistribuídos sem autorização expressa da Voccatio.
