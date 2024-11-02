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

	return (
		<div 
			className={css.imageContainer}
			style={{ 
				backgroundImage: `url(https:${imageUrl})`,
			}}
			aria-label={imageTitle}
		/>
	)
}

export default ImageContent
