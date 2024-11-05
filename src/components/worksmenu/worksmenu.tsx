import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useAppContext } from '@/services/context'
import { findEntryById } from '@/utils/content'
import { getLocalizedField } from '@/utils/localization'
import { ProjectEntry } from '@/types/types'
import css from './worksmenu.module.css'

const WorksMenu: React.FC = () => {
	const { state } = useAppContext()
	const language = state.language
	const currentNav = state.currentNav
	const navRef = useRef<HTMLElement>(null)
	const sectionRef = useRef<HTMLElement>(null)
	const projectEntry = findEntryById(state.data, currentNav, 'en-US')
	const projects: ProjectEntry[] = projectEntry ? getLocalizedField(projectEntry.fields?.project, 'en-US') ?? [] : []
	const [hoveredProject, setHoveredProject] = useState<ProjectEntry | null>(null)

	useEffect(() => {
		if (projects.length > 0) {
			setHoveredProject(projects[0])
		} else {
			setHoveredProject(null)
		}
	}, [currentNav, projects])

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

	const sortedProjects = [...projects].sort((a, b) => {
		const yearA = Number(a.fields.year?.['en-US']) || 0
		const yearB = Number(b.fields.year?.['en-US']) || 0
		return yearB - yearA
	})

	return (
		<section 
			ref={sectionRef} 
			className={`${css.worksmenu} grid space`}
		>
			<nav ref={navRef}>
				{Array.isArray(projects) && projects.length > 0
					? sortedProjects.map((project, i) => {
							const projectSlug = getLocalizedField(project?.fields?.slug, 'en-US')
							const isActive = hoveredProject === project ? css.active : ''
							const mainImgUrl = project?.fields?.mainImg?.['en-US']?.fields?.file?.['en-US']?.url

							return (
								<Link
									href={`/work/${projectSlug}`}
									key={i}
									style={{ backgroundImage: mainImgUrl ? `url(${mainImgUrl})` : 'none' }}
									className={isActive}
									onMouseEnter={() => setHoveredProject(project)}
								/>
							)
					})
					: null}
			</nav>
			<div className={css.projectInfo}>
				<h2>{getLocalizedField(hoveredProject?.fields?.title, language)}</h2>
				<Link href={`work/${getLocalizedField(hoveredProject?.fields?.slug, 'en-US')}`}>
					{language === 'da-DK' ? 'undersøg' : 'explore'}
				</Link>
			</div>
			{hoveredProject && (
				<>
					<p className={css.year}>{`WORK ${hoveredProject?.fields?.year?.['en-US'] ?? ''}`}</p>
				</>
			)}
		</section>
	)
}

export default WorksMenu
