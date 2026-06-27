import { createClient } from '@/lib/supabase/server'
import { Profile, Turma } from '@/types/database'
import { EditProfileDialog } from '@/components/edit-profile-dialog'

export default async function AlunasPage() {
  const supabase = await createClient()

  const [{ data: profiles }, { data: turmas }] = await Promise.all([
    supabase
      .from('profiles')
      .select('*, turma:turmas(id, nome, criado_em)')
      .order('criado_em', { ascending: false }),
    supabase
      .from('turmas')
      .select('*')
      .order('nome', { ascending: true }),
  ])

  const pendentes = (profiles ?? []).filter((p: Profile) => !p.turma_id && p.nome)
  const aprovadas = (profiles ?? []).filter((p: Profile) => !!p.turma_id)
  const semCadastro = (profiles ?? []).filter((p: Profile) => !p.nome)

  const tipoLabel = (tipo: Profile['tipo']) => {
    if (tipo === 'semanal') return 'Semanal'
    if (tipo === 'quinzenal_a') return 'Quinzenal A'
    if (tipo === 'quinzenal_b') return 'Quinzenal B'
    return null
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Alunas</h1>

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
                  {profile.celular && <p className="text-xs text-muted-foreground">{profile.celular}</p>}
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
                  {profile.celular && <p className="text-xs text-muted-foreground">{profile.celular}</p>}
                  <p className="text-xs text-brand-600 mt-0.5">
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
      )}
    </div>
  )
}
