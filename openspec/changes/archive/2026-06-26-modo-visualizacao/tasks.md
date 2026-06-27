# Tasks: Modo de Visualização

## 1. Infraestrutura de contexto

- [ ] 1.1 Criar `components/view-mode-context.tsx` com `ViewModeContext`, `ViewModeProvider` e hook `useViewMode`
- [ ] 1.2 Criar `components/view-mode-switch.tsx` com toggle Desktop/Mobile (lê e grava localStorage)

## 2. Integração nas navs

- [ ] 2.1 Adicionar `ViewModeSwitch` ao `AdminNav` com `defaultMode="desktop"`
- [ ] 2.2 Adicionar `ViewModeSwitch` ao `AlunaNav` com `defaultMode="mobile"`

## 3. Providers nos layouts

- [ ] 3.1 Envolver `children` com `ViewModeProvider` em `app/admin/layout.tsx` (default: desktop)
- [ ] 3.2 Envolver `children` com `ViewModeProvider` em `app/agenda/(aulas)/layout.tsx` (default: mobile)
- [ ] 3.3 Envolver `children` com `ViewModeProvider` em `app/pecas/layout.tsx` (default: mobile)

## 4. Adaptação de componentes

- [ ] 4.1 Adaptar grids de cards (`AulaCard`, `PecasPage`) para 1 coluna em mobile e 2–3 em desktop
- [ ] 4.2 Adaptar `PecasAdminList` para exibir cards empilhados (mobile) ou linhas compactas (desktop)
- [ ] 4.3 Adaptar botões de ação para largura total em mobile
- [ ] 4.4 Revisar espaçamentos e tipografia nos layouts adaptados
