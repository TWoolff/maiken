export const getLocalizedField = <T,>(field: { [key: string]: T } | undefined, locale: string): T | undefined => {
  return field ? field[locale] : undefined
}