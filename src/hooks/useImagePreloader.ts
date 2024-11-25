'use client'
import { useEffect } from 'react'
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
      const content = Array.isArray(data) ? data : data?.data?.[0]?.fields?.content?.['en-US'] || []
      const imageUrls = findImagesInContent(content)
      
      // Preload all images immediately, regardless of cache status
      const imagePromises = imageUrls.map(url => {
        if (!url) return null
        
        return new Promise((resolve) => {
          const img = new Image()
          img.src = `https:${url}`
          
          if (img.complete) {
            resolve({ url, loadedUrl: img.src })
          } else {
            img.onload = () => resolve({ url, loadedUrl: img.src })
          }
        })
      })

      const loadedImages = await Promise.all(imagePromises)
      const newImageMap = new Map(preloadedImages)
      loadedImages.forEach((result: any) => {
        if (result) {
          newImageMap.set(result.url, result.loadedUrl)
        }
      })
      
      setPreloadedImages(newImageMap)
    }

    if (data) {
      preloadImages()
    }
  }, [data, setPreloadedImages])

  return { preloadedImages }
} 