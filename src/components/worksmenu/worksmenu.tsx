import React from 'react'
import Link from 'next/link'
import { useAppContext } from '@/services/context'
import css from './worksmenu.module.css'
import { getLocalizedField } from '@/utils/localization'

const WorksMenu: React.FC = () => {
  const { state } = useAppContext()
  const language = state.language === 'da' ? 'da-DK' : 'en-US'
  const localizedContentArray = getLocalizedField(state.data?.content, 'en-US')
  const projectEntry = Array.isArray(localizedContentArray)
    ? localizedContentArray.find((entry) => getLocalizedField(entry?.fields?.id, 'en-US') === 'Work')
    : undefined

  const projects = projectEntry?.fields?.project ? getLocalizedField(projectEntry.fields.project, 'en-US') : []

  return (
    <section className={`${css.worksmenu} space`}>
      <nav>
          {Array.isArray(projects) && projects.length > 0 ? (
            projects.map((project, i) => {
              const projectTitle = getLocalizedField(project?.fields?.title, language) ?? 'Untitled Project'
              const projectSlug = getLocalizedField(project?.fields?.slug, 'en-US')

              return (
                <Link href={`/${projectSlug}`} key={i}>
                  {String(projectTitle)}
                </Link>
              )
            })
          ) : null}
      </nav>
    </section>
  )
}

export default WorksMenu
