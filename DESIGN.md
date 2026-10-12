# Wischlist Design

Wischlist fühlt sich an wie der Packtisch am Abend vor der Bescherung: Papierbögen, Klebeband,
ein Stift, Geschenkpapierrollen, Anhänger und ein Paket mit Versandetikett. Die Seite ist kein
SaaS-Dashboard mit Weihnachtsfarben.

Dieses Dokument regelt, **wie** das umgesetzt wird. Es gilt für alle neuen Komponenten und für
jede Überarbeitung bestehender Styles. Technische Konventionen (Tokens, SCSS Modules, Dark Mode)
stehen in `CLAUDE.md`.

## 1. Grundsätze

1. **Usability vor Stimmung.** Jede Seite muss ohne Dekoration genauso gut bedienbar sein.
   Wenn ein Stilmittel Lesbarkeit, Kontrast, Trefferfläche oder Fokus verschlechtert, fliegt es raus.
2. **Material mit Aufgabe.** Ein Material steht für eine fachliche Bedeutung (siehe Tabelle in Abschnitt 3).
   Das Vorbild ist die Priorität als farbiger Klebestreifen: Sie sieht nach Bastelei aus und ist trotzdem Information.
   Deko ohne Bedeutung ist die Ausnahme, höchstens einmal pro Ansicht.
3. **Dezent dosieren.** Pro Komponente höchstens ein Material-Moment (eine Abrisskante *oder*
   ein Klebeband *oder* ein Stempel). Alles andere ist ruhiges Papier mit guter Typografie.
4. **Papier liegt, es schwebt nicht.** Flächen liegen auf dem Tisch: kurze, nahe Kontaktschatten,
   kein Hover-Lift, keine großen weichen Schatten. Angehoben wird nur, was man gerade hält
   (Drag, Dialog).
5. **Kanten statt Kästen.** Bereiche trennen sich durch echte Papierkanten (Abriss, Perforation,
   Falz, Linie), nicht durch die nächste Box mit Rahmen, Radius und Schatten.
6. **Unregelmäßig, aber mit System.** Leichte Drehungen und krumme Linien kommen deterministisch
   aus `nth-child` oder festen Tokens, nie aus Zufall pro Render. Maximal ±1,5°.
   Was den Fokus hat oder bearbeitet wird, steht gerade.
7. **Handschrift ist für Menschliches.** Namen von Schenkenden, Notizen, Randbemerkungen und kurze
   Zurufe dürfen handschriftlich sein. Bedienelemente, Formularlabels, Fehlermeldungen und Fließtext nicht.

## 2. So sieht es nach Template aus (verboten)

| Muster | Wo es heute steckt | Stattdessen |
| --- | --- | --- |
| Gleichförmiges Raster runder Karten mit Rand, weichem Schatten und Hover-Lift | `ListCard .card`, `Home .feature`, `.paper` | Pakete, Zettel und Bögen mit eigener Form (Abschnitt 5) |
| Radius > 8px auf Flächen | `--radius-lg: 22px`, Inputs `10px` | `--radius*` max. 8px, Papier eher 2–4px |
| Pill-Buttons und Verlaufs-Buttons | `.btn` (`999px`), `.btn-primary` Gradient | Gedruckter Aufkleber mit hartem Versatzschatten (5.1) |
| Pill-Chips für Metadaten | `.chip`, `.giver`, `.linkBadge`, `.multiBadge` | Etikettfelder, Anhänger, kleine Stempel |
| Icon in weichem Kreis oder Quadrat über einer Überschrift | `Home .featureIcon`, `Dialog .icon` | Kritzelei oder Stempel, oder gar kein Icon |
| Drei-Spalten-Feature-Grid | `Home .features` | Nummerierte Notizen auf einem Bogen |
| Eyebrow + große H1 + grauer Untertitel + zwei Buttons + Illustration rechts | `Home .hero`, `.page_header` | Komposition auf dem Packtisch, Titel wie aufs Etikett geschrieben |
| Farbverlaufs-Leisten | `Dialog ::before` | Klebeband oder Stempel |
| Glas-Effekt / Backdrop-Blur | `Header ::before`, mobile `.nav` | Deckende Papierleiste |
| Radial-Glows im Hintergrund | `body::before` (`--glow-*`) | Nur Grain. Licht kommt höchstens als Lampenschein im Dark Mode |
| Segment-Control-Navigation mit aktivem Pill | `Header .nav`, `.navLink.active` | Textlinks mit handgezogener Unterstreichung |
| Emoji als Icons | | `react-feather` oder eigene Kritzel-SVGs |

