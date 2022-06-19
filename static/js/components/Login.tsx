import { FC } from "react";
import { CookiesProvider } from "react-cookie";
import GlobalStyles from "./common/styles/Global";
import Header from "./common/Header";
import Footer from "./common/Footer";
import LoginForm from "./Login/LoginForm";
import UserFormErrorMessages from "./common/UserFormErrorMessages";

const Login: FC = () => {
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

export default Login;