'use client'

import { useTransition } from 'react'
import Image from 'next/image'
import { Peca } from '@/types/database'
import { Button } from '@/components/ui/button'
import { confirmarPagamento } from '@/app/admin/pecas/actions'

const STATUS_LABEL: Record<string, { label: string; className: string }> = {
  pendente: { label: 'Pendente', className: 'bg-amber-100 text-amber-700' },
  comprovante_enviado: { label: 'Comprovante enviado', className: 'bg-blue-100 text-blue-700' },
  confirmado: { label: 'Confirmado', className: 'bg-green-100 text-green-700' },
}

function formatarPeso(gramas: number) {
  return gramas >= 1000
    ? `${(gramas / 1000).toFixed(gramas % 1000 === 0 ? 0 : 1)} kg`
    : `${gramas} g`
}

function ConfirmarButton({ pecaId }: { pecaId: string }) {
  const [pending, startTransition] = useTransition()

  return (
    <Button
      size="sm"
      variant="outline"
      disabled={pending}
      onClick={() => startTransition(() => confirmarPagamento(pecaId))}
    >
      {pending ? 'Confirmando...' : 'Confirmar pgto'}
    </Button>
  )
}

export function PecasAdminList({ pecas }: { pecas: Peca[] }) {
  if (pecas.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground border rounded-lg bg-white">
        Nenhuma peça lançada ainda.
      </div>
    )
  }

  return (
    <div className="border rounded-lg bg-white divide-y overflow-hidden">
      {pecas.map((peca) => {
        const status = STATUS_LABEL[peca.status] ?? STATUS_LABEL.pendente
        return (
          <div key={peca.id} className="flex items-center gap-4 px-4 py-3">
            {/* Foto */}
            <div className="w-14 h-14 rounded-md bg-gray-100 overflow-hidden shrink-0 flex items-center justify-center">
              {peca.foto_url ? (
                <Image
                  src={peca.foto_url}
                  alt="Foto da peça"
                  width={56}
                  height={56}
                  className="object-cover w-full h-full"
                />
              ) : (
                <span className="text-2xl">🏺</span>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {peca.profile?.nome ?? peca.profile?.email ?? peca.aluna_id}
              </p>
              <p className="text-xs text-muted-foreground">{formatarPeso(peca.peso_gramas)}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(peca.criado_em).toLocaleDateString('pt-BR')}
              </p>
            </div>

            {/* Status + ação */}
            <div className="flex flex-col items-end gap-2 shrink-0">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${status.className}`}>
                {status.label}
              </span>
              {peca.status === 'comprovante_enviado' && (
                <ConfirmarButton pecaId={peca.id} />
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
