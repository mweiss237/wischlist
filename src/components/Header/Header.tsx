import Head from "next/head";
import Image from "next/image";
import styles from "./Header.module.css";
import Link from "next/link";

type HeaderParams = {};

const Header = ({}: HeaderParams) => {
  return (
    <>
      <div className="crit_header">
        <Link href="/" className="crit_header_logo">
          <Image
            src={"/wischlist-color.svg"}
            alt="wischlist logo"
            width={60}
            height={60}
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
