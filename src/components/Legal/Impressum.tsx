import Field from "./Field"
import { legalUpdated, monetizationActive, operator } from "./operator"
import styles from "./Legal.module.scss"

const Impressum = () => (
  <div className={styles.container}>
    <header className="page_header">
      <h1>Impressum</h1>
      <p>Angaben nach § 5 Digitale-Dienste-Gesetz (DDG).</p>
    </header>

    <div className={styles.sheet}>
      <h2>Anbieter</h2>
      <address className={styles.address}>
        <Field value={operator.name} />
        <br />
        <Field value={operator.street} />
        <br />
        <Field value={operator.city} />
        <br />
        Deutschland
      </address>

      <h2>Kontakt</h2>
      <dl className={styles.facts}>
        <dt>E-Mail</dt>
        <dd>
          {operator.email.startsWith("[") ? (
            <Field value={operator.email} />
          ) : (
            <a href={`mailto:${operator.email}`}>{operator.email}</a>
          )}
        </dd>
        <dt>Telefon</dt>
        <dd>
          <Field value={operator.phone} />
        </dd>
      </dl>

      {operator.vatId ? (
        <>
          <h2>Umsatzsteuer-ID</h2>
          <p>
            Umsatzsteuer-Identifikationsnummer nach § 27a Umsatzsteuergesetz:{" "}
            <Field value={operator.vatId} />
          </p>
        </>
      ) : null}

      <h2>Verantwortlich für redaktionelle Inhalte</h2>
      <p>
        Verantwortlich nach § 18 Abs. 2 Medienstaatsvertrag (MStV) für die von uns bereitgestellten Inhalte,
        zum Beispiel die Themen-Vorlagen und Geschenkideen: <Field value={operator.name} />, Anschrift wie oben.
      </p>

      <h2>Inhalte der Nutzerinnen und Nutzer</h2>
      <p>
        Wunschlisten, Wünsche, Notizen und Namen werden von den Nutzerinnen und Nutzern selbst eingetragen.
        Für diese Inhalte sind die jeweiligen Personen verantwortlich. Wir prüfen sie nicht vorab. Wenn dir ein
        rechtswidriger Inhalt auffällt, schreib uns bitte per E-Mail an die oben genannte Adresse. Wir prüfen den
        Hinweis zeitnah und entfernen den Inhalt, wenn er rechtswidrig ist.
      </p>

      {monetizationActive ? (
        <>
          <h2>Werbehinweis</h2>
          <p>
            Einige Links in Wunschlisten oder auf unseren Seiten sind Werbe- bzw. Affiliate-Links. Wenn du darüber
            etwas kaufst, erhalten wir unter Umständen eine Provision. Für dich ändert sich der Preis nicht. Solche
            Links sind entsprechend gekennzeichnet.
          </p>
        </>
      ) : null}

      <h2>Verbraucherstreitbeilegung</h2>
      <p>
        Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer
        Verbraucherschlichtungsstelle teilzunehmen.
      </p>

      <h2>Haftung für Links</h2>
      <p>
        Wünsche können Links zu fremden Webseiten enthalten. Auf deren Inhalte haben wir keinen Einfluss und
        übernehmen dafür keine Gewähr. Für die Inhalte der verlinkten Seiten ist immer der jeweilige Anbieter
        verantwortlich.
      </p>

      <p className={styles.updated}>Stand: {legalUpdated}</p>
    </div>
  </div>
)

export default Impressum
