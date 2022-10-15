import { FC } from "react";
import { CookiesProvider } from "react-cookie";
import GlobalStyles from "../../components/layout/GlobalStyles/GlobalStyles";
import Header from "../../components/layout/Header/Header";
import Footer from "../../components/layout/Footer/Footer";
import UserFormErrorMessages from "../../components/forms/UserFormErrorMessages/UserFormErrorMessages";
import LoginForm from "./LoginForm";

const LoginPage: FC = () => {
  return (
    <div>
      {/* CookiesProviderでラップしているコンポーネント内でcookieの管理が可能*/}
      <CookiesProvider>
        <GlobalStyles />
        <Header />
        <UserFormErrorMessages formType="login" />
        <LoginForm />
        <Footer />
      </CookiesProvider>
    </div>
  );
};

export default LoginPage;
