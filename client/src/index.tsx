import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './components/App';
import { AuthProvider } from './firebase/Auth';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import auth from './firebase/Firebase';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import Equations from './components/Equations';
import ProjectEditor from './components/ProjectEditor';
import Projects from './components/Projects';
import Home from './components/Home';
import ErrorPage from './components/ErrorPage';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/" element={<Home />} />
      <Route path="/equations" element={<Equations />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/projects/:id" element={<ProjectEditor />} />
      <Route path="*" element={<ErrorPage code={404} message='Page not found.' />} />
    </Route>
  )
)

const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql',
});

const authLink = setContext(async (_, { headers }) => {
  const token = await auth.currentUser?.getIdToken();

  return {
    headers: {
      ...headers,
      authorization: token || ""
    }
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  // <React.StrictMode>
    <ApolloProvider client={client}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ApolloProvider>
  // </React.StrictMode>
);
