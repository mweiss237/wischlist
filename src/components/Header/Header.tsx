import Head from "next/head";
import Image from "next/image";
import styles from "./Header.module.css";
import favicon from "../../../public/favicon.ico";

type HeaderParams = {};

const Header = ({}: HeaderParams) => {
  return (
    <>
      <Head>
        <title>Wischlist</title>
      </Head>

      <Image className="example" src={favicon} alt="vercel icon" width={40} height={40} />

      <h1 className={`waffleFont ${styles.headline}`}>Wischlist</h1>
    </>
  );
};

export default Header;
