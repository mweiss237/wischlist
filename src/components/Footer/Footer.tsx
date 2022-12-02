import getVersion from "lib/env";

type FooterParams = {};

const Footer = ({}: FooterParams) => {
  return (
    <footer className="crit_footer">
      <p>Copyright by Moritz Weiß / v{getVersion()}</p>
    </footer>
  );
};

export default Footer;
