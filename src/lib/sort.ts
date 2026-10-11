import { Entry, Priority, SortOrder } from "types"

export const SORT_ORDER_LABELS: Record<SortOrder, string> = {
  custom: "Eigene",
  priority: "Nach Priorität",
  alphabetical: "Alphabetisch",
}

type EntryTuple = [id: string, entry: Entry]

const textCollator = new Intl.Collator("de", { sensitivity: "base", numeric: true })

// entries without position land at the end, ties keep creation order (push ids are chronological)
const byPosition = ([idA, a]: EntryTuple, [idB, b]: EntryTuple) =>
  (a.position ?? Infinity) - (b.position ?? Infinity) || (idA < idB ? -1 : idA > idB ? 1 : 0)

const byPriority = ([, a]: EntryTuple, [, b]: EntryTuple) =>
  (a.priority ?? Priority.medium) - (b.priority ?? Priority.medium)

// empty wishes (e.g. freshly added) land at the end
const byText = ([, a]: EntryTuple, [, b]: EntryTuple) => {
  const textA = a.text?.trim() || ""
  const textB = b.text?.trim() || ""
  if (!textA || !textB) return Number(!textA) - Number(!textB)
  return textCollator.compare(textA, textB)
}

const comparators: Record<SortOrder, (a: EntryTuple, b: EntryTuple) => number> = {
  custom: byPosition,
  priority: (a, b) => byPriority(a, b) || byPosition(a, b),
  alphabetical: (a, b) => byText(a, b) || byPosition(a, b),
}

export const sortEntries = (
  entries: Record<string, Entry> | null,
  sortOrder: SortOrder = "custom"
): EntryTuple[] =>
  Object.entries(entries || {}).sort(comparators[sortOrder] || byPosition)
