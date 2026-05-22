'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog'
import { Turma, SemanasDoMes } from '@/types/database'

const SEMANAS_LABELS: Record<SemanasDoMes, string> = {
  '1_3': '1ª e 3ª semanas do mês',
  '2_4': '2ª e 4ª semanas do mês',
}

const DIAS_SEMANA = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

/** Retorna qual semana do mês uma data representa (1–5). */
function semanaNoMes(date: Date): number {
  return Math.ceil(date.getDate() / 7)
}

/**
 * Retorna as datas das ocorrências corretas (1ª/3ª ou 2ª/4ª) de um dia da semana
 * dentro de um mês/ano, de acordo com a regra quinzenal da turma.
 */
function datasDoMes(
  ano: number,
  mes: number,         // 0–11
  diaSemana: number,   // 0=Dom … 6=Sáb
  semanas: SemanasDoMes
): string[] {
  const datas: string[] = []
  const cursor = new Date(ano, mes, 1, 12, 0, 0)
  // Avançar até a primeira ocorrência do dia escolhido no mês
  while (cursor.getDay() !== diaSemana) cursor.setDate(cursor.getDate() + 1)
  // Percorrer todas as ocorrências desse dia dentro do mês
  while (cursor.getMonth() === mes) {
    const semana = semanaNoMes(cursor)
    const valido = semanas === '1_3'
      ? (semana === 1 || semana === 3)
      : (semana === 2 || semana === 4)
    if (valido) datas.push(cursor.toISOString().split('T')[0])
    cursor.setDate(cursor.getDate() + 7)
  }
  return datas
}

interface GerarAulasMesDialogProps {
  turma: Turma
}

export function GerarAulasMesDialog({ turma }: GerarAulasMesDialogProps) {
  const semanas = turma.semanas_do_mes!
  const hoje = new Date()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [mes, setMes] = useState(hoje.getMonth())
  const [ano, setAno] = useState(hoje.getFullYear())
  const [diaSemana, setDiaSemana] = useState(6) // padrão: sábado (ajustável)
  const [form, setForm] = useState({
    titulo: '',
    horario: '',
    vagas_total: '10',
  })
  const router = useRouter()

  const datasPreview = datasDoMes(ano, mes, diaSemana, semanas)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (datasPreview.length === 0) {
      alert('Nenhuma data encontrada para essa combinação.')
      return
    }
    setLoading(true)
    const supabase = createClient()
    const vagasTotal = parseInt(form.vagas_total)

    const rows = datasPreview.map(data => ({
      titulo: form.titulo,
      data,
      horario: form.horario,
      vagas_total: vagasTotal,
      vagas_disponiveis: vagasTotal,
      turma_id: turma.id,
      recorrencia: 'quinzenal' as const,
    }))

    const { error } = await supabase.from('aulas').insert(rows)

    if (!error) {
      setOpen(false)
      setForm({ titulo: '', horario: '', vagas_total: '10' })
      router.refresh()
    } else {
      alert('Erro ao criar aulas: ' + error.message)
    }
    setLoading(false)
  }

  const anos = [hoje.getFullYear(), hoje.getFullYear() + 1]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="text-xs text-rose-600 hover:text-rose-800 font-medium transition-colors px-2 py-1 rounded hover:bg-rose-50">
        Gerar aulas do mês
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Gerar aulas — {turma.nome}</DialogTitle>
        </DialogHeader>

        <div className="rounded-md bg-rose-50 border border-rose-200 px-3 py-2 text-sm text-rose-700">
          Regra: <strong>{SEMANAS_LABELS[semanas]}</strong>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Mês, ano e dia da semana */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label>Mês</Label>
              <select
                value={mes}
                onChange={e => setMes(Number(e.target.value))}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600"
              >
                {MESES.map((nome, idx) => (
                  <option key={idx} value={idx}>{nome}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Ano</Label>
              <select
                value={ano}
                onChange={e => setAno(Number(e.target.value))}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600"
              >
                {anos.map(a => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Dia da semana</Label>
              <select
                value={diaSemana}
                onChange={e => setDiaSemana(Number(e.target.value))}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600"
              >
                {DIAS_SEMANA.map((nome, idx) => (
                  <option key={idx} value={idx}>{nome}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Preview das datas */}
          <div className="space-y-1">
            <Label>Aulas que serão geradas</Label>
            {datasPreview.length > 0 ? (
              <div className="rounded-md border bg-white divide-y text-sm">
                {datasPreview.map(d => (
                  <div key={d} className="px-3 py-2 text-gray-700">
                    {new Date(d + 'T12:00:00').toLocaleDateString('pt-BR', {
                      weekday: 'long', day: 'numeric', month: 'long',
                    })}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">Nenhuma data para essa combinação.</p>
            )}
          </div>

          {/* Título */}
          <div className="space-y-2">
            <Label htmlFor="gen-titulo">Título das aulas</Label>
            <Input
              id="gen-titulo"
              placeholder="Ex: Aula de cerâmica"
              value={form.titulo}
              onChange={e => setForm({ ...form, titulo: e.target.value })}
              required
            />
          </div>

          {/* Horário e vagas */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gen-horario">Horário</Label>
              <Input
                id="gen-horario"
                type="time"
                value={form.horario}
                onChange={e => setForm({ ...form, horario: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gen-vagas">Vagas por aula</Label>
              <Input
                id="gen-vagas"
                type="number"
                min="1"
                max="100"
                value={form.vagas_total}
                onChange={e => setForm({ ...form, vagas_total: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button
              type="submit"
              className="bg-rose-600 hover:bg-rose-700"
              disabled={loading || datasPreview.length === 0}
            >
              {loading ? 'Criando...' : `Criar ${datasPreview.length} aula${datasPreview.length !== 1 ? 's' : ''}`}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
