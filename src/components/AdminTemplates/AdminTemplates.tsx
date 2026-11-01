"use client"
import AdminGuard from "components/AdminGuard/AdminGuard"
import { useDialog } from "components/Dialog/Dialog"
import InlinePrompt from "components/InlinePrompt/InlinePrompt"
import Loading from "components/Loading/Loading"
import { addTemplate, useSuggestionCounts, useTemplates } from "lib/templates"
import Link from "next/link"
import { useRouter } from "next/navigation"
import React, { useState } from "react"
import { Plus } from "react-feather"
import styles from "./AdminTemplates.module.scss"

const AdminTemplatesContent = () => {
  const router = useRouter()
  const dialog = useDialog()
  const templates = useTemplates({ includeDrafts: true })
  const counts = useSuggestionCounts()
  const [creating, setCreating] = useState(false)

  const handleCreate = (title: string) => {
    setCreating(false)
    addTemplate({ title, published: false, position: templates?.length ?? 0 })
      .then(({ key }) => router.push(`/admin/templates/${key}`))
      .catch((error) => {
        console.error("[rtdb] add template", error)
        dialog.alert("Thema konnte nicht angelegt werden.", { title: "Hoppla" })
      })
  }

  return (
    <>
      <header className="page_header">
        <h1>Vorlagen pflegen</h1>
        <p>Themen und ihre Geschenkideen für alle Listen. Entwürfe sehen nur Admins.</p>
      </header>

      <div className={styles.actions}>
        {creating ? (
          <InlinePrompt
            label="Name des Themas"
            placeholder="z. B. Für Segler"
            maxLength={80}
            submitLabel="Anlegen"
            onSubmit={handleCreate}
            onCancel={() => setCreating(false)}
          />
        ) : (
          <button type="button" className="btn btn-primary" onClick={() => setCreating(true)}>
            <Plus size={18} aria-hidden /> Neues Thema
          </button>
        )}
      </div>

      {templates === null || counts === null ? (
        <Loading />
      ) : templates.length === 0 ? (
        <p className={styles.empty}>Noch keine Themen. Lege das erste an.</p>
      ) : (
        <ul className={styles.list}>
          {templates.map(([templateId, template]) => (
            <li key={templateId}>
              <Link href={`/admin/templates/${templateId}`} className={styles.row}>
                <span className={styles.title}>{template.title}</span>
                <span className="field">
                  <span className="field_key">Ideen</span>
                  <span className="field_value">{counts[templateId] ?? 0}</span>
                </span>
                <span className={`stamp ${template.published ? "stamp-primary" : "stamp-berry"}`}>
                  {template.published ? "Veröffentlicht" : "Entwurf"}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

const AdminTemplates = () => (
  <AdminGuard>
    <AdminTemplatesContent />
  </AdminGuard>
)

export default AdminTemplates
