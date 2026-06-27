# Delta for Tema Visual

## ADDED Requirements

### Requirement: Paleta de cores marrom e mostarda
O sistema DEVE usar tons de marrom como cor primária e amarelo mostarda como cor de acento, substituindo os tons de rosa/pink anteriores.

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
- GIVEN qualquer título principal (`h1`) no app
- WHEN renderizado em tela
- THEN usa tom marrom escuro (`#4E2810`)
- AND contraste contra fundo branco é mínimo 7:1 (WCAG AA para texto grande)

---

### Requirement: Fonte Montserrat em todo o sistema
O sistema DEVE usar Montserrat como fonte padrão em toda a interface, nos pesos 400, 500, 600 e 700.

#### Scenario: Fonte aplicada globalmente
- GIVEN qualquer tela do app (admin ou aluna)
- WHEN o conteúdo é renderizado
- THEN toda a tipografia usa Montserrat
- AND não há fallback visível para Inter ou fontes do sistema durante o carregamento

#### Scenario: Legibilidade em mobile
- GIVEN a aluna acessa o app no celular
- WHEN visualiza texto de corpo ou labels de formulário
- THEN Montserrat é renderizada com peso adequado (mínimo 400) e tamanho mínimo de 14px (Tailwind `text-sm`)
