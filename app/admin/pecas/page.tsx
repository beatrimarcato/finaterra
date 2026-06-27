export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { Peca, Profile } from '@/types/database'
import { NovaPecaDialog } from '@/components/nova-peca-dialog'
import { PecasAdminList } from '@/components/pecas-admin-list'

export default async function AdminPecasPage() {
  const supabase = await createClient()

  const [{ data: pecasRaw }, { data: profiles }] = await Promise.all([
    supabase
      .from('pecas')
      .select('*, profile:profiles(nome, email)')
      .order('criado_em', { ascending: false }),
    supabase
      .from('profiles')
      .select('id, nome, email')
      .not('nome', 'is', null)
      .order('nome', { ascending: true }),
  ])

  const pecas = (pecasRaw ?? []) as Peca[]
  const alunas = (profiles ?? []) as Pick<Profile, 'id' | 'nome' | 'email'>[]

  const pendentes = pecas.filter((p) => p.status === 'pendente')
  const aguardandoConfirmacao = pecas.filter((p) => p.status === 'comprovante_enviado')
  const confirmadas = pecas.filter((p) => p.status === 'confirmado')

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Peças Prontas</h1>
        <NovaPecaDialog alunas={alunas} />
      </div>

      {aguardandoConfirmacao.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-gray-700">Aguardando confirmação</h2>
            <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
              {aguardandoConfirmacao.length}
            </span>
          </div>
          <PecasAdminList pecas={aguardandoConfirmacao} />
        </section>
      )}

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold text-gray-700">Pendentes</h2>
          <span className="text-xs font-semibold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
            {pendentes.length}
          </span>
        </div>
        <PecasAdminList pecas={pendentes} />
      </section>

      {confirmadas.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-base font-semibold text-gray-500">Confirmadas</h2>
          <div className="opacity-70">
            <PecasAdminList pecas={confirmadas} />
          </div>
        </section>
      )}
    </div>
  )
}
