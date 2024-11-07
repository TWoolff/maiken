import { Dispatch } from 'react'

export type AppContextType = {
	state: State
	dispatch: Dispatch<Action>
}

export type Action = { type: 'SET_STATE'; payload: Partial<State> } | { type: 'TOGGLE_LANGUAGE'; payload: { language: 'da-DK' | 'en-US' } } | { type: 'SET_NAV'; payload: string }

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

export interface BaseEntry {
	metadata: Metadata
	sys: FullSys
	fields: {
		id: LocalizedFields<string>
	}
}

export interface TextContentEntry extends BaseEntry {
	fields: {
		id: LocalizedFields<string>
		text: LocalizedFields<RichTextDocument>
	}
}

export interface ProjectEntry extends BaseEntry {
	fields: {
		id: LocalizedFields<string>
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

export type ContentItem = ProjectContent | TextContentEntry

export type InitData = {
	title: LocalizedFields<string>
	slug: LocalizedFields<string>
	content: LocalizedFields<ContentItem[]>
}

export type ContentfulDocument =
	| {
			content: { content: { value: string }[] }[]
	  }
	| undefined

export interface Metadata {
	tags: Array<{
		sys: ContentTypeSys
		name: string
	}>
}

export interface BaseSys {
	id: string
	type: string
}

export interface ContentTypeSys extends BaseSys {
	linkType: string
}

export interface FullSys extends BaseSys {
	createdAt: string
	updatedAt: string
	contentType: {
		sys: ContentTypeSys
	}
	locale?: string
}

export interface LocalizedField<T> {
	[locale: string]: T
}

export interface PageFields {
	title: LocalizedField<string>
	slug: LocalizedField<string>
	content: LocalizedField<ContentEntry[]>
}

export interface ContentEntry {
	metadata: Metadata
	sys: FullSys
	fields: {
		id: LocalizedField<string>
		text: LocalizedField<RichTextDocument>
	}
}

export interface RichTextDocument {
	nodeType: string
	data: NodeData
	content: Array<{
		data: NodeData
		content: Array<{
			data: NodeData
			marks: Array<{ type: string }>
			value: string
			nodeType: string
		}>
		nodeType: string
	}>
}

export interface PageData {
	metadata: Metadata
	sys: FullSys
	fields: PageFields
}

export interface RichTextContent {
	nodeType: string
	data: NodeData
	content?: RichTextContent[]
	value?: string
	marks?: Array<{ type: string }>
}

export interface ContactFields {
	id: LocalizedField<string>
	text: LocalizedFields<RichTextDocument>
}

export interface ContactEntry {
	metadata: Metadata
	sys: FullSys
	fields: ContactFields
}

export type NodeData = {
	uri?: string
}

export interface ImageAsset {
	fields: {
		title: LocalizedFields<string>
		description?: LocalizedFields<string>
		file: LocalizedFields<{
			url: string
			details: {
				size: number
				image: {
					width: number
					height: number
				}
			}
			fileName: string
			contentType: string
		}>
	}
}

export interface ImageEntry {
	metadata: Metadata
	sys: FullSys
	fields: {
		id: LocalizedFields<string>
		image: LocalizedFields<ImageAsset>
	}
}

export interface VideoEntry {
	metadata: Metadata
	sys: FullSys
	fields: {
		id: LocalizedFields<string>
		video: LocalizedFields<{
			fields: {
				file: LocalizedFields<{
					url: string
					contentType: string
				}>
			}
		}>
	}
}

export interface ImageDoubleEntry {
	fields: {
		imageLeft: {
			'en-US': {
				fields: {
					title: { 'en-US': string }
					file: { 'en-US': { url: string } }
				}
			}
		}
		imageRight: {
			'en-US': {
				fields: {
					title: { 'en-US': string }
					file: { 'en-US': { url: string } }
				}
			}
		}
		spacing: { 'en-US': string }
	}
}

export interface ContentFields {
	file: {
		'en-US': {
			url: string
		}
	}
}
