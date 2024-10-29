import css from './content.module.css'

interface ImageContentProps {
	content: any
	index: number
	isDouble?: boolean
}

const ImageContent = ({ content, index, isDouble = false }: ImageContentProps) => {
	const imageUrl = content.fields.image['en-US']?.fields?.file?.['en-US']?.url
	const imageTitle = content.fields.image['en-US']?.fields?.title?.['en-US'] || ''

	if (!imageUrl) return null

	console.log(imageUrl)
	return (
		<article 
			className={`${css.imageContainer} ${isDouble ? css.doubleImage : ''} space`} 
			style={{ gridRow: isDouble ? undefined : index + 2 }}
		>
			<img 
				src={`https:${imageUrl}`} 
				alt={imageTitle} 
				className={css.contentImage} 
			/>
		</article>
	)
}

export default ImageContent
