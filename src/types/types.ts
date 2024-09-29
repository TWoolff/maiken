import { Dispatch } from 'react'

export type AppContextType = {
    state: State
    dispatch: Dispatch<Action>
}

export type Action = {
    type: 'SET_STATE' | 'TOGGLE_LANGUAGE'
    payload?: Partial<State>  | { id: string } | { key: string, value: string } | null
}

export type DataState = {
    data?: string
} | null | undefined | any

export type ErrorState = string | null

export type State = {
    error: ErrorState | null
    data: DataState | null
    hasLoaded: boolean
    language: 'da' | 'en'
}


