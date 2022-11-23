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
      <div className="crit_header">
        <Image
          className="crit_header_logo"
          src={favicon}
          alt="vercel icon"
          width={40}
          height={40}
        />

        <h1 className={`crit_header_title ${styles.headline}`}>Wischlist</h1>
      </div>
    </>
  );
};

export default Header;
