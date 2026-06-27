'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog'
import { Profile } from '@/types/database'

type ItemPeca = {
  id: string
  peso: string
  unidade: 'g' | 'kg'
  foto: File | null
}

type Props = {
  alunas: Pick<Profile, 'id' | 'nome' | 'email'>[]
}

function novoItem(): ItemPeca {
  return { id: crypto.randomUUID(), peso: '', unidade: 'g', foto: null }
}

export function NovaPecaDialog({ alunas }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [alunaId, setAlunaId] = useState('')
  const [itens, setItens] = useState<ItemPeca[]>([novoItem()])
  const [erro, setErro] = useState('')

  const resetForm = () => {
    setAlunaId('')
    setItens([novoItem()])
    setErro('')
  }

  const atualizarItem = (id: string, campo: Partial<ItemPeca>) => {
    setItens((prev) => prev.map((it) => it.id === id ? { ...it, ...campo } : it))
  }

  const adicionarItem = () => setItens((prev) => [...prev, novoItem()])

  const removerItem = (id: string) => {
    if (itens.length === 1) return
    setItens((prev) => prev.filter((it) => it.id !== id))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')

    if (!alunaId) { setErro('Selecione uma aluna.'); return }

    for (const item of itens) {
      if (!item.peso || Number(item.peso) <= 0) {
        setErro('Informe um peso válido em todas as peças.')
        return
      }
    }

    setLoading(true)
    const supabase = createClient()

    try {
      const rows = await Promise.all(itens.map(async (item) => {
        const pesoGramas = item.unidade === 'kg'
          ? Math.round(Number(item.peso) * 1000)
          : Math.round(Number(item.peso))

        let foto_url: string | null = null

        if (item.foto) {
          const ext = item.foto.name.split('.').pop()
          const path = `${crypto.randomUUID()}.${ext}`
          const { error: uploadError } = await supabase.storage
            .from('pecas-fotos')
            .upload(path, item.foto)
          if (uploadError) throw uploadError
          const { data: urlData } = supabase.storage.from('pecas-fotos').getPublicUrl(path)
          foto_url = urlData.publicUrl
        }

        return { aluna_id: alunaId, peso_gramas: pesoGramas, foto_url }
      }))

      const { error } = await supabase.from('pecas').insert(rows)
      if (error) throw error

      setOpen(false)
      resetForm()
      router.refresh()
    } catch (err: unknown) {
      setErro(err instanceof Error ? err.message : 'Erro ao lançar peças.')
    } finally {
      setLoading(false)
    }
  }

  const labelBotao = loading
    ? 'Salvando...'
    : itens.length === 1 ? 'Lançar peça' : `Lançar ${itens.length} peças`

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm() }}>
      <DialogTrigger className="inline-flex items-center justify-center rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600">
        Lançar peça
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {itens.length === 1 ? 'Nova peça pronta' : `${itens.length} peças prontas`}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 pt-2">
          {/* Aluna — selecionada uma vez para todas as peças */}
          <div className="space-y-1">
            <Label htmlFor="aluna">Aluna</Label>
            <select
              id="aluna"
              value={alunaId}
              onChange={(e) => setAlunaId(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Selecione...</option>
              {alunas.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.nome ?? a.email}
                </option>
              ))}
            </select>
          </div>

          {/* Lista de peças */}
          <div className="space-y-3">
            {itens.map((item, idx) => (
              <div key={item.id} className="rounded-lg border bg-gray-50 p-3 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Peça {idx + 1}
                  </p>
                  {itens.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removerItem(item.id)}
                      className="text-xs text-red-500 hover:text-red-700"
                    >
                      Remover
                    </button>
                  )}
                </div>

                <div className="space-y-1">
                  <Label htmlFor={`peso-${item.id}`}>Peso</Label>
                  <div className="flex gap-2">
                    <Input
                      id={`peso-${item.id}`}
                      type="number"
                      min="0.1"
                      step="any"
                      placeholder="Ex: 350"
                      value={item.peso}
                      onChange={(e) => atualizarItem(item.id, { peso: e.target.value })}
                      className="flex-1 bg-white"
                    />
                    <select
                      value={item.unidade}
                      onChange={(e) => atualizarItem(item.id, { unidade: e.target.value as 'g' | 'kg' })}
                      className="rounded-md border border-input bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="g">g</option>
                      <option value="kg">kg</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor={`foto-${item.id}`}>Foto (opcional)</Label>
                  <Input
                    id={`foto-${item.id}`}
                    type="file"
                    accept="image/*"
                    className="bg-white"
                    onChange={(e) => atualizarItem(item.id, { foto: e.target.files?.[0] ?? null })}
                  />
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={adicionarItem}
              className="w-full rounded-lg border-2 border-dashed border-gray-300 py-2 text-sm text-gray-500 hover:border-brand-300 hover:text-brand-600 transition-colors"
            >
              + Adicionar outra peça
            </button>
          </div>

          {erro && <p className="text-sm text-red-600">{erro}</p>}

          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {labelBotao}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
