import Head from "next/head";
import Image from "next/image";
import styles from "./Header.module.css";
import favicon from "../../../public/favicon.ico";
import Link from "next/link";

type HeaderParams = {};

const Header = ({}: HeaderParams) => {
  return (
    <>
      <Head>
        <title>Wischlist</title>
      </Head>
      <div className="crit_header">
        <Link href="/">
          <Image
            className="crit_header_logo"
            src={favicon}
            alt="vercel icon"
            width={40}
            height={40}
          />
        </Link>

        <h1 className={`crit_header_title ${styles.headline}`}>Wischlist</h1>
      </div>
    </>
  );
};

export default Header;
