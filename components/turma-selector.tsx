'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Turma } from '@/types/database'

interface TurmaSelectorProps {
  profileId: string
  turmaAtualId: string | null
  turmas: Turma[]
}

export function TurmaSelector({ profileId, turmaAtualId, turmas }: TurmaSelectorProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const novoId = e.target.value || null
    setLoading(true)
    const supabase = createClient()
    await supabase
      .from('profiles')
      .update({ turma_id: novoId })
      .eq('id', profileId)
    router.refresh()
    setLoading(false)
  }

  return (
    <select
      value={turmaAtualId ?? ''}
      onChange={handleChange}
      disabled={loading}
      className="rounded-md border border-input bg-background px-3 py-1.5 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 disabled:opacity-50 shrink-0"
    >
      <option value="">Sem turma</option>
      {turmas.map(t => (
        <option key={t.id} value={t.id}>{t.nome}</option>
      ))}
    </select>
  )
}
