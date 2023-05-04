import { useMutation } from '@apollo/client';
import EquationEditor from 'equation-editor-react';
import { Dispatch, useCallback, useEffect, useState } from 'react';
import { ADD_EQUATION, REM_EQUATION } from '../queries';
import { NamedText } from '../typings/gql';
import { DirtyDataDispatchAction } from './ProjectEditor';

type ProjectEquationProps = {
  equation: NamedText,
  pid?: string,
  dispatch: Dispatch<DirtyDataDispatchAction>
};

const ProjectEquation: React.FC<ProjectEquationProps> = ({ equation, pid, dispatch }) => {
  const [eq, setEq] = useState(equation.text);
  const [name, setName] = useState(equation.name);
  const [editing, ] = useState(true);
  // const [updateEquation, { loading }] = useMutation(UPDATE_PROJECT, {
  //   onError: (e) => {
  //     console.error(e);
  //     alert('Failed to save equation. Please try again in a moment.');
  //   },
  //   onCompleted: () => setEditing(false),
  //   variables: {
  //     id: pid,
  //     equations: [{
  //       _id: equation._id,
  //       name: name,
  //       text: eq
  //     }]
  //   },
  //   refetchQueries: ['GetProject']
  // });
  const [deleteEquation, { loading: loadingDel }] = useMutation(REM_EQUATION, {
    onError: (e) => {
      console.error(e);
      alert('Failed to delete equation. Please try again in a moment.');
    },
    variables: { pid: pid, id: equation._id },
    refetchQueries: ['GetProject']
  });
  const [duplicate, { loading: loadingDup }] = useMutation(ADD_EQUATION, {
    onError: (e) => {
      console.error(e);
      alert('Failed to duplicate equation. Please try again in a moment.');
    },
    variables: {
      id: pid,
      name: name,
      text: eq
    },
    refetchQueries: ['GetProject']
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

  // const onClickSave = useCallback(() => {
  //   if (loading) return;
  //   updateEquation();
  // }, [updateEquation, loading]);

  const dirty = equation.text !== eq || equation.name !== name;
  useEffect(() => {
    dispatch({
      type: dirty ? 'equation' : 'removeEquation',
      data: { _id: equation._id, name, text: eq }
    });
  }, [eq, name, dirty, dispatch, equation._id]);

  return (
    <div className="card">
      <header className="card-header">
        <p className="card-header-title"><>
          { editing
          ? <input type="text" value={name} className="input"
              onChange={(e) => setName(e.target.value)}
              aria-label="equation name" />
          : name }
          {dirty && '*'}
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
        {/* <button onClick={onClickSave}
          className={`card-footer-item${loading ? ' loading' : ''}`}>Save</button> */}
        {/* <button onClick={() => setEditing(true)}
          className={`card-footer-item`}>Rename</button> */}
          <button onClick={onClickDup}
            className={`card-footer-item${loadingDup ? ' loading' : ''}`}>Duplicate</button>
        <button onClick={onClickDel}
          className={`card-footer-item${loadingDel ? ' loading' : ''}`}>Delete</button>
      </footer>
    </div>
  );
};

export default ProjectEquation;
