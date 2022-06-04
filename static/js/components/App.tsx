import { FC } from "react";

import GlobalStyles from "../styles/Global";
import Header from "./common/Header";
import Footer from "./common/Footer";
import AppTodos from "./App/AppTodos";

const App: FC = () => {
  return (
    <div>
      <GlobalStyles />
      <Header />
      <AppTodos />
      <Footer />
    </div>
  );
};

export default App;