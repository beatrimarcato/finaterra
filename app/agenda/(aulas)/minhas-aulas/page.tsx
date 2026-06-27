import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CancelButton } from '@/components/cancel-button'

export default async function MinhasAulasPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: agendamentos } = await supabase
    .from('agendamentos')
    .select('*, aula:aulas(*)')
    .eq('aluna_id', user!.id)
    .order('criado_em', { ascending: false })

  const hoje = new Date().toISOString().split('T')[0]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-brand-800">Minhas Aulas</h1>
      {agendamentos && agendamentos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agendamentos.map((ag: any) => {
            const isPast = ag.aula?.data < hoje
            return (
              <Card key={ag.id} className={isPast ? 'opacity-60' : ''}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base">{ag.aula?.titulo}</CardTitle>
                    <Badge variant={isPast ? 'secondary' : 'default'} className={isPast ? '' : 'bg-brand-600'}>
                      {isPast ? 'Concluída' : 'Confirmada'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-1 text-sm text-muted-foreground">
                  <p>📅 {ag.aula?.data ? new Date(ag.aula.data + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : ''}</p>
                  <p>🕐 {ag.aula?.horario}</p>
                  {!isPast && <CancelButton agendamentoId={ag.id} aulaId={ag.aula_id} />}
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          Você ainda não tem aulas agendadas.
        </div>
      )}
    </div>
  )
}
