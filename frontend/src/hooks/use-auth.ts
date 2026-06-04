'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { api } from '@/lib/api-client';
import { supabase } from '@/lib/supabase-client';

export function useAuth() {
  const { user, isAuthenticated, isLoading, setUser, setLoading, logout } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');

      if (!token) {
        setLoading(false);
        return;
      }

      const { data } = await api.get('/auth/me');
      setUser(data.user);
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  }, [logout, setLoading, setUser]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      const { data, error: supabaseError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (supabaseError) throw supabaseError;

      localStorage.setItem('access_token', data.session?.access_token || '');
      localStorage.setItem('refresh_token', data.session?.refresh_token || '');

      const { data: userData } = await api.get('/auth/me');
      setUser(userData.user);

      return { success: true };
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
      return { success: false, error: err.message };
    }
  };

  const signUp = async (email: string, password: string, name?: string) => {
    try {
      setError(null);
      const { data, error: supabaseError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
      });

      if (supabaseError) throw supabaseError;

      return { success: true, message: 'Check your email to verify your account' };
    } catch (err: any) {
      setError(err.message || 'Failed to sign up');
      return { success: false, error: err.message };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    logout();
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
