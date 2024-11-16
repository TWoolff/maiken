'use client'
import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import { findEntryBySlug } from '@/services/contentful'
import { useAppContext } from '@/services/context'
import { getLocalizedField } from '@/utils/localization'
import { ImageEntry, ProjectEntry, TextContentEntry, VideoEntry, ImageDoubleEntry } from '@/types/types'
import TextContent from '@/components/content/TextContent'
import ImageContent from '@/components/content/ImageContent'
import VideoContent from '@/components/content/VideoContent'
import ImageDoubleContent from '@/components/content/ImageDoubleContent'
import { useTransition } from '@/services/transitionContext'
import css from './project.module.css'

const ProjectPage = ({ params }: { params: { projectSlug: string } }) => {
	const { state } = useAppContext()
	const language = state.language
	const [project, setProject] = useState<ProjectEntry | null>(null)
	const svgRef = useRef<SVGSVGElement>(null)
	const textRef = useRef<SVGTextElement>(null)
	const mainImgRef = useRef<HTMLImageElement>(null)
	const { setFinalBounds } = useTransition()

	useEffect(() => {
		const fetchProject = async () => {
			const projectData = await findEntryBySlug(params.projectSlug)
			setProject(projectData)
		}

		fetchProject()
	}, [params.projectSlug])

	useEffect(() => {
		const adjustTextSize = () => {
			if (svgRef.current && textRef.current) {
				const isMobile = window.innerWidth < 768
				const padding = isMobile ? `${1.5}rem` : `${3}rem`

				const remToPx = (rem: string) => {
					const baseFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize)
					return parseFloat(rem) * baseFontSize
				}

				const paddingPx = remToPx(padding) * 2
				const svgWidth = svgRef.current.clientWidth - paddingPx
				const textWidth = textRef.current.getBBox().width
				const scale = (svgWidth / textWidth) * 1

				textRef.current.style.transform = `scale(${scale})`
			}
		}

		if (project) {
			adjustTextSize()
			window.addEventListener('resize', adjustTextSize)
		}

		return () => {
			window.removeEventListener('resize', adjustTextSize)
		}
	}, [project, language])

	useEffect(() => {
		if (mainImgRef.current) {
			const rect = mainImgRef.current.getBoundingClientRect()
			setFinalBounds({
				top: rect.top,
				left: rect.left,
				width: rect.width,
				height: rect.height
			})
		}
	}, [mainImgRef, setFinalBounds])

	if (!project) return null
	const title = getLocalizedField(project.fields.title, language) as string
	const contentEntries = (project.fields.content?.['en-US'] || []) as unknown as (ProjectEntry | ImageEntry | TextContentEntry | VideoEntry | ImageDoubleEntry)[]
	const mainImgUrl = project?.fields?.mainImg?.['en-US']?.fields?.file?.['en-US']?.url

	const isImageDoubleEntry = (entry: any): entry is ImageDoubleEntry => {
		return 'fields' in entry && 'imageLeft' in entry.fields && 'imageRight' in entry.fields && 'spacing' in entry.fields && entry.sys.contentType.sys.id === 'imageDouble'
	}

	const renderContent = (entry: ProjectEntry | ImageEntry | TextContentEntry | VideoEntry | ImageDoubleEntry, index: number) => {
		if (!('sys' in entry) || !('contentType' in entry.sys)) return null

		const contentType = entry.sys.contentType.sys.id
		switch (contentType) {
			case 'text':
				return <TextContent key={index} content={entry as TextContentEntry} language={language} index={index} />
			case 'image':
				return <ImageContent key={index} content={entry as ImageEntry} />
			case 'imageDouble':
				if (isImageDoubleEntry(entry)) {
					return <ImageDoubleContent key={index} content={entry} />
				}
				return null
			case 'video':
				return <VideoContent key={index} content={entry as VideoEntry} index={index} />
			default:
				return null
		}
	}

	return (
		<section className={`${css.project} grid`}>
			{mainImgUrl && (
				<Image 
					ref={mainImgRef}
					src={`https:${mainImgUrl}`} 
					alt={title} 
					className={css.mainImg} 
					width={800} 
					height={600} 
				/>
			)}
			<div className={css.titleContainer}>
				<svg ref={svgRef} width='100%' height='100%' preserveAspectRatio='xMidYMid meet'>
					<text ref={textRef} x='50%' y='50%' dominantBaseline='middle' textAnchor='middle' className={css.titleText}>
						{title}
					</text>
				</svg>
			</div>
			{contentEntries.length === 0 ? null : contentEntries.map((entry: ProjectEntry | ImageEntry | TextContentEntry | VideoEntry | ImageDoubleEntry, i: number) => renderContent(entry, i))}
		</section>
	)
}

export default ProjectPage
