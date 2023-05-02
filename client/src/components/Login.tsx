import { GithubAuthProvider, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import auth from "../firebase/Firebase";
import "../styles/Login.scss";

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();


export default function Login() {
  
  return (
    <div className="center-center">
      <h1 className="title is-1">LaTeXLess</h1>
      <button className="social-btn" onClick={() => signInWithPopup(auth, googleProvider)}>
        <img src="/img/google-signin.svg" alt="Sign in with Google"/>
        Sign in with Google
      </button>
      <button className="social-btn" onClick={() => signInWithPopup(auth, githubProvider)}>
        <img src="/img/github-mark.png" alt="Sign in with GitHub"/>
        Sign in with GitHub
      </button>
    </div>
  );
};
