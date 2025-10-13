
// src/components/FetchAuthUser.tsx

import React from 'react';
import { supabase } from '../config/supabase';
import type { User } from '@supabase/supabase-js';

/**
 * Custom hook that subscribes to Supabase auth state and returns the current user (or null).
 */
const FetchAuthUser = (): User | null => {
  const [user, setUser] = React.useState<User | null>(null);

  React.useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return user;
};

export default FetchAuthUser;