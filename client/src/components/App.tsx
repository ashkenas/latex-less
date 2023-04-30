import { useContext } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthContext } from '../firebase/Auth';
import styles from '../styles/App.module.scss';
import Equations from './Equations';
import ErrorPage from './ErrorPage';
import Home from './Home';
import Login from './Login';
import Project from './Project';
import SmartLink from './SmartLink';
import auth from '../firebase/Firebase';
import Projects from './Projects';

function App() {
  const user = useContext(AuthContext);
  if (!user)
    return <Login />;

  return (
    <BrowserRouter>
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
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/equations" element={<Equations />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<Project />} />
          <Route path="*" element={<ErrorPage code={404} message='Page not found.' />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
