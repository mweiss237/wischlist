"use client"

import { auth, storage } from "lib/firebase";
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
  isSignInWithEmailLink
} from "firebase/auth"
import React, { createContext, PropsWithChildren, useCallback, useContext, useEffect, useState } from "react";
import _ from "lodash";
import { getDownloadURL, ref, uploadBytes, deleteObject } from "firebase/storage";


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

  const updateProfilePicture = useCallback(async (file: File) => {
    if (!user) return

    const storageRef = ref(storage, `uploads/${file.name}`);

    try {
      const snapshot = await uploadBytes(storageRef, file);
      const photoURL = await getDownloadURL(snapshot.ref);

      await updateProfile(user, {
        photoURL,
      })

      await deleteObject(storageRef)

    } catch (error) {
      console.error("Error uploading file:", error);
    }

    return await user.reload()

  }, [user, user?.displayName])

  return {
    user,
    loading,
    updateProfilePicture,
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

  const sendLoginLink = (email: string, continueURL = window.location.href) => sendSignInLinkToEmail(auth, email, { url: continueURL, handleCodeInApp: true })
  const checkLoginLink = React.useCallback(() => isSignInWithEmailLink(auth, window.location.href), [isSignInWithEmailLink, auth])
  const signInWithLink = React.useCallback(async (email: string) => {
    if (checkLoginLink())
      await signInWithEmailLink(auth, email)
  }, [checkLoginLink, signInWithEmailLink, auth])

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