'use client'
import { useEffect, useState } from 'react'
import { useAppContext } from '@/services/context'
import { getPage } from '@/services/contentful'
import { getLocalizedField } from '@/utils/localization'
import Loader from '@/components/loader/loader'
import css from './contact.module.css'

const Contact: React.FC = () => {
	const { state } = useAppContext()
	const [contactData, setContactData] = useState<any | null>(null)
	const [loading, setLoading] = useState<boolean>(true)
	const [error, setError] = useState<string | null>(null)
	const language = state.language

	useEffect(() => {
		let contactPageData = state.data?.find((page: any) => page.fields?.slug?.['en-US'] === 'contact')

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

	console.log(contentArray)

	const renderTextNode = (node: any) => {
		switch (node.nodeType) {
			case 'text':
				return node.value
			case 'hyperlink':
				return (
					<a href={node.data.uri} target={node.data.uri.startsWith('mailto:') ? undefined : '_blank'} rel={node.data.uri.startsWith('mailto:') ? undefined : 'noopener noreferrer'}>
						{node.content.map((content: any) => renderTextNode(content))}
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
				? contentArray.map((entry: any, i: number) => {
						if (entry.fields?.text) {
							const textContent: { content: { content: any[] }[] } | null = getLocalizedField(entry.fields.text, language)
							return (
								<div className={css.content} key={i}>
									{textContent?.content.map((paragraph: any, i: number) => (
										<p key={i}>
											{paragraph.content.map((textNode: any, j: number) => (
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
