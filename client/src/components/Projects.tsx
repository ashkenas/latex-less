import { GET_PROJECTS, NEW_PROJECT } from '../queries';
import { useMutation, useQuery } from '@apollo/client';
import { useCallback, useMemo } from 'react';

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
  }, [loadingNew]);

  if (loading) return <p>Loading...</p>;
  if (error) return (console.error(error), <p>Error.</p>);

  return (<>
    <button onClick={onClickNew}>New Project</button>
    {data.userProjects.map((p: any) => (
      <div key={p._id} className="project">
        <h1>{p.name}</h1>
        <time>{p.lastEdited}</time>
      </div>
    ))}
  </>);
  
};
