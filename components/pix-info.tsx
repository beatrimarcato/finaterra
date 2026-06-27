'use client'

import { useState } from 'react'

const CHAVE_PIX = '43536626000120'
const PRECO_KG = 60

export function calcularValor(pesoGramas: number): number {
  return (pesoGramas / 1000) * PRECO_KG
}

export function formatarValor(valor: number): string {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function PixInfo({ pesoGramas }: { pesoGramas: number }) {
  const [copiado, setCopiado] = useState(false)

  const copiar = async () => {
    await navigator.clipboard.writeText(CHAVE_PIX)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  const valor = calcularValor(pesoGramas)

  return (
    <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 space-y-3 text-sm">
      <p className="font-semibold text-rose-800">Como pagar</p>

      <p className="text-gray-700">
        Valor a pagar:{' '}
        <span className="font-bold text-rose-700 text-base">{formatarValor(valor)}</span>
        <span className="text-xs text-muted-foreground ml-1">(R$ 60/kg · {pesoGramas}g)</span>
      </p>

      <div className="space-y-1">
        <p className="text-gray-600">Faça um Pix para a chave CNPJ:</p>
        <div className="flex items-center gap-2">
          <code className="bg-white border rounded px-2 py-1 text-sm font-mono text-gray-800 select-all">
            {CHAVE_PIX}
          </code>
          <button
            onClick={copiar}
            className="inline-flex items-center gap-1 text-xs text-rose-700 hover:text-rose-900 font-medium transition-colors"
            title="Copiar chave Pix"
          >
            {copiado ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                Copiado!
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
                Copiar
              </>
            )}
          </button>
        </div>
      </div>

      <p className="text-gray-600 text-xs leading-relaxed">
        Após pagar, envie o comprovante aqui embaixo. Sua peça ficará disponível para retirada assim que o pagamento for confirmado.
      </p>
    </div>
  )
}
