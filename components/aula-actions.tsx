'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Aula, Turma } from '@/types/database'

type EstadoModal = 'fechado' | 'editando' | 'confirmar-exclusao'

export function AulaActions({ aula }: { aula: Aula }) {
  const [estado, setEstado]     = useState<EstadoModal>('fechado')
  const [loading, setLoading]   = useState(false)
  const [agendadas, setAgendadas] = useState<number | null>(null)
  const [turmas, setTurmas]     = useState<Turma[]>([])
  const [erro, setErro]         = useState('')
  const [form, setForm]         = useState({
    titulo:     aula.titulo,
    data:       aula.data,
    horario:    aula.horario.slice(0, 5),
    vagas_total: String(aula.vagas_total),
    turma_id:    aula.turma_id ?? '',
    semana_grupo: aula.semana_grupo ?? '' as 'a' | 'b' | '',
  })
  const router = useRouter()

  // Carrega turmas ao abrir edição
  useEffect(() => {
    if (estado !== 'editando') return
    const supabase = createClient()
    supabase.from('turmas').select('*').order('nome').then(({ data }) => {
      if (data) setTurmas(data)
    })
  }, [estado])

  // ── Edição ──────────────────────────────────────────────
  const salvarEdicao = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErro('')
    const supabase = createClient()
    const vagasTotal = parseInt(form.vagas_total)
    const vagasDisponiveis = Math.max(0, vagasTotal - (aula.vagas_total - aula.vagas_disponiveis))

    const { error } = await supabase
      .from('aulas')
      .update({
        titulo:             form.titulo,
        data:               form.data,
        horario:            form.horario,
        vagas_total:        vagasTotal,
        vagas_disponiveis:  vagasDisponiveis,
        turma_id:           form.turma_id || null,
        semana_grupo:       form.semana_grupo || null,
      })
      .eq('id', aula.id)

    if (error) {
      setErro(error.message)
    } else {
      setEstado('fechado')
      router.refresh()
    }
    setLoading(false)
  }

  // ── Exclusão ─────────────────────────────────────────────
  const iniciarExclusao = async () => {
    setLoading(true)
    const supabase = createClient()
    const { count } = await supabase
      .from('agendamentos')
      .select('*', { count: 'exact', head: true })
      .eq('aula_id', aula.id)
    setAgendadas(count ?? 0)
    setEstado('confirmar-exclusao')
    setLoading(false)
  }

  const excluir = async () => {
    setLoading(true)
    const supabase = createClient()
    // Agendamentos são deletados em cascata (FK on delete cascade),
    // mas deletamos explicitamente para garantir que os triggers de devolução
    // de vagas não causem problemas desnecessários antes do delete da aula.
    await supabase.from('agendamentos').delete().eq('aula_id', aula.id)
    await supabase.from('aulas').delete().eq('id', aula.id)
    setEstado('fechado')
    router.refresh()
    setLoading(false)
  }

  return (
    <>
      <div className="flex gap-1 shrink-0">
        <button
          onClick={() => { setErro(''); setEstado('editando') }}
          className="text-xs text-gray-500 hover:text-rose-600 transition-colors px-2 py-1 rounded hover:bg-rose-50"
        >
          Editar
        </button>
        <button
          onClick={iniciarExclusao}
          disabled={loading}
          className="text-xs text-gray-500 hover:text-red-600 transition-colors px-2 py-1 rounded hover:bg-red-50 disabled:opacity-40"
        >
          {loading ? '...' : 'Excluir'}
        </button>
      </div>

      {/* ── Modal de edição ── */}
      <Dialog open={estado === 'editando'} onOpenChange={open => !open && setEstado('fechado')}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar aula</DialogTitle>
          </DialogHeader>
          <form onSubmit={salvarEdicao} className="space-y-4">

            <div className="space-y-2">
              <Label htmlFor="titulo-edit">Título</Label>
              <Input
                id="titulo-edit"
                value={form.titulo}
                onChange={e => setForm({ ...form, titulo: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="turma-edit">Turma</Label>
              <select
                id="turma-edit"
                value={form.turma_id}
                onChange={e => setForm({ ...form, turma_id: e.target.value })}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600"
              >
                <option value="">Sem turma</option>
                {turmas.map(t => (
                  <option key={t.id} value={t.id}>{t.nome}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label>Grupo</Label>
              <div className="flex gap-2">
                {([['', 'Nenhum'], ['a', 'Grupo A'], ['b', 'Grupo B']] as const).map(([val, label]) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setForm({ ...form, semana_grupo: val as 'a' | 'b' | '' })}
                    className={`flex-1 py-1.5 rounded-md text-sm font-medium border transition-colors ${
                      form.semana_grupo === val
                        ? 'bg-rose-600 text-white border-rose-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-rose-400'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">Semanais veem todas. Quinzenais veem apenas seu grupo.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="data-edit">Data</Label>
                <Input
                  id="data-edit"
                  type="date"
                  value={form.data}
                  onChange={e => setForm({ ...form, data: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="horario-edit">Horário</Label>
                <Input
                  id="horario-edit"
                  type="time"
                  value={form.horario}
                  onChange={e => setForm({ ...form, horario: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="vagas-edit">Vagas totais</Label>
              <Input
                id="vagas-edit"
                type="number"
                min={aula.vagas_total - aula.vagas_disponiveis} // mínimo = já agendadas
                max="100"
                value={form.vagas_total}
                onChange={e => setForm({ ...form, vagas_total: e.target.value })}
                required
              />
              {aula.vagas_total - aula.vagas_disponiveis > 0 && (
                <p className="text-xs text-muted-foreground">
                  {aula.vagas_total - aula.vagas_disponiveis} aluna{aula.vagas_total - aula.vagas_disponiveis !== 1 ? 's' : ''} já agendada{aula.vagas_total - aula.vagas_disponiveis !== 1 ? 's' : ''} — o mínimo de vagas é {aula.vagas_total - aula.vagas_disponiveis}.
                </p>
              )}
            </div>

            {erro && <p className="text-sm text-red-500">{erro}</p>}

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setEstado('fechado')}>Cancelar</Button>
              <Button type="submit" className="bg-rose-600 hover:bg-rose-700" disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Modal de confirmação de exclusão ── */}
      <Dialog open={estado === 'confirmar-exclusao'} onOpenChange={open => !open && setEstado('fechado')}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir aula</DialogTitle>
          </DialogHeader>

          {agendadas && agendadas > 0 ? (
            <div className="space-y-4">
              <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800 space-y-1">
                <p className="font-medium">Esta aula tem {agendadas} aluna{agendadas !== 1 ? 's' : ''} agendada{agendadas !== 1 ? 's' : ''}.</p>
                <p>Ao excluir, todos os agendamentos serão cancelados.</p>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEstado('fechado')}>Cancelar</Button>
                <Button className="bg-red-600 hover:bg-red-700" onClick={excluir} disabled={loading}>
                  {loading ? 'Excluindo...' : `Cancelar ${agendadas} agendamento${agendadas !== 1 ? 's' : ''} e excluir aula`}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">Nenhuma aluna agendada. Confirma a exclusão?</p>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEstado('fechado')}>Cancelar</Button>
                <Button className="bg-red-600 hover:bg-red-700" onClick={excluir} disabled={loading}>
                  {loading ? 'Excluindo...' : 'Excluir aula'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
