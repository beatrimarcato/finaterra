import { createClient } from '@/lib/supabase/server'
import { Turma, SemanasDoMes } from '@/types/database'
import { CreateTurmaForm } from '@/components/create-turma-form'
import { TurmaActions } from '@/components/turma-actions'
import { GerarAulasMesDialog } from '@/components/gerar-aulas-mes-dialog'

const SEMANAS_LABELS: Record<SemanasDoMes, string> = {
  '1_3': 'Ímpares',
  '2_4': 'Pares',
}

export default async function TurmasPage() {
  const supabase = await createClient()
  const { data: turmas } = await supabase
    .from('turmas')
    .select('*')
    .order('nome', { ascending: true })

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900">Turmas</h1>

      <CreateTurmaForm />

      {turmas && turmas.length > 0 ? (
        <div className="divide-y border rounded-lg bg-white">
          {turmas.map((turma: Turma) => (
            <div key={turma.id} className="flex items-center justify-between px-4 py-3 gap-4">
              <div className="min-w-0">
                <span className="font-medium text-gray-800">{turma.nome}</span>
                <span className="text-xs text-muted-foreground ml-3">
                  {new Date(turma.criado_em).toLocaleDateString('pt-BR')}
                </span>
                {turma.semanas_do_mes && (
                  <p className="text-xs text-brand-600 mt-0.5">
                    {SEMANAS_LABELS[turma.semanas_do_mes]}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {turma.semanas_do_mes && (
                  <GerarAulasMesDialog turma={turma} />
                )}
                <TurmaActions
                  turmaId={turma.id}
                  turmaAtual={turma.nome}
                  semanasAtual={turma.semanas_do_mes ?? null}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground border rounded-lg bg-white">
          Nenhuma turma cadastrada ainda.
        </div>
      )}
    </div>
  )
}
