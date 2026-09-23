import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  companyName: string;
}

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isOnboarded: boolean;

  // Actions
  login: (email: string, name?: string) => void;
  register: (name: string, email: string, companyName: string) => void;
  completeOnboarding: (companyName: string, industry: string, dataSource: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: {
        id: 'usr-101',
        name: 'Aminat Shotade',
        email: 'aminat@acuitylabs.io',
        role: 'Chief Revenue Officer',
        companyName: 'Acuity Revenue Labs',
      },
      isAuthenticated: true,
      isOnboarded: true,

      login: (email, name) =>
        set({
          user: {
            id: `usr-${Date.now()}`,
            name: name || (email.split('@')[0].replace('.', ' ').toUpperCase()),
            email,
            role: 'Revenue Leader',
            companyName: 'Enterprise Org',
          },
          isAuthenticated: true,
          isOnboarded: true,
        }),

      register: (name, email, companyName) =>
        set({
          user: {
            id: `usr-${Date.now()}`,
            name,
            email,
            role: 'Chief Revenue Officer',
            companyName,
          },
          isAuthenticated: true,
          isOnboarded: false,
        }),

      completeOnboarding: (companyName, industry, dataSource) =>
        set((state) => ({
          user: state.user
            ? { ...state.user, companyName }
            : {
                id: `usr-${Date.now()}`,
                name: 'Executive User',
                email: 'leader@company.com',
                role: 'Revenue Leader',
                companyName,
              },
          isOnboarded: true,
          isAuthenticated: true,
        })),

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          isOnboarded: false,
        }),
    }),
    {
      name: 'revenue-rescue-auth-v1',
    }
  )
);
