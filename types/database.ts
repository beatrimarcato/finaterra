export type Aula = {
  id: string
  titulo: string
  data: string
  horario: string
  vagas_total: number
  vagas_disponiveis: number
  criado_em: string
}

export type Agendamento = {
  id: string
  aluna_id: string
  aula_id: string
  criado_em: string
  aula?: Aula
}
