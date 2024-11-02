'use client'
import { useEffect, useState, useRef } from 'react'
import { findEntryBySlug } from '@/services/contentful'
import { useAppContext } from '@/services/context'
import { getLocalizedField } from '@/utils/localization'
import css from './project.module.css'
import TextContent from '@/components/content/TextContent'
import ImageContent from '@/components/content/ImageContent'
import VideoContent from '@/components/content/VideoContent'

const ProjectPage = ({ params }: { params: { projectSlug: string } }) => {
	const { state } = useAppContext()
	const language = state.language
	const [project, setProject] = useState<any>(null)
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

	if (!project) return

	const title = getLocalizedField(project.fields.title, language) as string
	const contentEntries = project.fields.content?.['en-US'] || []
	const mainImgUrl = project?.fields?.mainImg?.['en-US']?.fields?.file?.['en-US']?.url

	console.log(project)

	const renderContent = (entry: any, index: number, entries: any[]) => {
		switch (entry.sys.contentType.sys.id) {
			case 'text':
				return <TextContent key={index} content={entry} language={language} index={index} />
			case 'image': {
				const imageEntries = entries.filter(e => e.sys.contentType.sys.id === 'image')
				const imageIndex = imageEntries.findIndex(e => e.sys.id === entry.sys.id)
				
				if (imageIndex % 2 === 0) {
					const nextImage = imageEntries[imageIndex + 1]
					return (
						<div key={index} className={`${css.imageRow} space grid`} style={{ gridRow: index + 2 }}>
							<article className={css.imageWrapper} style={{ gridColumn: getFirstImageColumn(imageIndex) }}>
								<ImageContent content={entry} index={index} />
							</article>
							{nextImage && 
								<article className={css.imageWrapper} style={{ gridColumn: getSecondImageColumn(imageIndex) }}>
									<ImageContent 
										content={nextImage} 
										index={entries.findIndex(e => e.sys.id === nextImage.sys.id)} 
									/>
								</article>
							}
						</div>
					)
				}
				return null
			}
			case 'video':
				return <VideoContent key={index} content={entry} index={index} />
			default:
				return null
		}
	}

	// Helper functions to determine column positions
	const getFirstImageColumn = (pairIndex: number) => {
		// pairIndex represents the pair number (0, 1, 2, etc.)
		return pairIndex % 2 === 0 ? '1 / 5' : '1 / 8'
	}

	const getSecondImageColumn = (pairIndex: number) => {
		return pairIndex % 2 === 0 ? '6 / -1' : '9 / -1'
	}

	return (
		<section className={`${css.project} grid`}>
			{mainImgUrl && <img src={`https:${mainImgUrl}`} alt={title} className={css.mainImg} />}
			<div className={css.titleContainer}>
				<svg ref={svgRef} width='100%' height='100%' preserveAspectRatio='xMidYMid meet'>
					<text ref={textRef} x='50%' y='50%' dominantBaseline='middle' textAnchor='middle' className={css.titleText}>
						{title}
					</text>
				</svg>
			</div>
			{contentEntries.length === 0 ? null : contentEntries.map((entry: any, i: number) => renderContent(entry, i, contentEntries))}
		</section>
	)
}

export default ProjectPage
