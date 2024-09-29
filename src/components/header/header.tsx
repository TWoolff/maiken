'use client'
import { useAppContext } from '@/utils/context'
import Toggle from '../formelements/toggle'

const text = {
  da: 'Maiken Vibe Bauer | Rum for Radikal Lytning',
  en: 'Maiken Vibe Bauer | Room for Radical Listening'
}

const Header: React.FC = () => {
  const { state, dispatch } = useAppContext()

  const handleLangChange = () => {
    dispatch({ type: 'TOGGLE_LANGUAGE', payload: { language: state.language === 'da' ? 'en' : 'da' } })
  }

  return ( 
    <header>
      <h1>{text[state.language]}</h1>
      <Toggle onChange={handleLangChange} labelLeft='da' labelRight='en' />
    </header>
  )
}

export default Header