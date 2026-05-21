'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog'
import { Turma, Recorrencia } from '@/types/database'

const DIAS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

function gerarDatas(
  tipo: Recorrencia,
  dataAvulsa: string,
  dataInicio: string,
  dataFim: string,
  diasSemana: number[]
): string[] {
  if (tipo === 'avulsa') return dataAvulsa ? [dataAvulsa] : []

  const datas: string[] = []
  const fim = new Date(dataFim + 'T12:00:00')
  const intervalo = tipo === 'quinzenal' ? 14 : 7

  for (const dia of diasSemana) {
    const cursor = new Date(dataInicio + 'T12:00:00')
    while (cursor.getDay() !== dia) {
      cursor.setDate(cursor.getDate() + 1)
    }
    while (cursor <= fim) {
      datas.push(cursor.toISOString().split('T')[0])
      cursor.setDate(cursor.getDate() + intervalo)
    }
  }

  return datas.sort()
}

export function CreateAulaDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [turmas, setTurmas] = useState<Turma[]>([])
  const [tipo, setTipo] = useState<Recorrencia>('avulsa')
  const [diasSemana, setDiasSemana] = useState<number[]>([])
  const [form, setForm] = useState({
    titulo: '',
    turma_id: '',
    data: '',
    dataInicio: '',
    dataFim: '',
    horario: '',
    vagas_total: '10',
  })
  const router = useRouter()

  useEffect(() => {
    if (!open) return
    const supabase = createClient()
    supabase.from('turmas').select('*').order('nome').then(({ data }) => {
      if (data) setTurmas(data)
    })
  }, [open])

  const toggleDia = (dia: number) => {
    setDiasSemana(prev =>
      prev.includes(dia) ? prev.filter(d => d !== dia) : [...prev, dia]
    )
  }

  const previewDatas = tipo !== 'avulsa' && form.dataInicio && form.dataFim && diasSemana.length > 0
    ? gerarDatas(tipo, '', form.dataInicio, form.dataFim, diasSemana)
    : []

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.turma_id) {
      alert('Selecione uma turma.')
      return
    }
    if (tipo !== 'avulsa' && diasSemana.length === 0) {
      alert('Selecione pelo menos um dia da semana.')
      return
    }

    const datas = gerarDatas(tipo, form.data, form.dataInicio, form.dataFim, diasSemana)

    if (datas.length === 0) {
      alert('Nenhuma data gerada com os parâmetros informados.')
      return
    }

    setLoading(true)
    const supabase = createClient()
    const vagasTotal = parseInt(form.vagas_total)

    const rows = datas.map(data => ({
      titulo: form.titulo,
      data,
      horario: form.horario,
      vagas_total: vagasTotal,
      vagas_disponiveis: vagasTotal,
      turma_id: form.turma_id,
      recorrencia: tipo,
    }))

    const { error } = await supabase.from('aulas').insert(rows)

    if (!error) {
      setOpen(false)
      setTipo('avulsa')
      setDiasSemana([])
      setForm({ titulo: '', turma_id: '', data: '', dataInicio: '', dataFim: '', horario: '', vagas_total: '10' })
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex items-center justify-center rounded-md bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600">
        + Nova Aula
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar Nova Aula</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Título */}
          <div className="space-y-2">
            <Label htmlFor="titulo">Título</Label>
            <Input
              id="titulo"
              placeholder="Ex: Yoga para iniciantes"
              value={form.titulo}
              onChange={e => setForm({ ...form, titulo: e.target.value })}
              required
            />
          </div>

          {/* Turma */}
          <div className="space-y-2">
            <Label htmlFor="turma">Turma</Label>
            <select
              id="turma"
              value={form.turma_id}
              onChange={e => setForm({ ...form, turma_id: e.target.value })}
              required
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600"
            >
              <option value="">Selecione uma turma</option>
              {turmas.map(t => (
                <option key={t.id} value={t.id}>{t.nome}</option>
              ))}
            </select>
            {turmas.length === 0 && (
              <p className="text-xs text-amber-600">Nenhuma turma cadastrada ainda. Crie turmas primeiro.</p>
            )}
          </div>

          {/* Frequência */}
          <div className="space-y-2">
            <Label>Frequência</Label>
            <div className="flex gap-2">
              {(['avulsa', 'semanal', 'quinzenal'] as Recorrencia[]).map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => { setTipo(t); setDiasSemana([]) }}
                  className={`flex-1 py-1.5 rounded-md text-sm font-medium border transition-colors capitalize ${
                    tipo === t
                      ? 'bg-rose-600 text-white border-rose-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-rose-400'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Dias da semana */}
          {tipo !== 'avulsa' && (
            <div className="space-y-2">
              <Label>Dias da semana</Label>
              <div className="flex gap-1">
                {DIAS.map((nome, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => toggleDia(idx)}
                    className={`flex-1 py-1.5 rounded text-xs font-medium border transition-colors ${
                      diasSemana.includes(idx)
                        ? 'bg-rose-600 text-white border-rose-600'
                        : 'bg-white text-gray-600 border-gray-300 hover:border-rose-400'
                    }`}
                  >
                    {nome}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Data(s) */}
          {tipo === 'avulsa' ? (
            <div className="space-y-2">
              <Label htmlFor="data">Data</Label>
              <Input
                id="data"
                type="date"
                value={form.data}
                onChange={e => setForm({ ...form, data: e.target.value })}
                required
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dataInicio">Data de início</Label>
                <Input
                  id="dataInicio"
                  type="date"
                  value={form.dataInicio}
                  onChange={e => setForm({ ...form, dataInicio: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dataFim">Data de término</Label>
                <Input
                  id="dataFim"
                  type="date"
                  value={form.dataFim}
                  onChange={e => setForm({ ...form, dataFim: e.target.value })}
                  required
                />
              </div>
            </div>
          )}

          {/* Horário e Vagas */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="horario">Horário</Label>
              <Input
                id="horario"
                type="time"
                value={form.horario}
                onChange={e => setForm({ ...form, horario: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vagas">Vagas por aula</Label>
              <Input
                id="vagas"
                type="number"
                min="1"
                max="100"
                value={form.vagas_total}
                onChange={e => setForm({ ...form, vagas_total: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Preview */}
          {previewDatas.length > 0 && (
            <p className="text-xs text-muted-foreground bg-rose-50 rounded px-3 py-2">
              {previewDatas.length} aula{previewDatas.length !== 1 ? 's' : ''} serão criadas
              {' '}({new Date(previewDatas[0] + 'T12:00:00').toLocaleDateString('pt-BR')}
              {' '}até {new Date(previewDatas[previewDatas.length - 1] + 'T12:00:00').toLocaleDateString('pt-BR')})
            </p>
          )}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit" className="bg-rose-600 hover:bg-rose-700" disabled={loading}>
              {loading ? 'Criando...' : 'Criar Aula'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
