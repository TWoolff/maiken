'use client'
import { useEffect, useState } from 'react'
import { useAppContext } from '@/services/context'
import { getPage } from '@/services/contentful'
import Video from '@/components/video/video'

const Home: React.FC = () => {
  const {state, dispatch} = useAppContext()
  const [homeData, setHomeData] = useState<any>(null);

  useEffect(() => {
		if (homeData) return;
		const fetchData = async () => {
			try {
				const data = await getPage('home');
				setHomeData(JSON.parse(JSON.stringify(data.items[0].fields)))
			} catch (error) {
				console.error('Error fetching home data:', error);
			}
		}
		fetchData()
	}, [])

  useEffect(() => {
		if (homeData && state.data) {
			dispatch({ type: 'SET_STATE', payload: { hasLoaded: true } })
		}
	}, [homeData, state.data])

  // console.log('homeData:', homeData)

  return (
    <main>
      <Video />
    </main>
  )
}

export default Home
