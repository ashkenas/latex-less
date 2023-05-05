import { useMutation } from '@apollo/client';
import EquationEditor from 'equation-editor-react';
import { useCallback, useState } from 'react';
import { DEL_EQUATION, UPDATE_EQUATION } from '../queries';

export default function Equation({ equation }: any) {
  const [eq, setEq] = useState(equation.text);
  const [name, setName] = useState(equation.name);
  const [editing, setEditing] = useState(false);
  const [updateEquation, { loading }] = useMutation(UPDATE_EQUATION, {
    onError: (e) => {
      console.error(e);
      alert('Failed to save equation. Please try again in a moment.');
    },
    onCompleted: () => setEditing(false),
    variables: { id: equation._id, name: name, text: eq },
    refetchQueries: ['GetEquations']
  });
  const [deleteEquation, { loading: loadingDel }] = useMutation(DEL_EQUATION, {
    onError: (e) => {
      console.error(e);
      alert('Failed to delete equation. Please try again in a moment.');
    },
    variables: { id: equation._id },
    refetchQueries: ['GetEquations']
  });

  const onClickDel = useCallback(() => {
    if (loadingDel) return;
    if (confirm('Are you sure you want to delete this equation?'))
      deleteEquation();
  }, [deleteEquation, loadingDel]);

  const onClickSave = useCallback(() => {
    if (loading) return;
    if ((/[{}]/.test(name)))
      return alert(`Equation names cannot have braces in them.`)
    updateEquation();
  }, [updateEquation, loading, name]);

  return (
    <div className="card">
      <header className="card-header">
        <p className="card-header-title"><>
          { editing
          ? <input type="text" value={name} className="input"
              onChange={(e) => setName(e.target.value)}
              aria-label="equation name" />
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
        <button onClick={onClickDel}
          className={`card-footer-item${loadingDel ? ' loading' : ''}`}>Delete</button>
      </footer>
    </div>
  );
};
