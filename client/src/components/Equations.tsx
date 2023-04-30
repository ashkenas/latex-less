import { GET_EQUATIONS, NEW_EQUATION } from '../queries';
import { useMutation, useQuery } from '@apollo/client';
import { useCallback } from 'react';
import '../styles/Equations.scss';
import Equation from './Equation';

export default function Equations() {
  const { data, loading, error } = useQuery(GET_EQUATIONS);
  const [newEquation, { loading: loadingNew }] = useMutation(NEW_EQUATION, {
    onError: (e) => {
      console.error(e);
      alert('Failed to create new equation. Please try again in a moment.');
    },
    refetchQueries: ['GetEquations']
  });

  const onClickNew = useCallback(() => {
    if (loadingNew) return;
    newEquation();
  }, [newEquation, loadingNew]);

  if (loading) return <p>Loading...</p>;
  if (error) return (console.error(error), <p>Error.</p>);

  const projects = data.userEquations.map((e: any) => {
    return <Equation key={e._id} equation={e} />;
  });

  return (<>
    <div className="container">
      <section className="section">
        <button onClick={onClickNew}
          className={`button${loadingNew ? ' loading' : ''}`}>New Equation</button>
        {projects}
      </section>
    </div>
  </>);
};
