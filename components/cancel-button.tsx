'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export function CancelButton({ agendamentoId, aulaId }: { agendamentoId: string; aulaId: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleCancel = async () => {
    if (!confirm('Deseja cancelar este agendamento?')) return
    setLoading(true)
    const supabase = createClient()
    await supabase.from('agendamentos').delete().eq('id', agendamentoId)
    router.refresh()
    setLoading(false)
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="w-full mt-2 text-red-600 border-red-200 hover:bg-red-50"
      onClick={handleCancel}
      disabled={loading}
    >
      {loading ? 'Cancelando...' : 'Cancelar agendamento'}
    </Button>
  )
}
