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
  const [saveNow, setSaveNow] = useState<NodeJS.Timeout | null>(null);
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
    onCompleted: () => {
      if (saveNow)
        clearTimeout(saveNow);
      setSaveNow(setTimeout(() => setSaveNow(null), 30000));
    },
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
    const badEquation = dirtyData.equations.find(e => (/[{}]/g).test(e.name));
    if (badEquation)
      return alert(`Equation names cannot have braces in them.
Violated by equation '${badEquation.name}'`)
    updateProject();
  }, [updateProject, loadingUpdate, dirtyData]);

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
      } else if ((e.ctrlKey || e.metaKey) && e.key ==='p') {
        e.preventDefault();
        onClickExport();
      }
    };
    addEventListener('keydown', saveListener, true);
    const cleanups = [
      () => removeEventListener('keydown', saveListener, true)
    ];
    if (dirty) {
      addEventListener('beforeunload', leaveListener, true);
      cleanups.push(() => removeEventListener('beforeunload', leaveListener, true));
    }
    return () => cleanups.forEach(f => f());
  }, [dirty, onClickExport, updateProject])

  if (loading || error)
    return <WaitForData loading={loading} error={error} />;

  const equationComps = data.project.equations.map((e: NamedText) =>
    <ProjectEquation key={e._id} equation={e} pid={id} dispatch={dispatch} />);
  const responseComps = data.project.responses.map((e: NamedText) =>
    <ProjectResponse key={e._id} response={e} pid={id} dispatch={dispatch}/>);

  if (!saveNow) updateProject();

  return (
    <div className="container is-fluid">
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
              <h2 className="title is-4">Using Equations</h2>
              <p>
                Build all the equations you would like to use in the middle
                column. When you've finished an equation, you can use it in
                a response by embbedding its name in curly braces. Equation
                names are case-insensitive.
              </p>
              <p>
                To use an equation in-line, use two curly braces like so:
                &nbsp;<code>{"{{name}}"}</code>
              </p>
              <p>
                To use an equation on its own line, use three curly braces
                like so: <code>{"{{{name}}}"}</code>
              </p>
              <p>
                If you mismatch the number of braces, or there's no
                equation with the name you used, the placeholder will show
                up in the final document.
              </p>
              <h2 className="title is-4">Commands</h2>
              <p>
                Most LaTeX symbol commands can be used by typing a backslash
                (\) followed by the command and then pressing space.
                However, the symbols in the table below and operators work
                without the backslash for your convenience and reference.
              </p>
              <p>
                If you would like to insert non-italic text into an equation,
                type a backslash (\), the text you want, and then a space.
              </p>
              <table>
                <thead>
                  <tr>
                    <th>Command(s)</th>
                    <th>Result</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>bar</td><td>Puts a bar above text.</td></tr>
                  <tr><td>sqrt</td><td>Inserts a square root snippet.</td></tr>
                  <tr><td>sum</td><td>Inserts a summation snippet. (&Sigma;)</td></tr>
                  <tr><td>prod</td><td>Inserts a product snippet. (&Pi;)</td></tr>
                  <tr><td>int</td><td>Inserts an integral snippet.</td></tr>
                  <tr><td>infty</td><td>Inserts an infinity symbol. (&infin;)</td></tr>
                  <tr><td>approx</td><td>Inserts an approximately equal symbol. (&asymp;)</td></tr>
                  <tr><td>angle</td><td>Inserts an angle symbol. (&ang;)</td></tr>
                  <tr><td>and</td><td>Inserts a conjunction symbol. (&and;)</td></tr>
                  <tr><td>or</td><td>Inserts a disjunction symbol. (&or;)</td></tr>
                  <tr><td>alpha/beta/...</td><td>Inserts an lowercase greek letter (&alpha;/&beta;/...).</td></tr>
                  <tr><td>Omega</td><td>Inserts capital Omega (&Omega;).</td></tr>
                  <tr><td>Pi</td><td>Inserts capital Pi (&Pi;).</td></tr>
                  <tr><td>Sigma</td><td>Inserts capital Sigma (&Sigma;).</td></tr>
                  <tr><td>langle</td><td>Inserts a left angle bracket.</td></tr>
                  <tr><td>rangle</td><td>Inserts a right angle bracket.</td></tr>
                  <tr><td>neq</td><td>Inserts a not equal symbol (&ne;).</td></tr>
                  <tr><td>cdot</td><td>Inserts a times symbol (&middot;).</td></tr>
                  <tr><td>ll</td><td>Inserts a much less than symbol (&#8810;).</td></tr>
                  <tr><td>gg</td><td>Inserts a much greater than symbol (&#8811;).</td></tr>
                  <tr><td>geq</td><td>Inserts a greater than or equal to symbol (&ge;).</td></tr>
                  <tr><td>leq</td><td>Inserts a less than or equal to symbol (&le;).</td></tr>
                  <tr><td>otimes</td><td>Inserts this thing: &otimes;.</td></tr>
                  <tr><td>sin</td><td>Inserts a sin operator.</td></tr>
                  <tr><td>cos</td><td>Inserts a cos operator.</td></tr>
                  <tr><td>tan</td><td>Inserts a tan operator.</td></tr>
                  <tr><td>mod</td><td>Inserts a mod operator.</td></tr>
                </tbody>
              </table>
          </div>
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
