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
				const svgWidth = svgRef.current.clientWidth
				const textWidth = textRef.current.getBBox().width
				const scale = svgWidth / textWidth * 0.9 // 90% of container width
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
	}, [project])

	if (!project) {
		return <div>Project not found</div>
	}

	const title = getLocalizedField(project.fields.title, language) as string
	const contentEntries: Array<{ fields: { text: Record<string, { content: Array<{ content: Array<{ value: string; marks?: Array<{ type: string }> }> }> }> } }> =
		project.fields.content?.['en-US'] || []
	const mainImgUrl = project?.fields?.mainImg?.['en-US']?.fields?.file?.['en-US']?.url

	return (
		<section className={`${css.project} grid space`}>
			<div className={css.projectHeader} style={{ backgroundImage: mainImgUrl ? `url(${mainImgUrl})` : 'none' }} />
			<div className={css.titleContainer}>
				<svg ref={svgRef} width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
					<text
						ref={textRef}
						x="50%"
						y="50%"
						dominantBaseline="middle"
						textAnchor="middle"
						className={css.titleText}
					>
						{title}
					</text>
				</svg>
			</div>
			{contentEntries.length === 0 ? (
				null
			) : (
				contentEntries.map((entry, i) => (
					<article key={i} style={{ gridRow: i + 2 }}>
						{entry.fields.text[language].content.map((paragraph, pIndex) => (
							<p key={pIndex}>
								{paragraph.content.map((textNode, tIndex) => {
									const text = textNode.value
									const isBold = textNode.marks?.some(mark => mark.type === 'bold')
									const isItalic = textNode.marks?.some(mark => mark.type === 'italic')
									return (
										<span key={tIndex} style={{ fontWeight: isBold ? 'bold' : 'normal', fontStyle: isItalic ? 'italic' : 'normal' }}>
												{text}
										</span>
									)
								})}
							</p>
						))}
					</article>
				))
			)}
		</section>
	)
}

export default ProjectPage