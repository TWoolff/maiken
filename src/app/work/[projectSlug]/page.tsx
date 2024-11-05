'use client'
import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import { findEntryBySlug } from '@/services/contentful'
import { useAppContext } from '@/services/context'
import { getLocalizedField } from '@/utils/localization'
import { ImageEntry, ProjectEntry, TextContentEntry, VideoEntry } from '@/types/types'
import TextContent from '@/components/content/TextContent'
import ImageContent from '@/components/content/ImageContent'
import VideoContent from '@/components/content/VideoContent'
import css from './project.module.css'

const ProjectPage = ({ params }: { params: { projectSlug: string } }) => {
	const { state } = useAppContext()
	const language = state.language
	const [project, setProject] = useState<ProjectEntry | null>(null)
	const svgRef = useRef<SVGSVGElement>(null)
	const textRef = useRef<SVGTextElement>(null)

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

	if (!project) return null
	const title = getLocalizedField(project.fields.title, language) as string
	const contentEntries = (project.fields.content?.['en-US'] || []) as unknown as (ProjectEntry | ImageEntry | TextContentEntry)[]
	const mainImgUrl = project?.fields?.mainImg?.['en-US']?.fields?.file?.['en-US']?.url

	const renderContent = (entry: ProjectEntry | ImageEntry | TextContentEntry | VideoEntry, index: number, entries: (ProjectEntry | ImageEntry | TextContentEntry | VideoEntry)[]) => {
		if (!('sys' in entry) || !('contentType' in entry.sys)) return null
		
		switch (entry.sys.contentType.sys.id) {
			case 'text':
				return <TextContent key={index} content={entry as TextContentEntry} language={language} index={index} />
			case 'image': {
				const imageEntries = entries.filter(e => 'contentType' in e.sys && e.sys.contentType.sys.id === 'image') as ImageEntry[]
				const imageIndex = imageEntries.findIndex(e => e.sys.id === entry.sys.id)

				if (imageIndex % 2 === 0) {
					const nextImage = imageEntries[imageIndex + 1]
					return (
						<div key={index} className={`${css.imageRow} space grid`} style={{ gridRow: index + 2 }}>
							<article className={css.imageWrapper} style={{ gridColumn: getFirstImageColumn(imageIndex) }}>
								<ImageContent content={entry as ImageEntry} />
							</article>
							{nextImage && (
								<article className={css.imageWrapper} style={{ gridColumn: getSecondImageColumn(imageIndex) }}>
									<ImageContent content={nextImage} />
								</article>
							)}
						</div>
					)
				}
				return null
			}
			case 'video':
				return <VideoContent key={index} content={entry as VideoEntry} index={index} />
			default:
				return null
		}
	}

	const getFirstImageColumn = (pairIndex: number) => {
		return pairIndex % 2 === 0 ? '1 / 5' : '1 / 8'
	}

	const getSecondImageColumn = (pairIndex: number) => {
		return pairIndex % 2 === 0 ? '6 / -1' : '9 / -1'
	}

	return (
		<section className={`${css.project} grid`}>
			{mainImgUrl && (
				<Image 
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
			{contentEntries.length === 0 ? null : contentEntries.map((entry: ProjectEntry | ImageEntry | TextContentEntry, i: number) => renderContent(entry, i, contentEntries))}
		</section>
	)
}

export default ProjectPage
