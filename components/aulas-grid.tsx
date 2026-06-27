'use client'

import { Aula } from '@/types/database'
import { AulaCard } from '@/components/aula-card'
import { useViewMode } from '@/components/view-mode-context'

type Props = {
  aulas: Aula[]
  aulaIdsAgendadas: Set<string>
  userId: string
}

export function AulasGrid({ aulas, aulaIdsAgendadas, userId }: Props) {
  const { mode } = useViewMode()

  if (aulas.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Nenhuma aula disponível no momento.
      </div>
    )
  }

  return (
    <div className={
      mode === 'mobile'
        ? 'flex flex-col gap-4'
        : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
    }>
      {aulas.map((aula) => (
        <AulaCard
          key={aula.id}
          aula={aula}
          isAgendada={aulaIdsAgendadas.has(aula.id)}
          userId={userId}
        />
      ))}
    </div>
  )
}
