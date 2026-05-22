-- =============================================
-- MIGRATION: semanas_do_mes em turmas
-- Armazena a regra de quais sábados do mês cada turma quinzenal usa
-- '1_3' = 1º e 3º sábados | '2_4' = 2º e 4º sábados
-- Rodar no Supabase SQL Editor
-- =============================================

alter table public.turmas
  add column semanas_do_mes text
  check (semanas_do_mes in ('1_3', '2_4'));
