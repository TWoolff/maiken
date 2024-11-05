import { TextContentEntry, RichTextDocument } from '@/types/types'

export const getLocalizedField = <T,>(field: { [key: string]: T } | undefined, locale: string): T | null => {
  return field?.[locale] ?? null;
};

export const getLocalizedTextContent = (entry: TextContentEntry | undefined, language: string): RichTextDocument | undefined => {
  const textField = getLocalizedField(entry?.fields?.text, language);
  return textField ?? undefined;
};