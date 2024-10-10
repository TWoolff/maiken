import React from 'react';
import Link from 'next/link';
import { useAppContext } from '@/services/context';
import css from './worksmenu.module.css';
import { findEntryById } from '@/utils/content';
import { getLocalizedField } from '@/utils/localization';

const WorksMenu: React.FC = () => {
  const { state } = useAppContext();

  // Determine the language
  const language = state.language === 'da' ? 'da-DK' : 'en-US';

  // Get all pages from state
  const pages = state.data;

  // Use utility to find the 'Work' entry
  const projectEntry = findEntryById(pages, 'Work', 'en-US');
  const projects = projectEntry ? getLocalizedField(projectEntry.fields?.project, 'en-US') : [];

  return (
    <section className={`${css.worksmenu} space`}>
      <nav>
        <ul>
          {Array.isArray(projects) && projects.length > 0 ? (
            projects.map((project, index) => {
              const projectTitle = getLocalizedField(project?.fields?.title, language) ?? 'Untitled Project';
              const projectSlug = getLocalizedField(project?.fields?.slug, 'en-US');

              return (
                <li key={index}>
                  <Link href={`/${projectSlug}`}>
                    {String(projectTitle)}
                  </Link>
                </li>
              );
            })
          ) : (
            <li>No projects available</li>
          )}
        </ul>
      </nav>
    </section>
  );
};

export default WorksMenu;
