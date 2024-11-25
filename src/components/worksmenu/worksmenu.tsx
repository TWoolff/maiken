import { useState, useEffect, useRef, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAppContext } from '@/services/context'
import { useTransition } from '@/services/transitionContext'
import { useImagePreloader } from '@/hooks/useImagePreloader'
import { findEntryById } from '@/utils/content'
import { getLocalizedField } from '@/utils/localization'
import { PageData, ProjectEntry, ProjectContent } from '@/types/types'
import css from './worksmenu.module.css'

const WorksMenu: React.FC = () => {
	const { state } = useAppContext()
	const language = state.language
	const currentNav = state.currentNav
	const navRef = useRef<HTMLElement>(null)
	const sectionRef = useRef<HTMLElement>(null)
	const projectEntry = findEntryById(state.data as PageData[], currentNav, 'en-US')
	const router = useRouter()
	const { setTransitionImage, setTransitionBounds, setFinalBounds, setIsTransitioning } = useTransition()

	const projects: ProjectEntry[] = useMemo(() => {
		if (projectEntry?.fields && 'project' in projectEntry.fields) {
			const entry = projectEntry as unknown as ProjectContent
			return getLocalizedField(entry.fields.project, 'en-US') ?? []
		}
		return []
	}, [projectEntry])

	const sortedProjects = useMemo(() => {
		return [...projects].sort((a, b) => {
			const yearA = Number(a.fields.year?.['en-US']) || 0
			const yearB = Number(b.fields.year?.['en-US']) || 0
			return yearB - yearA
		})
	}, [projects])

	const [hoveredProject, setHoveredProject] = useState<ProjectEntry | null>(null)

	const { preloadedImages } = useImagePreloader(sortedProjects)

	useEffect(() => {
		if (projects.length > 0) {
			setHoveredProject(projects[0])
		} else {
			setHoveredProject(null)
		}
	}, [projects])

	useEffect(() => {
		const handleWheel = (e: WheelEvent) => {
			if (navRef.current) {
				e.preventDefault()
				navRef.current.scrollLeft += e.deltaY * 2
			}
		}

		const sectionElement = sectionRef.current
		if (sectionElement) {
			sectionElement.addEventListener('wheel', handleWheel, { passive: false })
		}

		return () => {
			if (sectionElement) {
				sectionElement.removeEventListener('wheel', handleWheel)
			}
		}
	}, [])

	const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, mainImgUrl: string, projectSlug: string) => {
		e.preventDefault()
		window.scrollTo(0, 0)
		
		const element = e.currentTarget
		const rect = element.getBoundingClientRect()
		
		setTransitionBounds({
			top: rect.top,
			left: rect.left,
			width: rect.width,
			height: rect.height
		})
		
		const imageUrl = preloadedImages.get(mainImgUrl) || `https:${mainImgUrl}`
		setTransitionImage(imageUrl)
		setIsTransitioning(true)
		
		setTimeout(() => {
			router.push(`/work/${projectSlug}`)
			setIsTransitioning(false)
		}, 1000)
	}

	const handleMouseEnter = (project: ProjectEntry) => {
		setHoveredProject(project)
		const mainImgAsset = project?.fields?.mainImg?.['en-US']?.fields?.file?.['en-US'] as any

		if (mainImgAsset?.details?.image) {
			const windowWidth = window.innerWidth
			const imageWidth = mainImgAsset.details.image.width
			const imageHeight = mainImgAsset.details.image.height
			const aspectRatio = imageHeight / imageWidth
			const calculatedHeight = windowWidth * aspectRatio
			
			setFinalBounds({
				top: 0,
				left: 0,
				width: windowWidth,
				height: calculatedHeight
			})
		}
	}

	return (
		<section ref={sectionRef} className={`${css.worksmenu} grid space`}>
			<nav ref={navRef}>
				{Array.isArray(projects) && projects.length > 0
					? sortedProjects.map((project, i) => {
							const projectSlug = getLocalizedField(project?.fields?.slug, 'en-US')
							const isActive = hoveredProject === project ? css.active : ''
							const mainImgUrl = project?.fields?.mainImg?.['en-US']?.fields?.file?.['en-US']?.url

							if (mainImgUrl && preloadedImages.has(mainImgUrl)) {
								return (
									<Link
										href={`/work/${projectSlug}`}
										key={i}
										style={{ backgroundImage: mainImgUrl ? `url(${preloadedImages.get(mainImgUrl) || `https:${mainImgUrl}`})` : 'none' }}
										className={isActive}
										onMouseEnter={() => handleMouseEnter(project)}
										onClick={(e) => mainImgUrl && projectSlug && handleClick(e, mainImgUrl, projectSlug)}
									/>
								)
							}
							return null
						})
					: null}
			</nav>
			<div className={css.projectInfo}>
				<h2>{getLocalizedField(hoveredProject?.fields?.title, language)}</h2>
			</div>
			<Link href={`work/${getLocalizedField(hoveredProject?.fields?.slug, 'en-US')}`} className={css.explore}>{language === 'da-DK' ? 'undersøg' : 'explore'}</Link>
			{hoveredProject && <p className={css.year}>{`WORK ${hoveredProject?.fields?.year?.['en-US'] ?? ''}`}</p>}
		</section>
	)
}

export default WorksMenu
