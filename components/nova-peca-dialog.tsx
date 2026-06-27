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

type Props = {
  alunas: Pick<Profile, 'id' | 'nome' | 'email'>[]
}

export function NovaPecaDialog({ alunas }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [alunaId, setAlunaId] = useState('')
  const [peso, setPeso] = useState('')
  const [unidade, setUnidade] = useState<'g' | 'kg'>('g')
  const [foto, setFoto] = useState<File | null>(null)
  const [erro, setErro] = useState('')

  const resetForm = () => {
    setAlunaId('')
    setPeso('')
    setUnidade('g')
    setFoto(null)
    setErro('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')

    if (!alunaId) { setErro('Selecione uma aluna.'); return }
    if (!peso || Number(peso) <= 0) { setErro('Informe um peso válido.'); return }

    setLoading(true)
    const supabase = createClient()

    try {
      const pesoGramas = unidade === 'kg'
        ? Math.round(Number(peso) * 1000)
        : Math.round(Number(peso))

      let foto_url: string | null = null

      if (foto) {
        const ext = foto.name.split('.').pop()
        const path = `${crypto.randomUUID()}.${ext}`
        const { error: uploadError } = await supabase.storage
          .from('pecas-fotos')
          .upload(path, foto)

        if (uploadError) throw uploadError

        const { data: urlData } = supabase.storage
          .from('pecas-fotos')
          .getPublicUrl(path)

        foto_url = urlData.publicUrl
      }

      const { error } = await supabase.from('pecas').insert({
        aluna_id: alunaId,
        peso_gramas: pesoGramas,
        foto_url,
      })

      if (error) throw error

      setOpen(false)
      resetForm()
      router.refresh()
    } catch (err: unknown) {
      setErro(err instanceof Error ? err.message : 'Erro ao lançar peça.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm() }}>
      <DialogTrigger className="inline-flex items-center justify-center rounded-md bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600">
        Lançar peça
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nova peça pronta</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
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

          <div className="space-y-1">
            <Label htmlFor="peso">Peso</Label>
            <div className="flex gap-2">
              <Input
                id="peso"
                type="number"
                min="0.1"
                step="any"
                placeholder="Ex: 350"
                value={peso}
                onChange={(e) => setPeso(e.target.value)}
                className="flex-1"
              />
              <select
                value={unidade}
                onChange={(e) => setUnidade(e.target.value as 'g' | 'kg')}
                className="rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="g">g</option>
                <option value="kg">kg</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="foto">Foto da peça (opcional)</Label>
            <Input
              id="foto"
              type="file"
              accept="image/*"
              onChange={(e) => setFoto(e.target.files?.[0] ?? null)}
            />
          </div>

          {erro && <p className="text-sm text-red-600">{erro}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : 'Lançar peça'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
