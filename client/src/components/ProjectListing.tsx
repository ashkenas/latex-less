import { useMutation } from '@apollo/client';
import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { DEL_PROJECT } from '../queries';

export default function ProjectListing({ project }: any) {
  const date = new Date(project.lastEdited);
  const [deleteProject, { loading }] = useMutation(DEL_PROJECT, {
    onError: (e) => {
      console.error(e);
      alert('Failed to delete project. Please try again in a moment.');
    },
    refetchQueries: ['GetProjects']
  });

  const onClickDel = useCallback(() => {
    if (loading) return;
    if (confirm('Are you sure you want to delete this project?'))
      deleteProject({ variables: { id: project.id } });
  }, [deleteProject, project, loading]);

  return (
    <div className="card">
      <header className="card-header">
        <p className="card-header-title">{project.name}</p>
      </header>
      <div className="card-content">
        <time dateTime={date.toISOString()}>Last Edited: {date.toLocaleString()}</time>
      </div>
      <footer className="card-footer">
        <Link to={`/projects/${project._id}`} className="card-footer-item">Open</Link>
        <button onClick={onClickDel}
          className={`card-footer-item${loading ? ' loading' : ''}`}>Delete</button>
      </footer>
    </div>
  );
};
