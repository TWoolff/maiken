import Image from 'next/image'
import css from './content.module.css'

interface ContentFields {
	fields: {
		title: {
			'en-US': string
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
				'en-US': string
			}
		}
	}
}

const ImageDoubleContent = ({ content }: ImageDoubleContentProps) => {
	const leftImageUrl = content.fields.imageLeft['en-US'].fields.file['en-US'].url
	const rightImageUrl = content.fields.imageRight['en-US'].fields.file['en-US'].url
	const leftImageTitle = content.fields.imageLeft['en-US'].fields.title['en-US'] || ''
	const rightImageTitle = content.fields.imageRight['en-US'].fields.title['en-US'] || ''
	const spacing = content.fields.spacing['en-US'] || '1rem'

	if (!leftImageUrl || !rightImageUrl) return null

	return (
		<div className={`${css.imageDoubleContainer} space`} style={{ gap: spacing + 'rem' }}>
			<div className={css.imageWrapperLeft}>
				<Image src={`https:${leftImageUrl}`} alt={leftImageTitle} fill className={css.image} />
			</div>
			<div className={css.imageWrapperRight}>
				<Image src={`https:${rightImageUrl}`} alt={rightImageTitle} fill className={css.image} />
			</div>
		</div>
	)
}

export default ImageDoubleContent
