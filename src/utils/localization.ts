export const getLocalizedField = <T,>(field: { [key: string]: T } | undefined, locale: string): T | undefined => {
  return field ? field[locale] : undefined
}

export const getLocalizedTextContent = (entry: any, language: string) => {
  return entry ? getLocalizedField(entry?.fields?.text, language) : undefined;
};