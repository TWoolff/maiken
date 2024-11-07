import Image from 'next/image'
import { ImageEntry } from '@/types/types'
import css from './content.module.css'

interface ImageContentProps {
	content: ImageEntry
}

const ImageContent = ({ content }: ImageContentProps) => {
	const imageUrl = content.fields.image['en-US']?.fields?.file?.['en-US']?.url
	const imageTitle = content.fields.image['en-US']?.fields?.title?.['en-US'] || ''

	console.log('content Single', content)

	if (!imageUrl) return null

	return (
		<div className={`${css.imageWrapperSingle} space grid`}>
			<Image
				src={`https:${imageUrl}`}
				alt={imageTitle}
				width={1000}
				height={1000}
				className={css.imageSingle}
			/>
		</div>
	)
}

export default ImageContent
