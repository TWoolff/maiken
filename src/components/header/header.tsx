'use client'
import Link from 'next/link'
import { useAppContext } from '@/services/context'
import { findEntryById } from '@/utils/content'
import { getLocalizedTextContent } from '@/utils/localization'
import Toggle from '@/components/formelements/toggle'
import css from './header.module.css'

const Header: React.FC = () => {
	const { state, dispatch } = useAppContext()
	const pages = state.data
	const language = state.language
	const introTextEntry = findEntryById(pages, 'Intro', 'en-US')
	const introTextContent = getLocalizedTextContent(introTextEntry, language) as { content: { content: { value: string }[] }[] } | null

	const handleLangChange = () => {
		dispatch({ type: 'TOGGLE_LANGUAGE', payload: { language: state.language === 'da-DK' ? 'en-US' : 'da-DK' } })
	}

	const handleNavClick = (nav: string) => {
		dispatch({ type: 'SET_NAV', payload: nav })
	}

	return (
		<header className={`${css.header} grid space`}>
			<Link href='/' className={css.logo}>
				MVB
			</Link>
			<nav>
				<Link href='/' onClick={() => handleNavClick('Work')}>
					{state.language === 'da-DK' ? 'Arbejde' : 'Work'}
				</Link>
				<Link href='/' onClick={() => handleNavClick('Collaborations')}>
					{state.language === 'da-DK' ? 'Samarbejder' : 'Collaborations'}
				</Link>
				<Link href='/about'>{state.language === 'da-DK' ? 'Om' : 'About'}</Link>
				<Link href='/contact'>{state.language === 'da-DK' ? 'Kontakt' : 'Contact'}</Link>
				<Toggle onChange={handleLangChange} labelLeft='da' labelRight='en' className={css.headerToggle} />
			</nav>
			{introTextContent ? (
				<div className={css.intro}>
					{introTextContent.content.map((paragraph: { content: any[] }, i: number) => (
						<p key={i}>{paragraph.content.map((textNode: { value: string }) => textNode.value).join(' ')}</p>
					))}
				</div>
			) : null}
		</header>
	)
}

export default Header
