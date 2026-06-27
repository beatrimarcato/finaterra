# Tasks: Peças Prontas

## 1. Banco de dados

- [x] 1.1 Criar `supabase/migration_pecas.sql` com tabela `pecas`, índices e RLS
- [x] 1.2 Adicionar storage buckets `pecas-fotos` (público) e `pecas-comprovantes` (privado) com policies

## 2. Tipos e navegação

- [x] 2.1 Adicionar `Peca` e `PecaStatus` em `types/database.ts`
- [x] 2.2 Adicionar link "Peças" em `components/admin-nav.tsx`
- [x] 2.3 Adicionar link "Peças" em `components/aluna-nav.tsx`

## 3. Tela admin

- [x] 3.1 Criar `app/admin/pecas/actions.ts` com server actions `confirmarPagamento` e `deletarPeca`
- [x] 3.2 Criar `components/nova-peca-dialog.tsx` (formulário: dropdown alunas, peso g/kg, foto)
- [x] 3.3 Criar `components/pecas-admin-list.tsx` (tabela com foto, aluna, peso, status, botões confirmar e excluir)
- [x] 3.4 Criar `app/admin/pecas/page.tsx` compondo os componentes acima
- [x] 3.5 Adicionar policy RLS `"Admin pode excluir peças pendentes"` na migration

## 4. Tela aluna

- [x] 4.1 Criar `app/pecas/layout.tsx` com auth check e AlunaNav
- [x] 4.2 Criar `components/upload-comprovante-button.tsx` (upload para storage + update status)
- [x] 4.3 Criar `app/pecas/page.tsx` listando peças da aluna com status e botão de upload
