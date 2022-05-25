import React from "react";
import {css} from "@emotion/react";

const header = css({
  width: "100%",
  fontFamily: "Arial Black"
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

const ul = css({
  display: "flex",
  justifyContent: "flex-end"
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
  })
});

const Header: React.FC = () => {
  return (
    <div css={header}>
      <h1 css={titleWrapper}>
        <a css={title} href="/">TODO IN LIFE</a>
      </h1>
      <nav>
        <ul css={ul}>
          <li css={navgationBtn}>
            <a css={btn} href="/">HOME</a>
          </li>
          <li css={navgationBtn}>
            <a css={btn} href="/signup">Sign up</a>
          </li>
          <li css={navgationBtn}>
            <a css={btn} href="/login">Log in</a>
          </li>
          <li css={navgationBtn}>
            <a css={btn} href="/logout">Log out</a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Header;