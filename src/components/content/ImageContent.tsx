import css from './content.module.css'

interface ImageContentProps {
	content: any
	index: number
}

const ImageContent = ({ content, index }: ImageContentProps) => {
	const imageUrl = content.fields.image['en-US']?.fields?.file?.['en-US']?.url
	const imageTitle = content.fields.image['en-US']?.fields?.title?.['en-US'] || ''

	if (!imageUrl) return null

	return (
		<article className='space' style={{ gridRow: index + 2 }}>
			<img src={`https:${imageUrl}`} alt={imageTitle} className={css.contentImage} />
		</article>
	)
}

export default ImageContent
