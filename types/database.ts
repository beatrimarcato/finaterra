export type Recorrencia = 'avulsa' | 'semanal' | 'quinzenal'

export type Turma = {
  id: string
  nome: string
  criado_em: string
}

export type Profile = {
  id: string
  email: string
  nome: string | null
  celular: string | null
  turma_id: string | null
  tipo: 'semanal' | 'quinzenal_a' | 'quinzenal_b' | null
  criado_em: string
  turma?: Turma
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
  semana_grupo: 'a' | 'b' | null
  criado_em: string
}

export type Agendamento = {
  id: string
  aluna_id: string
  aula_id: string
  criado_em: string
  aula?: Aula
}
