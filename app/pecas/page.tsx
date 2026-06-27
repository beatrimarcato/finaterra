import { createClient } from '@/lib/supabase/server'
import { Peca } from '@/types/database'
import { PecasAlunaGrid } from '@/components/pecas-aluna-grid'

export default async function PecasPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: pecasRaw } = await supabase
    .from('pecas')
    .select('*')
    .eq('aluna_id', user!.id)
    .order('criado_em', { ascending: false })

  const pecas = (pecasRaw ?? []) as Peca[]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-rose-800">Minhas Peças</h1>
      <PecasAlunaGrid pecas={pecas} userId={user!.id} />
    </div>
  )
}
