'use client'

import Image from 'next/image'
import { Peca } from '@/types/database'
import { PixInfo } from '@/components/pix-info'
import { UploadComprovanteButton } from '@/components/upload-comprovante-button'
import { useViewMode } from '@/components/view-mode-context'

const STATUS_LABEL: Record<string, { label: string; className: string }> = {
  pendente: { label: 'Aguardando pagamento', className: 'bg-amber-100 text-amber-700' },
  comprovante_enviado: { label: 'Comprovante enviado', className: 'bg-blue-100 text-blue-700' },
  confirmado: { label: 'Pagamento confirmado', className: 'bg-green-100 text-green-700' },
}

function formatarPeso(gramas: number) {
  return gramas >= 1000
    ? `${(gramas / 1000).toFixed(gramas % 1000 === 0 ? 0 : 1)} kg`
    : `${gramas} g`
}

type Props = {
  pecas: Peca[]
  userId: string
}

export function PecasAlunaGrid({ pecas, userId }: Props) {
  const { mode } = useViewMode()

  if (pecas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center space-y-3">
        <p className="text-4xl">🏺</p>
        <h2 className="text-xl font-semibold text-brand-800">Nenhuma peça pronta ainda</h2>
        <p className="text-muted-foreground max-w-sm">
          Quando sua peça estiver pronta para retirada, ela aparecerá aqui com as informações de pagamento.
        </p>
      </div>
    )
  }

  return (
    <div className={
      mode === 'mobile'
        ? 'flex flex-col gap-5'
        : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
    }>
      {pecas.map((peca) => {
        const status = STATUS_LABEL[peca.status] ?? STATUS_LABEL.pendente
        return (
          <div key={peca.id} className="bg-white rounded-xl border shadow-sm overflow-hidden">
            {/* Foto */}
            <div className={`w-full bg-gray-100 flex items-center justify-center ${mode === 'mobile' ? 'h-56' : 'h-48'}`}>
              {peca.foto_url ? (
                <Image
                  src={peca.foto_url}
                  alt="Foto da peça"
                  width={400}
                  height={mode === 'mobile' ? 224 : 192}
                  className="object-cover w-full h-full"
                />
              ) : (
                <span className={mode === 'mobile' ? 'text-6xl' : 'text-5xl'}>🏺</span>
              )}
            </div>

            {/* Detalhes */}
            <div className={`p-4 space-y-3 ${mode === 'mobile' ? 'p-5' : ''}`}>
              <div className="flex items-center justify-between">
                <p className={`font-semibold text-gray-700 ${mode === 'mobile' ? 'text-base' : 'text-sm'}`}>
                  {formatarPeso(peca.peso_gramas)}
                </p>
                <span className={`font-medium px-2 py-0.5 rounded-full ${status.className} ${mode === 'mobile' ? 'text-sm' : 'text-xs'}`}>
                  {status.label}
                </span>
              </div>

              <p className="text-xs text-muted-foreground">
                Lançada em {new Date(peca.criado_em).toLocaleDateString('pt-BR')}
              </p>

              {peca.status === 'pendente' && (
                <>
                  <PixInfo pesoGramas={peca.peso_gramas} />
                  <div className={mode === 'mobile' ? 'w-full' : ''}>
                    <UploadComprovanteButton
                      pecaId={peca.id}
                      alunaId={userId}
                      fullWidth={mode === 'mobile'}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
