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

export type DataState = {
    data?: PageData[]
}

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

export interface Metadata {
  tags: ContentfulTag[];
}

export interface Sys {
  space: {
    sys: {
      type: string;
      linkType: string;
      id: string;
    };
  };
  id: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  environment: {
    sys: {
      id: string;
      type: string;
      linkType: string;
    };
  };
  publishedVersion: number;
  revision: number;
  contentType: {
    sys: {
      type: string;
      linkType: string;
      id: string;
    };
  };
}

export interface LocalizedField<T> {
  [locale: string]: T;
}

export interface PageFields {
  title: LocalizedField<string>;
  slug: LocalizedField<string>;
  content: LocalizedField<ContentEntry[]>;
}

export interface ContentEntry {
  metadata: Metadata;
  sys: Sys;
  fields: {
    id: LocalizedField<string>;
    text: LocalizedField<RichTextDocument>;
  };
}

export interface RichTextDocument {
  nodeType: string;
  data: NodeData;
  content: Array<{
    data: NodeData;
    content: Array<{
      data: NodeData;
      marks: Array<{ type: string }>;
      value: string;
      nodeType: string;
    }>;
    nodeType: string;
  }>;
}

export interface PageData {
  metadata: Metadata;
  sys: Sys;
  fields: PageFields;
}

export interface RichTextContent {
  nodeType: string;
  data: NodeData;
  content?: RichTextContent[];
  value?: string;
  marks?: Array<{ type: string }>;
}

export interface ContactFields {
  id: LocalizedField<string>;
  text: LocalizedFields<RichTextDocument>;
}

export interface ContactEntry {
  metadata: Metadata;
  sys: Sys;
  fields: ContactFields;
}

export type NodeData = {
	uri?: string;
}