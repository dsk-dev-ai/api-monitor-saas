import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name?: string | null;
  avatar?: string | null;
  subscription?: {
    plan: string;
    status: string;
  };
  monitorCount?: number;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: true,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),
      setLoading: (loading) => set({ isLoading: loading }),
      logout: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        set({ user: null, isAuthenticated: false, isLoading: false });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user }),
    }
  )
);
