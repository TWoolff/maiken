'use client'
import { createContext, useContext, ReactNode, useReducer } from 'react'
import { State, Action, AppContextType } from '@/types/types'

const loadInitialState = (): State => ({
  error: null,
  data: null,
  hasLoaded: false,
	language: 'da-DK',
  currentNav: 'Work'
})

const initialState: State = loadInitialState()

const AppContext = createContext<AppContextType | undefined>(undefined)

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'TOGGLE_LANGUAGE':
      return {
        ...state,
        language: state.language === 'da-DK' ? 'en-US' : 'da-DK'
      }
      case 'SET_NAV':
        return { ...state, currentNav: action.payload as string };
      case 'SET_STATE':
        return {
          ...state,
          ...action.payload
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