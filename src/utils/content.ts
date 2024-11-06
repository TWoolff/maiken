import { getLocalizedField } from './localization'
import { PageData, TextContentEntry } from '@/types/types'

export const findEntryById = (pages: PageData[], entryId: string, locale: string = 'en-US') => {
	if (!Array.isArray(pages)) {
		return undefined
	}

	for (const page of pages) {
		const localizedContentArray = getLocalizedField(page?.fields?.content, locale)
		if (Array.isArray(localizedContentArray)) {
			const foundEntry = localizedContentArray.find(entry => getLocalizedField(entry?.fields?.id, locale) === entryId)
			if (foundEntry) {
				return foundEntry as TextContentEntry
			}
		}
	}
	return undefined
}
