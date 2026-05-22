'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SemanasDoMes } from '@/types/database'

const SEMANAS_LABELS: Record<SemanasDoMes, string> = {
  '1_3': 'Ímpares',
  '2_4': 'Pares',
}

export function CreateTurmaForm() {
  const [nome, setNome] = useState('')
  const [semanas, setSemanas] = useState<SemanasDoMes | ''>('')
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErro('')
    const supabase = createClient()
    const { error } = await supabase.from('turmas').insert({
      nome: nome.trim(),
      semanas_do_mes: semanas || null,
    })
    if (error) {
      setErro(error.code === '23505' ? 'Já existe uma turma com esse nome.' : error.message)
    } else {
      setNome('')
      setSemanas('')
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-2 items-end flex-wrap">
        <div className="flex-1 min-w-40 space-y-2">
          <Label htmlFor="nome-turma">Nome da turma</Label>
          <Input
            id="nome-turma"
            placeholder="Ex: Quinzenal A, Iniciantes..."
            value={nome}
            onChange={e => setNome(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="semanas-turma">Quinzenas</Label>
          <select
            id="semanas-turma"
            value={semanas}
            onChange={e => setSemanas(e.target.value as SemanasDoMes | '')}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600"
          >
            <option value="">Nenhuma regra</option>
            {(Object.entries(SEMANAS_LABELS) as [SemanasDoMes, string][]).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
        <Button type="submit" className="bg-rose-600 hover:bg-rose-700 shrink-0" disabled={loading}>
          {loading ? 'Criando...' : 'Criar'}
        </Button>
      </div>
      {erro && <p className="text-xs text-red-500">{erro}</p>}
    </form>
  )
}
