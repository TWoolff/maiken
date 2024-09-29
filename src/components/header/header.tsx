'use client'
import { useAppContext } from '@/utils/context'
import { TEXTS } from '@/constants/consts.texts'
import Toggle from '@/components/formelements/toggle'

const Header: React.FC = () => {
  const { state, dispatch } = useAppContext()

  const handleLangChange = () => {
    dispatch({ type: 'TOGGLE_LANGUAGE', payload: { language: state.language === 'da' ? 'en' : 'da' } })
  }

  return ( 
    <header>
      <h1>{TEXTS.header[state.language]}</h1>
      <Toggle onChange={handleLangChange} labelLeft='da' labelRight='en' />
    </header>
  )
}

export default Header