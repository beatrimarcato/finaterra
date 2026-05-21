import { createClient } from '@/lib/supabase/server'
import { AulaCard } from '@/components/aula-card'
import { Aula } from '@/types/database'

export default async function AgendaPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Busca o turma_id da aluna logada
  const { data: profile } = await supabase
    .from('profiles')
    .select('turma_id')
    .eq('id', user!.id)
    .single()

  const turmaId = profile?.turma_id

  // Busca aulas da turma da aluna (filtro explícito + RLS como segunda camada)
  const { data: aulas } = turmaId
    ? await supabase
        .from('aulas')
        .select('*, turma:turmas(id, nome, criado_em)')
        .eq('turma_id', turmaId)
        .gte('data', new Date().toISOString().split('T')[0])
        .order('data', { ascending: true })
        .order('horario', { ascending: true })
    : { data: [] }

  const { data: agendamentos } = await supabase
    .from('agendamentos')
    .select('aula_id')
    .eq('aluna_id', user!.id)

  const aulaIdsAgendadas = new Set(agendamentos?.map(a => a.aula_id) ?? [])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-rose-800">Aulas Disponíveis</h1>
      {aulas && aulas.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {aulas.map((aula: Aula) => (
            <AulaCard
              key={aula.id}
              aula={aula}
              isAgendada={aulaIdsAgendadas.has(aula.id)}
              userId={user!.id}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          Nenhuma aula disponível no momento.
        </div>
      )}
    </div>
  )
}
