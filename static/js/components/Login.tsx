import React from "react";
import GlobalStyles from "../styles/Global";
import Header from "./common/Header";
import Footer from "./common/Footer";
import LoginForm from "./Login/LoginForm";

const Login: React.FC = () => {
  return (
    <div>
      <GlobalStyles />
      <Header />
      <LoginForm />
      <Footer />
    </div>
  );
};

export default Login;