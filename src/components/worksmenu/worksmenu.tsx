import { useMemo } from 'react'
import Link from 'next/link'
import { useAppContext } from '@/services/context'
import { ProjectEntry } from '@/types/types'
import css from './worksmenu.module.css'

const WorksMenu = () => {
  const { state } = useAppContext()

  const projects = useMemo(() => {
    return state.data?.content[0].fields.project || []
  }, [state.data])

  return ( 
    <section className={`${css.worksmenu} space`}>
      <nav>
        {projects.map((project: ProjectEntry) => (
          <Link href={`work/${project.fields.slug}`} key={project.sys.id}>
            {state.language == 'da' ? project.fields.title_dk : project.fields.title_eng}
          </Link>
        ))}
      </nav>
    </section>
  )
}

export default WorksMenu