## 3. Bedeutung → Material

Diese Tabelle ist verbindlich. Ein Material wird nicht für eine andere Bedeutung zweckentfremdet.

| Fachliche Bedeutung | Material | Hinweis |
| --- | --- | --- |
| Priorität eines Wunschs | **Farbiges Washi-Klebeband** (`--prio-*`) | Farbiges Band heißt *immer* Priorität |
| Eine Wunschliste | **Paket in Geschenkpapier** mit Band | Muster und Farbe pro Liste |
| Wunsch im Editor | **Notizzettel**, liniert | Bestehende `Card` |
| Wunsch in der Share-Ansicht | **Zeile auf einem linierten Bogen** | Kein Zettel pro Zeile, die Liste bleibt scannbar |
| Dauerbrenner („Mehrfach schenkbar“) | **Zettelblock**: zwei Blätter versetzt dahinter | Immer genau zwei, unabhängig von der Anzahl der Zusagen |
| Reserviert / vergeben | **Handgezogene Durchstreichung** und gezeichneter Haken | Bestehender `::after`-Strich |
| Schenkende:r, Notiz zur Zusage | **Geschenkanhänger** mit Loch, Text in Handschrift | Ersetzt die Pill `.giver` |
| Anlass, Datum, Countdown, Besitzer, Teilen-Link | **Sendungsetikett** mit Feldern „Für / Von / Am“ | Mono-Schrift, Barcode als Deko erlaubt |
| Status (geteilt, privat, Event vorbei) | **Stempel** | Nur auf Listenebene, nie pro Eintrag (siehe 6.6) |
| Ende eines Bogens, abtrennbarer Bereich | **Abrisskante** / **Perforation** | Höchstens eine Kante pro Fläche |
| Hervorhebung, Hinweis, „hier klicken“ | **Kritzelei** (Kringel, Pfeil, Unterstrich, Sternchen) | Höchstens zwei pro Ansicht |
| Etwas befestigen, rein dekorativ | **Neutrales Klebeband** (`--tape`, halbtransparent) | Nie farbig, damit es nicht wie Priorität aussieht |
| Neue Liste anlegen | **Schnittlinie mit Schere** („hier ausschneiden“) | Ersetzt die gestrichelte `addCard` |

## 4. Materialbibliothek

Alle Materialien werden mit CSS und Inline-SVG (Data-URI) gebaut, ohne Bilddateien.
Gemeinsame Bausteine kommen als Tokens oder Hilfsklassen in `src/styles/globals.scss`.

### 4.1 Papierbogen
Die Grundfläche für Inhalte. `--paper` + `--grain`, Radius `--radius-sm` (2–4px), Kontaktschatten
`--shadow-contact`. Liniertes Papier über `repeating-linear-gradient` wie in `Card.module.scss`.
Ein Bogen hat keinen umlaufenden Rand. Er hebt sich durch Farbe und Kontaktschatten vom `--bg` ab.

### 4.2 Abrisskante
Eine Kante (fast immer die untere) wird per `mask` unregelmäßig ausgeschnitten.
```scss
.torn_bottom {
  mask:
    linear-gradient(#000 0 0) top / 100% calc(100% - 10px) no-repeat,
    var(--edge-torn) bottom / 64px 10px repeat-x;
}
```
- `--edge-torn` ist ein SVG-Pfad mit unregelmäßigen Zacken. Die Periode muss mindestens 64px sein,
  sonst sieht man das Muster.
- Eine Maske schneidet auch `box-shadow` und Fokusringe ab. Den Schatten daher per
  `filter: drop-shadow(...)` auf einen Wrapper legen und unten genug Padding lassen.
- Einsatz: Ende der Share-Liste, Oberkante des Footers, Unterkante des Dialogs.

### 4.3 Perforation
Gestrichelte Linie mit gestanzten Löchern. Sie heißt: „Was darunter kommt, ist abtrennbar oder gehört nicht mehr dazu.“
Einsatz: über der Legende der Share-Ansicht, über „Reservierte entfernen“, am Teilen-Link-Abschnitt.
```scss
.perforation {
  height: 8px;
  background: radial-gradient(circle, var(--bg) 2.5px, transparent 3px) 0 50% / 12px 8px repeat-x;
  border-top: 1px dashed var(--line-strong);
}
```

