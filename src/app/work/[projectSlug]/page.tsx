'use client'
import { useEffect, useState, useRef } from 'react'
import { findEntryBySlug } from '@/services/contentful'
import { useAppContext } from '@/services/context'
import { getLocalizedField } from '@/utils/localization'
import css from './project.module.css'

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

	const renderContent = (entry: any, index: number) => {
		// Text content rendering
		if (entry.sys.contentType.sys.id === 'text' && entry.fields.text) {
			return (
				<article key={index} style={{ gridRow: index + 2 }}>
					{entry.fields.text[language].content.map((paragraph: any, i: number) => (
						<p key={i}>
							{paragraph.content.map((textNode: any, tIndex: number) => {
								const text = textNode.value
								const isBold = textNode.marks?.some((mark: any) => mark.type === 'bold')
								const isItalic = textNode.marks?.some((mark: any) => mark.type === 'italic')
								return (
									<span
										key={tIndex}
										style={{
											fontWeight: isBold ? 'bold' : 'normal',
											fontStyle: isItalic ? 'italic' : 'normal',
										}}
									>
										{text}
									</span>
								)
							})}
						</p>
					))}
				</article>
			)
		}

		// Image content rendering
		if (entry.sys.contentType.sys.id === 'image' && entry.fields.image) {
			const imageUrl = entry.fields.image['en-US']?.fields?.file?.['en-US']?.url
			if (imageUrl) {
				return (
					<article key={index} style={{ gridRow: index + 2 }}>
						<img 
							src={`https:${imageUrl}`} 
							alt={entry.fields.image['en-US']?.fields?.title?.['en-US'] || ''} 
							className={css.contentImage} 
						/>
					</article>
				)
			}
		}

		// Video content rendering
		if (entry.sys.contentType.sys.id === 'video' && entry.fields.video) {
			const videoUrl = entry.fields.video['en-US']?.fields?.file?.['en-US']?.url
			const videoType = entry.fields.video['en-US']?.fields?.file?.['en-US']?.contentType
			if (videoUrl) {
				return (
					<article key={index} className={css.videoContainer} style={{ gridRow: index + 2 }}>
						<video 
							controls
							className={css.contentVideo}
							playsInline
						>
							<source 
								src={`https:${videoUrl}`} 
								type={videoType} 
							/>
							Your browser does not support the video tag.
						</video>
					</article>
				)
			}
		}

		return null
	}

	return (
		<section className={`${css.project} grid space`}>
			<div className={css.projectHeader} style={{ backgroundImage: mainImgUrl ? `url(https:${mainImgUrl})` : 'none' }} />
			<div className={css.titleContainer}>
				<svg ref={svgRef} width='100%' height='100%' preserveAspectRatio='xMidYMid meet'>
					<text ref={textRef} x='50%' y='50%' dominantBaseline='middle' textAnchor='middle' className={css.titleText}>
						{title}
					</text>
				</svg>
			</div>
			{contentEntries.length === 0 ? null : contentEntries.map((entry: any, i: number) => renderContent(entry, i))}
		</section>
	)
}

export default ProjectPage
