export type Recorrencia = 'avulsa' | 'semanal' | 'quinzenal'

export type SemanasDoMes = '1_3' | '2_4'

export type Turma = {
  id: string
  nome: string
  semanas_do_mes: SemanasDoMes | null
  criado_em: string
}

export type Profile = {
  id: string
  email: string
  nome: string | null
  celular: string | null
  turma_id: string | null
  turma?: Turma
  criado_em: string
}

export type Aula = {
  id: string
  titulo: string
  data: string
  horario: string
  vagas_total: number
  vagas_disponiveis: number
  turma_id: string | null
  turma?: Turma
  recorrencia: Recorrencia
  criado_em: string
}

export type Agendamento = {
  id: string
  aluna_id: string
  aula_id: string
  criado_em: string
  aula?: Aula
}