### 4.4 Klebeband
- **Farbig (Priorität):** `--prio-high`, `--prio-medium`, `--prio-low`, mit 70% Deckkraft.
  Die Enden sind gezackt abgerissen (`clip-path` mit Zickzack-Polygon), das Band leicht gedreht.
  Hoch = breiteres Band, niedrig = schmaleres, damit die Priorität nicht nur an der Farbe hängt.
  Zusätzlich ein Text für Screenreader (`sr_only`) und `title`.
- **Neutral (Deko):** `--tape`, halbtransparent wie Kreppband. Hält einen Bogen oder Dialog „fest“.
  Höchstens einmal pro Ansicht.

### 4.5 Notizzettel und Zettelblock
Der Notizzettel ist die bestehende `Card`: liniert, Band oben, kleine Drehung über `nth-child`, Radius 2px.
Beim Hover keine Bewegung nach oben. Fokus und Bearbeiten setzen die Drehung auf 0°.
Der **Zettelblock** für Dauerbrenner zeigt zwei versetzte Blätter dahinter:
```scss
box-shadow:
  3px 3px 0 -1px var(--paper), 3px 3px 0 0 var(--line-strong),
  6px 6px 0 -1px var(--paper), 6px 6px 0 0 var(--line-strong);
```

### 4.6 Geschenkpapier und Paket
Eine Liste ist ein eingepacktes Paket. Das Papier hat ein **Muster** (Streifen, Punkte, Sterne, Rauten,
Fischgrät), nicht nur eine Farbe, über CSS-Gradients. Das Band kreuzt das Paket, die Schleife sitzt
am Kreuzungspunkt. Farben kommen aus Tokens (`--wrap-*`, `--ribbon-*`), nicht hart codiert wie heute in
`ListCard.module.scss`.
**Regel:** Text steht nie direkt auf dem Muster. Titel und Metadaten stehen auf einem Anhänger
oder Etikett, das auf dem Paket klebt.

### 4.7 Sendungsetikett
Weiß oder Kraftpapier, 1,5px Rahmen in `--ink`, Ecken 2px. Felder mit kleinem Mono-Label in
Großbuchstaben („FÜR“, „ANLASS“, „AM“) und Wert darunter. Ein dekorativer Barcode (CSS-Streifen)
ist erlaubt, wenn Platz ist. Es ersetzt Chips für Metadaten.
Einsatz: Kopf der Share-Seite („Für: Moritz · Geburtstag · 24.12.“, Countdown), Metadaten auf
dem Paket in `/list`, Box mit dem Teilen-Link inklusive Kopieren-Button.

### 4.8 Geschenkanhänger
Ein Kärtchen mit abgeschrägter Seite und gestanztem Loch, optional eine Schnur:
```scss
clip-path: polygon(14px 0, 100% 0, 100% 100%, 14px 100%, 0 50%);
background: radial-gradient(circle at 9px 50%, var(--bg) 3px, transparent 3.5px), var(--paper);
```
Text in `--font-hand`, mindestens 1.25rem. Einsatz: Name der Schenkenden („von Oma“), Notiz einer
Zusage, `GiverIntro` als großer Anhänger „Von: ____“ zum Beschriften.

### 4.9 Stempel
Großbuchstaben in Mono, 2px Rahmen in `currentColor`, Drehung −4° bis −8°. Unregelmäßige Tinte über
eine Grain-Maske, Deckkraft etwa 0,85. Farben: `--berry` (Achtung, privat, löschen), `--primary` (geteilt),
`--ink` (neutral). Beim Erscheinen „drückt“ der Stempel kurz auf (Scale 1.15 → 1, 150ms).
Einsatz: „Geteilt“ / „Nicht geteilt“ an der Liste, Hinweis auf der Share-Seite bei `isShared: false`,
„Event vorbei“, Warnung im Lösch-Dialog.

