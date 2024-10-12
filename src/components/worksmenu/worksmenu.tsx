import { useState } from 'react';
import Link from 'next/link';
import { useAppContext } from '@/services/context';
import { findEntryById } from '@/utils/content';
import { getLocalizedField } from '@/utils/localization';
import { ProjectEntry } from '@/types/types';
import css from './worksmenu.module.css';

const WorksMenu: React.FC = () => {
  const {state} = useAppContext();
  const language = state.language;
  const pages = state.data;
  const projectEntry = findEntryById(pages, 'Work', 'en-US');
  const projects: ProjectEntry[] = projectEntry ? getLocalizedField(projectEntry.fields?.project, 'en-US') ?? [] : [];
  const [hoveredProject, setHoveredProject] = useState<ProjectEntry | null>(null);

  const calculateWidth = (projectCount: number) => {
    const gap = 1;
    return `calc((100% - ${(projectCount - 1) * gap}rem) / ${projectCount})`;
  };

  const sortedProjects = [...projects].sort((a, b) => {
    const yearA = Number(a.fields.year?.['en-US']) || 0;
    const yearB = Number(b.fields.year?.['en-US']) || 0;
    return yearB - yearA;
  });

  return (
    <section className={`${css.worksmenu} grid space`}>
      <nav>
        {Array.isArray(projects) && projects.length > 0 ? (
          sortedProjects.map((project, i) => {
            const projectSlug = getLocalizedField(project?.fields?.slug, 'en-US');
            const width = calculateWidth(projects.length);

            return (
              <Link 
                href={`/${projectSlug}`} 
                key={i} style={{ width }} 
                onMouseEnter={() => setHoveredProject(project)}
                onMouseLeave={() => setHoveredProject(null)} 
              />
            );
          })
        ) : null}
      </nav>
      <h2>{getLocalizedField(hoveredProject?.fields?.title, language)}</h2>
      {hoveredProject && <>
        <p className={css.year}>{`WORK ${hoveredProject?.fields?.year?.['en-US'] ?? ''}`}</p>
        <p className={css.explore}>explore</p>
      </>}

    </section>
  );
};

export default WorksMenu;
