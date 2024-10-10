'use client'
import React, { useEffect, useCallback } from 'react'
import { useAppContext } from '@/services/context'
import { getAllPages } from '@/services/contentful'
import { HomeData } from '@/types/types'
import Video from '@/components/video/video'
import WorksMenu from '@/components/worksmenu/worksmenu'

const Home: React.FC = () => {
  const { state, dispatch } = useAppContext()

  const fetchData = useCallback(async () => {
    if (state.data) return
    try {
      const data = await getAllPages()
      const formattedData = JSON.parse(JSON.stringify(data)) as HomeData
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
      <WorksMenu />
      <Video />
    </main>
  )
}

export default Home
