'use client'
import { createContext, useContext, useState, ReactNode } from 'react'

type TransitionContextType = {
  transitionImage: string | null
  setTransitionImage: (image: string | null) => void
  transitionBounds: { top: number; left: number; width: number; height: number } | null
  setTransitionBounds: (bounds: { top: number; left: number; width: number; height: number } | null) => void
  finalBounds: { top: number; left: number; width: number; height: number } | null
  setFinalBounds: (bounds: { top: number; left: number; width: number; height: number } | null) => void
  isTransitioning: boolean
  setIsTransitioning: (value: boolean) => void
}

const TransitionContext = createContext<TransitionContextType | undefined>(undefined)

export function TransitionProvider({ children }: { children: ReactNode }) {
  const [transitionImage, setTransitionImage] = useState<string | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [transitionBounds, setTransitionBounds] = useState<{ top: number; left: number; width: number; height: number } | null>(null)
  const [finalBounds, setFinalBounds] = useState<{ top: number; left: number; width: number; height: number } | null>(null)

  return (
    <TransitionContext.Provider value={{ 
      transitionImage, 
      setTransitionImage,
      isTransitioning,
      setIsTransitioning,
      transitionBounds,
      setTransitionBounds,
      finalBounds,
      setFinalBounds
    }}>
      {children}
    </TransitionContext.Provider>
  )
}

export function useTransition() {
  const context = useContext(TransitionContext)
  if (undefined === context) {
    throw new Error('useTransition must be used within a TransitionProvider')
  }
  return context
} 