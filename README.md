# Filipe Lucas — Portfólio v3 (React + Three.js + Rapier)

Reconstrução completa do design, mantendo 100% do conteúdo real do portfólio
anterior (projetos, stack, formação, experiência, links).

## Stack

- **React 19 + TypeScript + Vite**
- **Tailwind CSS v4** (config via CSS, sem `tailwind.config.js`)
- **Framer Motion** — scroll reveals, botões magnéticos, transições
- **Three.js + React Three Fiber + Rapier** — crachá 3D com física real (pêndulo)
- Fontes **Sora / Inter / JetBrains Mono** self-hosted via `@fontsource` (sem
  dependência de CDN externo — ver seção "Decisões técnicas" abaixo)

## Rodando localmente

```bash
npm install
npm run dev        # http://localhost:5173
```

## Build de produção

```bash
npm run build       # gera /dist
npm run preview      # serve /dist localmente pra conferir antes do deploy
```

## Deploy

O projeto é 100% estático depois do build (`/dist`). Duas opções:

### Vercel (recomendado, mais simples)
1. `npm install -g vercel` (se ainda não tiver)
2. Na raiz do projeto: `vercel --prod`
3. Ou conecte o repositório Git direto no [vercel.com](https://vercel.com) —
   framework preset "Vite" é detectado automaticamente. Build command:
   `npm run build`, output directory: `dist`.

### GitHub Pages
Como o projeto agora usa build step (Vite), o deploy no GitHub Pages precisa
rodar `npm run build` e publicar a pasta `dist/`, não o repositório inteiro.
O jeito mais simples é usar uma GitHub Action (`actions/deploy-pages`) que
builda e publica automaticamente a cada push. Se preferir manter tudo simples
sem Action, o Vercel é o caminho de menor atrito.

## Estrutura

```
src/
  components/        # componentes reutilizáveis (Navbar, Cursor, botões, etc.)
    3d/               # crachá 3D: mesh, física, cena, fallback, canvas-texture
  sections/           # Hero, About, Skills, Projects, Contact (uma por seção)
  data/               # site.ts, projects.ts, skills.ts — TODO o conteúdo real
  hooks/              # useDeviceTier, useIsFinePointer, etc.
```

Dados e apresentação são separados: pra editar textos, projetos ou skills,
mexe só em `src/data/`, nunca precisa tocar nos componentes visuais.

## Decisões técnicas importantes

**Crachá 3D com física real via Rapier.** Usa um joint esférico (`useSphericalJoint`)
ligando um ponto fixo a um ponto de fixação no topo do crachá — isso cria um
pêndulo físico de verdade (não é uma rotação CSS fingindo ser 3D). O crachá reage
ao movimento do mouse via impulsos de torque, com amortecimento alto
(`angularDamping`/`linearDamping`) e um clamp de velocidade angular máxima —
isso garante que ele nunca "endoideça" (jitter, spin infinito, sair da tela).

**Sem dependências externas de rede no 3D.** Na primeira versão, o crachá usava
`<Environment preset="city">` (busca um HDR de `raw.githack.com`) e texto 3D via
drei `<Text>` (que por baixo usa troika-three-text, que SEMPRE busca um índice de
glifos Unicode de `cdn.jsdelivr.net`, mesmo com fonte local especificada). Ambos
foram removidos: o ambiente agora é sintético (`Lightformer`, gerado localmente),
e o texto do crachá (nome, cargo, marca) é desenhado num `<canvas>` 2D e usado
como textura — sem nenhuma chamada de rede. Isso importa porque, num site de
portfólio, um CDN de terceiro fora do ar não pode derrubar seu elemento principal.

**Code splitting agressivo.** Three.js + React Three Fiber + Rapier (a parte
pesada, ~1MB) só carrega via `React.lazy()` quando o dispositivo é desktop com
boa capacidade (`useDeviceTier` checa núcleos de CPU, memória e tipo de ponteiro).
Em mobile ou `prefers-reduced-motion`, carrega só o fallback em CSS/Framer Motion
— o bundle inicial fica em ~220KB.

**Skills como "teclas 3D" via CSS, não Three.js.** Optei por `transform-style:
preserve-3d` + bevel via camadas ao invés de uma segunda cena Three.js separada.
Mais leve, mais fácil de manter, e visualmente já entrega a sensação de teclado
físico pedida no brief — reservei o Three.js/física de verdade só pro elemento
que mais precisa disso (o crachá).

## Coisas que ficaram como estão por falta de dado real

- **Botão "Baixar CV"**: hoje aponta pro WhatsApp ("Entrar em contato"). Não
  recebi um PDF de currículo — quando tiver um, é só trocar o `href` em
  `src/components/Navbar.tsx` e `src/sections/Hero.tsx` e adicionar o
  atributo `download`.
- **Card "Business OS"**: usa a screenshot real do projeto (`/public/img/bussineos.png`).
