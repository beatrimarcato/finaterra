import { createClient } from '@/lib/supabase/server'
import { Profile, Turma } from '@/types/database'
import { TurmaSelector } from '@/components/turma-selector'

export default async function AlunasPage() {
  const supabase = await createClient()

  const [{ data: profiles }, { data: turmas }] = await Promise.all([
    supabase
      .from('profiles')
      .select('*, turma:turmas(id, nome, criado_em)')
      .order('email', { ascending: true }),
    supabase
      .from('turmas')
      .select('*')
      .order('nome', { ascending: true }),
  ])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Alunas</h1>

      {profiles && profiles.length > 0 ? (
        <div className="border rounded-lg bg-white divide-y">
          {profiles.map((profile: Profile) => (
            <div key={profile.id} className="flex items-center justify-between px-4 py-3 gap-4">
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{profile.email}</p>
                {profile.turma?.nome ? (
                  <p className="text-xs text-rose-600 mt-0.5">{profile.turma.nome}</p>
                ) : (
                  <p className="text-xs text-muted-foreground mt-0.5">Sem turma</p>
                )}
              </div>
              <TurmaSelector
                profileId={profile.id}
                turmaAtualId={profile.turma_id}
                turmas={turmas ?? []}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground border rounded-lg bg-white">
          Nenhuma aluna cadastrada ainda. As alunas aparecem aqui após o primeiro login.
        </div>
      )}
    </div>
  )
}
