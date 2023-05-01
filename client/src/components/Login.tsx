import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import auth from "../firebase/Firebase";
import "../styles/Login.scss";

const gProvider = new GoogleAuthProvider();


export default function Login() {
  
  return (
    <section className="section">
      <div className="container">
        <button className="google-btn" onClick={() => signInWithPopup(auth, gProvider)}>
          <img src="/img/btn_google_signin_light_normal_web@2x.png" alt="Google sign-in"/>
        </button>
      </div>
    </section>
  );
};
