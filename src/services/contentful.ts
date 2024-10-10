'use server'
import * as contentful from 'contentful'

const client = contentful.createClient({
  space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID ?? '',
  accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN ?? '',
})

export const getPage = async (slug: string) => {
  const page = await client.withAllLocales.getEntries({
    content_type: 'page',
    include: 3,
    'fields.slug': slug,
  })
  return page
}

export const getAllPages = async () => {
  try {
    const pages = await client.withAllLocales.getEntries({
      content_type: 'page',
      include: 3,
    })
    return pages.items 
  } catch (error) {
    console.error('Error fetching all pages:', error)
    throw error
  }
}