
// src/components/FetchAuthUser.tsx

import React from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { auth } from '../firebase';

/**
 * Custom hook that subscribes to Firebase auth state and returns the current user (or null).
 */
const FetchAuthUser = (): firebase.User | null => {
  const [user, setUser] = React.useState<firebase.User | null>(null);

  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => setUser(u));
    return () => unsubscribe();
  }, []);

  return user;
};

export default FetchAuthUser;