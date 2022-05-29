import React from "react";
import GlobalStyles from "../styles/Global";
import Header from "./common/Header";
import Footer from "./common/Footer";
import AppForm from "./App/AppForm";
// import AppTodos from "./App/AppTodos";

const App: React.FC = () => {
  return (
    <div>
      <GlobalStyles />
      <Header />
      <AppForm />
      {/* <AppTodos /> */}
      <Footer />
    </div>
  );
};

export default App;