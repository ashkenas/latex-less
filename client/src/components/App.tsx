import { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import { AuthContext } from '../firebase/Auth';
import Login from './Login';
import SmartLink from './SmartLink';
import auth from '../firebase/Firebase';
import '../styles/App.scss';

function App() {
  const user = useContext(AuthContext);
  if (!user)
    return <Login />;

  return (<>
    <nav className="navbar has-shadow" role="navigation" aria-label="navigation bar">
      <div className="navbar-menu">
        <div className="navbar-start">
          <SmartLink to="/">Home</SmartLink>
          <SmartLink to="/equations">Equations</SmartLink>
          <SmartLink to="/projects">Projects</SmartLink>
        </div>
        <div className="navbar-end">
          <button className="navbar-item" onClick={() => auth.signOut()}>Logout</button>
        </div>
      </div>
    </nav>
    <main>
      <Outlet />
    </main>
  </>);
}

export default App;
