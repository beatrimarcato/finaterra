'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog'
import { Profile, Turma } from '@/types/database'

interface EditProfileDialogProps {
  profile: Profile
  turmas: Turma[]
}

export function EditProfileDialog({ profile, turmas }: EditProfileDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    turma_id: profile.turma_id ?? '',
    tipo: profile.tipo ?? '' as Profile['tipo'] | '',
  })
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase
      .from('profiles')
      .update({
        turma_id: form.turma_id || null,
        tipo: form.tipo || null,
      })
      .eq('id', profile.id)

    if (!error) {
      setOpen(false)
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Editar</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Configurar aluna</DialogTitle>
        </DialogHeader>
        <div className="mb-2 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">{profile.nome || profile.email}</p>
          <p>{profile.email}</p>
        </div>
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
            <Label>Tipo</Label>
            <div className="flex gap-2">
              {([
                { value: 'semanal', label: 'Semanal' },
                { value: 'quinzenal_a', label: 'Quinzenal A' },
                { value: 'quinzenal_b', label: 'Quinzenal B' },
              ] as const).map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setForm({ ...form, tipo: opt.value })}
                  className={`flex-1 rounded-md border py-2 text-xs font-medium transition-colors ${
                    form.tipo === opt.value
                      ? 'bg-rose-600 text-white border-rose-600'
                      : 'bg-background border-input hover:bg-accent'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit" className="bg-rose-600 hover:bg-rose-700" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
