'use client'
import { useEffect } from 'react'
import { useTransition } from '@/services/transitionContext'

const ImagePreloader = ({ imageUrl }: { imageUrl: string }) => {
  const { setPreloadedImage } = useTransition()

  useEffect(() => {
    const img = new Image()
    img.src = imageUrl
    
    img.onload = () => {
      setPreloadedImage(imageUrl)
    }

    return () => {
      img.onload = null
    }
  }, [imageUrl, setPreloadedImage])

  return null
}

export default ImagePreloader 