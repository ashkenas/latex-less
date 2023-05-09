import React, { useState, useEffect, PropsWithChildren } from 'react';
import firebase from 'firebase/auth';
import auth from './Firebase';
import { useApolloClient } from '@apollo/client';

type AuthProviderState = {
  currentUser: firebase.User | null,
  loadingUser: boolean
};

export const AuthContext = React.createContext<firebase.User | null>(null);

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [state, setState] = useState<AuthProviderState>({
    currentUser: null,
    loadingUser: true
  });
  const apolloClient = useApolloClient();

  useEffect(() => {
    if (state.currentUser)
      apolloClient.refetchQueries({
        include: ['GetEquations', 'GetProjects', 'GetProject']
      });
    return auth.onAuthStateChanged((user) => {
      setState({
        currentUser: user,
        loadingUser: false
      });
    });
  }, [apolloClient, state.currentUser]);

  if (state.loadingUser)
    return <div className='spinner'></div>;

  return (
    <AuthContext.Provider value={state.currentUser}>
      {children}
    </AuthContext.Provider>
  );
};
