import GlobalStyles from "../../components/layout/GlobalStyles/GlobalStyles";
import Header from "../../components/layout/Header/Header";
import Footer from "../../components/layout/Footer/Footer";
import TopContents from "./TopContents";

function TopPage() {
  return (
    < div >
      <GlobalStyles />
      <Header />
      <TopContents />
      <Footer />
    </div >
  );
}

export default TopPage;
