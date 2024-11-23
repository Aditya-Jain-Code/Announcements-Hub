import "@/styles/globals.css";
import Header from "@/components/Header";
import Aos from "@/components/Aos";
import ScrollToTopBtn from "@/components/ScrollToTopBtn";
import TopLoadingLine from "@/components/ToLoadingLine";

export default function App({ Component, pageProps }) {
  return <>
    <Header />
    <main>
      <TopLoadingLine />
      <Aos>
        <Component {...pageProps} />
      </Aos>
      <ScrollToTopBtn />
    </main>
  </>
}
