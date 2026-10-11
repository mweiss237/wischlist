# Wischlist

Next.js-Web-App (App Router) zum Erstellen von Wunschlisten. Besitzer:innen teilen eine Liste per Link
(`/list/<listId>/share`). Freunde und Familie haken dort Wünsche in Echtzeit ab, auch ohne Account.
Backend ist ausschließlich Firebase: Auth, Realtime Database (europe-west1) und Storage. Es gibt keine
eigenen API-Routen und kein Server-Backend.

## Befehle
- `npm run dev`: Dev-Server auf http://localhost:3000
- `npm run build`: Produktions-Build (dient auch als Typecheck)
- `npm run lint`: ESLint (`next/core-web-vitals`)
- `npm run release`: release-it (Version bumpen, taggen). Nur auf ausdrückliche Anweisung ausführen.
- `firebase deploy --only database`: Deployt `database.rules.json` ins Projekt `wischlist-cd9c6`.
  Nur auf ausdrückliche Anweisung ausführen.
- Node-Version: siehe `.nvmrc` (v20). Es gibt keine Tests.

## Stack
Next.js 13 (App Router), React 18, TypeScript (strict), Firebase JS SDK v10 (modular), SCSS Modules,
`@dnd-kit` (Sortieren der Einträge), `react-feather` (Icons), lodash.
Imports laufen absolut über `baseUrl: ./src`: `import { useList } from "lib/list"` statt relativer Pfade.

## Struktur
- `src/app/(dashboard)/`: Seiten mit Header und Footer
  - `/`: Home, `/login`, `/register`, `/auth`, `/forgot-password`, `/profile`
  - `/list`: eigene Listen, `/list/favorites`: favorisierte fremde Listen
  - `/list/[listId]`: Liste bearbeiten (Besitzer), `/list/[listId]/share`: öffentliche Abhak-Ansicht
- `src/app/(fullscreen)/share`: dieselbe `Checklist`-Komponente ohne Chrome
- Seiten sind dünne Wrapper (`export default List`). Die Logik liegt in `src/components/<Name>/<Name>.tsx`,
  die Styles daneben in `<Name>.module.scss`.
- `src/lib/`: der komplette Firebase-Zugriff als React-Hooks. Komponenten sprechen Firebase nie direkt an.
  - `firebase.ts`: App-Singleton (HMR-sicher), `auth`, `database`, `storage`
  - `auth.tsx`: `AuthProvider`, `useUser()` (User, Profil), `useAuth()` (Login, Register, E-Mail-Link, Passwort-Reset)
  - `lists.ts`: `useLists()` (eigene Listen per `orderByChild("userId")`)
  - `list.ts`: `useList(id)`, `deleteListWithEntries()`
  - `entries.ts`: `useEntries(id)`, `pickEntry()` und `unpickEntry()` für Schenkende
  - `favorite.ts`: `useFavorites()`
  - `giver.tsx`: `GiverProvider` merkt sich den Namen anonymer Schenkender in localStorage
  - `date.ts`: Event-Datum formatieren, Countdown
- `src/types/`: `List`, `ListOptions`, `Entry`, `Priority` (1 hoch, 2 mittel, 3 niedrig), `Favorite`

## Datenmodell (Realtime Database)
```text
lists/{listId}             { title, userId, eventDate?: "YYYY-MM-DD", options: { isShared, blurForOwner, sortOrder? } }
entries/{listId}/{entryId} { text, link?, priority?, position?, taken?: { timestamp: ISO-String, giver? } }
favorites/{uid}/{listId}   { title }
```
- Einträge liegen absichtlich getrennt von `lists`, damit sich die Leserechte unterscheiden lassen.
- Muster für Hooks: `onValue` in `useEffect`, den State beim ID-Wechsel auf `null` zurücksetzen,
  den Unsubscriber zurückgeben, Fehler mit `console.error("[rtdb] <pfad>", error)` loggen.
  Für neue Daten-Hooks dieses Muster übernehmen.
- Wenn mehrere Pfade zusammen geschrieben werden, läuft das als atomares Multi-Path-`update`
  (z. B. Liste und Einträge löschen, `reorderEntries`). Das Reservieren eines Wunsches läuft per
  `runTransaction` auf `taken`, damit zwei Schenkende nicht denselben Wunsch nehmen.

## Sicherheitsregeln (`database.rules.json`)
- Nur der Besitzer (`userId === auth.uid`) darf Listen und Einträge schreiben.
- `entries/{listId}` dürfen alle lesen, wenn `options.isShared === true`, sonst nur der Besitzer.
- `taken` dürfen alle setzen (auch anonym), solange die Liste geteilt ist und der Eintrag existiert.
  Entfernen ist nur als Löschen möglich. Erlaubt sind nur die Felder `timestamp` (≤30 Zeichen) und `giver` (≤100).
- `lists` als Ganzes lässt sich nur mit Query `orderByChild('userId').equalTo(uid)` lesen.
- **Wenn sich das Datenmodell ändert, immer auch die Regeln anpassen** und prüfen, ob die
  anonyme Share-Ansicht noch funktioniert. Neue Felder unter `taken` werden sonst abgelehnt (`$other: false`).

## Fachliche Regeln
- Der Besitzer soll nicht sehen, was schon geschenkt wurde. Bei `blurForOwner` wird die eigene
  Share-Ansicht unscharf dargestellt, das darf nicht kaputtgehen.
- Ist eine Liste nicht geteilt (`isShared: false`), zeigt die Share-Seite einen Hinweis statt der Einträge.
- Einträge werden nach `options.sortOrder` sortiert (`lib/sort.ts`, in Editier- und Share-Ansicht gleich):
  `custom` (Standard, nach `position`; fehlt `position`, landen sie am Ende), `priority` oder `alphabetical`.
  Bei Gleichstand entscheidet `position`. Manuelles Verschieben setzt die Sortierung wieder auf `custom`.

## Konventionen
- Die UI-Sprache ist Deutsch (Labels, `confirm`, `prompt`, Metadaten). Neue Texte auf Deutsch schreiben.
- Dateien sind UTF-8 kodiert und enthalten Umlaute. Beim Bearbeiten nicht umkodieren.
- Komponenten mit Hooks oder Browser-APIs bekommen `"use client"`.
- Prettier: kein Semikolon, doppelte Anführungszeichen, 2 Spaces, `trailingComma: es5`.
  Ältere Dateien weichen davon ab; den Stil der jeweiligen Datei beibehalten.
- Styling: zuerst die Design-Tokens aus `src/styles/globals.scss` nutzen (`--primary`, `--gold`, `--berry`,
  `--prio-*`, `--radius*`, `--shadow-*`), keine hart codierten Farben. Dark Mode läuft über
  `prefers-color-scheme` in derselben Datei. Globale Hilfsklassen (`crit_*`) stehen in `critical.scss`.
- SVGs werden per `@svgr/webpack` als React-Komponenten importiert.
- Commits: Conventional Commits mit Scope, z. B. `feat(List): …`, `fix(Auth): …`, `chore(core): …`.
- Branches: Entwickelt wird auf `dev`, Releases gehen per PR nach `main`.

## Hinweise
- Die Firebase-Web-Config in `lib/firebase.ts` ist absichtlich öffentlich. Die Sicherheit kommt allein aus
  den DB-Regeln. Es gibt keine `.env`.
- `src/lib/storage.ts` ist ein leerer Stub. Profilbilder laufen über `useUser().updateProfilePicture`.
