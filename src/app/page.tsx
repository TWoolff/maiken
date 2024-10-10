'use client'
import React, { useEffect, useCallback } from 'react'
import { useAppContext } from '@/services/context'
import { getAllPages } from '@/services/contentful'
import { InitData } from '@/types/types'
import WorksMenu from '@/components/worksmenu/worksmenu'

const Work: React.FC = () => {
  const { state, dispatch } = useAppContext()

  const fetchData = useCallback(async () => {
    if (state.data) return
    try {
      const data = await getAllPages()
      dispatch({ type: 'SET_STATE', payload: { data: JSON.parse(JSON.stringify(data)) as InitData, hasLoaded: true } })
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
    </main>
  )
}

export default Work
