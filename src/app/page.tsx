'use client'
import React, { useEffect, useCallback } from 'react'
import { useAppContext } from '@/services/context'
import { getAllPages } from '@/services/contentful'
import WorksMenu from '@/components/worksmenu/worksmenu'
import Loader from '@/components/loader/loader'

const Work: React.FC = () => {
  const { state, dispatch } = useAppContext()

  const fetchData = useCallback(async () => {
    if (state.data) return
    try {
      const data = await getAllPages()
      const serializedData = JSON.parse(JSON.stringify(data))
      dispatch({ type: 'SET_STATE', payload: { data: serializedData, hasLoaded: true } })
    } catch (error) {
      console.error('Error fetching home data:', error)
    }
  }, [dispatch, state.data])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <main className='grid'>
      {state.hasLoaded ? <WorksMenu /> : <Loader />}
    </main>
  )
}

export default Work
