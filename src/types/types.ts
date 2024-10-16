import { Dispatch } from 'react'
import { EntrySkeletonType } from 'contentful'

export type AppContextType = {
	state: State
	dispatch: Dispatch<Action>
}

export type Action =
  | { type: 'SET_STATE'; payload: Partial<State> }
  | { type: 'TOGGLE_LANGUAGE'; payload: { language: 'da-DK' | 'en-US' } }
  | { type: 'SET_NAV'; payload: string }
  | { type: string; payload?: any }

export type DataState = {
    data?: InitData
} | null | undefined | any

export type ErrorState = string | null

export type State = {
	error: ErrorState | null
	data: null | DataState
	hasLoaded: boolean
	language: 'da-DK' | 'en-US'
  currentNav: string
}

export type ContentfulTag = {
  sys: {
    id: string
    type: string
    linkType: string 
  }
  name: string
}

export type LocalizedFields<T> = {
  [locale: string]: T
}

export type RichTextDocument = {
  nodeType: string
  data: object
  content: Array<{
    nodeType: string
    data: object
    content: Array<{
      nodeType: string
      value?: string
      data: object
    }>
  }>
}

export type TextContent = {
  sys: {
    id: string
    type: string
  }
  fields: {
    id: LocalizedFields<string>
    text: LocalizedFields<RichTextDocument>
  }
}

export interface ProjectEntry extends EntrySkeletonType {
  metadata: {
    tags: ContentfulTag[]
  }
  sys: {
    id: string
    type: string
    createdAt: string
    updatedAt: string
    contentType: {
      sys: {
        id: string
        type: string
        linkType: string
      }
    }
    locale: string
  }
  fields: {
    title: LocalizedFields<string>
    year: LocalizedFields<number>
    slug: LocalizedFields<string>
    content: LocalizedFields<RichTextDocument[]>
    mainImg?: LocalizedFields<{ fields: { file: { 'en-US': { url: string } } } }>
  }
}

export type ProjectContent = {
  sys: {
    id: string
    type: string
  }
  fields: {
    id: LocalizedFields<string>
    project: LocalizedFields<ProjectEntry[]>
  }
}

export type ContentItem = ProjectContent | TextContent

export type InitData = {
  title: LocalizedFields<string>
  slug: LocalizedFields<string>
  content: LocalizedFields<ContentItem[]>
}

export type ContentfulDocument = {
  content: { content: { value: string }[] }[]
} | undefined