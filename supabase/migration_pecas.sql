-- =============================================
-- MIGRATION: pecas prontas
-- Rodar no Supabase SQL Editor
-- =============================================

-- 1. Tabela de peças
create table public.pecas (
  id uuid default gen_random_uuid() primary key,
  aluna_id uuid references auth.users(id) on delete cascade not null,
  peso_gramas integer not null check (peso_gramas > 0),
  foto_url text,
  status text not null default 'pendente'
    check (status in ('pendente', 'comprovante_enviado', 'confirmado')),
  comprovante_url text,
  criado_em timestamp with time zone default now()
);

-- 2. Índices
create index pecas_aluna_id_idx on public.pecas(aluna_id);
create index pecas_status_idx on public.pecas(status);

-- 3. RLS
alter table public.pecas enable row level security;

create policy "Admin vê todas as peças"
  on public.pecas for select to authenticated
  using (public.is_admin());

create policy "Aluna vê suas próprias peças"
  on public.pecas for select to authenticated
  using (auth.uid() = aluna_id);

create policy "Apenas admin insere peças"
  on public.pecas for insert to authenticated
  with check (public.is_admin());

create policy "Admin pode atualizar qualquer peça"
  on public.pecas for update to authenticated
  using (public.is_admin());

create policy "Aluna pode atualizar sua própria peça"
  on public.pecas for update to authenticated
  using (auth.uid() = aluna_id)
  with check (auth.uid() = aluna_id);

-- 4. Storage buckets
-- pecas-fotos: público (fotos das peças não são sensíveis)
insert into storage.buckets (id, name, public)
  values ('pecas-fotos', 'pecas-fotos', true)
  on conflict (id) do nothing;

-- pecas-comprovantes: privado (dados financeiros)
insert into storage.buckets (id, name, public)
  values ('pecas-comprovantes', 'pecas-comprovantes', false)
  on conflict (id) do nothing;

-- 5. Storage policies: pecas-fotos
create policy "Admin faz upload de fotos"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'pecas-fotos' and public.is_admin());

create policy "Autenticados leem fotos de peças"
  on storage.objects for select to authenticated
  using (bucket_id = 'pecas-fotos');

-- 6. Storage policies: pecas-comprovantes
create policy "Aluna envia comprovante no próprio prefixo"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'pecas-comprovantes'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Admin vê todos os comprovantes"
  on storage.objects for select to authenticated
  using (bucket_id = 'pecas-comprovantes' and public.is_admin());

create policy "Aluna vê seu próprio comprovante"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'pecas-comprovantes'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
