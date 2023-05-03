import { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import { AuthContext } from '../firebase/Auth';
import styles from '../styles/App.module.scss';
import Login from './Login';
import SmartLink from './SmartLink';
import auth from '../firebase/Firebase';

function App() {
  const user = useContext(AuthContext);
  if (!user)
    return <Login />;

  return (<>
    <nav>
      <div className={styles.right}>
        <SmartLink to="/">Home</SmartLink>
        <SmartLink to="/equations">Equations</SmartLink>
        <SmartLink to="/projects">Projects</SmartLink>
      </div>
      <div className={styles.left}>
        <button onClick={() => auth.signOut()}>Logout</button>
      </div>
    </nav>
    <main>
      <Outlet />
    </main>
  </>);
}

export default App;