### 4.10 Kritzeleien
Eigene SVG-Strichzeichnungen: Kringel, Pfeil, Unterstrich, Sternchen, Haken, kleine Schleife.
`stroke: currentColor`, `stroke-width: 2`, runde Enden, leicht unregelmäßige Pfade. Beim Erscheinen dürfen sie
sich per `stroke-dashoffset` zeichnen (300–500ms), mit `prefers-reduced-motion` sofort fertig.
Einsatz: Haken in der Checkbox, aktiver Navigationspunkt (Unterstrich), Kringel um den Countdown,
Pfeil im Empty State zum einzigen Button. Ablegen als Komponenten unter `src/components/Doodle/`
(Import per `@svgr/webpack`).

### 4.11 Schnittlinie
Gestrichelter Rahmen (`2px dashed --line-strong`) mit kleinem Scheren-Icon auf der Linie. Heißt: „Hier entsteht
etwas Neues.“ Einsatz: „Neue Liste“ und „Neuer Wunsch“, also überall, wo heute `addCard` steht.

## 5. Komponenten

### 5.1 Buttons
- **Primär:** wie ein gedruckter Aufkleber. Vollfarbe `--primary`, kein Verlauf, Radius 4px,
  harter Versatzschatten `--shadow-print` (`2px 2px 0 var(--ink-shadow)`). `:active` verschiebt um 2px
  und nimmt den Schatten weg, der Button wird also gedrückt. Kein `translateY(-1px)` beim Hover, stattdessen
  eine minimal dunklere Farbe.
- **Sekundär:** Papier mit 1,5px Rahmen in `--ink`, gleiches Druckverhalten.
- **Tertiär:** Textlink mit Unterstreichung in `--gold`.
- **Gefahr:** wie Sekundär, Hover in `--berry`. Im Dialog Vollfarbe `--berry`.
- Icon-Buttons sind quadratisch (Radius 4px), mindestens 44×44px Trefferfläche. Kreise nur für Avatare.

### 5.2 Formulare
- Inline-Felder auf einer Linie (`.crit_textinput`) sind die Regel. Das passt zu einem Formular auf Papier.
- Freistehende Felder: Radius 4px, Rahmen `--line-strong`, Hintergrund `--paper`.
- Fokus: Rahmen `--gold` **und** `--ring`. Der Fokus muss immer deutlich sichtbar sein.
- Labels in Body-Schrift, nie handschriftlich.

### 5.3 Checkbox (Share-Ansicht)
Ein leicht unregelmäßig gezeichnetes Kästchen (`border-radius: 3px 5px 4px 6px`, 1,5px Rahmen in `--ink`).
Beim Abhaken zeichnet sich ein Kritzel-Haken (4.10). Die bisherige Vollfläche in `--primary` mit weißem
Feather-Haken entfällt. Sichtbare Größe 24px, klickbar ist die ganze Zeile.

### 5.4 Header und Navigation
- Deckende Leiste in `--bg`, kein Blur. Die Unterkante ist eine dünne Linie, die Girlande wird höchstens
  eine einfarbige Bindfaden-Linie.
- Das Logo ist ein kleiner Stempel oder Aufkleber, nicht das gerundete Quadrat mit Schatten.
- Navigation: Textlinks, der aktive Punkt bekommt einen handgezogenen Unterstrich (Kritzelei). Kein Segment-Control.
- Mobile Tab-Bar: deckender Papierstreifen am unteren Rand mit Abrisskante oben, kein schwebendes Glas-Pill.
  Labels bleiben unter den Icons, Trefferflächen mindestens 44px.

### 5.5 Listenübersicht `/list` (`ListCard`)
Jede Liste ist ein Paket (4.6). Titel und Metadaten stehen auf einem Etikett oder Anhänger auf dem Paket.
Datum und Countdown kommen als Etikettfelder, nicht als Chips. Das Raster bleibt, die Pakete dürfen über
`nth-child` unterschiedlich gedreht (±1°) und unterschiedlich gemustert sein. Hover: Die Schleife bewegt sich
leicht, das Paket bleibt liegen. „Neue Liste“ ist eine Schnittlinie (4.11).

### 5.6 Liste bearbeiten (`Card`)
Bleibt beim Notizzettel-Konzept. Anpassungen: Radius 2px, kein Hover-Lift. Das Prioritäts-Band bekommt gezackte
Enden und eine Breite nach Priorität. Dauerbrenner werden als Zettelblock gezeigt. Link und „Mehrfach“
erscheinen als kleiner Stempel oder handschriftliche Randnotiz, nicht als Pill.

