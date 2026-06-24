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
import { Turma } from '@/types/database'

export function CreateAulaDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [turmas, setTurmas] = useState<Turma[]>([])
  const [form, setForm] = useState({
    turma_id: '',
    semana_grupo: '' as 'a' | 'b' | '',
    data: '',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()

    const turma = turmas.find(t => t.id === form.turma_id)
    const grupoLabel = form.semana_grupo === 'a' ? ' · Grupo A' : form.semana_grupo === 'b' ? ' · Grupo B' : ''
    const titulo = `${turma?.nome ?? 'Aula'}${grupoLabel}`
    const vagasTotal = parseInt(form.vagas_total)

    const { error } = await supabase.from('aulas').insert({
      titulo,
      turma_id: form.turma_id,
      semana_grupo: form.semana_grupo || null,
      data: form.data,
      horario: form.horario,
      vagas_total: vagasTotal,
      vagas_disponiveis: vagasTotal,
    })

    if (!error) {
      setOpen(false)
      setForm({ turma_id: '', semana_grupo: '', data: '', horario: '', vagas_total: '10' })
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
          <div className="space-y-2">
            <Label htmlFor="turma">Turma</Label>
            <select
              id="turma"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={form.turma_id}
              onChange={e => setForm({ ...form, turma_id: e.target.value })}
              required
            >
              <option value="">Selecionar turma...</option>
              {turmas.map(t => (
                <option key={t.id} value={t.id}>{t.nome}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label>Semana</Label>
            <div className="flex gap-2">
              {(['a', 'b'] as const).map(g => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setForm({ ...form, semana_grupo: form.semana_grupo === g ? '' : g })}
                  className={`flex-1 rounded-md border py-2 text-sm font-medium transition-colors ${
                    form.semana_grupo === g
                      ? 'bg-rose-600 text-white border-rose-600'
                      : 'bg-background border-input hover:bg-accent'
                  }`}
                >
                  Grupo {g.toUpperCase()}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">Semanais veem ambos os grupos. Quinzenais veem apenas o grupo delas.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="vagas">Vagas</Label>
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
