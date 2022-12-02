import Head from "next/head";
import Image from "next/image";
import styles from "./Header.module.css";
import Link from "next/link";

type HeaderParams = {};

const Header = ({}: HeaderParams) => {
  return (
    <>
      <Head>
        <title>Wischlist</title>
      </Head>
      <div className="crit_header">
        <Link href="/" className="crit_header_logo">
          <Image
            src={"/favicon.ico"}
            alt="vercel icon"
            width={40}
            height={40}
            unoptimized
          />
        </Link>

        <h1 className={`crit_header_title ${styles.headline}`}>Wischlist</h1>
      </div>
      <nav className="crit_navigator">
        <Link href={"/"}>Home</Link>
        <Link href={"/entries"}>Lists</Link>
      </nav>
    </>
  );
};

export default Header;
