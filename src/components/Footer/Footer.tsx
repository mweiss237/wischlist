import getVersion from "lib/env";

const Footer = () => {
  return (
    <footer className="crit_footer">
      <p>Copyright by Moritz Weiß / v{getVersion()}</p>
    </footer>
  );
};

export default Footer;
