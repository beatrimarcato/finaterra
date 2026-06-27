# Design: Peças Prontas

## Technical Approach

Extensão do schema Supabase existente com nova tabela `pecas` e dois storage buckets. Segue o padrão do projeto (Next.js 15 App Router, Server Components, shadcn/ui, RLS no Supabase).

## Architecture Decisions

### Decision: Dois buckets de storage separados

`pecas-fotos` é público (sem chave de acesso) para simplificar a exibição da foto na tela da aluna sem precisar gerar signed URLs. `pecas-comprovantes` é privado — comprovantes têm natureza financeira e só devem ser visíveis para admin e para a própria aluna (via signed URL gerada no servidor).

### Decision: Upload via cliente browser

Uploads feitos diretamente do browser para o Supabase Storage (sem passar pelo servidor Next.js), seguindo o padrão já usado em outros formulários do projeto. As storage policies garantem que cada aluna só sobe no próprio prefixo.

### Decision: Status como coluna text com check constraint

Três valores possíveis: `pendente`, `comprovante_enviado`, `confirmado`. Simples, sem tabela extra de status.

### Decision: Peso em gramas (inteiro)

Armazenado como `integer` em gramas para evitar ponto flutuante. A UI exibe em g ou kg conforme preferência do usuário na hora do lançamento.

## Data Flow

```
Admin cria peça:
  NovaPecaDialog (client)
    → upload foto → storage: pecas-fotos/{uuid}.{ext}
    → insert pecas row (aluna_id, peso_gramas, foto_url, status='pendente')

Aluna envia comprovante:
  UploadComprovanteButton (client)
    → upload comprovante → storage: pecas-comprovantes/{aluna_id}/{peca_id}.{ext}
    → update pecas set comprovante_url=..., status='comprovante_enviado'

Admin confirma pagamento:
  Server Action: confirmarPagamento(pecaId)
    → update pecas set status='confirmado'
```

## File Changes

- `supabase/migration_pecas.sql` (new) — tabela, RLS, storage buckets
- `types/database.ts` (modified) — adicionar tipo `Peca` e `PecaStatus`
- `components/admin-nav.tsx` (modified) — adicionar link "Peças"
- `components/aluna-nav.tsx` (modified) — adicionar link "Peças"
- `app/admin/pecas/page.tsx` (new) — tela admin
- `app/admin/pecas/actions.ts` (new) — server action confirmar pagamento
- `components/nova-peca-dialog.tsx` (new) — formulário de lançamento
- `components/pecas-admin-list.tsx` (new) — lista admin com ações
- `app/pecas/layout.tsx` (new) — layout aluna com auth check
- `app/pecas/page.tsx` (new) — tela aluna
- `components/upload-comprovante-button.tsx` (new) — upload de comprovante
