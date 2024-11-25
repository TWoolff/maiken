'use client'
import { useEffect } from 'react'
import { ProjectEntry } from '@/types/types'
import { useTransition } from '@/services/transitionContext'

const findImagesInContent = (content: any[]): string[] => {
  const imageUrls: string[] = []
  
  content?.forEach(entry => {
    // Check for mainImg in project entries
    if (entry?.fields?.mainImg?.['en-US']?.fields?.file?.['en-US']?.url) {
      imageUrls.push(entry.fields.mainImg['en-US'].fields.file['en-US'].url)
    }
    
    // Check for nested content
    if (entry?.fields?.content?.['en-US']) {
      const nestedContent = entry.fields.content['en-US']
      imageUrls.push(...findImagesInContent(nestedContent))
    }
    
    // Check for direct image entries
    if (entry?.fields?.image?.['en-US']?.fields?.file?.['en-US']?.url) {
      imageUrls.push(entry.fields.image['en-US'].fields.file['en-US'].url)
    }
  })
  
  return imageUrls
}

export const useImagePreloader = (data: any) => {
  const { preloadedImages, setPreloadedImages } = useTransition()

  useEffect(() => {
    const preloadImages = async () => {
      // Handle both direct project arrays and nested content
      const content = Array.isArray(data) ? data : data?.data?.[0]?.fields?.content?.['en-US'] || []
      const imageUrls = findImagesInContent(content)
      
      // Filter out already loaded images
      const newUrls = imageUrls.filter(url => !preloadedImages.has(url))
      
      if (newUrls.length === 0) return

      const imagePromises = newUrls.map(url => {
        if (!url) return null
        
        return new Promise((resolve) => {
          const img = new Image()
          img.src = `https:${url}`
          img.onload = () => resolve({ url, loadedUrl: img.src })
        })
      })

      const loadedImages = await Promise.all(imagePromises)
      const newImageMap = new Map(preloadedImages) // Create copy of existing map
      loadedImages.forEach((result: any) => {
        if (result) {
          newImageMap.set(result.url, result.loadedUrl)
        }
      })
      
      setPreloadedImages(newImageMap)
    }

    // Remove the size check to allow loading new images
    if (data) {
      preloadImages()
    }
  }, [data, setPreloadedImages, preloadedImages]) // Add preloadedImages to dependencies

  return { preloadedImages }
} 