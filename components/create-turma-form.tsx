'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function CreateTurmaForm() {
  const [nome, setNome] = useState('')
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErro('')
    const supabase = createClient()
    const { error } = await supabase.from('turmas').insert({ nome: nome.trim() })
    if (error) {
      setErro(error.code === '23505' ? 'Já existe uma turma com esse nome.' : error.message)
    } else {
      setNome('')
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-end">
      <div className="flex-1 space-y-2">
        <Label htmlFor="nome-turma">Nova turma</Label>
        <Input
          id="nome-turma"
          placeholder="Ex: Turma A, Iniciantes, Avançado..."
          value={nome}
          onChange={e => setNome(e.target.value)}
          required
        />
        {erro && <p className="text-xs text-red-500">{erro}</p>}
      </div>
      <Button type="submit" className="bg-rose-600 hover:bg-rose-700 shrink-0" disabled={loading}>
        {loading ? 'Criando...' : 'Criar'}
      </Button>
    </form>
  )
}
