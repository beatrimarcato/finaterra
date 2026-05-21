-- =============================================
-- MIGRATION: turmas, profiles, turma_id e recorrencia em aulas
-- Rodar no Supabase SQL Editor
-- =============================================

-- 1. Tabela de turmas
create table public.turmas (
  id uuid default gen_random_uuid() primary key,
  nome text not null unique,
  criado_em timestamp with time zone default now()
);

-- 2. Tabela de profiles (uma por usuária autenticada)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  turma_id uuid references public.turmas(id) on delete set null,
  criado_em timestamp with time zone default now()
);

-- 3. Adicionar colunas em aulas
alter table public.aulas
  add column turma_id uuid references public.turmas(id) on delete set null,
  add column recorrencia text not null default 'avulsa'
    check (recorrencia in ('avulsa', 'semanal', 'quinzenal'));

-- 4. Índices
create index profiles_turma_id_idx on public.profiles(turma_id);
create index aulas_turma_id_idx on public.aulas(turma_id);

-- 5. RLS para turmas
alter table public.turmas enable row level security;

create policy "Turmas visíveis para autenticados"
  on public.turmas for select to authenticated using (true);

create policy "Apenas admin cria turmas"
  on public.turmas for insert to authenticated
  with check (public.is_admin());

create policy "Apenas admin atualiza turmas"
  on public.turmas for update to authenticated
  using (public.is_admin());

create policy "Apenas admin deleta turmas"
  on public.turmas for delete to authenticated
  using (public.is_admin());

-- 6. RLS para profiles
alter table public.profiles enable row level security;

create policy "Admin vê todos os profiles"
  on public.profiles for select to authenticated
  using (public.is_admin());

create policy "Aluna vê próprio profile"
  on public.profiles for select to authenticated
  using (auth.uid() = id);

create policy "Profile pode ser inserido pela própria aluna"
  on public.profiles for insert to authenticated
  with check (auth.uid() = id);

create policy "Admin atualiza qualquer profile"
  on public.profiles for update to authenticated
  using (public.is_admin());

-- 7. Atualizar política de SELECT em aulas:
--    alunas veem apenas aulas da sua turma; admin vê todas
drop policy "Aulas visíveis para todos autenticados" on public.aulas;

create policy "Aulas visíveis por turma"
  on public.aulas for select to authenticated
  using (
    public.is_admin()
    or (
      turma_id is not null
      and turma_id = (select turma_id from public.profiles where id = auth.uid())
    )
  );

-- 8. Trigger: cria profile automaticamente quando aluna faz login pela 1ª vez
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
