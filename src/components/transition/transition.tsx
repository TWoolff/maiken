'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTransition } from '@/services/transitionContext'
import css from './transition.module.css'

const Transition = () => {
  const { transitionImage, transitionBounds, finalBounds, setTransitionImage, setTransitionBounds, setFinalBounds } = useTransition()
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (transitionImage && transitionBounds) {
      setIsAnimating(true)
      const timer = setTimeout(() => {
        setTransitionImage(null)
        setTransitionBounds(null)
        setFinalBounds(null)
        setIsAnimating(false)
      }, 1100)
      return () => clearTimeout(timer)
    }
  }, [transitionImage, transitionBounds, setTransitionImage, setTransitionBounds, setFinalBounds])

  if (!transitionImage || !transitionBounds) return null

  return (
    <AnimatePresence mode="wait">
      {isAnimating && (
        <motion.div 
          className={css.transitionWrapper}
          initial={{
            position: 'fixed',
            top: transitionBounds.top,
            left: transitionBounds.left,
            width: transitionBounds.width,
            height: transitionBounds.height,
            zIndex: 9999,
            opacity: 1
          }}
          animate={{
            top: finalBounds?.top ?? 0,
            left: finalBounds?.left ?? 0,
            width: finalBounds?.width ?? '100vw',
            height: finalBounds?.height ?? '100vh',
            opacity: 1
          }}
          exit={{
            opacity: 1
          }}
          transition={{
            duration: 0.8,
            ease: [0.645, 0.045, 0.355, 1.000],
            opacity: { duration: 0.3, delay: 0.8 }
          }}
        >
          <motion.div 
            className={css.transitionImage}
            style={{ 
              backgroundImage: `url(${transitionImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'top center',
              width: '100%',
              height: '100%'
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Transition 