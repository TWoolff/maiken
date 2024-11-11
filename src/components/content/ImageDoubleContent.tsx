import Image from 'next/image'
import { useAppContext } from '@/services/context'
import css from './content.module.css'

interface ContentFields {
	fields: {
		title: {
			'en-US': string
			'da-DK': string
		}
		description?: {
			'en-US': string
			'da-DK': string
		}
		file: {
			'en-US': {
				url: string
			}
		}
	}
}

interface ImageDoubleContentProps {
	content: {
		fields: {
			imageLeft: {
				'en-US': ContentFields
			}
			imageRight: {
				'en-US': ContentFields
			}
			spacing: {
				'en-US': number
			}
		}
	}
}

const ImageDoubleContent = ({ content }: ImageDoubleContentProps) => {
	const { state } = useAppContext()
	const language = state.language
	const leftImage = content.fields.imageLeft['en-US']
	const rightImage = content.fields.imageRight['en-US']

	if (!leftImage?.fields || !rightImage?.fields) return null;

	const leftImageUrl = leftImage.fields.file['en-US'].url
	const rightImageUrl = rightImage.fields.file['en-US'].url
	const leftImageTitle = leftImage.fields.title[language] || 'Image' 
	const rightImageTitle = rightImage.fields.title[language] || 'Image' 
	const leftImageDescription = leftImage.fields.description?.[language]
	const rightImageDescription = rightImage.fields.description?.[language]
	const spacing = content.fields.spacing['en-US'] || 1

	return (
		<div className={`${css.imageDoubleContainer} space`} style={{ gap: spacing + 'rem' }}>
			<figure className={css.imageWrapperLeft}>
				<Image 
					src={`https:${leftImageUrl}`} 
					alt={leftImageTitle}
					fill 
					className={css.image}
				/>
				{leftImageDescription && (
					<figcaption className={css.figcaption}>{leftImageDescription}</figcaption>
				)}
			</figure>
			<figure className={css.imageWrapperRight}>
				<Image 
					src={`https:${rightImageUrl}`} 
					alt={rightImageTitle}
					fill 
					className={css.image}
				/>
				{rightImageDescription && (
					<figcaption className={css.figcaption}>{rightImageDescription}</figcaption>
				)}
			</figure>
		</div>
	)
}

export default ImageDoubleContent
