import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { Peca } from '@/types/database'
import { UploadComprovanteButton } from '@/components/upload-comprovante-button'
import { PixInfo } from '@/components/pix-info'

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

export default async function PecasPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: pecasRaw } = await supabase
    .from('pecas')
    .select('*')
    .eq('aluna_id', user!.id)
    .order('criado_em', { ascending: false })

  const pecas = (pecasRaw ?? []) as Peca[]

  if (pecas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center space-y-3">
        <p className="text-4xl">🏺</p>
        <h2 className="text-xl font-semibold text-rose-800">Nenhuma peça pronta ainda</h2>
        <p className="text-muted-foreground max-w-sm">
          Quando sua peça estiver pronta para retirada, ela aparecerá aqui com as informações de pagamento.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-rose-800">Minhas Peças</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {pecas.map((peca) => {
          const status = STATUS_LABEL[peca.status] ?? STATUS_LABEL.pendente
          return (
            <div key={peca.id} className="bg-white rounded-xl border shadow-sm overflow-hidden">
              {/* Foto */}
              <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                {peca.foto_url ? (
                  <Image
                    src={peca.foto_url}
                    alt="Foto da peça"
                    width={400}
                    height={192}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <span className="text-5xl">🏺</span>
                )}
              </div>

              {/* Detalhes */}
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-700">
                    {formatarPeso(peca.peso_gramas)}
                  </p>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${status.className}`}>
                    {status.label}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground">
                  Lançada em {new Date(peca.criado_em).toLocaleDateString('pt-BR')}
                </p>

                {peca.status === 'pendente' && (
                  <>
                    <PixInfo pesoGramas={peca.peso_gramas} />
                    <UploadComprovanteButton pecaId={peca.id} alunaId={user!.id} />
                  </>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
