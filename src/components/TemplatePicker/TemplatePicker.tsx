"use client"
import EmptyState from "components/EmptyState/EmptyState"
import Loading from "components/Loading/Loading"
import { matchesTemplateQuery, useSuggestionCounts, useTemplates } from "lib/templates"
import Link from "next/link"
import React, { use, useMemo, useState } from "react"
import { ArrowLeft, Search } from "react-feather"
import styles from "./TemplatePicker.module.scss"
import { useOwnerGuard } from "./useOwnerGuard"

// pick a topic, then swipe through its ideas
const TemplatePicker = ({ params }: { params: Promise<{ listId: string }> }) => {
  const { listId } = use(params)
  const { user, loading, isOwner } = useOwnerGuard(listId)
  const templates = useTemplates()
  const counts = useSuggestionCounts()
  const [query, setQuery] = useState("")

  const matches = useMemo(
    () => (templates || []).filter(([, template]) => matchesTemplateQuery(template, query)),
    [templates, query]
  )

  if (loading) return <Loading />

  if (!user) {
    return (
      <EmptyState
        text="Melde dich an, dann kannst du Ideen für deine Liste stöbern."
        action={<Link href="/auth" className="btn btn-primary">Anmelden</Link>}
      />
    )
  }

  if (!isOwner) return <Loading />

  return (
    <>
      <header className="page_header">
        <Link href={`/list/${listId}`} className={`btn-tertiary ${styles.back}`}>
          <ArrowLeft size={16} aria-hidden /> Zur Liste
        </Link>
        <h1>Ideen stöbern</h1>
        <p>Such dir ein Thema aus und entscheide bei jedem Vorschlag, ob er auf deine Liste soll.</p>
      </header>

      <label className={styles.search}>
        <span className="sr_only">Thema suchen</span>
        <Search size={18} aria-hidden />
        <input
          type="search"
          className="crit_textinput"
          placeholder="Thema suchen, z. B. Mama, Fahrrad, Kaffee"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </label>

      {templates === null || counts === null ? (
        <Loading />
      ) : templates.length === 0 ? (
        <EmptyState text="Hier gibt es noch keine Themen." />
      ) : matches.length === 0 ? (
        <EmptyState text="Dazu haben wir noch nichts. Versuch ein anderes Wort." />
      ) : (
        <ul className={styles.grid}>
          {matches.map(([templateId, template]) => (
            <li key={templateId}>
              <Link href={`/list/${listId}/ideas/${templateId}`} className={`shipping_label ${styles.topic}`}>
                <span className={styles.title}>{template.title}</span>
                {template.description ? <span className={styles.description}>{template.description}</span> : null}
                <span className="field">
                  <span className="field_key">Ideen</span>
                  <span className="field_value">{counts[templateId] ?? 0}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

export default TemplatePicker
