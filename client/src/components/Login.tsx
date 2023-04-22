import { GoogleAuthProvider } from "firebase/auth";
import { StyledFirebaseAuth } from "react-firebaseui";
import auth from "../firebase/Firebase";

const config = {
  signInFlow: 'popup',
  signInOptions: [
    GoogleAuthProvider.PROVIDER_ID
  ]
};

export default function Login() {
  return <StyledFirebaseAuth uiConfig={config} firebaseAuth={auth} />;
};
