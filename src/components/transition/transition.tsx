'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTransition } from '@/services/transitionContext'
import css from './transition.module.css'
import { usePathname } from 'next/navigation'

const Transition = () => {
	const { transitionImage, transitionBounds, finalBounds, setTransitionImage, setTransitionBounds, setFinalBounds } = useTransition()
	const [isAnimating, setIsAnimating] = useState(false)
	const pathname = usePathname()
	const isProjectPage = pathname.includes('/work/')
	const isNavigatingToNonProject = !pathname.includes('/work/') && transitionImage

	useEffect(() => {
		if (transitionImage && transitionBounds) {
			setIsAnimating(true)
			if (!isProjectPage || isNavigatingToNonProject) {
				const timer = setTimeout(() => {
					setIsAnimating(false)
					setTimeout(() => {
						setTransitionImage(null)
						setTransitionBounds(null)
						setFinalBounds(null)
					}, 100)
				}, 1000)
				return () => clearTimeout(timer)
			}
		}
	}, [transitionImage, transitionBounds, setTransitionImage, setTransitionBounds, setFinalBounds, isProjectPage, isNavigatingToNonProject])
	if (!transitionImage || !transitionBounds) return null

	return (
		<AnimatePresence mode='wait'>
			{(isAnimating || (isProjectPage && !isNavigatingToNonProject)) && (
				<motion.div
					key={pathname}
					className={css.transitionWrapper}
					initial={{
						position: 'fixed',
						top: isProjectPage ? 0 : transitionBounds.top,
						left: isProjectPage ? 0 : transitionBounds.left,
						width: isProjectPage ? '100vw' : transitionBounds.width,
						height: isProjectPage ? '75vh' : transitionBounds.height,
						zIndex: 9999,
						opacity: 1,
					}}
					animate={{
						position: isProjectPage ? 'sticky' : 'fixed',
						top: finalBounds?.top ?? 0,
						left: finalBounds?.left ?? 0,
						width: finalBounds?.width ?? '100vw',
						height: finalBounds?.height ?? '100vh',
						zIndex: isProjectPage ? -1 : 9999,
						opacity: 1,
					}}
					transition={{
						duration: 0.8,
						ease: [0.645, 0.045, 0.355, 1.000],
					}}
				>
					<motion.div
						className={css.transitionImage}
						style={{
							backgroundImage: `url(${transitionImage})`,
							backgroundSize: 'cover',
							backgroundPosition: 'top center',
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
