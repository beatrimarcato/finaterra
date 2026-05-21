-- =============================================
-- FIX: política de aulas visíveis por turma
-- Problema: subquery em RLS sobre tabela com RLS ativa (profiles)
-- Solução: usar função security definer para buscar turma_id da aluna
-- Rodar no Supabase SQL Editor
-- =============================================

-- 1. Função que retorna o turma_id da aluna logada (security definer = sem RLS)
create or replace function public.get_my_turma_id()
returns uuid language sql security definer stable as $$
  select turma_id from public.profiles where id = auth.uid();
$$;

-- 2. Recriar a política de SELECT de aulas usando a função
drop policy if exists "Aulas visíveis por turma" on public.aulas;

create policy "Aulas visíveis por turma"
  on public.aulas for select to authenticated
  using (
    public.is_admin()
    or turma_id = public.get_my_turma_id()
  );

-- 3. Garantir que a política antiga (se ainda existir) foi removida
drop policy if exists "Aulas visíveis para todos autenticados" on public.aulas;
