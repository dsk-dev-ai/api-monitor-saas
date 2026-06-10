'use client';

import { useState, useCallback } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { api } from '@/lib/api-client';
import { supabase } from '@/lib/supabase-client';

export function useAuth() {
const {
user,
isAuthenticated,
isLoading,
setUser,
setLoading,
logout,
} = useAuthStore();

const [error, setError] = useState<string | null>(null);

const checkAuth = useCallback(async () => {
    try {
      // Already authenticated, skip duplicate request
      if (user && isAuthenticated) {
        return;
      }

      const token = localStorage.getItem('access_token');

      if (!token) {
        logout();
        return;
      }

      setLoading(true);

      const { data } = await api.get('/auth/me');

      if (data?.user) {
        setUser(data.user);
      } else {
        logout();
      }
    } catch (err) {
      console.error('Auth check failed:', err);
      logout();
    } finally {
      setLoading(false);
    }
}, [
user,
isAuthenticated,
logout,
setLoading,
setUser,
]);

const signIn = async (email: string, password: string) => {
  try {
    setError(null);

    const { data, error: supabaseError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (supabaseError) {
      throw supabaseError;
    }

    if (!data.session) {
      throw new Error('No session returned');
    }

    localStorage.setItem('access_token', data.session.access_token);
    localStorage.setItem('refresh_token', data.session.refresh_token);

    const { data: userData } = await api.get('/auth/me');

    if (!userData?.user) {
      throw new Error('Failed to load user profile');
    }

    setUser(userData.user);

    return { success: true };
  } catch (err: any) {
    const message = err?.message || 'Failed to sign in';
    setError(message);
    return { success: false, error: message };
  }
};

const signUp = async (email: string, password: string, name?: string) => {
  try {
    setError(null);

    const { error: supabaseError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });

    if (supabaseError) {
      throw supabaseError;
    }

    return {
      success: true,
      message: 'Check your email to verify your account',
    };
  } catch (err: any) {
    const message = err?.message || 'Failed to sign up';
    setError(message);
    return { success: false, error: message };
  }
};

const signOut = async () => {
try {
await supabase.auth.signOut();
} finally {
logout();
}
};

return {
user,
isAuthenticated,
isLoading,
error,
signIn,
signUp,
signOut,
checkAuth,
};
}