### 5.7 Share-Ansicht (`Checklist`)
- Der Kopf ist ein Sendungsetikett: für wen, Anlass, Datum, Countdown.
- Die Liste ist **ein** linierter Bogen, oben mit neutralem Klebeband, unten mit Abrisskante.
- Zeilen trennt die Linierung, keine gestrichelten Rahmen pro Zeile. Hover: zarte Markierung wie mit einem
  Textmarker (`--gold-soft`), keine graue Fläche.
- Schenkende und Notizen stehen als Anhänger hinter dem Wunsch. Die Zusagen eines Dauerbrenners hängen
  eingerückt an einer senkrechten Bindfaden-Linie.
- Die Legende folgt unter einer Perforation als handschriftliche Fußnote.
- `GiverIntro`: großer Anhänger „Von: ____“, Eingabe auf der Linie. „Ohne Namen weiter“ ist ein Tertiär-Button.

### 5.8 Dialoge
Ein Zettel, der auf den Tisch gelegt wird: Radius 4px, oben neutrales Klebeband statt Verlaufsleiste, Schatten
`--shadow-lift` (der einzige große Schatten). Kein Icon im Kreis. Bei `danger: true` gibt es den Stempel
„Achtung“ in `--berry`. Erscheinen: leicht gedreht (−1°) und gerade hinlegen, 200ms.

### 5.9 Empty States
Ein handschriftlicher Satz, eine Kritzelei (z. B. ein Pfeil zum Button) und genau ein Button. Kein Icon im Kreis
und kein zentrierter Karten-Kasten.

### 5.10 Startseite
- Hero als Komposition auf dem Packtisch: Ein Wunschzettel, ein Paket mit Etikett und ein Anhänger überlappen sich.
  Die Headline steht links daneben in Display-Schrift, ohne Eyebrow-Formel.
- Statt drei Feature-Karten gibt es drei nummerierte Schritte auf einem Bogen („1. Liste schreiben, 2. Link teilen,
  3. Abhaken lassen“) mit Kritzel-Nummern.
- Höchstens zwei Buttons, nur einer davon ist primär.

### 5.11 Footer
Oberkante als Abrisskante, darunter Papier in `--surface-2`. Text klein, Links unterstrichen.

## 6. Usability-Leitplanken (nicht verhandelbar)

1. **Kontrast:** Text erfüllt WCAG AA (4,5:1, große Schrift 3:1), auch auf Kraftpapier und Etiketten.
   Text steht nie direkt auf Mustern oder Klebeband.
2. **Nicht nur Farbe:** Die Priorität steckt in Farbe *und* Bandbreite, dazu kommen Screenreader-Text und Legende.
   Reserviert heißt Durchstreichung *und* Haken *und* Checkbox-Zustand.
3. **Drehung:** maximal ±1,5° für Flächen, ±8° nur für Stempel und Deko. Nie bei Eingabefeldern
   mit Fokus, nie bei Fließtext über zwei Zeilen.
4. **Masken und clip-path** dürfen weder Inhalt noch Fokusring abschneiden. Fokusringe sitzen notfalls auf dem Wrapper.
5. **Trefferflächen** sind mindestens 44×44px, Abstände zwischen Aktionen mindestens 8px.
6. **Blur für Besitzer:** Zustände in der Share-Ansicht dürfen unter `filter: blur(8px)` keine erkennbare Form
   oder Farbfläche erzeugen. Deshalb gibt es keine Stempel, Anhänger oder farbigen Flächen pro Eintrag, die nur bei
   vergebenen Wünschen auftauchen, solange `blurForOwner` aktiv ist. Bei Dauerbrennern verrät der Zettelblock
   keine Anzahl.
7. **Bewegung:** 150–350ms, dazu passt die Materiallogik: hinlegen, aufdrücken, abziehen, zeichnen.
   Kein Schweben und kein Federn. `prefers-reduced-motion` schaltet alles auf sofort, wie in `globals.scss`.
8. **Performance:** Texturen und Kanten als kleine SVG-Data-URIs in Tokens. Kein live `feTurbulence` auf großen
   oder scrollenden Flächen außer dem vorhandenen fixen `body::before`.
9. **Dark Mode** heißt „Schreibtisch bei Lampenlicht“: Papier wird zu dunklem Karton, Klebeband bleibt halbtransparent,
   Stempeltinte und Kritzeleien werden hell. Jedes Material braucht eine geprüfte Dark-Variante.

