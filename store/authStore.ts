"use client";

import { AuthUser } from "@/components/api/type";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  currentUser: AuthUser | null;
  setCurrentUser: (user: AuthUser | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      currentUser: null,

      setCurrentUser: (user) => set({ currentUser: user }),

      logout: () => {
        set({ currentUser: null });
        
        // Clear storage only on client-side
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem("auth-storage");
          
          // Clear cookies on logout
          document.cookie = "accessToken=; Max-Age=0; path=/;";
          document.cookie = "refreshToken=; Max-Age=0; path=/;";
        }
      },
    }),
    {
      name: "auth-storage",
      storage: {
        getItem: (name) => {
          if (typeof window === 'undefined') return null;
          const item = sessionStorage.getItem(name);
          return item ? JSON.parse(item) : null;
        },
        setItem: (name, value) => {
          if (typeof window === 'undefined') return;
          sessionStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          if (typeof window === 'undefined') return;
          sessionStorage.removeItem(name);
        },
      },
    }
  )
);
