'use client'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

const PERIODOS = [
  { value: 'semana_atual',    label: 'Esta semana' },
  { value: 'proxima_semana', label: 'Próxima semana' },
  { value: 'mes_atual',      label: 'Este mês' },
  { value: 'custom',         label: 'Personalizado' },
]

export function AdminAulasFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const periodo = searchParams.get('periodo') ?? 'semana_atual'
  const view    = searchParams.get('view')    ?? 'lista'
  const de      = searchParams.get('de')      ?? ''
  const ate     = searchParams.get('ate')     ?? ''

  const update = useCallback((updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString())
    for (const [key, value] of Object.entries(updates)) {
      value ? params.set(key, value) : params.delete(key)
    }
    router.push(`${pathname}?${params.toString()}`)
  }, [router, pathname, searchParams])

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Seletor de período */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
        {PERIODOS.map(p => (
          <button
            key={p.value}
            onClick={() => update({ periodo: p.value, de: '', ate: '' })}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              periodo === p.value
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Intervalo personalizado */}
      {periodo === 'custom' && (
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={de}
            onChange={e => update({ de: e.target.value })}
            className="rounded-md border border-input px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600"
          />
          <span className="text-sm text-muted-foreground">até</span>
          <input
            type="date"
            value={ate}
            onChange={e => update({ ate: e.target.value })}
            className="rounded-md border border-input px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600"
          />
        </div>
      )}

      {/* Toggle de visualização */}
      <div className="ml-auto flex gap-1 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => update({ view: 'lista' })}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            view === 'lista' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          ☰ Lista
        </button>
        <button
          onClick={() => update({ view: 'cards' })}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            view === 'cards' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          ⊞ Cards
        </button>
      </div>
    </div>
  )
}
