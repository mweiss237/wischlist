"use client"
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import AdminGuard from "components/AdminGuard/AdminGuard"
import { useDialog } from "components/Dialog/Dialog"
import EmptyState from "components/EmptyState/EmptyState"
import InlinePrompt from "components/InlinePrompt/InlinePrompt"
import Checkbox from "components/List/ListOptions"
import Loading from "components/Loading/Loading"
import {
  addSuggestion,
  deleteTemplateWithSuggestions,
  removeSuggestion,
  reorderSuggestions,
  updateSuggestion,
  updateTemplate,
  useTemplate,
  useTemplateSuggestions,
} from "lib/templates"
import Link from "next/link"
import { useRouter } from "next/navigation"
import React, { use, useState } from "react"
import { ArrowLeft, Plus, Trash2 } from "react-feather"
import { Template } from "types"
import styles from "./AdminTemplate.module.scss"
import SuggestionRow from "./SuggestionRow"

type TextField = "title" | "description" | "tags"

const toDraft = (template: Template) => ({
  title: template.title,
  description: template.description || "",
  tags: template.tags || "",
})

const TemplateForm = ({ templateId, template }: { templateId: string; template: Template }) => {
  const router = useRouter()
  const dialog = useDialog()
  const suggestions = useTemplateSuggestions(templateId)
  const [adding, setAdding] = useState(false)

  const [draft, setDraft] = useState(() => toDraft(template))
  const savedKey = JSON.stringify(toDraft(template))
  const [seenKey, setSeenKey] = useState(savedKey)
  if (seenKey !== savedKey) {
    setSeenKey(savedKey)
    setDraft(toDraft(template))
  }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const fail = (what: string, message: string) => (error: unknown) => {
    console.error(`[rtdb] ${what}`, error)
    dialog.alert(message, { title: "Hoppla" })
  }

  const saveTemplate = (changes: Partial<Template>, what = "update template") =>
    updateTemplate(templateId, changes).catch(fail(what, "Änderung konnte nicht gespeichert werden."))

  const handleBlur = (name: TextField) => {
    const saved = toDraft(template)
    const value = draft[name].trim()
    if (value === saved[name] || (name === "title" && !value)) {
      setDraft((previous) => ({ ...previous, [name]: saved[name] }))
      return
    }
    setDraft((previous) => ({ ...previous, [name]: value }))
    saveTemplate({ [name]: value })
  }

  const textField = (name: TextField) => ({
    value: draft[name],
    onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setDraft((previous) => ({ ...previous, [name]: event.target.value })),
    onBlur: () => handleBlur(name),
  })

  const handleDelete = async () => {
    const count = suggestions?.length ?? 0
    const confirmed = await dialog.confirm(
      `Das Thema „${template.title}“ und ${count === 1 ? "seine 1 Idee" : `seine ${count} Ideen`} werden unwiederbringlich gelöscht.`,
      { title: "Thema löschen?", confirmLabel: "Löschen", danger: true }
    )
    if (!confirmed) return
    deleteTemplateWithSuggestions(templateId)
      .then(() => router.replace("/admin/templates"))
      .catch(fail("delete template", "Thema konnte nicht gelöscht werden."))
  }

  const handleDeleteSuggestion = async (suggestionId: string, text: string) => {
    const confirmed = await dialog.confirm(`„${text}“ wird gelöscht.`, {
      title: "Vorschlag löschen?",
      confirmLabel: "Löschen",
      danger: true,
    })
    if (confirmed) removeSuggestion(templateId, suggestionId).catch(fail("remove suggestion", "Vorschlag konnte nicht gelöscht werden."))
  }

  const handleAdd = (text: string) => {
    setAdding(false)
    addSuggestion(templateId, { text, position: suggestions?.length ?? 0 }).catch(
      fail("add suggestion", "Vorschlag konnte nicht angelegt werden.")
    )
  }

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!suggestions || !over || active.id === over.id) return
    const ids = suggestions.map(([id]) => id)
    const [moved] = ids.splice(ids.indexOf(String(active.id)), 1)
    ids.splice(ids.indexOf(String(over.id)), 0, moved)
    reorderSuggestions(templateId, ids).catch(fail("reorder suggestions", "Reihenfolge konnte nicht gespeichert werden."))
  }

  return (
    <>
      <header className="page_header">
        <Link href="/admin/templates" className={`btn-tertiary ${styles.back}`}>
          <ArrowLeft size={16} aria-hidden /> Alle Themen
        </Link>
        <div className={styles.titleRow}>
          <label className={styles.titleField}>
            <span className="sr_only">Name des Themas</span>
            <input type="text" className={`crit_textinput ${styles.titleInput}`} maxLength={80} {...textField("title")} />
          </label>
          <button type="button" className="btn btn-ghost btn-danger" onClick={handleDelete}>
            <Trash2 size={18} aria-hidden /> Thema löschen
          </button>
        </div>
      </header>

      <div className={styles.layout}>
        <aside className={`paper ${styles.settings}`}>
          <label className="field">
            <span className="field_key">Beschreibung</span>
            <textarea className={`crit_textinput ${styles.textarea}`} rows={3} maxLength={300} {...textField("description")} />
          </label>
          <label className="field">
            <span className="field_key">Suchbegriffe</span>
            <input
              type="text"
              className="crit_textinput"
              maxLength={200}
              placeholder="mama, mutter, muttertag"
              {...textField("tags")}
            />
          </label>
          <Checkbox
            checked={template.published}
            label="Veröffentlicht"
            description="Entwürfe sehen nur Admins."
            onToggle={() => saveTemplate({ published: !template.published }, "toggle published")}
          />
        </aside>

        <section className={styles.ideas}>
          {suggestions === null ? (
            <Loading />
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={suggestions.map(([id]) => id)} strategy={verticalListSortingStrategy}>
                <ul className={styles.rows}>
                  {suggestions.map(([suggestionId, suggestion]) => (
                    <SuggestionRow
                      key={suggestionId}
                      id={suggestionId}
                      suggestion={suggestion}
                      onSave={(changes) =>
                        updateSuggestion(templateId, suggestionId, changes).catch(
                          fail("update suggestion", "Änderung konnte nicht gespeichert werden.")
                        )
                      }
                      onDelete={() => handleDeleteSuggestion(suggestionId, suggestion.text)}
                    />
                  ))}
                </ul>
              </SortableContext>
            </DndContext>
          )}

          {adding ? (
            <InlinePrompt
              label="Neues Geschenk"
              placeholder="z. B. Akku-Fusselrasierer"
              maxLength={200}
              submitLabel="Anlegen"
              onSubmit={handleAdd}
              onCancel={() => setAdding(false)}
            />
          ) : (
            <button type="button" className="btn btn-primary" onClick={() => setAdding(true)}>
              <Plus size={18} aria-hidden /> Neuer Vorschlag
            </button>
          )}
        </section>
      </div>
    </>
  )
}

const AdminTemplateContent = ({ templateId }: { templateId: string }) => {
  const template = useTemplate(templateId)

  if (template === undefined) return <Loading />

  if (template === null) {
    return (
      <EmptyState
        text="Dieses Thema gibt es nicht (mehr)."
        action={<Link href="/admin/templates" className="btn btn-primary">Alle Themen</Link>}
      />
    )
  }

  return <TemplateForm templateId={templateId} template={template} />
}

const AdminTemplate = ({ params }: { params: Promise<{ templateId: string }> }) => {
  const { templateId } = use(params)

  return (
    <AdminGuard>
      <AdminTemplateContent templateId={templateId} />
    </AdminGuard>
  )
}

export default AdminTemplate
