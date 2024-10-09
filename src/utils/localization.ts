export const getLocalizedField = <T,>(field: { [key: string]: T } | undefined, locale: string): T | undefined => {
  return field ? field[locale] : undefined
}

export const isTextContent = (item: any): boolean => {
  return item?.fields?.text !== undefined
}

export const isProjectContent = (item: any): boolean => {
  return item?.fields?.project !== undefined
}