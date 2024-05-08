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
        <h2>Wischlist - die digitale Wunschliste!</h2>

        <Image
          src={"/processing.svg"}
          alt="construction side"
          width={300}
          height={200}
          loading={"eager"}
          unoptimized
        />

        <h3>Was ist Wischlist?</h3>
        <p>Kennst du das? Du schreibst deine Wunschliste und schickst sie jedem aber niemand moderiert die Liste. Entweder du machst es selbst und verdirbst dir die Überraschung oder du bekommst alles doppelt und dreifach.</p>
        <p>Falls ja, wird <b>Wischlist</b> die Lösung für dich sein! Hier kannst du Wunschlisten ganz einfach erfassen und diese anschließend teilen.</p>
        <p>Das Coole dabei - da die Einträge in der geteilten Liste abgehakt werden können, verwalten sich deine Wünsche von ganz alleine! 😍🎁</p>
      </div>
    </div>
  )
}

export default Home
