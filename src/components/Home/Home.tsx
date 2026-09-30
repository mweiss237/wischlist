import Link from "next/link"
import { ArrowRight, Edit3, Gift, Share2 } from "react-feather"
import styles from "./Home.module.scss"

const features = [
  {
    Icon: Edit3,
    title: "Wünsche notieren",
    text: "Schreib deine Wünsche auf Zettel, setz Prioritäten und hänge Links an.",
  },
  {
    Icon: Share2,
    title: "Liste teilen",
    text: "Ein Link genügt – Familie und Freunde sehen deine Liste ganz ohne Konto.",
  },
  {
    Icon: Gift,
    title: "Überraschung bleibt",
    text: "Wer etwas schenkt, hakt es ab. Keine Doppelgeschenke, und du erfährst nichts.",
  },
]

const Home = () => (
  <div className={styles.home}>
    <section className={styles.hero}>
      <div className={`${styles.copy} rise_in`}>
        <span className="eyebrow">Frohes Schenken!</span>
        <h1>
          Die Wunschliste, die sich <em>von selbst</em> verwaltet.
        </h1>
        <p>
          Kennst du das? Du verschickst deine Wunschliste, aber niemand koordiniert sie.
          Entweder du verdirbst dir die Überraschung – oder du bekommst alles doppelt.
          Mit <b>Wischlist</b> haken Schenkende Wünsche einfach ab.
        </p>
        <div className={styles.actions}>
          <Link href="/list" className="btn btn-primary btn-lg">
            Meine Listen <ArrowRight size={18} aria-hidden />
          </Link>
          <Link href="/auth" className="btn btn-ghost btn-lg">
            Anmelden
          </Link>
        </div>
      </div>

      {/* decorative preview of a shared list */}
      <div className={styles.preview} aria-hidden>
        <div className={styles.backSheet} />
        <div className={`${styles.sheet} paper`}>
          <span className={styles.tape} />
          <span className="hand">Ich wünsche mir…</span>
          <h3>Weihnachten 2026</h3>
          <ul>
            <li className={styles.done}>
              <span className={styles.box} />
              <span>Kuscheldecke</span>
              <span className="chip chip-green">schenkt Oma</span>
            </li>
            <li>
              <span className={styles.box} />
              <span>Neues Kochbuch</span>
              <i className={styles.prioHigh} />
            </li>
            <li className={styles.done}>
              <span className={styles.box} />
              <span>Konzertkarten</span>
              <span className="chip chip-green">schenkt Lea</span>
            </li>
            <li>
              <span className={styles.box} />
              <span>Duftkerze</span>
              <i className={styles.prioLow} />
            </li>
          </ul>
        </div>
        <span className={styles.tag}>
          <Gift size={20} />
        </span>
      </div>
    </section>

    <section className={styles.features}>
      {features.map(({ Icon, title, text }, index) => (
        <article
          key={title}
          className={`${styles.feature} rise_in`}
          style={{ animationDelay: `${120 + index * 80}ms` }}
        >
          <span className={styles.featureIcon}>
            <Icon size={20} aria-hidden />
          </span>
          <h3>{title}</h3>
          <p>{text}</p>
        </article>
      ))}
    </section>
  </div>
)

export default Home
