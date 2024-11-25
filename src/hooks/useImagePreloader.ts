'use client'
import { useState, useEffect } from 'react'
import { ProjectEntry } from '@/types/types'

export const useImagePreloader = (projects: ProjectEntry[]) => {
  const [preloadedImages, setPreloadedImages] = useState<Map<string, string>>(new Map())
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const preloadImages = async () => {
      const imagePromises = projects.map(project => {
        const mainImgUrl = project?.fields?.mainImg?.['en-US']?.fields?.file?.['en-US']?.url
        if (!mainImgUrl) return null

        return new Promise((resolve) => {
          const img = new Image()
          img.src = `https:${mainImgUrl}`
          img.onload = () => resolve({ url: mainImgUrl, loadedUrl: img.src })
        })
      })

      const loadedImages = await Promise.all(imagePromises)
      const imageMap = new Map()
      loadedImages.forEach((result: any) => {
        if (result) {
          imageMap.set(result.url, result.loadedUrl)
        }
      })
      
      setPreloadedImages(imageMap)
      setIsLoading(false)
    }

    if (projects.length > 0) {
      preloadImages()
    }
  }, [projects])

  return { preloadedImages, isLoading }
} 