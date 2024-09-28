// src/utils/context.tsx
'use client'
import { createContext, useContext, ReactNode, useReducer } from 'react'
import { State, Action, AppContextType } from '@/types/types'

// Load initial state
const loadInitialState = (): State => ({
  error: null,
  data: null,
  hasLoaded: false,
})

const initialState: State = loadInitialState()

// Create the context
const AppContext = createContext<AppContextType | undefined>(undefined)

// Reducer function
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    default:
      return state
  }
}

// Context Provider Component
export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>
}

// Custom hook to use the context
export const useAppContext = () => {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider')
  }
  return context
}