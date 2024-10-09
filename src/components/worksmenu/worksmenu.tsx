import Link from 'next/link'
import { useAppContext } from '@/services/context'
import { ProjectEntry, ProjectContent, ContentItem } from '@/types/types'
import css from './worksmenu.module.css'

const isProjectContent = (item: ContentItem): item is ProjectContent => {
  return 'fields' in item && 'project' in item.fields
}

const WorksMenu: React.FC = () => {
  const { state } = useAppContext()
  const { data } = state
  const projects = data?.content.find(isProjectContent)?.fields.project || []

  return (
    <section className={`${css.worksmenu} space`}>
      <nav>
        {projects.map((project: ProjectEntry) => (
          <Link href={`work/${project.fields.slug}`} key={project.sys.id}>
            {/* {language === 'da' ? project.fields.title_dk : project.fields.title_eng} */}
          </Link>
        ))}
      </nav>
    </section>
  )
}

export default WorksMenu