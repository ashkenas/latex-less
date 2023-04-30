import { GET_PROJECTS, NEW_PROJECT } from '../queries';
import { useMutation, useQuery } from '@apollo/client';
import { useCallback } from 'react';
import '../styles/Projects.scss';
import ProjectListing from './ProjectListing';

export default function Projects() {
  const { data, loading, error } = useQuery(GET_PROJECTS);
  const [newProject, { loading: loadingNew }] = useMutation(NEW_PROJECT, {
    onError: (e) => {
      console.error(e);
      alert('Failed to create new project. Please try again in a moment.');
    },
    refetchQueries: ['GetProjects']
  });

  const onClickNew = useCallback(() => {
    if (loadingNew) return;
    newProject();
  }, [newProject, loadingNew]);

  if (loading) return <p>Loading...</p>;
  if (error) return (console.error(error), <p>Error.</p>);

  const projects = data.userProjects.map((p: any) => {
    return <ProjectListing key={p._id} project={p} />;
  });

  return (<>
    <div className="container">
      <section className="section">
        <button onClick={onClickNew}
          className={`button${loadingNew ? ' loading' : ''}`}>New Project</button>
        {projects}
      </section>
    </div>
  </>);
};
