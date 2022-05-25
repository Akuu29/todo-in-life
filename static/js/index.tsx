import React from "react";
import ReactDOM from "react-dom";
import {css} from "@emotion/react";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";

const content = css({
  height: 600,
  maxWidth: 800,
  margin: "0 auto",
  textAlign: "center",
  marginTop: 80,
  fontFamily: "Arial Black"
});

const contentMain = css({
  display: "inline-block",
  textAlign: "left",
  fontSize: 30,
});

const Index: React.FC = () => {
  return (
    <div>
      <Header />
      <div css={content}>
        <p css={contentMain}>
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

const index = document.getElementById("index");
ReactDOM.render(<Index />, index);