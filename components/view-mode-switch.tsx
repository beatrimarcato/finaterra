'use client'

import { useViewMode } from '@/components/view-mode-context'

export function ViewModeSwitch() {
  const { mode, setMode } = useViewMode()

  return (
    <div className="flex items-center rounded-md border border-gray-200 bg-gray-100 p-0.5 text-xs">
      <button
        onClick={() => setMode('desktop')}
        title="Modo desktop"
        className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${
          mode === 'desktop'
            ? 'bg-white shadow-sm font-medium text-gray-800'
            : 'text-gray-400 hover:text-gray-600'
        }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
        </svg>
        Desktop
      </button>
      <button
        onClick={() => setMode('mobile')}
        title="Modo mobile"
        className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${
          mode === 'mobile'
            ? 'bg-white shadow-sm font-medium text-gray-800'
            : 'text-gray-400 hover:text-gray-600'
        }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="5" y="2" width="14" height="20" rx="2" /><line x1="12" y1="18" x2="12.01" y2="18" />
        </svg>
        Mobile
      </button>
    </div>
  )
}
