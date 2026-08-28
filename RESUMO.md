# Portfólio — Filipe Lucas (v3 — Design Azul/Navy)

## Estrutura de Diretórios

```
portfoli-main/
├── index.html              # Página única do portfólio
├── css/
│   └── style.css           # Todos os estilos
├── js/
│   └── main.js              # JavaScript (nav, reveal, contadores, menu mobile)
├── img/
│   ├── perfil.jpeg          # Foto de perfil (hero)
│   ├── cta-bg.jpeg          # Fundo da seção de contato (laptop com código)
│   ├── catalogo-de-filme.png
│   ├── card-resident-evill-village.png
│   ├── card-lumina.png
│   ├── spartan-gym.png
│   ├── card-confeitaria.png
│   ├── card-stranger-thigs.png
│   └── hero-restaurante.png
└── RESUMO.md
```

## Tecnologias

- HTML5 semântico
- CSS3 puro (Flexbox, Grid, Custom Properties, Media Queries)
- JavaScript vanilla (IntersectionObserver, requestAnimationFrame)
- Google Fonts: Sora (display) + Inter (body)
- Zero dependências externas

## Design System

| Token | Valor | Uso |
|-------|-------|-----|
| `--bg` | `#090D16` | Fundo principal |
| `--bg-alt` | `#0C121F` | Fundo de seções alternadas (Sobre) |
| `--panel` | `#111827` | Cards e painéis |
| `--panel-2` | `#141C2E` | Fundo de thumbs sem imagem |
| `--blue` | `#2F6FED` | Cor primária, CTAs |
| `--blue-light` | `#5C9CFF` | Destaques, hover, eyebrows |
| `--green` | `#22C55E` | Badge "disponível" |
| `--text` | `#EEF2F9` | Texto principal |
| `--text-dim` | `#97A1B5` | Texto secundário |
| `--text-dimmer` | `#616B80` | Texto terciário/legenda |
| `--font-display` | `Sora` | Títulos |
| `--font-body` | `Inter` | Textos |

## Estrutura da Página

1. **Hero (`#inicio`)** — Nome grande, foto em moldura arredondada com badge `</>`, botões, redes sociais.
2. **Sobre (`#sobre`)** — Texto + tags de localização/disponibilidade + 4 cards de estatística com contador animado.
3. **Projetos (`#projetos`)** — 3 cards em destaque (Catálogo de Filmes, Business OS, Resident Evil Village) + grade de 6 "mais projetos" (Lumina, Spartan Gym, Confeitaria, Stranger Things, Restaurante Brasa).
4. **Habilidades (`#habilidades`)** — Painel de linguagens/ferramentas + painel de IA, com badges coloridos por tecnologia.
5. **Experiência (`#experiencia`)** — Formação (UniCesumar) + experiência freelancer, em cards lado a lado.
6. **Contato (`#contato`)** — Painel com imagem de fundo (laptop) + overlay azul, CTA para WhatsApp.
7. **Footer** — Marca, navegação, copyright, watermark "FL." decorativo.

## Observações e pendências

- **Card "Business OS"** ainda não tem link (projeto em desenvolvimento) — usa um placeholder visual com o glifo "OS" em vez de screenshot. Quando o projeto estiver publicado, é só trocar o bloco `.projeto-thumb-placeholder` por uma `<img>` real e adicionar o link em `.projeto-link`.
- **Botão "Entrar em contato" no menu** aponta para `#contato`. Se quiser trocar por "Download CV", basta adicionar o PDF em uma pasta (ex: `cv/`) e trocar o `href` para o caminho do arquivo, com atributo `download`.
- Ícones de tecnologia usam iniciais/abreviações coloridas (sem dependência de bibliotecas de ícones externas) — fácil de trocar por SVGs de marca depois, se preferir.

## Responsividade

| Breakpoint | Comportamento |
|---|---|
| < 480px | 1 coluna em quase tudo, stats 2 colunas |
| < 768px | Menu hambúrguer (slide-in lateral), grids em 1 coluna |
| < 1024px | Hero empilha (foto acima do texto), stats/skills 2 colunas |
| > 1024px | Layout completo lado a lado |

## Interatividade (JS)

| Funcionalidade | Técnica |
|---|---|
| Menu mobile | Toggle de classe + slide-in lateral |
| Scroll reveal | IntersectionObserver (threshold 0.1) |
| Contadores animados | IntersectionObserver + easing cúbico |
| Nav ativo no scroll | IntersectionObserver por seção |
| Cursor glow (desktop) | requestAnimationFrame + mousemove |
| Back to top | Aparece após 400px de scroll |
| Scroll suave em âncoras | `scrollTo` com offset do nav |
| `prefers-reduced-motion` | Desativa reveal e cursor glow |

## Manutenção

- Cores: editar variáveis no `:root` do `style.css`.
- Adicionar projeto: copiar um bloco `.projeto-card` no HTML (grade principal ou `#mais-projetos`).
- Trocar imagens: substituir os arquivos em `img/` mantendo os mesmos nomes, ou atualizar o `src`.
