import { TextContentEntry, RichTextDocument } from '@/types/types'
import css from './content.module.css'

interface TextContentProps {
	content: TextContentEntry
	language: string
	index: number
}

const TextContent = ({ content, language, index }: TextContentProps) => {
	return (
		<article className={`${css.textContainer} space`} style={{ gridRow: index + 2 }}>
			{content.fields.text[language]?.content.map((paragraph: RichTextDocument['content'][0], i: number) => (
				<p key={i}>
					{paragraph.content.map((textNode: RichTextDocument['content'][0]['content'][0], tIndex: number) => {
						const text = textNode.value
						const isBold = textNode.marks?.some((mark) => mark.type === 'bold')
						const isItalic = textNode.marks?.some((mark) => mark.type === 'italic')
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

export default TextContent
