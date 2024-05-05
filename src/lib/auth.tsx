"use client"

import { auth } from "lib/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User } from "firebase/auth"
import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";


const AuthContext = createContext<{ user: User | null, loading: boolean }>({ user: null, loading: false })

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}


/**
 * Custom hook to provide authentication methods.
 */
export const useAuth = () => {
  const { user } = useContext(AuthContext)

  const login = async (email: string, password: string) =>
    await signInWithEmailAndPassword(auth, email, password)

  const logout = async () =>
    await signOut(auth)

  const register = async (email: string, password: string) =>
    await createUserWithEmailAndPassword(auth, email, password)


  return {
    user,
    login,
    logout,
    register,
  }
}
