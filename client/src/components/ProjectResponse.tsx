import { useMutation } from '@apollo/client';
import { Dispatch, useCallback, useEffect, useState } from 'react';
import { REM_RESPONSE } from '../queries';
import { NamedText } from '../typings/gql';
import { DirtyDataDispatchAction } from './ProjectEditor';

type ProjectResponseProps = {
  response: NamedText,
  pid?: string,
  dispatch: Dispatch<DirtyDataDispatchAction>
};

const ProjectResponse: React.FC<ProjectResponseProps> = ({ response, pid, dispatch }) => {
  const [res, setRes] = useState(response.text);
  const [name, setName] = useState(response.name);
  const [deleteResponse, { loading: loadingDel }] = useMutation(REM_RESPONSE, {
    onError: (e) => {
      console.error(e);
      alert('Failed to delete response. Please try again in a moment.');
    },
    variables: { pid: pid, id: response._id },
    refetchQueries: ['GetProject']
  });

  const onClickDel = useCallback(() => {
    if (loadingDel) return;
    if (confirm('Are you sure you want to delete this response?'))
      deleteResponse();
  }, [deleteResponse, loadingDel]);

  useEffect(() => {
    const dirty = res !== response.text || name !== response.name;
    if (dirty)
      dispatch({
        type: 'response',
        data: { _id: response._id, name, text: res }
    });
  }, [res, name, dispatch, response]);

  return (<>
    <label className="label" htmlFor={`qn${response._id}`}>Question Name</label>
    <div className="field has-addons">
      <div className="control is-expanded">
        <input className="input" type="text" value={name} id={`qn${response._id}`}
          onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="control">
        <input className="button is-danger" type="submit" onClick={onClickDel} value="Delete" />
      </div>
    </div>
    <div className="field">
      <label className="label" htmlFor={`qr${response._id}`}>Question Response</label>
      <div className="control">
        <textarea className="input" value={res} rows={5} id={`qr${response._id}`}
          onChange={(e) => setRes(e.target.value)}></textarea>
      </div>
    </div>
  </>);
};

export default ProjectResponse;
