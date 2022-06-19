import { FC } from "react";
import { CookiesProvider } from "react-cookie";
import GlobalStyles from "./common/styles/Global";
import Header from "./common/Header";
import Footer from "./common/Footer";
import SignupForm from "./Signup/SignupForm";
import UserFormErrorMessages from "./common/UserFormErrorMessages";

const Signup: FC = () => {
  return (
    <div>
      {/* CookiesProviderでラップしているコンポーネント内でcookieの管理が可能 */}
      <CookiesProvider>
        <GlobalStyles />
        <Header />
        <UserFormErrorMessages formType="signup"/>
        <SignupForm />
        <Footer />
      </CookiesProvider>
    </div>
  );
};

export default Signup;