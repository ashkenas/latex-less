import { BrowserRouter, Route, Routes } from 'react-router-dom';
import styles from '../styles/App.module.scss';
import Equations from './Equations';
import ErrorPage from './ErrorPage';
import Home from './Home';
import Project from './Project';
import SmartLink from './SmartLink';

function App() {
  return (
    <BrowserRouter>
      <nav>
        <div className={styles.right}>
          <SmartLink to="/">Home</SmartLink>
          <SmartLink to="/equations">Equations</SmartLink>
        </div>
        <div className={styles.left}>
          <SmartLink to="/logout">Logout</SmartLink>
        </div>
      </nav>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/equations" element={<Equations />} />
          <Route path="/project/:id" element={<Project />} />
          <Route path="*" element={<ErrorPage code={404} message='Page not found.' />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
