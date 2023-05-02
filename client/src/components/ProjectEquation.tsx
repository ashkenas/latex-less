import { useMutation } from '@apollo/client';
import EquationEditor from 'equation-editor-react';
import { useCallback, useState } from 'react';
import { DEL_EQUATION, NEW_EQUATION, UPDATE_PROJECT } from '../queries';
import { NamedText } from '../typings/gql';

type ProjectEquation = React.FC<{
  equation: NamedText,
  pid: string | undefined,
  collector: (_id: string, name: string, text: string) => void
}>;

const ProjectEquation: ProjectEquation = ({ equation, pid, collector }) => {
  const [eq, setEq] = useState(equation.text);
  const [name, setName] = useState(equation.name);
  collector(equation._id, name, eq);
  const [editing, setEditing] = useState(false);
  const [updateEquation, { loading }] = useMutation(UPDATE_PROJECT, {
    onError: (e) => {
      console.error(e);
      alert('Failed to save equation. Please try again in a moment.');
    },
    onCompleted: () => setEditing(false),
    variables: {
      id: pid,
      equations: [{
        _id: equation._id,
        name: name,
        text: eq
      }]
    },
    refetchQueries: ['GetProjectEquations']
  });
  const [deleteEquation, { loading: loadingDel }] = useMutation(DEL_EQUATION, {
    onError: (e) => {
      console.error(e);
      alert('Failed to delete equation. Please try again in a moment.');
    },
    variables: { id: equation._id },
    refetchQueries: ['GetProjectEquations']
  });
  const [duplicate, { loading: loadingDup }] = useMutation(NEW_EQUATION, {
    onError: (e) => {
      console.error(e);
      alert('Failed to duplicate equation. Please try again in a moment.');
    },
    variables: {
      name: name,
      text: eq
    },
    refetchQueries: ['GetProjectEquations']
  });

  const onClickDel = useCallback(() => {
    if (loadingDel) return;
    if (confirm('Are you sure you want to delete this equation?'))
      deleteEquation();
  }, [deleteEquation, loadingDel]);

  const onClickDup = useCallback(() => {
    if (loadingDup) return;
    duplicate();
  }, [duplicate, loadingDup]);

  const onClickSave = useCallback(() => {
    if (loading) return;
    updateEquation();
  }, [updateEquation, loading]);

  return (
    <div className="card">
      <header className="card-header">
        <p className="card-header-title"><>
          { editing
          ? <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
          : name }
          {(equation.text !== eq || equation.name !== name) && '*'}
        </></p>
      </header>
      <div className="card-content">
        <EquationEditor
          value={eq}
          onChange={setEq}
          autoCommands="pi theta sqrt sum prod alpha beta gamma rho"
          autoOperatorNames="sin cos tan"
        />
      </div>
      <footer className="card-footer">
        <button onClick={onClickSave}
          className={`card-footer-item${loading ? ' loading' : ''}`}>Save</button>
        <button onClick={() => setEditing(true)}
          className={`card-footer-item`}>Rename</button>
          <button onClick={onClickDup}
            className={`card-footer-item${loadingDup ? ' loading' : ''}`}>Duplicate</button>
        <button onClick={onClickDel}
          className={`card-footer-item${loadingDel ? ' loading' : ''}`}>Delete</button>
      </footer>
    </div>
  );
};

export default ProjectEquation;
