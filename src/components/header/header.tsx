'use client'
import { useAppContext } from '@/services/context'
import { ContentfulDocument } from '@/types/types'
import { getLocalizedField } from '@/utils/localization'
import Toggle from '@/components/formelements/toggle'
import css from './header.module.css'
import Link from 'next/link'

const Header: React.FC = () => {
  const { state, dispatch } = useAppContext()

  const handleLangChange = () => {
    dispatch({ type: 'TOGGLE_LANGUAGE', payload: { language: state.language === 'da' ? 'en' : 'da' } })
  }

  const language = state.language === 'da' ? 'da-DK' : 'en-US'
  const localizedContentArray = getLocalizedField(state.data?.content, 'en-US')
  const introTextEntry = Array.isArray(localizedContentArray)
    ? localizedContentArray.find((entry) => getLocalizedField(entry?.fields?.id, 'en-US') === 'Intro')
    : undefined
  const introTextContent: ContentfulDocument = getLocalizedField(introTextEntry?.fields?.text, language)

  return ( 
    <header className={`${css.header} grid space`}>
      <h1>MVB</h1>
      <nav>
        <Link href='/'>Work</Link>
        <Link href='/contact'>Contact</Link>
        <Toggle onChange={handleLangChange} labelLeft='da' labelRight='en' className={css.headerToggle} /> 
      </nav>
      {introTextContent ? (
          <div className={css.intro}>
            {introTextContent.content.map((paragraph, i) => (
              <p key={i}>
                {paragraph.content.map((textNode) => textNode.value).join(' ')}
              </p>
            ))}
          </div>
        ) : null}
    </header>
  )
}

export default Header