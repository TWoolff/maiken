'use client'
import { useEffect, useCallback } from 'react'
import { useAppContext } from '@/services/context'
import { getPage } from '@/services/contentful'
import { DataState, HomeData } from '@/types/types'
import WorksMenu from '@/components/worksmenu/worksmenu'
import Video from '@/components/video/video'

const Home: React.FC = () => {
  const { state, dispatch } = useAppContext()

  const fetchData = useCallback(async () => {
    if (state.data) return 
    try {
      const data = await getPage('home')
      const formattedData = JSON.parse(JSON.stringify(data.items[0].fields)) as HomeData
      dispatch({ type: 'SET_STATE', payload: { data: formattedData as DataState, hasLoaded: true } })
    } catch (error) {
      console.error('Error fetching home data:', error)
    }
  }, [dispatch, state.data])

  useEffect(() => {
    fetchData()
  }, [fetchData])


  console.log(state.data)

  return (
    <main className='grid'>
      <WorksMenu />
      <Video />
    </main>
  )
}

export default Home