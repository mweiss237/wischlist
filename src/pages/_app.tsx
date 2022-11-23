import Footer from "components/Footer/Footer";
import Header from "components/Header/Header";
import { AppProps } from "next/app";
import "styles/globals.css";
import "styles/critical.css";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Header />
      <main className="crit_main">
        <Component {...pageProps} />
      </main>
      <Footer />
    </>
  );
};

export default App;
