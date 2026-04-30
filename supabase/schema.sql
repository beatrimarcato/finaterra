-- Tabela de aulas
create table public.aulas (
  id uuid default gen_random_uuid() primary key,
  titulo text not null,
  data date not null,
  horario time not null,
  vagas_total integer not null check (vagas_total > 0),
  vagas_disponiveis integer not null check (vagas_disponiveis >= 0),
  criado_em timestamp with time zone default now()
);

-- Tabela de agendamentos
create table public.agendamentos (
  id uuid default gen_random_uuid() primary key,
  aluna_id uuid references auth.users(id) on delete cascade not null,
  aula_id uuid references public.aulas(id) on delete cascade not null,
  criado_em timestamp with time zone default now(),
  unique(aluna_id, aula_id)
);

-- Índices
create index agendamentos_aluna_id_idx on public.agendamentos(aluna_id);
create index agendamentos_aula_id_idx on public.agendamentos(aula_id);
create index aulas_data_idx on public.aulas(data);

-- RLS
alter table public.aulas enable row level security;
alter table public.agendamentos enable row level security;

-- Políticas para aulas
create policy "Aulas visíveis para todos autenticados"
  on public.aulas for select
  to authenticated
  using (true);

create policy "Apenas admin pode criar aulas"
  on public.aulas for insert
  to authenticated
  with check (auth.jwt() ->> 'email' = 'beatrimarcato@gmail.com');

create policy "Apenas admin pode atualizar aulas"
  on public.aulas for update
  to authenticated
  using (auth.jwt() ->> 'email' = 'beatrimarcato@gmail.com');

create policy "Apenas admin pode deletar aulas"
  on public.aulas for delete
  to authenticated
  using (auth.jwt() ->> 'email' = 'beatrimarcato@gmail.com');

-- Políticas para agendamentos
create policy "Aluna vê apenas seus agendamentos"
  on public.agendamentos for select
  to authenticated
  using (auth.uid() = aluna_id);

create policy "Aluna pode criar seus agendamentos"
  on public.agendamentos for insert
  to authenticated
  with check (auth.uid() = aluna_id);

create policy "Aluna pode cancelar seus agendamentos"
  on public.agendamentos for delete
  to authenticated
  using (auth.uid() = aluna_id);

-- Função para decrementar vagas ao agendar
create or replace function public.handle_new_agendamento()
returns trigger language plpgsql security definer as $$
begin
  update public.aulas
  set vagas_disponiveis = vagas_disponiveis - 1
  where id = new.aula_id and vagas_disponiveis > 0;

  if not found then
    raise exception 'Aula sem vagas disponíveis';
  end if;

  return new;
end;
$$;

create trigger on_agendamento_created
  before insert on public.agendamentos
  for each row execute procedure public.handle_new_agendamento();

-- Função para incrementar vagas ao cancelar
create or replace function public.handle_cancel_agendamento()
returns trigger language plpgsql security definer as $$
begin
  update public.aulas
  set vagas_disponiveis = vagas_disponiveis + 1
  where id = old.aula_id;
  return old;
end;
$$;

create trigger on_agendamento_deleted
  after delete on public.agendamentos
  for each row execute procedure public.handle_cancel_agendamento();
