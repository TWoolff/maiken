'use client'
import { useAppContext } from '@/utils/context'

const Home: React.FC = () => {
  const { state, dispatch } = useAppContext()

  return (
    <main>
      <h1>
        {state.language === 'da' ? 'Hej verden' : 'Hello world'}
      </h1>
    </main>
  )
}

export default Home
