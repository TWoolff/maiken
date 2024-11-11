import Image from 'next/image'
import { useAppContext } from '@/services/context'
import { ImageEntry } from '@/types/types'
import css from './content.module.css'

interface ImageContentProps {
	content: ImageEntry
}

const ImageContent = ({ content }: ImageContentProps) => {
	const { state } = useAppContext()
	const language = state.language
	const imageUrl = content.fields.image['en-US']?.fields?.file?.['en-US']?.url
	const imageTitle = content.fields.image['en-US']?.fields?.title?.['en-US'] || ''
	const ImageDescription = content.fields.image['en-US']?.fields?.description?.[language]

	if (!imageUrl) return null

	return (
		<figure className={`${css.imageWrapperSingle} space grid`}>
			<Image
				src={`https:${imageUrl}`}
				alt={imageTitle}
				width={1000}
				height={1000}
				className={css.imageSingle}
			/>
			{ImageDescription && (
				<figcaption className={css.figcaption}>{ImageDescription}</figcaption>
			)}
		</figure>
	)
}

export default ImageContent
