'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'

interface TurmaActionsProps {
  turmaId: string
  turmaAtual: string
}

type EstadoModal = 'fechado' | 'editando' | 'confirmar-exclusao' | 'forcando-exclusao'

interface VinculosInfo {
  alunas: number
  aulas: number
}

export function TurmaActions({ turmaId, turmaAtual }: TurmaActionsProps) {
  const [estado, setEstado] = useState<EstadoModal>('fechado')
  const [novoNome, setNovoNome] = useState(turmaAtual)
  const [vinculos, setVinculos] = useState<VinculosInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')
  const router = useRouter()

  // --- Edição ---
  const abrirEdicao = () => {
    setNovoNome(turmaAtual)
    setErro('')
    setEstado('editando')
  }

  const salvarEdicao = async (e: React.FormEvent) => {
    e.preventDefault()
    if (novoNome.trim() === turmaAtual) { setEstado('fechado'); return }
    setLoading(true)
    setErro('')
    const supabase = createClient()
    const { error } = await supabase
      .from('turmas')
      .update({ nome: novoNome.trim() })
      .eq('id', turmaId)
    if (error) {
      setErro(error.code === '23505' ? 'Já existe uma turma com esse nome.' : error.message)
    } else {
      setEstado('fechado')
      router.refresh()
    }
    setLoading(false)
  }

  // --- Exclusão ---
  const iniciarExclusao = async () => {
    setLoading(true)
    const supabase = createClient()
    const [{ count: alunas }, { count: aulas }] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('turma_id', turmaId),
      supabase.from('aulas').select('*', { count: 'exact', head: true }).eq('turma_id', turmaId),
    ])
    setVinculos({ alunas: alunas ?? 0, aulas: aulas ?? 0 })
    setEstado('confirmar-exclusao')
    setLoading(false)
  }

  const excluirDireto = async () => {
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.from('turmas').delete().eq('id', turmaId)
    if (!error) {
      setEstado('fechado')
      router.refresh()
    }
    setLoading(false)
  }

  const desvincularEExcluir = async () => {
    setLoading(true)
    const supabase = createClient()

    // 1. Desvincular alunas
    await supabase.from('profiles').update({ turma_id: null }).eq('turma_id', turmaId)
    // 2. Excluir aulas
    await supabase.from('aulas').delete().eq('turma_id', turmaId)
    // 3. Excluir turma
    await supabase.from('turmas').delete().eq('id', turmaId)

    setEstado('fechado')
    router.refresh()
    setLoading(false)
  }

  const temVinculos = vinculos && (vinculos.alunas > 0 || vinculos.aulas > 0)

  return (
    <>
      <div className="flex gap-2 shrink-0">
        <button
          onClick={abrirEdicao}
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

      {/* Modal de edição */}
      <Dialog open={estado === 'editando'} onOpenChange={open => !open && setEstado('fechado')}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar turma</DialogTitle>
          </DialogHeader>
          <form onSubmit={salvarEdicao} className="space-y-4">
            <Input
              value={novoNome}
              onChange={e => setNovoNome(e.target.value)}
              placeholder="Nome da turma"
              required
              autoFocus
            />
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

      {/* Modal de confirmação de exclusão */}
      <Dialog open={estado === 'confirmar-exclusao'} onOpenChange={open => !open && setEstado('fechado')}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir turma "{turmaAtual}"</DialogTitle>
          </DialogHeader>

          {temVinculos ? (
            <div className="space-y-4">
              <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800 space-y-1">
                <p className="font-medium">Não é possível excluir esta turma pois ela possui vínculos:</p>
                {vinculos!.alunas > 0 && (
                  <p>· {vinculos!.alunas} aluna{vinculos!.alunas !== 1 ? 's' : ''} vinculada{vinculos!.alunas !== 1 ? 's' : ''}</p>
                )}
                {vinculos!.aulas > 0 && (
                  <p>· {vinculos!.aulas} aula{vinculos!.aulas !== 1 ? 's' : ''} vinculada{vinculos!.aulas !== 1 ? 's' : ''}</p>
                )}
              </div>
              <p className="text-sm text-gray-600">
                Para excluir, é necessário desvincular as alunas e remover as aulas desta turma. Deseja continuar?
              </p>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEstado('fechado')}>Cancelar</Button>
                <Button
                  className="bg-red-600 hover:bg-red-700"
                  onClick={desvincularEExcluir}
                  disabled={loading}
                >
                  {loading ? 'Excluindo...' : 'Desvincular alunas, excluir aulas e turma'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Esta turma não tem alunas nem aulas vinculadas. Confirma a exclusão?
              </p>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEstado('fechado')}>Cancelar</Button>
                <Button
                  className="bg-red-600 hover:bg-red-700"
                  onClick={excluirDireto}
                  disabled={loading}
                >
                  {loading ? 'Excluindo...' : 'Excluir turma'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
