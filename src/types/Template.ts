import { Priority } from "./Entry"

// a topic ("Für Mütter") with a set of gift ideas, maintained by admins
export interface Template {
  title: string
  description?: string
  // comma separated search terms, e.g. "mama, mutter, muttertag"
  tags?: string
  // drafts are only listed in the admin area
  published: boolean
  position?: number
}

export interface TemplateSuggestion {
  text: string
  // why the idea is underrated, shown on the swipe card only
  description?: string
  link?: string
  priority?: Priority
  position?: number
}
