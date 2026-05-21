import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { AulaCard } from '@/components/aula-card'
import { AulaList } from '@/components/aula-list'
import { CreateAulaDialog } from '@/components/create-aula-dialog'
import { AdminAulasFilters } from '@/components/admin-aulas-filters'
import { Aula } from '@/types/database'

function getDateRange(
  periodo: string,
  de?: string,
  ate?: string,
): { inicio: string; fim: string } {
  const hoje = new Date()

  if (periodo === 'semana_atual') {
    const diff = hoje.getDay() === 0 ? -6 : 1 - hoje.getDay()
    const inicio = new Date(hoje)
    inicio.setDate(hoje.getDate() + diff)
    const fim = new Date(inicio)
    fim.setDate(inicio.getDate() + 6)
    return { inicio: fmtDate(inicio), fim: fmtDate(fim) }
  }

  if (periodo === 'proxima_semana') {
    const diff = hoje.getDay() === 0 ? -6 : 1 - hoje.getDay()
    const inicio = new Date(hoje)
    inicio.setDate(hoje.getDate() + diff + 7)
    const fim = new Date(inicio)
    fim.setDate(inicio.getDate() + 6)
    return { inicio: fmtDate(inicio), fim: fmtDate(fim) }
  }

  if (periodo === 'mes_atual') {
    const inicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1)
    const fim    = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0)
    return { inicio: fmtDate(inicio), fim: fmtDate(fim) }
  }

  if (periodo === 'custom' && de && ate) {
    return { inicio: de, fim: ate }
  }

  // fallback: semana atual
  return getDateRange('semana_atual')
}

function fmtDate(d: Date) {
  return d.toISOString().split('T')[0]
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: { periodo?: string; view?: string; de?: string; ate?: string }
}) {
  const supabase = await createClient()

  const periodo = searchParams.periodo ?? 'semana_atual'
  const view    = searchParams.view    ?? 'lista'
  const { inicio, fim } = getDateRange(periodo, searchParams.de, searchParams.ate)

  const { data: aulas } = await supabase
    .from('aulas')
    .select('*, turma:turmas(id, nome, criado_em), agendamentos(id)')
    .gte('data', inicio)
    .lte('data', fim)
    .order('data',    { ascending: true })
    .order('horario', { ascending: true })

  const listaAulas = (aulas ?? []) as (Aula & { agendamentos: { id: string }[] })[]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Gerenciar Aulas</h1>
        <CreateAulaDialog />
      </div>

      <Suspense>
        <AdminAulasFilters />
      </Suspense>

      {view === 'lista' ? (
        <AulaList aulas={listaAulas} />
      ) : listaAulas.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {listaAulas.map((aula) => (
            <AulaCard key={aula.id} aula={aula} isAdmin />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          Nenhuma aula neste período.
        </div>
      )}
    </div>
  )
}
