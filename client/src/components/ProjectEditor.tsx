import { useMutation, useQuery } from '@apollo/client';
import { useCallback, useContext, useEffect, useReducer, useState } from 'react';
import { unstable_usePrompt, useParams } from 'react-router-dom';
import { AuthContext } from '../firebase/Auth';
import { ADD_EQUATION, ADD_RESPONSE, GET_PROJECT, UPDATE_PROJECT } from '../queries';
import '../styles/ProjectEditor.scss';
import { NamedText } from '../typings/gql';
import ProjectEquation from './ProjectEquation';
import ProjectResponse from './ProjectResponse';
import WaitForData from './WaitForData';

type DirtyData = {
  equations: NamedText[],
  responses: NamedText[]
};

export type DirtyDataDispatchAction = {
  type: string,
  data?: NamedText
};

const dirtyDataReducer = (state: DirtyData, action: DirtyDataDispatchAction) => {
  if (action.type === 'equation') {
    const newState = { ...state };
    const idx = newState.equations.findIndex(d => d._id === action.data?._id);
    if (idx >= 0) newState.equations[idx] = action.data as NamedText;
    else newState.equations.push(action.data as NamedText);
    return newState;
  } else if (action.type === 'response') {
    const newState = { ...state };
    const idx = newState.responses.findIndex(d => d._id === action.data?._id);
    if (idx >= 0) newState.responses[idx] = action.data as NamedText;
    else newState.responses.push(action.data as NamedText);
    return newState;
  } else if (action.type === 'removeEquation') {
    return {
      responses: [...state.responses],
      equations: state.equations.filter(d => d._id !== action.data?._id)
    };
  } else if (action.type === 'removeResponse') {
    return {
      equations: [...state.equations],
      responses: state.responses.filter(d => d._id !== action.data?._id)
    };
  } else if (action.type === 'reset') {
    return { equations: [], responses: [] };
  } else {
    console.log(`Unknown action '${action.type}' dispatched.`);
    return { ...state };
  }
};

const ProjectEditor: React.FC = () => {
  const user = useContext(AuthContext);
  const [renaming, setRenaming] = useState(false)
  const [name, setName] = useState('');
  const [left, setLeft] = useState('');
  const [right, setRight] = useState('');
  const [dirtyData, dispatch] = useReducer(dirtyDataReducer, {
    equations: [],
    responses: []
  });
  const { id } = useParams();
  const { data, loading, error } = useQuery(GET_PROJECT, {
    onCompleted: (d) => {
      setRenaming(false);
      setName(d.project.name);
      setLeft(d.project.left);
      setRight(d.project.right);
    },
    variables: { id: id }
  });
  const dirty = name !== data?.project.name
    || left !== data?.project.left
    || right !== data?.project.right
    || dirtyData.equations.length > 0
    || dirtyData.responses.length > 0;
  unstable_usePrompt({
    when: dirty,
    message: 'You have unsaved changes. Are you sure you want to go?'
  });
  const [updateProject, { loading: loadingUpdate }] = useMutation(UPDATE_PROJECT, {
    onError: (e) => {
      console.error(e);
      alert('Failed to save project. Please try again in a moment.');
    },
    onCompleted: () => dispatch({ type: 'reset' }),
    variables: {
      id: id,
      name: name,
      left: left,
      right: right,
      equations: dirtyData.equations,
      responses: dirtyData.responses
    },
    refetchQueries: ['GetProject']
  });
  const [newEquation, { loading: loadingNewEq }] = useMutation(ADD_EQUATION, {
    onError: (e) => {
      console.error(e);
      alert('Failed to make new equation. Please try again in a moment.');
    },
    variables: { id: id },
    refetchQueries: ['GetProject']
  });
  const [newResponse, { loading: loadingNewRes }] = useMutation(ADD_RESPONSE, {
    onError: (e) => {
      console.error(e);
      alert('Failed to add new response. Please try again in a moment.');
    },
    variables: { id: id },
    refetchQueries: ['GetProject']
  });

  const onClickSave = useCallback(() => {
    if (loadingUpdate) return;
    updateProject();
  }, [updateProject, loadingUpdate]);

  const onClickNewEq = useCallback(() => {
    if (loadingNewEq) return;
    newEquation();
  }, [newEquation, loadingNewEq]);

  const onClickNewRes = useCallback(() => {
    if (loadingNewRes) return;
    newResponse();
  }, [newResponse, loadingNewRes]);

  const onClickExport = useCallback(() => {
    user?.getIdToken().then(token =>
      window.open(
        `${process.env.REACT_APP_BACKEND}export/${data?.project._id}?token=${token}`,
        '_blank'
      )
    );
  }, [user, data?.project._id])

  useEffect(() => {
    const leaveListener = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      return e.returnValue = "You have unsaved changes. Are you sure you want to go?";
    };
    const saveListener = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key ==='s') {
        e.preventDefault();
        updateProject();
      }
    };
    addEventListener('keydown', saveListener);
    const cleanups = [
      () => removeEventListener('keydown', saveListener)
    ];
    if (dirty) {
      addEventListener('beforeunload', leaveListener, true);
      cleanups.push(() => removeEventListener('beforeunload', leaveListener, true));
    }
    return () => cleanups.forEach(f => f());
  }, [dirty])

  if (loading || error)
    return <WaitForData loading={loading} error={error} />;

  const equationComps = data.project.equations.map((e: NamedText) =>
    <ProjectEquation key={e._id} equation={e} pid={id} dispatch={dispatch} />);
  const responseComps = data.project.responses.map((e: NamedText) =>
    <ProjectResponse key={e._id} response={e} pid={id} dispatch={dispatch}/>);

  return (
    <div className="container">
      <section className="section">
        <div className="level">
          <div className="level-item">
            <h1 className="title">
              {renaming
              ? <input type="text" className="input" value={name}
                  onChange={(e) => setName(e.target.value)} />
              : name }
            </h1>
          </div>
        </div>
        <div className="level">
          <div className="level-item">
            <button className="button" onClick={() => setRenaming(true)}>Rename</button>
            <button className={`button${loadingUpdate ? ' is-loading' : ''}${dirty ? ' is-link' : ''}`}
              onClick={onClickSave}>Save</button>
            <button onClick={onClickExport} className="button">Export</button>
          </div>
        </div>
        <div className="columns">
          <div className="column">
            <label className="label">
              Author
              <input type="text" className="input" value={left}
                onChange={(e) => setLeft(e.target.value)}/>
            </label>
            <button className={`button${loadingNewEq ? ' is-loading' : ''}`} onClick={onClickNewEq}>New Equation</button>
            {equationComps}
          </div>
          <div className="column">
            <label className="label">
              Header Right
              <input type="text" className="input" value={right}
                onChange={(e) => setRight(e.target.value)}/>
            </label>
            <button className={`button${loadingNewRes ? ' is-loading' : ''}`} onClick={onClickNewRes}>New Response</button>
            {responseComps}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProjectEditor;
