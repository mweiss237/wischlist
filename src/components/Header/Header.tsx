import Image from "next/image";
import styles from "./Header.module.scss";
import Link from "next/link";

const Header = () => {
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
        <span className="align-start">
          <Link href={"/"}>Home</Link>
          <Link href={"/entries"}>Lists</Link>
        </span>
        <span className="align-end">
          <Link href={"/register"}>
            <Image
              src={"/user.svg"}
              width={18}
              height={18}
              style={{ position: "relative" }}
              alt="Login"
            />
          </Link>
        </span>
      </nav>
    </>
  );
};

export default Header;
