# Design: Modo de Visualização

## Technical Approach

Context + localStorage. O modo é um estado global por sessão de navegação, persistido localmente. Nenhuma mudança no banco de dados é necessária.

## Architecture Decisions

### Decision: Context React em vez de CSS media queries

O switch é intencional e explícito — não queremos que o layout mude automaticamente ao girar o dispositivo ou redimensionar a janela. A usuária escolhe o modo que prefere. Por isso, usamos estado React controlado pelo usuário em vez de breakpoints CSS responsivos.

### Decision: localStorage com fallback por perfil

- Chave: `finaterra_view_mode`
- Valor: `"desktop"` | `"mobile"`
- Se não houver valor salvo: admin recebe `"desktop"`, aluna recebe `"mobile"`
- Leitura no lado do cliente para evitar hydration mismatch (componente `'use client'`)

### Decision: Switch na nav, não em cada página

O modo afeta todo o app, então o controle fica na nav (AdminNav / AlunaNav) onde sempre está visível. Evita duplicação e garante consistência.

## Data Flow

```
Layout (server) renderiza contexto com defaultMode
  → ViewModeProvider (client) lê localStorage na montagem
    → sobrescreve com valor salvo se existir
      → NavSwitch atualiza contexto + grava localStorage
        → Componentes consomem useViewMode() para variar layout
```

## Variações de layout esperadas

| Elemento            | Mobile                        | Desktop                        |
|---------------------|-------------------------------|--------------------------------|
| Grid de cards       | 1 coluna                      | 2–3 colunas                    |
| Tabelas/listas      | Cards empilhados              | Linhas horizontais             |
| Tipografia          | Maior (legível no celular)    | Padrão                         |
| Botões de ação      | Largura total (touch-friendly)| Tamanho natural (inline)       |
| Espaçamento         | Mais vertical                 | Compacto horizontal            |

## File Changes

- `components/view-mode-context.tsx` (new) — Context, Provider e hook `useViewMode`
- `components/view-mode-switch.tsx` (new) — Componente de toggle para a nav
- `components/admin-nav.tsx` (modified) — incluir ViewModeSwitch + passar defaultMode
- `components/aluna-nav.tsx` (modified) — incluir ViewModeSwitch + passar defaultMode
- `app/admin/layout.tsx` (modified) — envolver children com ViewModeProvider (default: desktop)
- `app/agenda/(aulas)/layout.tsx` (modified) — envolver children com ViewModeProvider (default: mobile)
- `app/pecas/layout.tsx` (modified) — envolver children com ViewModeProvider (default: mobile)
- Componentes de listagem e grid (modified) — consumir `useViewMode()` para variar layout
