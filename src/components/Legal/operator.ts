// Angaben zum Betreiber, einmal zentral für Impressum und Datenschutzerklärung.
// Die Platzhalter in eckigen Klammern vor dem Livegang ersetzen.
export const operator = {
  name: "[Vor- und Nachname]",
  street: "[Straße und Hausnummer]",
  city: "[PLZ und Ort]",
  email: "[E-Mail-Adresse]",
  phone: "[Telefonnummer]",
  // nur eintragen, wenn vorhanden (bei Kleinunternehmerregelung leer lassen)
  vatId: "",
  // zuständige Landesdatenschutzbehörde, abhängig vom Wohnsitz
  authority: "[zuständige Landesdatenschutzbehörde]",
}

// Erst auf true setzen, wenn Affiliate-Links, Werbung oder Spenden wirklich live sind.
// Dann erscheint der passende Abschnitt in der Datenschutzerklärung (und in den Hinweisen im Impressum).
export const monetizationActive = false

export const legalUpdated = "November 2026"
