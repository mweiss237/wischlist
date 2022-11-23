import styles from "./Footer.module.css";
import getVersion from "lib/env";

type FooterParams = {};

const Footer = ({}: FooterParams) => {
  return (
    <footer className={styles.footer}>
      <p>Copyright by Moritz Weiß / v{getVersion()}</p>
    </footer>
  );
};

export default Footer;
