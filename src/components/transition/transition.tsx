'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTransition } from '@/services/transitionContext'
import css from './transition.module.css'

const Transition = () => {
  const { transitionImage, transitionBounds, setTransitionImage, setTransitionBounds } = useTransition()
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (transitionImage && transitionBounds) {
      setIsAnimating(true)
      const timer = setTimeout(() => {
        setTransitionImage(null)
        setTransitionBounds(null)
        setIsAnimating(false)
      }, 1200)
      return () => clearTimeout(timer)
    }
  }, [transitionImage, transitionBounds, setTransitionImage, setTransitionBounds])

  if (!transitionImage || !transitionBounds) return null

  return (
    <AnimatePresence>
      {isAnimating && (
        <motion.div 
          className={css.transitionWrapper}
          initial={{
            position: 'fixed',
            top: transitionBounds.top,
            left: transitionBounds.left,
            width: transitionBounds.width,
            height: transitionBounds.height,
            zIndex: 9999
          }}
          animate={{
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            position: 'fixed'
          }}
          exit={{
            opacity: 0
          }}
          transition={{
            duration: 0.8,
            ease: [0.645, 0.045, 0.355, 1.000]
          }}
        >
          <motion.div 
            className={css.transitionImage}
            style={{ 
              backgroundImage: `url(${transitionImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              width: '100%',
              height: '100%',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Transition 