import create from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  userUid: string | null;
  empresaUid: string | null;
  setAuth: (userUid: string, empresaUid: string) => void;
  clearAuth: () => void;
}

const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      userUid: null,
      empresaUid: null,
      setAuth: (userUid, empresaUid) => set({ userUid, empresaUid }),
      clearAuth: () => set({ userUid: null, empresaUid: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);

export default useAuth;