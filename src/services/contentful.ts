'use server'
import * as contentful from 'contentful'
import { EntrySkeletonType } from 'contentful'
import { ProjectEntry } from '@/types/types' 

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
  return JSON.parse(JSON.stringify(page))
}

export const getAllPages = async () => {
  try {
    const pages = await client.withAllLocales.getEntries({
      content_type: 'page',
      include: 3,
    })

    return JSON.parse(JSON.stringify(pages.items))
  } catch (error) {
    console.error('Error fetching all pages:', error)
    throw error
  }
}

export const findEntryBySlug = async (slug: string): Promise<ProjectEntry | null> => {
  try {
    const response = await client.withAllLocales.getEntries<EntrySkeletonType>({
      content_type: 'project',
      'fields.slug': slug,
      include: 3,
    })

    return response.items.length > 0 ? response.items[0] as unknown as ProjectEntry : null
  } catch (error) {
    console.error(`Error fetching project with slug ${slug}:`, error)
    throw error
  }
}
