import Head from "next/head"
import Image from "next/image"
import styles from "./Home.module.scss"

const Home = () => {

  return (
    <div className={styles.container}>
      <Head>
        <title>Wischlist</title>
        <meta
          name="description"
          content="Deine persönliche Wunschliste für Freunde und Familie!"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.main}>
        <h2>Der Wunschlistendrucker spinnt gerade noch</h2>

        <Image
          src={"/processing.svg"}
          alt="construction side"
          width={300}
          height={200}
          loading={"eager"}
          unoptimized
        />

        <p>Kennst du das? Du schreibst deine Wunschliste und schickst jedem die gleiche Liste. Am Ende schenken dir Familie und Freunde die gleichen Geschenke doppelt und dreifach.</p>
        <p>Nein? Auch gut. Um das aber schon für die Zukunft zu vermeiden, kannst du hier Wünsche erfassen und diese anschließend teilen.</p>
        <p>Das coole dabei - die Schenkenden können Einträge als "abgehakt" markieren und jeder sieht es! Keine doppelten Geschenke mehr! 😍</p>
      </div>
    </div>
  )
}

export default Home
