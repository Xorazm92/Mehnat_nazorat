import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  role: string;
  organization: string;
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  loading: true,
  login: async (username: string, password: string) => {
    set({ loading: true });
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        set({
          user: data.user,
          isAuthenticated: true,
          loading: false,
        });
        localStorage.setItem('token', data.token);
      } else {
        set({ loading: false });
      }
    } catch (error) {
      set({ loading: false });
      console.error('Login xatosi:', error);
    }
  },
  logout: () => {
    set({
      user: null,
      isAuthenticated: false,
    });
    localStorage.removeItem('token');
  },
  setLoading: (loading: boolean) => set({ loading }),
}));
