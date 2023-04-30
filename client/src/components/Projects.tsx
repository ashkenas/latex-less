import { GET_PROJECTS } from '../queries';
import { useQuery } from '@apollo/client';

export default function Projects() {
  const { data, loading, error } = useQuery(GET_PROJECTS);

  if (loading) return 'Loading...';
  if (error) return (console.error(error), 'Error.');

  return data.userProjects.map((p: any) => (
    <div key={p._id} className="project">
      <h1>{p.name}</h1>
      <time>{p.lastEdited}</time>
    </div>
  ))
};
