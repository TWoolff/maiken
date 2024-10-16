import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAppContext } from '@/services/context';
import { findEntryById } from '@/utils/content';
import { getLocalizedField } from '@/utils/localization';
import { ProjectEntry } from '@/types/types';
import css from './worksmenu.module.css';

const WorksMenu: React.FC = () => {
  const { state } = useAppContext();
  const language = state.language;
  const currentNav = state.currentNav;
  
  const projectEntry = findEntryById(state.data, currentNav, 'en-US');
  const projects: ProjectEntry[] = projectEntry ? getLocalizedField(projectEntry.fields?.project, 'en-US') ?? [] : [];
  const [hoveredProject, setHoveredProject] = useState<ProjectEntry | null>(null);

  useEffect(() => {
    if (projects.length > 0) {
      setHoveredProject(projects[0]);
    } else {
      setHoveredProject(null);
    }
  }, [currentNav, projects]);

  const calculateWidth = (projectCount: number) => {
    const gap = 1;
    return `calc((100% - ${(projectCount - 1) * gap}rem) / ${projectCount})`;
  };

  const sortedProjects = [...projects].sort((a, b) => {
    const yearA = Number(a.fields.year?.['en-US']) || 0;
    const yearB = Number(b.fields.year?.['en-US']) || 0;
    return yearB - yearA;
  });

  console.log(hoveredProject, 'hoveredProject')

  return (
    <section className={`${css.worksmenu} grid space`}>
      <nav>
        {Array.isArray(projects) && projects.length > 0 ? (
          sortedProjects.map((project, i) => {
            const projectSlug = getLocalizedField(project?.fields?.slug, 'en-US');
            const width = calculateWidth(projects.length);
            const isActive = hoveredProject === project ? css.active : '';
            const mainImgUrl = project?.fields?.mainImg?.['en-US']?.fields?.file?.['en-US']?.url;

            return (
              <Link 
                href={`/work/${projectSlug}`} 
                key={i} 
                style={{width, backgroundImage: mainImgUrl ? `url(${mainImgUrl})` : 'none'}} 
                className={isActive}
                onMouseEnter={() => setHoveredProject(project)}
              />
            );
          })
        ) : null}
      </nav>
      <h2>{getLocalizedField(hoveredProject?.fields?.title, language)}</h2>
      {hoveredProject && <>
        <p className={css.year}>{`WORK ${hoveredProject?.fields?.year?.['en-US'] ?? ''}`}</p>
        <Link href={`work/${getLocalizedField(hoveredProject?.fields?.slug, 'en-US')}`} className={css.explore}>{language === 'da-DK' ? 'undersøg' : 'explore'}</Link>
      </>}
    </section>
  );
};

export default WorksMenu;
