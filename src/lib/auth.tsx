"use client"

import { auth, database } from "lib/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User,
  signInWithEmailLink,
  updateProfile,
  sendPasswordResetEmail,
  sendSignInLinkToEmail,
  fetchSignInMethodsForEmail,
  isSignInWithEmailLink,
  deleteUser
} from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { equalTo, get, orderByChild, query, ref, update } from "firebase/database";
import React, { createContext, PropsWithChildren, useCallback, useContext, useEffect, useState } from "react";
import _ from "lodash";

// Firebase refuses sensitive actions after roughly 5 minutes, stay below that
const RECENT_LOGIN_MS = 4 * 60 * 1000

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
  }, [setLoading])

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

  }, [user])

  /**
   * Deletes lists, their entries and favorites in one atomic update, then the account itself.
   * deleteUser() only works shortly after a login, so that is checked up front. Otherwise the
   * data would be gone while the account stays. Rejects with `auth/requires-recent-login` then.
   */
  const deleteAccount = useCallback(async () => {
    // `user` is a deep clone (see AuthProvider), the SDK calls need the real instance
    const current = auth.currentUser
    if (!user || !current) return

    const { authTime } = await current.getIdTokenResult()
    if (Date.now() - new Date(authTime).getTime() > RECENT_LOGIN_MS)
      throw new FirebaseError("auth/requires-recent-login", "Login too old to delete the account")

    const snapshot = await get(query(ref(database, "lists"), orderByChild("userId"), equalTo(user.uid)))
    const updates: Record<string, null> = { [`favorites/${user.uid}`]: null }
    snapshot.forEach((list) => {
      updates[`lists/${list.key}`] = null
      updates[`entries/${list.key}`] = null
    })
    await update(ref(database), updates)

    await deleteUser(current)
  }, [user])

  return {
    user,
    loading,
    updateUserName,
    deleteAccount
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

  const sendLoginLink = (email: string, continueURL = window.location.href) => sendSignInLinkToEmail(auth, email, { url: continueURL, handleCodeInApp: true })
  const checkLoginLink = React.useCallback(() => isSignInWithEmailLink(auth, window.location.href), [])
  const signInWithLink = React.useCallback(async (email: string) => {
    if (checkLoginLink())
      await signInWithEmailLink(auth, email)
  }, [checkLoginLink])

  const checkUserExists = async (email: string) => await fetchSignInMethodsForEmail(auth, email)



  const resetPassword = async (email: string) =>
    await sendPasswordResetEmail(auth, email)


  return {
    login,
    sendLoginLink,
    signInWithLink,
    checkLoginLink,
    logout,
    register,
    resetPassword,
    checkUserExists,
  }
}