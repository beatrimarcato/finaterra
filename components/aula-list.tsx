import { Aula } from '@/types/database'
import { AulaActions } from '@/components/aula-actions'

type AulaComAgendamentos = Aula & { agendamentos: { id: string }[] }

const GRUPO_LABEL: Record<string, string> = {
  a: 'Grupo A',
  b: 'Grupo B',
}

const GRUPO_COLOR: Record<string, string> = {
  a: 'bg-purple-100 text-purple-700',
  b: 'bg-amber-100 text-amber-700',
}

export function AulaList({ aulas }: { aulas: AulaComAgendamentos[] }) {
  if (aulas.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground border rounded-lg bg-white">
        Nenhuma aula neste período.
      </div>
    )
  }

  return (
    <div className="border rounded-lg bg-white overflow-hidden">
      <div className="hidden md:grid md:grid-cols-[2fr_1fr_auto_auto_auto_auto_auto] gap-4 px-4 py-2 bg-gray-50 border-b text-xs font-semibold text-muted-foreground uppercase tracking-wide">
        <span>Aula</span>
        <span>Turma</span>
        <span>Data</span>
        <span>Horário</span>
        <span>Frequência</span>
        <span className="text-right">Alunas</span>
        <span></span>
      </div>

      <div className="divide-y">
        {aulas.map(aula => {
          const agendadas  = aula.agendamentos?.length ?? 0
          const lotada     = agendadas >= aula.vagas_total
          const quaseCheia = !lotada && agendadas / aula.vagas_total >= 0.75

          const dataFormatada = new Date(aula.data + 'T12:00:00').toLocaleDateString('pt-BR', {
            weekday: 'short', day: '2-digit', month: '2-digit',
          })

          return (
            <div
              key={aula.id}
              className="grid grid-cols-1 md:grid-cols-[2fr_1fr_auto_auto_auto_auto_auto] gap-1 md:gap-4 px-4 py-3 items-center hover:bg-gray-50 transition-colors"
            >
              <p className="font-medium text-sm text-gray-900">{aula.titulo}</p>

              <span className="text-xs text-brand-600 font-medium">
                {aula.turma?.nome ?? <span className="text-muted-foreground italic">Sem turma</span>}
              </span>

              <span className="text-sm text-gray-600 whitespace-nowrap">{dataFormatada}</span>

              <span className="text-sm text-gray-600 tabular-nums">{aula.horario.slice(0, 5)}</span>

              <span className={`text-xs px-2 py-0.5 rounded-full font-medium w-fit ${aula.semana_grupo ? GRUPO_COLOR[aula.semana_grupo] : 'bg-blue-100 text-blue-700'}`}>
                {aula.semana_grupo ? (GRUPO_LABEL[aula.semana_grupo] ?? aula.semana_grupo) : 'Semanal'}
              </span>

              <div className="md:text-right">
                <span className={`text-sm font-semibold tabular-nums ${
                  lotada ? 'text-red-600' : quaseCheia ? 'text-amber-600' : 'text-gray-900'
                }`}>
                  {agendadas}
                </span>
                <span className="text-xs text-muted-foreground">/{aula.vagas_total}</span>
                {lotada && <span className="ml-2 text-xs text-red-500 font-medium">Lotada</span>}
              </div>

              <AulaActions aula={aula} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
