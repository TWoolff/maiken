'use client'
import { useAppContext } from '@/services/context'
import { TEXTS } from '@/constants/consts.texts'
import css from './footer.module.css'

const Footer: React.FC = () => {
  const { state } = useAppContext()

  return ( 
    <footer className={`${css.footer} grid`}>
      <h4>{TEXTS.footer[state.language]}</h4>
    </footer>
  )
}

export default Footer