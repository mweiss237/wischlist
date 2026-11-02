import Link from "next/link"
import type { ReactNode } from "react"
import Field from "./Field"
import { legalUpdated, monetizationActive, operator } from "./operator"
import styles from "./Legal.module.scss"

interface Section {
  id: string
  title: string
  body: ReactNode
}

const sections: Section[] = [
  {
    id: "verantwortlicher",
    title: "Verantwortlicher",
    body: (
      <>
        <p>
          Verantwortlich für die Datenverarbeitung auf dieser Webseite ist:
        </p>
        <p>
          <Field value={operator.name} />, <Field value={operator.street} />, <Field value={operator.city} />
          <br />
          E-Mail: <Field value={operator.email} />
        </p>
        <p>
          Weitere Angaben findest du im <Link href="/impressum">Impressum</Link>. Einen Datenschutzbeauftragten
          müssen wir nicht benennen.
        </p>
      </>
    ),
  },
  {
    id: "ueberblick",
    title: "Das Wichtigste in Kürze",
    body: (
      <>
        <p>
          Wischlist ist eine Webseite, auf der du Wunschlisten anlegst und per Link teilst. Freundinnen, Freunde und
          Familie können dort Wünsche abhaken, auch ohne Konto.
        </p>
        <ul>
          <li>Wir verwenden keine Analyse- oder Tracking-Dienste und keine Werbe-Cookies.</li>
          <li>Wir binden keine Schriftarten, Karten oder Videos von Drittanbietern ein.</li>
          <li>Unsere Daten liegen bei Google Firebase (Datenbank in Belgien) und die Webseite wird bei Vercel gehostet.</li>
          <li>Du kannst dein Konto samt Listen jederzeit selbst löschen.</li>
        </ul>
      </>
    ),
  },
  {
    id: "hosting",
    title: "Hosting und Server-Logfiles (Vercel)",
    body: (
      <>
        <p>
          Die Webseite wird bei Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA gehostet. Beim Aufruf
          der Seite verarbeitet der Server technisch notwendige Daten: deine IP-Adresse, Datum und Uhrzeit, die
          aufgerufene Adresse, die zuvor besuchte Seite (Referrer) sowie Browser- und Betriebssystemangaben
          (User-Agent).
        </p>
        <p>
          Zweck ist, die Seite auszuliefern, sicher zu betreiben und Angriffe abzuwehren. Rechtsgrundlage ist
          Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einem stabilen und sicheren Betrieb). Wir werten diese
          Daten nicht aus, um dein Verhalten zu analysieren.
        </p>
        <p>
          Dabei kann es zu einer Übermittlung in die USA kommen. Vercel ist unter dem EU-US Data Privacy Framework
          zertifiziert, außerdem besteht ein Vertrag zur Auftragsverarbeitung mit Standardvertragsklauseln.
        </p>
      </>
    ),
  },
  {
    id: "firebase",
    title: "Firebase (Google)",
    body: (
      <>
        <p>
          Für Anmeldung und Datenspeicherung nutzen wir Firebase, einen Dienst von Google Ireland Limited, Gordon
          House, Barrow Street, Dublin 4, Irland (Muttergesellschaft: Google LLC, USA). Wir nutzen:
        </p>
        <ul>
          <li>
            <strong>Firebase Authentication</strong> für Konto, Anmeldung, Anmelde-Link und das Zurücksetzen des
            Passworts per E-Mail,
          </li>
          <li>
            <strong>Firebase Realtime Database</strong> (Standort: Belgien, europe-west1) für Listen, Wünsche,
            Zusagen und Favoriten.
          </li>
        </ul>
        <p>
          Dein Browser verbindet sich dafür direkt mit Servern von Google. Dabei wird technisch bedingt auch deine
          IP-Adresse übertragen. Das gilt ebenso, wenn du ohne Konto eine geteilte Liste öffnest oder einen Wunsch
          abhakst. Mit Google besteht ein Vertrag zur Auftragsverarbeitung. Eine Übermittlung in die USA ist nicht
          ausgeschlossen. Google LLC ist unter dem EU-US Data Privacy Framework zertifiziert, zusätzlich gelten
          Standardvertragsklauseln.
        </p>
        <p>
          Wir speichern keine Dateien oder Bilder bei Firebase Storage. Ein Profilbild kannst du nicht hochladen,
          es wird ein lokal ausgeliefertes Platzhalterbild angezeigt.
        </p>
        <p>
          Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, soweit du ein Konto nutzt, und sonst Art. 6 Abs. 1 lit. f
          DSGVO (berechtigtes Interesse, die geteilten Listen für Schenkende bereitzustellen).
        </p>
      </>
    ),
  },
  {
    id: "konto",
    title: "Konto und Anmeldung",
    body: (
      <>
        <p>
          Für ein Konto brauchst du eine E-Mail-Adresse, einen Nutzernamen und ein Passwort. Die Anmeldung ist auch
          per Link möglich, den wir an deine E-Mail-Adresse schicken. Gespeichert werden E-Mail-Adresse, Nutzername,
          das Passwort (ausschließlich als Hash), eine interne Nutzer-ID sowie Zeitpunkte von Registrierung und
          Anmeldung.
        </p>
        <p>
          Zweck ist, dir deine Listen zuzuordnen und nur dir die Bearbeitung zu erlauben. Rechtsgrundlage ist
          Art. 6 Abs. 1 lit. b DSGVO (Nutzungsvertrag). Die Daten bleiben gespeichert, bis du dein Konto löschst.
        </p>
        <p>
          Du kannst dein Konto in deinem Profil unter „Konto löschen“ selbst löschen. Dabei werden dein Zugang, alle
          deine Listen mit allen Wünschen und deine Favoriten gelöscht.
        </p>
      </>
    ),
  },
  {
    id: "listen",
    title: "Listen und Wünsche",
    body: (
      <>
        <p>
          Zu jeder Liste speichern wir Titel, optional das Datum des Anlasses, deine Einstellungen (zum Beispiel ob
          die Liste geteilt ist und wie sie sortiert wird) und deine Nutzer-ID. Zu jedem Wunsch speichern wir Text,
          optional einen Link, die Priorität und die Reihenfolge.
        </p>
        <p>
          Solange eine Liste nicht geteilt ist, kann nur du sie sehen. Sobald du sie teilst, kann jede Person, die den
          Link kennt, die Liste und die Wünsche sehen. Teile den Link deshalb nur mit Menschen, die ihn sehen
          sollen. Bitte trage in Listen keine personenbezogenen Daten Dritter ein, für die du keinen Grund hast. Für
          die Inhalte deiner Listen bist du selbst verantwortlich.
        </p>
        <p>
          Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO. Die Daten werden gelöscht, wenn du die Liste oder dein Konto
          löschst.
        </p>
      </>
    ),
  },
  {
    id: "schenken",
    title: "Wünsche abhaken (auch ohne Konto)",
    body: (
      <>
        <p>
          Wenn du einen Wunsch abhakst, speichern wir den Zeitpunkt und, wenn du ihn angibst, deinen Namen. Bei
          Wünschen, die mehrfach geschenkt werden können, kannst du außerdem eine kurze Notiz hinzufügen, was du
          schenkst. Du kannst auch ohne Namen weitermachen.
        </p>
        <p>
          Name, Zeitpunkt und Notiz sind für alle sichtbar, die die geteilte Liste öffnen. Die Besitzerin oder der
          Besitzer der Liste sieht diese Angaben in der Regel nicht, wenn die Liste auf „unscharf“ eingestellt ist. Die
          Daten sind aber technisch für sie abrufbar. Gib deshalb nur an, was die Beschenkten später auch wissen
          dürfen.
        </p>
        <p>
          Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse, Geschenke untereinander abzustimmen,
          damit nichts doppelt gekauft wird). Du kannst deine Zusage jederzeit selbst zurücknehmen. Dann sind die
          Angaben gelöscht. Sie werden auch gelöscht, wenn die Liste gelöscht wird oder die Besitzerin bzw. der
          Besitzer nach dem Anlass die reservierten Wünsche entfernt.
        </p>
      </>
    ),
  },
  {
    id: "favoriten",
    title: "Favoriten",
    body: (
      <p>
        Wenn du angemeldet bist, kannst du fremde Listen als Favoriten merken. Dafür speichern wir die Kennung und den
        Titel der Liste verknüpft mit deiner Nutzer-ID (Art. 6 Abs. 1 lit. b DSGVO). Die Daten bleiben gespeichert,
        bis du den Favoriten entfernst oder dein Konto löschst.
      </p>
    ),
  },
  {
    id: "endgeraet",
    title: "Speicherung auf deinem Gerät",
    body: (
      <>
        <p>
          Wir speichern Informationen im lokalen Speicher deines Browsers (localStorage bzw. IndexedDB). Sie werden
          ausschließlich dafür gebraucht, dass die Webseite so funktioniert, wie du sie nutzt, und werden nicht an
          Werbe- oder Analysedienste weitergegeben:
        </p>
        <ul>
          <li>
            <strong>Anmeldestatus</strong> (von Firebase Authentication), damit du angemeldet bleibst,
          </li>
          <li>
            <code>giver</code>: dein Name, den du beim Abhaken angegeben hast,
          </li>
          <li>
            <code>giverSkipped</code>: ob du bewusst ohne Namen weitermachen möchtest,
          </li>
          <li>
            <code>giftIds</code>: die Zusagen, die du auf diesem Gerät angelegt hast, damit du sie wieder zurücknehmen
            kannst.
          </li>
        </ul>
        <p>
          Rechtsgrundlage ist § 25 Abs. 2 Nr. 2 TDDDG (unbedingt erforderlich für den von dir gewünschten Dienst) und
          Art. 6 Abs. 1 lit. f DSGVO. Eine Einwilligung ist deshalb nicht nötig. Du kannst die Daten jederzeit in
          den Einstellungen deines Browsers löschen. Dann musst du dich erneut anmelden und kannst Zusagen von diesem
          Gerät nicht mehr selbst zurücknehmen.
        </p>
      </>
    ),
  },
  {
    id: "extern",
    title: "Schriftarten und externe Links",
    body: (
      <>
        <p>
          Die Schriftarten werden beim Erstellen der Webseite heruntergeladen und von unserem eigenen Server
          ausgeliefert. Dein Browser verbindet sich dafür nicht mit Google.
        </p>
        <p>
          Wünsche können Links zu fremden Webseiten (zum Beispiel zu Online-Shops) enthalten. Erst wenn du einen Link
          anklickst, verlässt du Wischlist. Dann gilt die Datenschutzerklärung der jeweiligen Seite.
        </p>
      </>
    ),
  },
  ...(monetizationActive
    ? [
        {
          id: "werbung",
          title: "Affiliate-Links, Werbung und Spenden",
          body: (
            <>
              <p>
                [Vor dem Livegang ausfüllen: Anbieter (zum Beispiel Amazon PartnerNet, Werbenetzwerk,
                Spendenanbieter) mit Anschrift, welche Daten verarbeitet werden, Cookies und Tracking des Anbieters,
                Rechtsgrundlage (bei Cookies/Tracking Einwilligung nach § 25 Abs. 1 TDDDG und Art. 6 Abs. 1 lit. a
                DSGVO, mit Einwilligungsbanner), Drittlandübermittlung.]
              </p>
              <p>
                Affiliate-Links sind als Werbung gekennzeichnet. Wenn du über einen solchen Link kaufst, erhalten wir
                möglicherweise eine Provision. Für dich ändert sich der Preis nicht.
              </p>
            </>
          ),
        },
      ]
    : []),
  {
    id: "speicherdauer",
    title: "Speicherdauer",
    body: (
      <ul>
        <li>Konto, Listen, Wünsche und Favoriten: bis du sie oder dein Konto löschst.</li>
        <li>Zusagen und Namen von Schenkenden: bis zur Rücknahme, zum Entfernen durch die Besitzerin oder den Besitzer oder bis die Liste gelöscht wird.</li>
        <li>Server-Logfiles: nur kurzzeitig, danach werden sie gelöscht.</li>
        <li>Daten auf deinem Gerät: bis du sie in deinem Browser löschst.</li>
      </ul>
    ),
  },
  {
    id: "rechte",
    title: "Deine Rechte",
    body: (
      <>
        <p>Du hast nach der DSGVO folgende Rechte:</p>
        <ul>
          <li>Auskunft über deine gespeicherten Daten (Art. 15),</li>
          <li>Berichtigung unrichtiger Daten (Art. 16),</li>
          <li>Löschung (Art. 17), in deinem Profil kannst du dein Konto selbst löschen,</li>
          <li>Einschränkung der Verarbeitung (Art. 18),</li>
          <li>Übertragbarkeit deiner Daten (Art. 20),</li>
          <li>Widerruf einer erteilten Einwilligung mit Wirkung für die Zukunft (Art. 7 Abs. 3).</li>
        </ul>
        <p>
          <strong>Widerspruchsrecht nach Art. 21 DSGVO:</strong> Wenn wir Daten auf Grundlage eines berechtigten
          Interesses (Art. 6 Abs. 1 lit. f DSGVO) verarbeiten, kannst du aus Gründen, die sich aus deiner besonderen
          Situation ergeben, jederzeit dagegen Widerspruch einlegen. Wir verarbeiten die Daten dann nicht mehr, es sei
          denn, wir können zwingende schutzwürdige Gründe nachweisen.
        </p>
        <p>
          Schreib uns für alle Anliegen einfach an <Field value={operator.email} />. Außerdem hast du das Recht, dich
          bei einer Datenschutz-Aufsichtsbehörde zu beschweren, zum Beispiel bei der für uns zuständigen Behörde:{" "}
          <Field value={operator.authority} />.
        </p>
      </>
    ),
  },
  {
    id: "sonstiges",
    title: "Automatisierte Entscheidungen und Änderungen",
    body: (
      <>
        <p>
          Eine automatisierte Entscheidungsfindung einschließlich Profiling findet nicht statt. Du bist nicht
          verpflichtet, uns Daten bereitzustellen. Ohne E-Mail-Adresse, Nutzername und Passwort können wir dir aber
          kein Konto einrichten.
        </p>
        <p>
          Wenn sich unsere Webseite oder die Rechtslage ändert, passen wir diese Datenschutzerklärung an. Es gilt die
          jeweils hier veröffentlichte Fassung.
        </p>
      </>
    ),
  },
]

const Datenschutz = () => (
  <div className={styles.container}>
    <header className="page_header">
      <h1>Datenschutzerklärung</h1>
      <p>Welche Daten wir verarbeiten, wofür und welche Rechte du hast.</p>
    </header>

    <div className={styles.sheet}>
      <nav aria-label="Inhalt">
        <ol className={styles.toc}>
          {sections.map(({ id, title }) => (
            <li key={id}>
              <a href={`#${id}`}>{title}</a>
            </li>
          ))}
        </ol>
      </nav>

      {sections.map(({ id, title, body }, index) => (
        <section key={id} id={id} className={styles.section} aria-labelledby={`${id}-title`}>
          <h2 id={`${id}-title`}>
            {index + 1}. {title}
          </h2>
          {body}
        </section>
      ))}

      <p className={styles.updated}>Stand: {legalUpdated}</p>
    </div>
  </div>
)

export default Datenschutz
