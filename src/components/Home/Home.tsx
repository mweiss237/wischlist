import Head from "next/head";
import Image from "next/image";
import styles from "./Home.module.css";

const Home = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Wischlist</title>
        <meta
          name="description"
          content="Your personal wischlist for friends and family"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.main}>
        <h2>We are currently setting things up!</h2>

        <Image
          src={'/under_construction.png'}
          alt="construction side"
          width={300}
          height={200}
          loading={"eager"}
          unoptimized
        />

        <h2>Be patient!</h2>
        <p>Maybe this thing is partially running until christmas in some years...</p>
      </div>
    </div>
  );
};

export default Home;
