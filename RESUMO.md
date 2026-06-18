# Portfólio — Filipe Lucas

## Estrutura de Diretórios

```
portifolio/
├── index.html              # Página única do portfólio
├── css/
│   └── style.css           # Todos os estilos (~1170 linhas)
├── js/
│   └── main.js             # JavaScript (~120 linhas)
├── img/
│   ├── imageminicial.png   # Hero — imagem principal (1.6 MB)
│   └── perfil.jpeg          # Seção Quem Sou (77 KB)
├── skills/
│   └── frontend-design/    # Skill de design (referência)
├── .agents/
│   └── skills/
│       └── small-business-conversion/  # Skill de conversão
└── RESUMO.md               # Este arquivo
```

## Tecnologias

- HTML5 semântico
- CSS3 puro (Flexbox, Grid, Custom Properties, Keyframes, Media Queries)
- JavaScript vanilla (IntersectionObserver, requestAnimationFrame)
- Google Fonts: Cormorant Garamond + Inter
- Zero dependências

## Design System

| Token | Valor | Uso |
|-------|-------|-----|
| `--preto` | `#090909` | Fundo principal |
| `--cinza-escuro` | `#141414` | Fundo de seções alternadas |
| `--vinho` | `#5B0A0A` | Detalhes, bordas secundárias |
| `--vermelho` | `#8A1010` | CTAs, destaques, hover |
| `--texto` | `#F0F0F0` | Texto principal |
| `--texto-dim` | `#999` | Texto secundário |
| `--font-display` | `Cormorant Garamond` | Títulos (serif elegante) |
| `--font-body` | `Inter` | Textos (sans-serif moderna) |

## Estrutura da Página

### 1. Hero (`#hero`)
- Tela cheia, fundo escuro
- Imagem `imageminicial.png` à direita (~38vw, max 420px)
- Nome: **FILIPE LUCAS** (Cormorant Garamond, vermelho destaque no primeiro nome)
- Subtítulo + descrição + 2 CTAs ("Ver projetos" / "Entrar em contato")
- Indicador de scroll animado (seta pulsando no fim do hero)
- Camadas visuais: noise overlay, névoa atmosférica, vinheta

### 2. Quem Sou (`#sobre`)
- Grid 2 colunas (desktop) / 1 coluna (mobile)
- Foto `perfil.jpeg` (340px altura desktop, 240px mobile)
- Título "Quem sou" + 3 parágrafos descritivos

### 3. O Que Eu Construo (`#servicos`)
- Grid 2x2 de cards (desktop) / empilhado (mobile)
- 4 cards com ícones SVG:
  - Sites institucionais
  - Landing pages
  - Design personalizado
  - Experiência mobile
- Hover: translateY(-4px) + borda superior em vermelho

### 4. Projetos (`#projetos`)
- Grid 3 colunas (desktop) / 1 coluna (mobile)
- 3 projetos com thumbnails gradientes + overlay hover (vinho semi-transparente com "Ver projeto")
- Links externos para cada projeto (abrem em nova aba)
- Projetos:
  - Confeitaria Maiza Borges
  - Spotify Page
  - Stranger Things

### 5. Como Eu Trabalho (`#trabalho`)
- Timeline vertical com 5 etapas numeradas (01-05)
- Linha com gradiente vinho → vermelho → transparente
- Scroll reveal sequencial (cada item aparece com atraso)

### 6. Contato (`#contato`)
- Centralizado, links clicáveis
- Instagram: @filipe_lucas7
- Email: filipelucasfsa@gmail.com
- WhatsApp: botão verde proeminente (CTA principal)
- Frase de encerramento em itálico (Cormorant Garamond)

### Footer
- Grid 3 colunas: marca + navegação + redes sociais
- Badge "Disponível para novos projetos" com indicador verde pulsante
- Links de navegação rápida para todas as seções
- Ícones das redes sociais (Instagram, Email, WhatsApp)
- Copyright

## Responsividade

| Breakpoint | Alvo | Comportamento |
|---|---|---|
| < 768px | Mobile | Tudo empilhado, hero vertical, hambúrguer, footer em 1 coluna |
| 768–1024px | Tablet | Grids adaptados, padding reduzido |
| > 1024px | Desktop | Layout completo, hero lado a lado |
| > 1400px | Wide | Padding extra no hero content |

## Animações e Efeitos

| Efeito | Descrição | Técnica |
|--------|-----------|---------|
| Hero fade-in | Nome → subtítulo → descrição → botões (stagger 0.2s) | CSS keyframes |
| Body fade-in | Página aparece com fade de 0.6s | CSS keyframes |
| Scroll reveal | Elementos aparecem ao entrar na viewport | IntersectionObserver |
| Cursor glow | Radial gradiente `#8A1010` seguindo o mouse | requestAnimationFrame |
| Hover cards | translateY(-4px) + borda destaque | CSS transition |
| Hover projetos | Overlay vinho com "Ver projeto" | CSS pseudo-element |
| Scroll indicator | Seta pulsando no fim do hero | CSS keyframes |
| Névoa atmosférica | Gradientes animados com blur (drift 25s/30s) | CSS keyframes |
| Noise overlay | Textura de grão cinematográfico | SVG turbulence filter |
| Vinheta | Radial gradient escurecendo bordas | CSS radial-gradient |
| Badge pulsante | Indicador verde "Disponível" no footer | CSS keyframes |
| Back to top | Botão aparece após 300px de scroll | JS + CSS transition |
| Reduced motion | Tudo desativado via `prefers-reduced-motion` | Media query + JS |

## Interatividade (JS)

| Funcionalidade | Técnica | Local |
|---|---|---|
| Menu mobile | Toggle class + slide-in | `main.js:22-40` |
| Scroll reveal | IntersectionObserver (threshold 0.08) | `main.js:42-59` |
| Cursor glow | requestAnimationFrame + mousemove | `main.js:63-90` |
| Nav scroll | Classe `scrolled` após 80px | `main.js:9-19` |
| Back to top | Show/hide no scroll + click to top | `main.js:63-79` |
| Smooth scroll | scrollTo com offset do nav | `main.js:82-100` |

## Performance

- Zero dependências externas (além das fontes do Google)
- Animações GPU: `transform` e `opacity` apenas
- Imagens com `loading="lazy"` (exceto hero)
- Google Fonts com `display=swap`
- `will-change: transform` no cursor glow
- Event listeners passivos para scroll
- CSS otimizado sem imports desnecessários

## Acessibilidade

- `prefers-reduced-motion` suportado (desativa todas as animações)
- `:focus-visible` com outline vermelho
- ARIA: `aria-label`, `aria-expanded`, `aria-hidden`
- Navegação por teclado em todos os elementos interativos
- `alt` texts nas imagens
- Contraste suficiente entre texto e fundo
- Botões com tamanhos adequados para toque mobile

## Manutenção

Para alterar cores: editar as variáveis no `:root` do `style.css`.

Para adicionar projetos: copiar um bloco `.projeto-card` no HTML e atualizar link, nome e descrição.

Para adicionar serviços: copiar um bloco `.servico-card` no HTML.

Para trocar imagens: substituir os arquivos em `img/` mantendo os mesmos nomes.
  