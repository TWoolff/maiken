import { findEntryBySlug } from '@/services/contentful';
import css from './project.module.css';

const ProjectPage = async ({ params }: { params: { projectSlug: string } }) => {
  const project = await findEntryBySlug(params.projectSlug);
  const mainImgUrl = project?.fields?.mainImg?.['en-US']?.fields?.file?.['en-US']?.url;

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <section className={`${css.project} grid space`} style={{ backgroundImage: mainImgUrl ? `url(${mainImgUrl})` : 'none'}}>
      <h1>{project.fields.title['en-US']}</h1>
    </section>
  );
}

export default ProjectPage