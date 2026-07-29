"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import type { Role } from "@/lib/roles";

export type UserProfile = {
  nome: string;
  email: string;
  role: Role;
  congregacaoId: string | null;
  ativo: boolean;
};

type AuthContextValue = {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  profile: null,
  loading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (!firebaseUser) {
        setProfile(null);
        setLoading(false);
      }
    });
    return unsubAuth;
  }, []);

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    const unsubProfile = onSnapshot(doc(db, "usuarios", user.uid), (snap) => {
      if (!snap.exists()) {
        setProfile(null);
        setLoading(false);
        return;
      }
      const data = snap.data();
      if (data.ativo === false) {
        signOut(auth);
        setProfile(null);
        setLoading(false);
        return;
      }
      setProfile({
        nome: data.nome,
        email: data.email,
        role: data.role,
        congregacaoId: data.congregacaoId ?? null,
        ativo: data.ativo ?? true,
      });
      setLoading(false);
    });

    return unsubProfile;
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, profile, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
