import { createClient } from '@/lib/supabase/server'
import { Profile, Turma } from '@/types/database'
<<<<<<< HEAD
import { TurmaSelector } from '@/components/turma-selector'
import { EditProfileDialog } from '@/components/edit-profile-dialog'

export default async function AlunasPage() {
=======
import { EditProfileDialog } from '@/components/edit-profile-dialog'

export default async function AdminAlunasPage() {
>>>>>>> 69df8e35185937196dbd5775c87abd9c59859411
  const supabase = await createClient()

  const [{ data: profiles }, { data: turmas }] = await Promise.all([
    supabase
      .from('profiles')
<<<<<<< HEAD
      .select('*, turma:turmas(id, nome, criado_em)')
=======
      .select('*, turma:turmas(nome)')
>>>>>>> 69df8e35185937196dbd5775c87abd9c59859411
      .order('criado_em', { ascending: false }),
    supabase
      .from('turmas')
      .select('*')
<<<<<<< HEAD
      .order('nome', { ascending: true }),
  ])

  const pendentes = (profiles ?? []).filter((p: Profile) => !p.turma_id && p.nome)
  const aprovadas = (profiles ?? []).filter((p: Profile) => !!p.turma_id)
  const semCadastro = (profiles ?? []).filter((p: Profile) => !p.nome)

  const tipoLabel = (tipo: Profile['tipo']) => {
=======
      .order('nome'),
  ])

  const tipoLabel = (tipo: string | null) => {
>>>>>>> 69df8e35185937196dbd5775c87abd9c59859411
    if (tipo === 'semanal') return 'Semanal'
    if (tipo === 'quinzenal_a') return 'Quinzenal A'
    if (tipo === 'quinzenal_b') return 'Quinzenal B'
    return null
  }

  return (
<<<<<<< HEAD
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Alunas</h1>

      {/* Pendentes de aprovação */}
      {pendentes.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-gray-700">Aguardando aprovação</h2>
            <span className="text-xs font-semibold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
              {pendentes.length}
            </span>
          </div>
          <div className="border border-amber-200 rounded-lg bg-white divide-y divide-amber-100">
            {pendentes.map((profile: Profile) => (
              <div key={profile.id} className="flex items-center justify-between px-4 py-3 gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900">{profile.nome}</p>
                  <p className="text-xs text-muted-foreground">{profile.email}</p>
                  {profile.celular && (
                    <p className="text-xs text-muted-foreground">{profile.celular}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-amber-600 font-medium hidden sm:block">Atribuir:</span>
                  <EditProfileDialog profile={profile} turmas={turmas as Turma[]} />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Aprovadas */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold text-gray-700">Alunas ativas</h2>
          <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
            {aprovadas.length}
          </span>
        </div>
        {aprovadas.length > 0 ? (
          <div className="border rounded-lg bg-white divide-y">
            {aprovadas.map((profile: Profile) => (
              <div key={profile.id} className="flex items-center justify-between px-4 py-3 gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900">{profile.nome ?? profile.email}</p>
                  <p className="text-xs text-muted-foreground">{profile.email}</p>
                  {profile.celular && (
                    <p className="text-xs text-muted-foreground">{profile.celular}</p>
                  )}
                  <p className="text-xs text-rose-600 mt-0.5">
                    {profile.turma?.nome}
                    {profile.tipo && <span className="text-gray-400"> · {tipoLabel(profile.tipo)}</span>}
                  </p>
                </div>
                <EditProfileDialog profile={profile} turmas={turmas as Turma[]} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-muted-foreground border rounded-lg bg-white">
            Nenhuma aluna aprovada ainda.
          </div>
        )}
      </section>

      {/* Sem cadastro */}
      {semCadastro.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-gray-500">Sem cadastro completo</h2>
            <span className="text-xs font-semibold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
              {semCadastro.length}
            </span>
          </div>
          <div className="border rounded-lg bg-white divide-y opacity-60">
            {semCadastro.map((profile: Profile) => (
              <div key={profile.id} className="px-4 py-3">
                <p className="text-sm text-gray-500">{profile.email}</p>
                <p className="text-xs text-muted-foreground">Fez login mas não preencheu o cadastro</p>
              </div>
            ))}
          </div>
        </section>
=======
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
>>>>>>> 69df8e35185937196dbd5775c87abd9c59859411
      )}
    </div>
  )
}
