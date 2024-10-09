'use server';
import * as contentful from 'contentful';

const client = contentful.createClient({
  space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID ?? '',
  accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN ?? '',
});

// Function to get a page entry with all locales included using withAllLocales
export const getPage = async (slug: string) => {
  const page = await client.withAllLocales.getEntries({
    content_type: 'page',
    include: 3,
    'fields.slug': slug,
  });
  return page;
};