import { createClient } from '@/lib/supabase/server'
import { AulaCard } from '@/components/aula-card'
import { Aula } from '@/types/database'

export default async function AgendaPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Buscar perfil da aluna
  const { data: profile } = await supabase
    .from('profiles')
    .select('*, turma:turmas(nome)')
    .eq('id', user!.id)
    .single()

  // Sem turma configurada → tela de espera
  if (!profile?.turma_id || !profile?.tipo) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center space-y-3">
        <p className="text-4xl">🏺</p>
        <h2 className="text-xl font-semibold text-rose-800">Quase lá!</h2>
        <p className="text-muted-foreground max-w-sm">
          Sua conta foi criada. Aguarde a professora configurar sua turma — assim que ela fizer isso, sua agenda aparecerá aqui.
        </p>
      </div>
    )
  }

  // Montar filtro de aulas baseado no tipo da aluna
  let query = supabase
    .from('aulas')
    .select('*')
    .eq('turma_id', profile.turma_id)
    .gte('data', new Date().toISOString().split('T')[0])
    .order('data', { ascending: true })
    .order('horario', { ascending: true })

  if (profile.tipo === 'quinzenal_a') {
    query = query.eq('semana_grupo', 'a')
  } else if (profile.tipo === 'quinzenal_b') {
    query = query.eq('semana_grupo', 'b')
  }
  // semanal: sem filtro adicional — vê todas as aulas da turma

  const { data: aulas } = await query

  const { data: agendamentos } = await supabase
    .from('agendamentos')
    .select('aula_id')
    .eq('aluna_id', user!.id)

  const aulaIdsAgendadas = new Set(agendamentos?.map(a => a.aula_id) ?? [])

  const turmaLabel = (profile.turma as any)?.nome ?? ''
  const tipoLabel = profile.tipo === 'semanal' ? 'Semanal' : profile.tipo === 'quinzenal_a' ? 'Quinzenal A' : 'Quinzenal B'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-rose-800">Aulas Disponíveis</h1>
        <p className="text-sm text-muted-foreground mt-1">{turmaLabel} · {tipoLabel}</p>
      </div>
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
