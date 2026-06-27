'use client'

import { useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

type Props = {
  pecaId: string
  alunaId: string
  fullWidth?: boolean
}

export function UploadComprovanteButton({ pecaId, alunaId, fullWidth }: Props) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')
  const [, startTransition] = useTransition()

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setErro('')
    setLoading(true)
    const supabase = createClient()

    try {
      const ext = file.name.split('.').pop()
      const path = `${alunaId}/${pecaId}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('pecas-comprovantes')
        .upload(path, file, { upsert: true })

      if (uploadError) throw uploadError

      const { error: updateError } = await supabase
        .from('pecas')
        .update({ comprovante_url: path, status: 'comprovante_enviado' })
        .eq('id', pecaId)

      if (updateError) throw updateError

      startTransition(() => router.refresh())
    } catch (err: unknown) {
      setErro(err instanceof Error ? err.message : 'Erro ao enviar comprovante.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-1">
      <input
        ref={inputRef}
        type="file"
        accept="image/*,.pdf"
        className="hidden"
        onChange={handleChange}
      />
      <Button
        size="sm"
        variant="outline"
        disabled={loading}
        onClick={() => inputRef.current?.click()}
        className={fullWidth ? 'w-full' : ''}
      >
        {loading ? 'Enviando...' : 'Enviar comprovante'}
      </Button>
      {erro && <p className="text-xs text-red-600">{erro}</p>}
    </div>
  )
}
