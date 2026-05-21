'use client'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Aula } from '@/types/database'

interface AulaCardProps {
  aula: Aula
  isAdmin?: boolean
  isAgendada?: boolean
  userId?: string
}

const RECORRENCIA_LABEL: Record<string, string> = {
  avulsa: 'Avulsa',
  semanal: 'Semanal',
  quinzenal: 'Quinzenal',
}

const RECORRENCIA_COLOR: Record<string, string> = {
  avulsa: 'bg-blue-100 text-blue-700',
  semanal: 'bg-purple-100 text-purple-700',
  quinzenal: 'bg-amber-100 text-amber-700',
}

export function AulaCard({ aula, isAdmin, isAgendada, userId }: AulaCardProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const lotada = aula.vagas_disponiveis === 0

  const handleAgendar = async () => {
    if (!userId) return
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.from('agendamentos').insert({
      aluna_id: userId,
      aula_id: aula.id,
    })
    if (!error) {
      router.refresh()
    }
    setLoading(false)
  }

  const dataFormatada = aula.data
    ? new Date(aula.data + 'T12:00:00').toLocaleDateString('pt-BR', {
        weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric'
      })
    : ''

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base leading-tight">{aula.titulo}</CardTitle>
          {lotada ? (
            <Badge variant="destructive" className="shrink-0">Lotada</Badge>
          ) : (
            <Badge variant="secondary" className="shrink-0 bg-green-100 text-green-700">
              {aula.vagas_disponiveis} vaga{aula.vagas_disponiveis !== 1 ? 's' : ''}
            </Badge>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {aula.turma?.nome && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-medium">
              {aula.turma.nome}
            </span>
          )}
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${RECORRENCIA_COLOR[aula.recorrencia] ?? 'bg-gray-100 text-gray-600'}`}>
            {RECORRENCIA_LABEL[aula.recorrencia] ?? aula.recorrencia}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-sm text-muted-foreground space-y-1">
          <p>📅 {dataFormatada}</p>
          <p>🕐 {aula.horario}</p>
          <p>👥 {aula.vagas_disponiveis}/{aula.vagas_total} vagas</p>
        </div>
        {!isAdmin && (
          <div className="pt-2">
            {isAgendada ? (
              <Button variant="outline" size="sm" className="w-full" disabled>
                ✓ Agendada
              </Button>
            ) : (
              <Button
                size="sm"
                className="w-full bg-rose-600 hover:bg-rose-700"
                disabled={lotada || loading}
                onClick={handleAgendar}
              >
                {loading ? 'Agendando...' : lotada ? 'Indisponível' : 'Agendar'}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
