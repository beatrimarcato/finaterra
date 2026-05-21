import { createClient } from '@/lib/supabase/server'
import { Turma } from '@/types/database'
import { CreateTurmaForm } from '@/components/create-turma-form'
import { TurmaActions } from '@/components/turma-actions'

export default async function TurmasPage() {
  const supabase = await createClient()
  const { data: turmas } = await supabase
    .from('turmas')
    .select('*')
    .order('nome', { ascending: true })

  return (
    <div className="space-y-6 max-w-xl">
      <h1 className="text-2xl font-bold text-gray-900">Turmas</h1>

      <CreateTurmaForm />

      {turmas && turmas.length > 0 ? (
        <div className="divide-y border rounded-lg bg-white">
          {turmas.map((turma: Turma) => (
            <div key={turma.id} className="flex items-center justify-between px-4 py-3 gap-4">
              <div>
                <span className="font-medium text-gray-800">{turma.nome}</span>
                <span className="text-xs text-muted-foreground ml-3">
                  {new Date(turma.criado_em).toLocaleDateString('pt-BR')}
                </span>
              </div>
              <TurmaActions turmaId={turma.id} turmaAtual={turma.nome} />
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
