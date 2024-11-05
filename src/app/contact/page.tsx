'use client'
import { useEffect, useState } from 'react'
import { useAppContext } from '@/services/context'
import { getPage } from '@/services/contentful'
import { getLocalizedField } from '@/utils/localization'
import { ContactEntry, PageData, RichTextContent, NodeData } from '@/types/types'
import Loader from '@/components/loader/loader'
import css from './contact.module.css'

const Contact: React.FC = () => {
	const { state } = useAppContext()
	const [contactData, setContactData] = useState<PageData | null>(null)
	const [loading, setLoading] = useState<boolean>(true)
	const [error, setError] = useState<string | null>(null)
	const language = state.language

	useEffect(() => {
		let contactPageData = Array.isArray(state.data) 
			? state.data.find((page: PageData) => page.fields?.slug?.['en-US'] === 'contact')
			: null;

		if (contactPageData) {
			setContactData(contactPageData)
			setLoading(false)
		} else {
			const fetchData = async () => {
				setLoading(true)
				try {
					const page = await getPage('contact')
					if (page && page.items && page.items.length > 0) {
						contactPageData = page.items[0]
						setContactData(contactPageData)
					}
				} catch (err) {
					setError('Error fetching contact page data')
					console.error(err)
				} finally {
					setLoading(false)
				}
			}
			fetchData()
		}
	}, [state.data])

	if (loading) return <Loader />
	if (error) return null
	if (!contactData) return null

	const title: string = getLocalizedField(contactData.fields?.title, language) as string
	const contentArray = contactData.fields?.content?.['en-US'] || []

	console.log('contentArray', contentArray)

	const renderTextNode = (node: RichTextContent) => {
		switch (node.nodeType) {
			case 'text':
				return node.value
			case 'hyperlink':
				const data = node.data as NodeData
				return (
					<a href={data.uri} target={data.uri?.startsWith('mailto:') ? undefined : '_blank'} rel={data.uri?.startsWith('mailto:') ? undefined : 'noopener noreferrer'}>
						{node.content?.map((content: RichTextContent) => renderTextNode(content))}
					</a>
				)
			default:
				return null
		}
	}

	return (
		<section className={`${css.contact} grid space`}>
			<h1>{title}</h1>
			{contentArray.length > 0
				? contentArray.map((entry: ContactEntry, i: number) => {
						if (entry.fields?.text) {
							const textContent: { content: { content: RichTextContent[] }[] } | null = getLocalizedField(entry.fields.text, language)
							return (
								<div className={css.content} key={i}>
									{textContent?.content.map((paragraph: { content: RichTextContent[] }, i: number) => (
										<p key={i}>
											{paragraph.content.map((textNode: RichTextContent, j: number) => (
												<span key={j}>{renderTextNode(textNode)}</span>
											))}
										</p>
									))}
								</div>
							)
						}
						return null
				})
				: null}
		</section>
	)
}

export default Contact
