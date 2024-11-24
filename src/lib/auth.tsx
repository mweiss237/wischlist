"use client"

import { auth } from "lib/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User,
  updateProfile,
  sendPasswordResetEmail,
  fetchSignInMethodsForEmail
} from "firebase/auth"
import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useState } from "react";
import _ from "lodash";


const AuthContext = createContext<{ user: User | null, loading: boolean }>({ user: null, loading: false })

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((updatedUser) => {
      setUser(updatedUser);
      setLoading(false);
    });
    const unsubscribeToken = auth.onIdTokenChanged(updatedUser => {
      // `updatedUser` appears to be a reference of user
      // so setting the updatedUser is not trigger a rerender
      // cloning the object removes the reference and it triggers again 
      const clone = _.cloneDeep(updatedUser)

      setUser(clone)
    })
    return () => {
      unsubscribe()
      unsubscribeToken()
    };
  }, [auth, setLoading])

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}


/**
 * Custom hook to provide user.
 */
export const useUser = () => {
  const { user, loading } = useContext(AuthContext)

  const updateUserName = useCallback(async (displayName: string) => {
    if (!user) return

    await updateProfile(user, {
      displayName,
    })

    return await user.reload()

  }, [user, user?.displayName])

  return {
    user,
    loading,
    updateUserName
  }
}

/**
 * 
 * @returns 
 */
export const useAuth = () => {
  const login = async (email: string, password: string) =>
    await signInWithEmailAndPassword(auth, email, password)

  const logout = async () =>
    await signOut(auth)

  const register = async (email: string, password: string, displayName: string) => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(user, {
      displayName
    })
    return await user.reload()
  }

  const checkUserExists = async (email: string) => await fetchSignInMethodsForEmail(auth, email)



  const resetPassword = async (email: string) =>
    await sendPasswordResetEmail(auth, email)


  return {
    login,
    logout,
    register,
    resetPassword,
    checkUserExists,
  }
}