## 7. Tokens

Bestehende Farben bleiben (`--paper`, `--bg`, `--primary`, `--gold`, `--berry`, `--prio-*`). Neu oder geändert:

| Token | Zweck | Wert (hell) |
| --- | --- | --- |
| `--ink` | Stift, Stempel, Etikett-Rahmen | `#2b2620` (dunkel: `#efe7d6`) |
| `--ink-shadow` | harter Druckschatten | `#2b2620` (dunkel: `#050807`) |
| `--kraft` / `--kraft-ink` | Packpapier für Etiketten und Anhänger | `#d9bf94` / `#4a3620` |
| `--tape` | neutrales Klebeband | `rgba(255, 248, 225, 0.55)` |
| `--wrap-*`, `--ribbon-*` | Geschenkpapier und Band | heute hart codiert in `ListCard.module.scss` |
| `--radius-sm` / `--radius` / `--radius-lg` | Ecken | `2px` / `4px` / `8px` (vorher 8 / 14 / 22) |
| `--shadow-contact` | liegendes Papier | `0 1px 0 var(--line), 0 2px 3px rgba(62, 42, 12, 0.08)` |
| `--shadow-print` | Aufkleber, Buttons | `2px 2px 0 var(--ink-shadow)` |
| `--shadow-lift` | gehaltenes Papier (Drag, Dialog) | heutiges `--shadow-lg` |
| `--tilt-1..3` | feste Drehungen | `-0.8deg`, `0.6deg`, `-1.4deg` |
| `--edge-torn`, `--edge-perforation` | Kantenmasken | SVG-Data-URIs |

Wegfallen: `--glow-1`, `--glow-2`, `--shadow-md` als Hover-Schatten. `--shadow-sm` geht in `--shadow-contact` auf.

## 8. Typografie

Fraunces, Inter und Caveat sind das häufigste „warme“ Font-Trio generierter Seiten. Vorschlag:

| Rolle | Schrift | Regeln |
| --- | --- | --- |
| Display (H1–H3, Wordmark) | **Young Serif** (alternativ Fraunces mit `"SOFT" 100, "WONK" 1`) | Nur Überschriften, nie unter 1.25rem |
| Body, UI | **Atkinson Hyperlegible Next** | 16px Basis, `line-height` 1.5, Gewicht 400/600 |
| Etikett, Stempel, Zahlen | **Atkinson Hyperlegible Mono** | Großbuchstaben, `letter-spacing: 0.08em`, mindestens 12px |
| Handschrift | **Caveat** (bleibt) | Mindestens 1.25rem, nur Namen, Notizen und Randbemerkungen |

Vor dem Umstieg prüfen, ob die installierte Next-Version die Schriften in `next/font/google` kennt.
Sonst über `next/font/local` selbst hosten. Variablennamen (`--font-display`, `--font-body`, `--font-hand`)
bleiben, `--font-label` kommt dazu.

## 9. Review-Checkliste für neue UI

- [ ] Hat jedes Material eine Bedeutung aus Abschnitt 3? Sonst weglassen.
- [ ] Gibt es höchstens ein Material-Moment pro Komponente?
- [ ] Ist die Komponente ohne Deko genauso benutzbar?
- [ ] Kein Radius über 8px, keine Pills, kein Verlauf, kein Hover-Lift, kein Icon im Kreis, kein Blur-Glas?
- [ ] Werden Tokens statt Hex-Werten verwendet? Steht kein Text auf Mustern?
- [ ] Sind Kontrast AA, 44px-Trefferflächen und sichtbarer Fokus gegeben, auch durch Masken hindurch?
- [ ] Funktionieren Dark Mode und `prefers-reduced-motion`?
- [ ] Share-Ansicht: Verrät der Blur für Besitzer nichts?

## 10. Reihenfolge der Umstellung

1. Tokens, Radien, Schatten, Buttons und Formulare in `globals.scss` (größte Wirkung, geringstes Risiko)
2. Share-Ansicht (`Checklist`, `ChecklistEntry`, `ChecklistMultiEntry`, `GiverIntro`): die meistbesuchte Seite
3. Listenübersicht (`ListCard`, `AddCard`) als Pakete
4. Header, Footer, Dialog, Empty States
5. Startseite
6. Schriften
