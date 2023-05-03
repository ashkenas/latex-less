import { useMutation, useQuery } from '@apollo/client';
import { AnyMxRecord } from 'dns';
import { useCallback, useEffect, useReducer, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ADD_EQUATION, ADD_RESPONSE, GET_PROJECT, UPDATE_PROJECT } from '../queries';
import '../styles/ProjectEditor.scss';
import { NamedText } from '../typings/gql';
import ProjectEquation from './ProjectEquation';
import ProjectResponse from './ProjectResponse';
import WaitForData from './WaitForData';

const objReducer = (state: any, obj: NamedText) =>
  ({ ...state, [obj._id]: obj });

const ProjectEditor: React.FC = () => {
  const [renaming, setRenaming] = useState(false)
  const [name, setName] = useState('');
  const [equations, eCollector] = useReducer(objReducer, {});
  const [responses, rCollector] = useReducer(objReducer, {});
  const [dirty, setDirty] = useReducer((isDirty: boolean, dirty?: boolean) =>
    dirty === undefined ? false : isDirty || dirty, false);
  const { id } = useParams();
  const { data, loading, error } = useQuery(GET_PROJECT, {
    onCompleted: (d) => {
      setRenaming(false);
      setName(d.project.name);
    },
    variables: { id: id }
  });
  const [updateProject, { loading: loadingUpdate }] = useMutation(UPDATE_PROJECT, {
    onError: (e) => {
      console.error(e);
      alert('Failed to save project. Please try again in a moment.');
    },
    onCompleted: (d) => setDirty(),
    variables: {
      id: id,
      name: name,
      equations: equations,
      responses: responses
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
    console.log(equations, responses);
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

  useEffect(() => {
    const listener = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      return e.returnValue = "You have unsaved changes. Are you sure you want to go?";
    };
    if (dirty) {
      addEventListener('beforeunload', listener, true);
      return () => removeEventListener('beforeunload', listener, true);
    }
  }, [dirty])

  if (loading || error)
    return <WaitForData loading={loading} error={error} />;

  return (
    <div className="container">
      <div className="level">
        <div className="level-item">
          <h1 className="title">
            {renaming
            ? <input type="text" onChange={(e) => setName(e.target.value)} value={name} />
            : name }
          </h1>
        </div>
      </div>
      <div className="level">
        <div className="level-item">
          <button className="button" onClick={() => setRenaming(true)}>Rename</button>
          <button className={`button${loadingUpdate ? ' is-loading' : ''}${dirty ? ' is-link' : ''}`}
            onClick={onClickSave}>Save</button>
        </div>
      </div>
      <div className="columns">
        <div className="column">
          <button className={`button${loadingNewEq ? ' is-loading' : ''}`} onClick={onClickNewEq}>New Equation</button>
          {data.project.equations.map((e: NamedText) =>
            <ProjectEquation key={e._id} equation={e} pid={id} collector={eCollector} isDirty={setDirty} />)}
        </div>
        <div className="column">
          <button className={`button${loadingNewRes ? ' is-loading' : ''}`} onClick={onClickNewRes}>New Response</button>
          {data.project.responses.map((e: NamedText) =>
            <ProjectResponse key={e._id} response={e} pid={id} collector={rCollector} isDirty={setDirty} />)}
        </div>
      </div>
    </div>
  );
};

export default ProjectEditor;
