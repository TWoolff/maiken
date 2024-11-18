'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAppContext } from '@/services/context'
import { findEntryById } from '@/utils/content'
import { getLocalizedTextContent } from '@/utils/localization'
import { PageData, RichTextDocument } from '@/types/types'
import Toggle from '@/components/formelements/toggle'
import css from './header.module.css'
import { useTransition } from '@/services/transitionContext'

const Header: React.FC = () => {
	const pathname = usePathname()
	const { state, dispatch } = useAppContext()
	const { setTransitionImage, setTransitionBounds, setFinalBounds, setIsTransitioning } = useTransition()
	const pages = state.data
	const language = state.language
	const introTextEntry = findEntryById(pages as PageData[], 'Intro', 'en-US')
	const introTextContent = getLocalizedTextContent(introTextEntry, language) as RichTextDocument | null

	const clearTransitionStates = () => {
		setTransitionImage(null)
		setTransitionBounds(null)
		setFinalBounds(null)
		setIsTransitioning(false)
	}

	const handleLangChange = () => {
		dispatch({ type: 'TOGGLE_LANGUAGE', payload: { language: state.language === 'da-DK' ? 'en-US' : 'da-DK' } })
	}

	const handleNavClick = (nav: string) => {
		clearTransitionStates()
		dispatch({ type: 'SET_NAV', payload: nav })
	}

	return (
		<header className={`${css.header} grid space`} data-pathname={pathname}>
			<Link href='/' onClick={clearTransitionStates} className={css.logo}>
				MAIKEN VIBE BAUER
			</Link>
			<nav>
				<Link href='/' onClick={() => handleNavClick('Work')}>
					{state.language === 'da-DK' ? 'Arbejder' : 'Work'}
				</Link>
				<Link href='/' onClick={() => handleNavClick('Collaborations')}>
					{state.language === 'da-DK' ? 'Samarbejder' : 'Collaborations'}
				</Link>
				<Link href='/about' onClick={clearTransitionStates}>
					{state.language === 'da-DK' ? 'Om' : 'About'}
				</Link>
				<Link href='/contact' onClick={clearTransitionStates}>
					{state.language === 'da-DK' ? 'Kontakt' : 'Contact'}
				</Link>
				<Toggle onChange={handleLangChange} labelLeft='da' labelRight='en' className={css.headerToggle} />
			</nav>
			{introTextContent && (
				<div className={css.intro}>
					{introTextContent.content.map((paragraph: { content: RichTextDocument['content'][0]['content'] }, i: number) => (
						<p key={i}>{paragraph.content.map((textNode: { value: string }) => textNode.value).join(' ')}</p>
					))}
				</div>
			)}
		</header>
	)
}

export default Header
