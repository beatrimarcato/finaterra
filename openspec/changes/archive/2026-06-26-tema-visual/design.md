# Design: Tema Visual

## Paleta de Cores

### Marrom (substitui `rose-*`)

| Token Tailwind | Hex       | Uso principal                              | Contraste vs branco |
|----------------|-----------|-------------------------------------------|---------------------|
| `rose-50`      | `#FBF5EF` | Backgrounds de página (gradient start)    | —                   |
| `rose-100`     | `#F3E2CA` | Cards, seções de destaque leve            | —                   |
| `rose-200`     | `#E4C49A` | Bordas de componentes de destaque         | —                   |
| `rose-300`     | `#D0A06C` | Hover em bordas, separadores              | —                   |
| `rose-400`     | `#BB7C40` | Estados intermediários                    | 3.0:1               |
| `rose-500`     | `#9A5F28` | Cor secundária média                      | 4.6:1 ✅            |
| `rose-600`     | `#7C4A1E` | **Primário** — botões, links ativos, nav  | 6.9:1 ✅ (AA+)      |
| `rose-700`     | `#6A3A14` | Hover de botões e links                   | 8.7:1 ✅ (AAA)      |
| `rose-800`     | `#4E2810` | Headings principais                       | 13:1 ✅ (AAA)       |
| `rose-900`     | `#361A08` | Texto muito enfatizado                    | 17:1 ✅ (AAA)       |

### Mostarda (substitui `pink-*`)

| Token Tailwind | Hex       | Uso principal                             |
|----------------|-----------|------------------------------------------|
| `pink-50`      | `#FEFBF0` | Backgrounds de página (gradient end)      |
| `pink-100`     | `#FDF3D0` | Gradients secundários, fundos de página   |
| `pink-200`     | `#F7DE90` | Bordas e detalhes de acento               |

## Fonte: Montserrat

- **Família**: Montserrat (Google Fonts via `next/font/google`)
- **Pesos**: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)
- **Subsets**: `latin`
- **Variable**: `--font-sans` (já mapeado no tema via `@theme inline`)
- **Justificativa mobile**: Montserrat tem x-height alto e formas abertas, melhorando legibilidade em telas pequenas e densidades de pixel variadas

## Technical Approach

### Por que redefinir rose/pink em vez de criar novas classes?

O app usa `rose-*` e `pink-*` em ~50 lugares. Renomear todos seria arriscado e geraria PRs enormes. Tailwind v4 permite sobrescrever escalas no `@theme {}` — as classes `rose-600`, `rose-800` etc. continuam funcionando, mas agora renderizam marrom. Zero risco de regressão em componentes.

### Acessibilidade

- Texto corpo: `rose-600` (#7C4A1E) sobre branco = **6.9:1** (WCAG AA ✅, AA Large ✅)
- Texto branco sobre `rose-600`: mesmo ratio = **6.9:1** ✅
- Headings `rose-800` (#4E2810) sobre branco: **~13:1** (AAA ✅)
- Fundo `rose-50` (#FBF5EF) é neutro — texto padrão `gray-900` mantém contraste alto
- Touch targets: sem mudança (já dimensionados no componente)

## File Changes

- `app/layout.tsx` (modified) — troca `Inter` por `Montserrat` com `variable: '--font-sans'`
- `app/globals.css` (modified) — adiciona `@theme {}` com redefinição de `rose-*` e `pink-*`
