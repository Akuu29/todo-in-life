import { FC } from "react";

import GlobalStyles from "../styles/Global";
import Header from "./common/Header";
import Footer from "./common/Footer";
import LoginForm from "./Login/LoginForm";

const Login: FC = () => {
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