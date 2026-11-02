"use client"
import React from "react"
import { useIsAdmin } from "lib/admin"
import { useAuth, useUser } from "lib/auth"
import { getAvatarUrl } from "lib/avatar"

import Image from "next/image"
import Link from "next/link"
import { Edit3, Gift, LogOut, Trash2 } from "react-feather"
import { useRouter } from "next/navigation"
import Loading from "components/Loading/Loading"
import { useDialog } from "components/Dialog/Dialog"
import styles from "./Profile.module.scss"

const Profile = () => {
  const { user, updateUserName, deleteAccount } = useUser()
  const [name, setName] = React.useState(user?.displayName || "")
  const { logout } = useAuth()
  const isAdmin = useIsAdmin()
  const router = useRouter()
  const dialog = useDialog()
  const [deleting, setDeleting] = React.useState(false)

  const handleLogout = async () => {
    await logout()
    router.push("/auth")
  }

  React.useEffect(() => {
    if (user?.displayName) setName(user.displayName)
  }, [user, setName])

  const handleChangeName: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setName(event.target.value)
  }

  const handleBlur: React.FocusEventHandler<HTMLInputElement> = () => {
    updateUserName(name)
  }

  const handleDeleteAccount = async () => {
    const confirmed = await dialog.confirm(
      "Dein Konto, alle deine Listen mit ihren Wünschen und deine Favoriten werden unwiderruflich gelöscht. Geteilte Links funktionieren danach nicht mehr.",
      { title: "Konto löschen?", confirmLabel: "Konto löschen", danger: true }
    )
    if (!confirmed) return

    setDeleting(true)
    try {
      await deleteAccount()
      router.push("/")
    } catch (error) {
      if ((error as { code?: string }).code === "auth/requires-recent-login") {
        await dialog.alert(
          "Zur Sicherheit musst du dich neu anmelden, bevor du dein Konto löschen kannst. Melde dich danach noch einmal an und versuche es erneut.",
          { title: "Bitte neu anmelden" }
        )
        await logout()
        router.push("/auth")
      } else {
        console.error("[auth] delete account", error)
        await dialog.alert("Das Konto konnte nicht gelöscht werden. Bitte versuche es später noch einmal.", {
          title: "Löschen fehlgeschlagen",
        })
      }
    } finally {
      setDeleting(false)
    }
  }

  if (!user) return <Loading />

  return (
    <div className={styles.container}>
      <header className="page_header">
        <h1>Profil</h1>
        <p>So stehst du als Absender auf deinen Listen.</p>
      </header>

      {/* the owner is a shipping label: sender, name, address */}
      <div className={`shipping_label ${styles.label}`}>
        <div className={styles.labelHead}>
          <span className="field_key">Absender</span>
          <span className="barcode" aria-hidden />
        </div>
        <div className={styles.labelBody}>
          <div className={styles.avatar}>
            <Image src={getAvatarUrl(user)} alt="" width="96" height="96" unoptimized />
          </div>

          <div className={styles.fields}>
            <label className="field" htmlFor="display-name">
              <span className="field_key">Name</span>
              <input
                id="display-name"
                type="text"
                className={`crit_textinput ${styles.nameInput}`}
                value={name}
                placeholder="Dein Name"
                onChange={handleChangeName}
                onBlur={handleBlur}
              />
            </label>
            <div className="field">
              <span className="field_key">E-Mail</span>
              <span className={`field_value ${styles.email}`}>{user.email}</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <Link href="/list" className="btn btn-primary">
          <Gift size={18} aria-hidden /> Meine Listen
        </Link>
        {isAdmin ? (
          <Link href="/admin/templates" className="btn btn-ghost">
            <Edit3 size={18} aria-hidden /> Vorlagen pflegen
          </Link>
        ) : null}
        <button type="button" className="btn btn-ghost" onClick={handleLogout}>
          <LogOut size={18} aria-hidden /> Ausloggen
        </button>
      </div>

      {/* what is below the perforation can be torn off for good */}
      <div className={`perforation ${styles.perforation}`} aria-hidden />
      <div className={styles.danger}>
        <p>Löscht dein Konto mit allen Listen, Wünschen und Favoriten endgültig.</p>
        <button type="button" className="btn btn-ghost btn-danger" onClick={handleDeleteAccount} disabled={deleting}>
          <Trash2 size={18} aria-hidden /> Konto löschen
        </button>
      </div>
    </div>
  )
}

export default Profile
