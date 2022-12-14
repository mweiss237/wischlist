import Head from "next/head";
import Image from "next/image";
import styles from "./Home.module.scss";

const Home = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Wischlist</title>
        <meta
          name="description"
          content="Your personal wischlist for friends and family with an extra 'c'"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.main}>
        <h2>Der Wunschlistendrucker spinnt gerade</h2>

        <Image
          src={'/processing.svg'}
          alt="construction side"
          width={300}
          height={200}
          loading={"eager"}
          unoptimized
        />

        <p>Das Tool befindet sich noch im Aufbau</p>
      </div>
    </div>
  );
};

export default Home;
