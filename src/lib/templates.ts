import { child, onValue, push, ref, remove, update } from "firebase/database"
import { useEffect, useMemo, useState } from "react"
import { Template, TemplateSuggestion } from "types"
import { database } from "./firebase"

const TEMPLATES = "templates"
const SUGGESTIONS = "templateSuggestions"

type TemplateTuple = [id: string, template: Template]
type SuggestionTuple = [id: string, suggestion: TemplateSuggestion]

const byId = (idA: string, idB: string) => (idA < idB ? -1 : idA > idB ? 1 : 0)

const textCollator = new Intl.Collator("de", { sensitivity: "base", numeric: true })

/** lower case, without diacritics, so "Mütter" matches "mutter" */
export const normalizeText = (text: string) =>
  text.toLocaleLowerCase("de").normalize("NFD").replace(/[̀-ͯ]/g, "").trim()

/** every word of the query has to appear in title, description or tags */
export const matchesTemplateQuery = (template: Template, query: string) => {
  const words = normalizeText(query).split(/\s+/).filter(Boolean)
  if (!words.length) return true
  const haystack = normalizeText(
    [template.title, template.description, template.tags].filter(Boolean).join(" ")
  )
  return words.every((word) => haystack.includes(word))
}

const sortTemplates = (templates: Record<string, Template> | null): TemplateTuple[] =>
  Object.entries(templates || {}).sort(
    ([idA, a], [idB, b]) =>
      (a.position ?? Infinity) - (b.position ?? Infinity) ||
      textCollator.compare(a.title, b.title) ||
      byId(idA, idB)
  )

const sortSuggestions = (suggestions: Record<string, TemplateSuggestion> | null): SuggestionTuple[] =>
  Object.entries(suggestions || {}).sort(
    ([idA, a], [idB, b]) => (a.position ?? Infinity) - (b.position ?? Infinity) || byId(idA, idB)
  )

// empty fields are removed, the rules reject e.g. a link that is not an URL
const clean = <T extends object>(value: T) =>
  Object.fromEntries(
    Object.entries(value).map(([key, entry]) => [
      key,
      entry === undefined || (typeof entry === "string" && !entry.trim()) ? null : typeof entry === "string" ? entry.trim() : entry,
    ])
  )

/** All topics, drafts only for admins. `null` while loading. */
export const useTemplates = ({ includeDrafts = false }: { includeDrafts?: boolean } = {}) => {
  const [templates, setTemplates] = useState<Record<string, Template> | null>(null)

  useEffect(() => {
    setTemplates(null)
    const unsubscriber = onValue(
      ref(database, TEMPLATES),
      (snapshot) => setTemplates(snapshot.val() || {}),
      (error) => console.error(`[rtdb] ${TEMPLATES}`, error)
    )

    return unsubscriber
  }, [])

  return useMemo(
    () => (templates ? sortTemplates(templates).filter(([, t]) => includeDrafts || t.published) : null),
    [templates, includeDrafts]
  )
}

export const useTemplate = (templateId: string) => {
  const [template, setTemplate] = useState<Template | null | undefined>(undefined)

  useEffect(() => {
    setTemplate(undefined)
    const path = `${TEMPLATES}/${templateId}`
    const unsubscriber = onValue(
      ref(database, path),
      (snapshot) => setTemplate(snapshot.val()),
      (error) => console.error(`[rtdb] ${path}`, error)
    )

    return unsubscriber
  }, [templateId])

  // undefined: loading, null: does not exist
  return template
}

export const useTemplateSuggestions = (templateId: string) => {
  const [suggestions, setSuggestions] = useState<Record<string, TemplateSuggestion> | null>(null)

  useEffect(() => {
    setSuggestions(null)
    const path = `${SUGGESTIONS}/${templateId}`
    const unsubscriber = onValue(
      ref(database, path),
      (snapshot) => setSuggestions(snapshot.val() || {}),
      (error) => console.error(`[rtdb] ${path}`, error)
    )

    return unsubscriber
  }, [templateId])

  return useMemo(() => (suggestions ? sortSuggestions(suggestions) : null), [suggestions])
}

/** Number of ideas per topic. The whole node is small (a few dozen short texts). */
export const useSuggestionCounts = () => {
  const [counts, setCounts] = useState<Record<string, number> | null>(null)

  useEffect(() => {
    setCounts(null)
    const unsubscriber = onValue(
      ref(database, SUGGESTIONS),
      (snapshot) => {
        const value: Record<string, Record<string, unknown>> = snapshot.val() || {}
        setCounts(Object.fromEntries(Object.entries(value).map(([id, ideas]) => [id, Object.keys(ideas).length])))
      },
      (error) => console.error(`[rtdb] ${SUGGESTIONS}`, error)
    )

    return unsubscriber
  }, [])

  return counts
}

/* Admin writes. Everything below is rejected by the database rules for non-admins. */

export const addTemplate = (template: Template) => push(child(ref(database), TEMPLATES), clean(template))

export const updateTemplate = (templateId: string, template: Partial<Template>) =>
  update(ref(database, `${TEMPLATES}/${templateId}`), clean(template))

/** Removes the topic and its ideas in one atomic multi-path update. */
export const deleteTemplateWithSuggestions = (templateId: string) =>
  update(ref(database), {
    [`${TEMPLATES}/${templateId}`]: null,
    [`${SUGGESTIONS}/${templateId}`]: null,
  })

export const addSuggestion = (templateId: string, suggestion: TemplateSuggestion) =>
  push(child(ref(database), `${SUGGESTIONS}/${templateId}`), clean(suggestion))

export const updateSuggestion = (templateId: string, suggestionId: string, suggestion: Partial<TemplateSuggestion>) =>
  update(ref(database, `${SUGGESTIONS}/${templateId}/${suggestionId}`), clean(suggestion))

export const removeSuggestion = (templateId: string, suggestionId: string) =>
  remove(ref(database, `${SUGGESTIONS}/${templateId}/${suggestionId}`))

export const reorderSuggestions = (templateId: string, orderedSuggestionIds: string[]) =>
  update(
    ref(database),
    Object.fromEntries(
      orderedSuggestionIds.map((suggestionId, index) => [`${SUGGESTIONS}/${templateId}/${suggestionId}/position`, index])
    )
  )
