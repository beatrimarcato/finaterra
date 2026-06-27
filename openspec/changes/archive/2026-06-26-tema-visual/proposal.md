# Proposal: Tema Visual — Marrom e Amarelo Mostarda

## Intent

O sistema atualmente usa tons de rosa/pink como cor primária. A identidade visual da Finaterra Cerâmica pede tons terrosos — marrom e amarelo mostarda — que remetem à argila, à queima e ao universo da cerâmica. A mudança abrange todo o app: área da aluna (uso principal mobile) e painel admin (desktop/mobile).

A fonte também muda de Inter para Montserrat, que oferece melhor legibilidade em telas pequenas com suas proporções geométricas e espessuras variadas.

## Scope

**In scope:**
- Substituição completa da paleta rose/pink por marrom e mostarda em todos os componentes
- Troca da fonte Inter por Montserrat (pesos 400, 500, 600, 700)
- Garantia de contraste WCAG AA em todos os textos e ações

**Out of scope:**
- Modo escuro (dark mode não está ativo no app)
- Customização por turma ou por aluna
- Icones ou ilustrações

## Approach

Tailwind v4 permite redefinir escalas de cores inteiras via `@theme` no `globals.css`, sem alterar nenhum componente. Rose passa a representar o marrom e pink passa a representar o mostarda. Montserrat é carregada via `next/font/google` com a opção `variable`, alimentando o `--font-sans` já mapeado no tema.
