import { createClient } from '@/lib/supabase/server'
import { Aula } from '@/types/database'
import { AulasGrid } from '@/components/aulas-grid'

export default async function AgendaPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Busca o perfil da aluna (turma + tipo)
  const { data: profile } = await supabase
    .from('profiles')
    .select('turma_id, tipo, turma:turmas(id, nome, criado_em)')
    .eq('id', user!.id)
    .single()

  const turmaId = profile?.turma_id

  // Sem turma configurada → sem aulas
  if (!turmaId) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Nenhuma aula disponível no momento.
      </div>
    )
  }

  // Montar query filtrando por turma e tipo
  let query = supabase
    .from('aulas')
    .select('*, turma:turmas(id, nome, criado_em)')
    .eq('turma_id', turmaId)
    .gte('data', new Date().toISOString().split('T')[0])
    .order('data', { ascending: true })
    .order('horario', { ascending: true })

  if (profile?.tipo === 'quinzenal_a') {
    query = query.eq('semana_grupo', 'a')
  } else if (profile?.tipo === 'quinzenal_b') {
    query = query.eq('semana_grupo', 'b')
  }
  // semanal: sem filtro — vê todas as aulas da turma

  const { data: aulas } = await query

  const { data: agendamentos } = await supabase
    .from('agendamentos')
    .select('aula_id')
    .eq('aluna_id', user!.id)

  const aulaIdsAgendadas = new Set(agendamentos?.map(a => a.aula_id) ?? [])

  const turmaLabel = (profile?.turma as any)?.nome ?? ''
  const tipoLabel = profile?.tipo === 'semanal' ? 'Semanal'
    : profile?.tipo === 'quinzenal_a' ? 'Quinzenal A'
    : profile?.tipo === 'quinzenal_b' ? 'Quinzenal B'
    : ''

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-800">Aulas Disponíveis</h1>
        {turmaLabel && (
          <p className="text-sm text-muted-foreground mt-1">{turmaLabel}{tipoLabel && ` · ${tipoLabel}`}</p>
        )}
      </div>
      <AulasGrid
        aulas={(aulas ?? []) as Aula[]}
        aulaIdsAgendadas={aulaIdsAgendadas}
        userId={user!.id}
      />
    </div>
  )
}
