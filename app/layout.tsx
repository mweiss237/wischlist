import Footer from "components/Footer/Footer";
import Header from "components/Header/Header";
import "../src/styles/globals.css";
import "../src/styles/critical.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <head></head>
      <body>
          <Header />
        <main>
          <span className="crit_content">{children}</span>
        </main>
          <Footer />
      </body>
    </html>
  );
}
