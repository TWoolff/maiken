'use client'
import { useAppContext } from '@/services/context'
import css from './footer.module.css'
import { TEXTS } from '@/constants/consts.texts'

const Footer: React.FC = () => {
  const { state } = useAppContext()

  return ( 
    <footer className={`${css.footer} grid`}>
      <h4>{TEXTS.footer[state.language]}</h4>
    </footer>
  )
}

export default Footer