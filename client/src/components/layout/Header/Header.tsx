import { FC, useEffect, useState } from "react";
import { css } from "@emotion/react";
import { CookiesProvider, useCookies } from "react-cookie";

const header = css({
  width: "100%",
  paddingTop: 60,
  paddingBottom: 40,
  borderBottom: "solid 5px #000000",
});

const titleWrapper = css({
  textAlign: "center",
  fontSize: 70,
  marginBottom: 0,
});

const title = css({
  textDecoration: "none",
  color: "#000000",
});

const btnList = css({
  display: "flex",
  justifyContent: "flex-end",
});

const navgationBtn = css({
  listStyle: "none",
  marginRight: 30,
});

const btn = css({
  textDecoration: "none",
  color: "#000000",
  fontWeight: "bold",
  fontSize: 20,
  "&:hover": css({
    textDecoration: "underline",
  }),
});

const Header: FC = () => {
  const [cookies, setCookie] = useCookies(["messages"]);

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const manageLoginStatus = () => {
      const cookieMessages = cookies.messages;
      if (cookieMessages.length && cookieMessages[0].title) {
        const resultLoginOrSignup = cookieMessages[0].title;
        if (resultLoginOrSignup == "success") {
          setIsLoggedIn(true);
        }
      }
    };

    manageLoginStatus();
  }, [cookies]);

  return (
    <div css={header}>
      {/* CookiesProviderでラップしているコンポーネント内でcookieの管理が可能*/}
      <CookiesProvider>
        <h1 css={titleWrapper}>
          <a css={title} href="/">
            TODO IN LIFE
          </a>
        </h1>
        <nav>
          <ul css={btnList}>
            {isLoggedIn && (
              <li css={navgationBtn}>
                <a css={btn} href="/app">
                  HOME
                </a>
              </li>
            )}
            {!isLoggedIn && (
              <li css={navgationBtn}>
                <a css={btn} href="/signup">
                  Sign up
                </a>
              </li>
            )}
            {!isLoggedIn && (
              <li css={navgationBtn}>
                <a css={btn} href="/login">
                  Log in
                </a>
              </li>
            )}
            {isLoggedIn && (
              <li css={navgationBtn}>
                <a css={btn} href="/logout">
                  Log out
                </a>
              </li>
            )}
          </ul>
        </nav>
      </CookiesProvider>
    </div>
  );
};

export default Header;
