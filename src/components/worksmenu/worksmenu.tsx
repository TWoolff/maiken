import React, { useState } from 'react';
import Link from 'next/link';
import { useAppContext } from '@/services/context';
import { findEntryById } from '@/utils/content';
import { getLocalizedField } from '@/utils/localization';
import css from './worksmenu.module.css';
import { ProjectEntry } from '@/types/types';

const WorksMenu: React.FC = () => {
  const { state } = useAppContext();
  const language = state.language;
  const pages = state.data;
  const projectEntry = findEntryById(pages, 'Work', 'en-US');
  const projects = projectEntry ? getLocalizedField(projectEntry.fields?.project, 'en-US') : [];
  const [hoveredProject, setHoveredProject] = useState<ProjectEntry | null>(null);

  const calculateWidth = (projectCount: number) => {
    const gap = 1;
    return `calc((100% - ${(projectCount - 1) * gap}rem) / ${projectCount})`;
  };

  console.log(hoveredProject)

  return (
    <section className={`${css.worksmenu} grid space`}>
      <nav>
        {Array.isArray(projects) && projects.length > 0 ? (
          projects.map((project, i) => {
            const projectTitle = getLocalizedField(project?.fields?.title, language) ?? 'Untitled Project';
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
      {hoveredProject && <p className={css.year}>{`WORK ${hoveredProject?.fields?.year?.['en-US'] ?? ''}`}</p>}

    </section>
  );
};

export default WorksMenu;