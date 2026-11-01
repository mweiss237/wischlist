"use client"
import { useDialog } from "components/Dialog/Dialog"
import { useUser } from "lib/auth"
import { useList } from "lib/list"
import { useRouter } from "next/navigation"
import { useEffect, useRef } from "react"

/**
 * Same access check as the list editor: only the owner may use the pages below `/list/[listId]`.
 * Sends other accounts back to `/list`. `isOwner` is false while loading and when signed out.
 */
export const useOwnerGuard = (listId: string) => {
  const router = useRouter()
  const dialog = useDialog()
  const { user, loading } = useUser()
  const { list } = useList(listId)

  // the dialog is not blocking, so the effect could fire again before the redirect is done
  const isRedirecting = useRef(false)

  useEffect(() => {
    if (!isRedirecting.current && !loading && user !== null && list && user.uid !== list.userId) {
      isRedirecting.current = true
      router.replace("/list")
      dialog.alert("Diese Liste gehört einem anderen Account.", { title: "Kein Zugriff" })
    }
  }, [user, list, router, loading, dialog])

  const isOwner = !!user && !!list && user.uid === list.userId

  return { user, loading, list, isOwner }
}
