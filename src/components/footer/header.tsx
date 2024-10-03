'use client'
import { useAppContext } from '@/utils/context'
import { TEXTS } from '@/constants/consts.texts'
import css from './footer.module.css'

const Footer: React.FC = () => {
  const { state, dispatch } = useAppContext()



  return ( 
    <footer className={`${css.footer} grid`}>
      <h4>{TEXTS.footer[state.language]}</h4>
    </footer>
  )
}

export default Footer