# Tema Visual Specification

## Purpose

Identidade visual do app Finaterra Agenda: tons terrosos de marrom e amarelo mostarda, remetendo à cerâmica e à argila. Fonte Montserrat para legibilidade em mobile e desktop.

## Requirements

### Requirement: Paleta de cores marrom e mostarda
O sistema DEVE usar tons de marrom como cor primária e amarelo mostarda como cor de acento, com contraste mínimo WCAG AA em todos os textos de ação.

**Paleta (mapeada sobre as classes Tailwind `rose-*` e `pink-*`):**

| Token          | Hex       | Uso                             | Contraste vs branco |
|----------------|-----------|---------------------------------|---------------------|
| `rose-50`      | `#FBF5EF` | Backgrounds de página           | —                   |
| `rose-200`     | `#E4C49A` | Bordas de destaque              | —                   |
| `rose-600`     | `#7C4A1E` | Botões, links ativos, nav       | 6.9:1 ✅ (AA)       |
| `rose-700`     | `#6A3A14` | Hover de botões/links           | 8.7:1 ✅ (AAA)      |
| `rose-800`     | `#4E2810` | Headings principais             | 13:1 ✅ (AAA)       |
| `pink-50`      | `#FEFBF0` | Gradient end de páginas aluna   | —                   |
| `pink-100`     | `#FDF3D0` | Gradient end secundário         | —                   |

#### Scenario: Ações primárias em marrom
- GIVEN qualquer tela do app
- WHEN a usuária vê botões de ação principal, links ativos na nav ou elementos de destaque
- THEN esses elementos são renderizados em marrom (`#7C4A1E`)
- AND o contraste contra o fundo é no mínimo 4.5:1 (WCAG AA)

#### Scenario: Backgrounds com gradiente terroso
- GIVEN qualquer página da área de alunas
- WHEN a página carrega
- THEN o background usa gradiente de creme suave (`#FBF5EF`) para mostarda muito claro (`#FEFBF0`)

#### Scenario: Headings em marrom escuro
- GIVEN qualquer título principal no app
- WHEN renderizado em tela
- THEN usa tom marrom escuro (`#4E2810`) com contraste mínimo 7:1 contra fundo branco

### Requirement: Fonte Montserrat em todo o sistema
O sistema DEVE usar Montserrat como fonte padrão em toda a interface, nos pesos 400, 500, 600 e 700.

#### Scenario: Fonte aplicada globalmente
- GIVEN qualquer tela do app (admin ou aluna)
- WHEN o conteúdo é renderizado
- THEN toda a tipografia usa Montserrat via variável CSS `--font-sans`

#### Scenario: Legibilidade em mobile
- GIVEN a aluna acessa o app no celular
- WHEN visualiza texto de corpo ou labels
- THEN Montserrat é renderizada com peso mínimo 400 e tamanho mínimo `text-sm` (14px)
