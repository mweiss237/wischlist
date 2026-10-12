import Link from "next/link"
import { ArrowRight } from "react-feather"
import { Bow, DoodleCheck } from "components/Doodle/Doodle"
import styles from "./Home.module.scss"

const steps = [
  {
    title: "Liste schreiben",
    text: "Notier deine Wünsche auf Zettel, setz Prioritäten und häng Links an.",
  },
  {
    title: "Link teilen",
    text: "Ein Link genügt. Familie und Freunde sehen deine Liste ganz ohne Konto.",
  },
  {
    title: "Abhaken lassen",
    text: "Wer etwas besorgt, hakt es ab. Nichts kommt doppelt, und du erfährst nichts.",
  },
]

const previewWishes = [
  { text: "Kuscheldecke", priority: 2, giver: "Oma" },
  { text: "Neues Kochbuch", priority: 1 },
  { text: "Konzertkarten", priority: 1, giver: "Lea" },
  { text: "Duftkerze", priority: 3 },
]

const Home = () => (
  <div className={styles.home}>
    <section className={styles.hero}>
      <div className={`${styles.copy} lay_in`}>
        <h1>
          Die Wunschliste, die sich <em>von selbst</em> verwaltet.
        </h1>
        <p>
          Kennst du das? Du verschickst deine Wunschliste, aber niemand koordiniert sie.
          Entweder du verdirbst dir die Überraschung oder du bekommst alles doppelt.
          Mit <b>Wischlist</b> haken Schenkende Wünsche einfach ab.
        </p>
        <div className={styles.actions}>
          <Link href="/list" className="btn btn-primary btn-lg">
            Meine Listen <ArrowRight size={18} aria-hidden />
          </Link>
          <Link href="/auth" className="btn btn-tertiary btn-lg">
            Anmelden
          </Link>
        </div>
      </div>

      {/* decorative: a wish list, a wrapped present and a gift tag on the packing table */}
      <div className={styles.table} aria-hidden>
        <div className={styles.sheet}>
          <span className={`tape ${styles.sheetTape}`} />
          <span className={styles.sheetRemark}>Ich wünsche mir…</span>
          <ul>
            {previewWishes.map(({ text, priority, giver }) => (
              <li key={text} className={giver ? styles.done : undefined}>
                <span className={styles.box}>{giver ? <DoodleCheck className={styles.check} /> : null}</span>
                <span className={styles.wish}>{text}</span>
                <span className="prio_tape" data-priority={priority} />
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.package}>
          <div className={styles.wrap} data-wrapping="berry" data-pattern="dots">
            <Bow className={styles.bow} />
          </div>
          <div className={styles.label}>
            <span className="field">
              <span className="field_key">Für</span>
              <span className="field_value">Lea</span>
            </span>
            <span className="field">
              <span className="field_key">Am</span>
              <span className="field_value">24.12.</span>
            </span>
          </div>
        </div>

        <span className={styles.tag}>von Oma</span>
      </div>
    </section>

    {/* three numbered notes on one sheet instead of a feature grid */}
    <section className={styles.stepsWrapper} aria-labelledby="steps-title">
      <div className={`${styles.steps} torn_bottom`}>
        <h2 id="steps-title">So funktioniert&apos;s</h2>
        <ol>
          {steps.map(({ title, text }, index) => (
            <li key={title}>
              <span className={styles.number} aria-hidden>{index + 1}.</span>
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  </div>
)

export default Home
