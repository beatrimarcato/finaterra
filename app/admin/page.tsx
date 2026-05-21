import { createClient } from '@/lib/supabase/server'
import { AulaCard } from '@/components/aula-card'
import { CreateAulaDialog } from '@/components/create-aula-dialog'
import { Aula } from '@/types/database'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: aulas } = await supabase
    .from('aulas')
    .select('*, turma:turmas(id, nome, criado_em)')
    .order('data', { ascending: true })
    .order('horario', { ascending: true })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Gerenciar Aulas</h1>
        <CreateAulaDialog />
      </div>
      {aulas && aulas.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {aulas.map((aula: Aula) => (
            <AulaCard key={aula.id} aula={aula} isAdmin />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          Nenhuma aula cadastrada ainda. Crie a primeira!
        </div>
      )}
    </div>
  )
}
