"use client"
import EmptyState from "components/EmptyState/EmptyState"
import Loading from "components/Loading/Loading"
import { useIsAdmin } from "lib/admin"
import { useUser } from "lib/auth"
import Link from "next/link"
import React from "react"
import styles from "./AdminGuard.module.scss"

// Only steers the UI. The write access itself is enforced by database.rules.json.
const AdminGuard = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useUser()
  const isAdmin = useIsAdmin()

  if (loading || (user && isAdmin === null)) return <Loading />

  if (!user) {
    return (
      <EmptyState
        text="Melde dich an, um die Vorlagen zu pflegen."
        action={<Link href="/auth" className="btn btn-primary">Anmelden</Link>}
      />
    )
  }

  if (!isAdmin) {
    return (
      <>
        <EmptyState text="Dafür brauchst du Admin-Rechte." />
        <p className={styles.setup}>
          Admin wird, wer in der Firebase-Konsole unter <code>admins/{user.uid}</code> den Wert{" "}
          <code>true</code> eingetragen hat.
        </p>
      </>
    )
  }

  return <>{children}</>
}

export default AdminGuard
