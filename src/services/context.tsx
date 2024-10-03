'use client'
import { createContext, useContext, ReactNode, useReducer } from 'react'
import { State, Action, AppContextType } from '@/types/types'

const loadInitialState = (): State => ({
  error: null,
  data: null,
  hasLoaded: false,
	language: 'da'
})

const initialState: State = loadInitialState()

const AppContext = createContext<AppContextType | undefined>(undefined)

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'TOGGLE_LANGUAGE':
      return {
        ...state,
        language: state.language === 'da' ? 'en' : 'da'
      }
    default:
      return state
  }
}

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>
}

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider')
  }
  return context
}