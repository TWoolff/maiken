import { TextContentEntry, RichTextDocument, HyperlinkNode } from '@/types/types'
import css from './content.module.css'

interface TextContentProps {
	content: TextContentEntry
	language: string
	index: number
}

const TextContent = ({ content, language, index }: TextContentProps) => {
	const textAlign = content.fields.textAlign['en-US']

	return (
		<article className={`${css.textContainer} space`} style={{ gridRow: index + 2 }}>
			{content.fields.text[language]?.content.map((node: RichTextDocument['content'][0], i: number) => {
				switch (node.nodeType) {
					case 'heading-1':
						return <h1 key={i}>{node.content.map((textNode, tIndex) => (
							<span key={tIndex} style={{
								fontWeight: textNode.marks?.some(mark => mark.type === 'bold') ? 'bold' : 'normal',
								fontStyle: textNode.marks?.some(mark => mark.type === 'italic') ? 'italic' : 'normal',
							}}>{textNode.value}</span>
						))}</h1>
					case 'heading-2':
						return <h2 key={i}>{node.content.map((textNode, tIndex) => (
							<span key={tIndex} style={{
								fontWeight: textNode.marks?.some(mark => mark.type === 'bold') ? 'bold' : 'normal',
								fontStyle: textNode.marks?.some(mark => mark.type === 'italic') ? 'italic' : 'normal',
							}}>{textNode.value}</span>
						))}</h2>
					case 'heading-3':
						return <h3 key={i}>{node.content.map((textNode, tIndex) => (
							<span key={tIndex} style={{
								fontWeight: textNode.marks?.some(mark => mark.type === 'bold') ? 'bold' : 'normal',
								fontStyle: textNode.marks?.some(mark => mark.type === 'italic') ? 'italic' : 'normal',
							}}>{textNode.value}</span>
						))}</h3>
					default:
						return <p key={i}>
							{node.content.map((textNode, tIndex) => {
								const text = textNode.value
								const isBold = textNode.marks?.some(mark => mark.type === 'bold')
								const isItalic = textNode.marks?.some(mark => mark.type === 'italic')

								if (textNode.nodeType === 'hyperlink' && 'data' in textNode && 'content' in textNode) {
									const hyperlinkNode = textNode as HyperlinkNode
									return (
										<a key={tIndex} href={hyperlinkNode.data.uri} target='_blank' rel='noopener noreferrer'>
											{hyperlinkNode.content.map((linkText, linkIndex) => (
												<span
													key={linkIndex}
													style={{
														fontWeight: linkText.marks?.some(mark => mark.type === 'bold') ? 'bold' : 'normal',
														fontStyle: linkText.marks?.some(mark => mark.type === 'italic') ? 'italic' : 'normal',
													}}
												>
													{linkText.value}
												</span>
											))}
										</a>
									)
								}

								return (
									<span
										key={tIndex}
										style={{
											display: 'block',
											fontWeight: isBold ? 'bold' : 'normal',
											fontStyle: isItalic ? 'italic' : 'normal',
											textAlign: textAlign ? 'left' : 'right',
										}}
									>
										{text}
									</span>
								)
							})}
						</p>
				}
			})}
		</article>
	)
}

export default TextContent
