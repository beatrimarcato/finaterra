<<<<<<< HEAD
export type Recorrencia = 'avulsa' | 'semanal' | 'quinzenal'

/** @deprecated coluna removida do banco — mantida só para compatibilidade de tipos */
export type SemanasDoMes = '1_3' | '2_4'

export type Turma = {
  id: string
  nome: string
  semanas_do_mes?: SemanasDoMes | null
=======
export type Turma = {
  id: string
  nome: string
>>>>>>> 69df8e35185937196dbd5775c87abd9c59859411
  criado_em: string
}

export type Profile = {
  id: string
  email: string
<<<<<<< HEAD
  nome: string | null
  celular: string | null
=======
  nome: string
  celular: string
>>>>>>> 69df8e35185937196dbd5775c87abd9c59859411
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
<<<<<<< HEAD
  turma?: Turma
=======
>>>>>>> 69df8e35185937196dbd5775c87abd9c59859411
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
