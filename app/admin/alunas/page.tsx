import { createClient } from '@/lib/supabase/server'
import { Profile, Turma } from '@/types/database'
import { EditProfileDialog } from '@/components/edit-profile-dialog'

export default async function AdminAlunasPage() {
  const supabase = await createClient()

  const [{ data: profiles }, { data: turmas }] = await Promise.all([
    supabase
      .from('profiles')
      .select('*, turma:turmas(nome)')
      .order('criado_em', { ascending: false }),
    supabase
      .from('turmas')
      .select('*')
      .order('nome'),
  ])

  const tipoLabel = (tipo: string | null) => {
    if (tipo === 'semanal') return 'Semanal'
    if (tipo === 'quinzenal_a') return 'Quinzenal A'
    if (tipo === 'quinzenal_b') return 'Quinzenal B'
    return null
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Alunas</h1>

      {profiles && profiles.length > 0 ? (
        <div className="bg-white rounded-lg border divide-y">
          {profiles.map((profile: any) => {
            const turmaLabel = (profile.turma as any)?.nome
            const tipo = tipoLabel(profile.tipo)
            const configurada = !!turmaLabel && !!tipo

            return (
              <div key={profile.id} className="flex items-center justify-between px-4 py-3 gap-4">
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate">{profile.nome || profile.email}</p>
                  <p className="text-xs text-muted-foreground truncate">{profile.email}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {configurada ? (
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-700">{turmaLabel}</p>
                      <p className="text-xs text-muted-foreground">{tipo}</p>
                    </div>
                  ) : (
                    <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                      Sem turma
                    </span>
                  )}
                  <EditProfileDialog
                    profile={profile as Profile}
                    turmas={turmas as Turma[]}
                  />
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          Nenhuma aluna cadastrada ainda.
        </div>
      )}
    </div>
  )
}
