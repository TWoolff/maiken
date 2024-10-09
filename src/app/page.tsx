'use client'
import React, { useEffect, useCallback } from 'react'
import { useAppContext } from '@/services/context'
import { getPage } from '@/services/contentful'
import { ContentfulDocument, HomeData } from '@/types/types'
import { getLocalizedField } from '@/utils/localization'
import Video from '@/components/video/video'

const Home: React.FC = () => {
  const { state, dispatch } = useAppContext()


  const fetchData = useCallback(async () => {
    if (state.data) return
    try {
      const data = await getPage('home')
      const formattedData = JSON.parse(JSON.stringify(data.items[0].fields)) as HomeData
      console.log('Formatted Data:', formattedData)
      dispatch({ type: 'SET_STATE', payload: { data: formattedData, hasLoaded: true } })
    } catch (error) {
      console.error('Error fetching home data:', error)
    }
  }, [dispatch, state.data])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  
  return (
    <main className='grid'>
      <Video />
    </main>
  )
}

export default Home
