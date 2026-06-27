'use client'

import { createContext, useContext, useState, useEffect } from 'react'

export type ViewMode = 'desktop' | 'mobile'

const STORAGE_KEY = 'finaterra_view_mode'

type ViewModeContextType = {
  mode: ViewMode
  setMode: (mode: ViewMode) => void
}

const ViewModeContext = createContext<ViewModeContextType>({
  mode: 'desktop',
  setMode: () => {},
})

export function ViewModeProvider({
  children,
  defaultMode,
}: {
  children: React.ReactNode
  defaultMode: ViewMode
}) {
  const [mode, setModeState] = useState<ViewMode>(defaultMode)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as ViewMode | null
    if (saved === 'desktop' || saved === 'mobile') {
      setModeState(saved)
    }
  }, [])

  const setMode = (newMode: ViewMode) => {
    setModeState(newMode)
    localStorage.setItem(STORAGE_KEY, newMode)
  }

  return (
    <ViewModeContext.Provider value={{ mode, setMode }}>
      {children}
    </ViewModeContext.Provider>
  )
}

export function useViewMode() {
  return useContext(ViewModeContext)
}
