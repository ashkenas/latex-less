import { useMutation, useQuery } from '@apollo/client';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { GET_PROJECT, UPDATE_PROJECT } from '../queries';
import '../styles/Project.css';
import { NamedText } from '../typings/gql';
import ProjectEquation from './ProjectEquation';
import WaitForData from './WaitForData';

const collector = (array: NamedText[]) =>
  (id: string, name: string, text: string) =>
    array.push({
      _id: id,
      name: name,
      text: text
    });

const ProjectEditor: React.FC = () => {
  const [renaming, setRenaming] = useState(false)
  const [name, setName] = useState('');
  const { id } = useParams();
  const { data, loading, error } = useQuery(GET_PROJECT, {
    onCompleted: (d) => {
      setRenaming(false);
      setName(d.project.name);
    },
    variables: { id: id }
  });
  const equations: NamedText[] = [];
  const responses: NamedText[] = [];
  const eCollector = collector(equations);
  const rCollector = collector(responses);
  const [updateProject, { loading: loadingUpdate }] = useMutation(UPDATE_PROJECT, {
    variables: {
      id: id,
      name: name,
      equations: equations,
      responses: responses
    },
    refetchQueries: ['GetProject']
  });


  if (loading || error)
    return <WaitForData loading={loading} error={error} />;

  return (
    <div className="container">
      <div className="level">
        <div className="level-item">
          <h1>
            {renaming
            ? <input type="text" onChange={(e) => setName(e.target.value)} value={name} />
            : name }
          </h1>
        </div>
        <div className="level-item">
          <button className="button" onClick={() => setRenaming(true)}>Rename</button>
        </div>
        <div className="level-item">
          <button className={`button${loadingUpdate ? ' is-loading' : ''}`}
            onClick={() => updateProject()}>Save</button>
        </div>
      </div>
      <div className="columns">
        <div className="column">
          {data.project.equations.map((e: NamedText) =>
            <ProjectEquation key={e._id} equation={e} pid={id} collector={eCollector} />)}
        </div>
        <div className="column">

        </div>
      </div>
    </div>
  );
};

export default ProjectEditor;
