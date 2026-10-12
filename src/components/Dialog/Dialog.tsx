"use client"

import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import styles from "./Dialog.module.scss"

interface DialogOptions {
  title?: string
  confirmLabel?: string
  cancelLabel?: string
  // destructive questions get a berry button and start focused on "Abbrechen"
  danger?: boolean
}

interface DialogRequest {
  kind: "alert" | "confirm"
  message: string
  options: DialogOptions
  resolve: (confirmed: boolean) => void
}

interface DialogContextValue {
  alert: (message: string, options?: DialogOptions) => Promise<void>
  confirm: (message: string, options?: DialogOptions) => Promise<boolean>
}

const DialogContext = createContext<DialogContextValue>({
  alert: async () => { return },
  confirm: async () => false,
})

// replaces window.alert and window.confirm with a modal in the style of the page
export const DialogProvider = ({ children }: PropsWithChildren) => {
  // several requests at once are shown one after another
  const [queue, setQueue] = useState<DialogRequest[]>([])
  const current = queue[0]

  const dialogRef = useRef<HTMLDialogElement>(null)
  const confirmRef = useRef<HTMLButtonElement>(null)
  const cancelRef = useRef<HTMLButtonElement>(null)

  const open = useCallback((kind: DialogRequest["kind"], message: string, options: DialogOptions = {}) =>
    new Promise<boolean>((resolve) => setQueue((requests) => [...requests, { kind, message, options, resolve }]))
    , [])

  const alert = useCallback(async (message: string, options?: DialogOptions) => {
    await open("alert", message, options)
  }, [open])

  const confirm = useCallback((message: string, options?: DialogOptions) => open("confirm", message, options), [open])

  // stable, so useDialog() is safe in effect and callback dependencies
  const value = useMemo(() => ({ alert, confirm }), [alert, confirm])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (!current) {
      if (dialog.open) dialog.close()
      return
    }

    if (!dialog.open) dialog.showModal()
    const initialFocus = current.kind === "confirm" && current.options.danger ? cancelRef : confirmRef
    initialFocus.current?.focus()
  }, [current])

  const close = (confirmed: boolean) => {
    if (!current) return
    current.resolve(confirmed)
    setQueue((requests) => requests.slice(1))
  }

  const isConfirm = current?.kind === "confirm"
  const isDanger = isConfirm && !!current?.options.danger
  const title = current?.options.title || (isConfirm ? "Bist du sicher?" : "Hinweis")

  return (
    <DialogContext.Provider value={value}>
      {children}
      <dialog
        ref={dialogRef}
        className={styles.dialog}
        aria-labelledby="dialog-title"
        aria-describedby="dialog-message"
        onCancel={(event) => {
          // Escape: keep the state in charge of closing
          event.preventDefault()
          close(false)
        }}
        onClick={(event) => {
          // a click on the backdrop lands on the dialog element itself
          if (event.target === event.currentTarget) close(false)
        }}
      >
        {current ? (
          <div className={styles.content}>
            {/* a note put down on the table and taped, destructive questions get a warning stamp */}
            <span className={`tape ${styles.tape}`} aria-hidden />
            {isDanger ? <span className={`stamp stamp-berry ${styles.stamp}`} aria-hidden>Achtung</span> : null}
            <h2 id="dialog-title" className={styles.title}>{title}</h2>
            <p id="dialog-message" className={styles.message}>{current.message}</p>
            <div className={styles.actions}>
              {isConfirm ? (
                <button ref={cancelRef} type="button" className="btn btn-ghost" onClick={() => close(false)}>
                  {current.options.cancelLabel || "Abbrechen"}
                </button>
              ) : null}
              <button
                ref={confirmRef}
                type="button"
                className={`btn btn-primary ${isDanger ? styles.dangerButton : ""}`}
                onClick={() => close(true)}
              >
                {current.options.confirmLabel || (isConfirm ? "Ja" : "Okay")}
              </button>
            </div>
          </div>
        ) : null}
      </dialog>
    </DialogContext.Provider>
  )
}

export const useDialog = () => useContext(DialogContext)
