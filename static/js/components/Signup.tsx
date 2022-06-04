import { FC } from "react";

import GlobalStyles from "../styles/Global";
import Header from "./common/Header";
import Footer from "./common/Footer";
import SignupForm from "./Signup/SignupForm";

const Signup: FC = () => {
  return (
    <div>
      <GlobalStyles />
      <Header />
      <SignupForm />
      <Footer />
    </div>
  );
}

export default Signup;