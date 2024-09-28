import { Dispatch } from 'react'

export type AppContextType = {
    state: State
    dispatch: Dispatch<Action>
}

export type Action = {
    type: 
        'SET_STATE' | 
        'RESET_STATE'
    payload?: Partial<State>  | { id: string } | { key: string, value: string } | null
}

export type ProductType = {
    data: {
        id: string
        slug?: string
    }
}

export type DataState = {
    data?: any
} | null | undefined | any



export type ErrorState = string | null

export type State = {
    error: ErrorState | null
    data: DataState | null
    hasLoaded: boolean
}


