import { findEntryBySlug } from '@/services/contentful';

const ProjectPage = async ({ params }: { params: { projectSlug: string } }) => {
  const project = await findEntryBySlug(params.projectSlug);

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <section className='grid space'>
      <h1>{project.fields.title['en-US']}</h1>
    </section>
  );
}

export default ProjectPage