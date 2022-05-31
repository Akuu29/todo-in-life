import React from "react";
import { css } from "@emotion/react";
import GlobalStyles from "../styles/Global";
import Header from "./common/Header";
import Footer from "./common/Footer";

const messageWrapper = css({
  height: 600,
  maxWidth: 800,
  margin: "0 auto",
  textAlign: "center",
  marginTop: 80,
});

const message = css({
  display: "inline-block",
  textAlign: "left",
  fontSize: 30,
});

const Index: React.FC = () => {
  return (
    <div>
      <GlobalStyles />
      <Header />
      <div css={messageWrapper}>
        <p css={message}>
          There is much todo in life.<br/>
          Manage them here.<br/>
          Todo can be managed in three categories:<br/>
          short term, medium term, and long term.<br/>
        </p>
      </div>
      <Footer />
    </div>
  );
}

export default Index;