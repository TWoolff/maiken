import React from 'react';
import Link from 'next/link';
import { useAppContext } from '@/services/context';
import { findEntryById } from '@/utils/content';
import { getLocalizedField } from '@/utils/localization';
import css from './worksmenu.module.css';

const WorksMenu: React.FC = () => {
  const { state } = useAppContext();
  const language = state.language === 'da' ? 'da-DK' : 'en-US';
  const pages = state.data;
  const projectEntry = findEntryById(pages, 'Work', 'en-US');
  const projects = projectEntry ? getLocalizedField(projectEntry.fields?.project, 'en-US') : [];

  return (
    <section className={`${css.worksmenu} space`}>
      <nav>
        {Array.isArray(projects) && projects.length > 0 ? (
          projects.map((project, i) => {
            const projectTitle = getLocalizedField(project?.fields?.title, language) ?? 'Untitled Project';
            const projectSlug = getLocalizedField(project?.fields?.slug, 'en-US');

            return (
                <Link href={`/${projectSlug}`} key={i}>
                  {String(projectTitle)}
                </Link>
            );
          })
        ) : null}
      </nav>
    </section>
  );
};

export default WorksMenu;
