export const getLocalizedField = <T,>(field: { [key: string]: T } | undefined, locale: string): T | null => {
  return field?.[locale] ?? null;
};

export const getLocalizedTextContent = (entry: any, language: string) => {
  return entry ? getLocalizedField(entry?.fields?.text, language) : undefined;
};