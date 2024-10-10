import { getLocalizedField } from './localization';

// Utility function to find a specific entry across all pages
export const findEntryById = (pages: any, entryId: string, locale: string = 'en-US') => {
  if (!Array.isArray(pages)) {
    console.warn('Pages is not an array:', pages);
    return undefined;
  }

  for (let page of pages) {
    const localizedContentArray = getLocalizedField(page?.fields?.content, locale);
    if (Array.isArray(localizedContentArray)) {
      const foundEntry = localizedContentArray.find(
        (entry) => getLocalizedField(entry?.fields?.id, locale) === entryId
      );
      if (foundEntry) {
        return foundEntry;
      }
    }
  }
  return undefined;
};

// Utility function to extract localized text content from an entry
export const getLocalizedTextContent = (entry: any, language: string) => {
  return entry ? getLocalizedField(entry?.fields?.text, language) : undefined;
};
