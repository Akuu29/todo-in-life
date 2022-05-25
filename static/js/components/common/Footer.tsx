import React from "react";
import {css} from "@emotion/react";

const footer = css({
  width: "100%",
  fontFamily: "Arial Black"
});

const footerTitle = css({
  textAlign: "center",
});

const Footer: React.FC = () => {
  return (
    <div css={footer}>
      <h4 css={footerTitle}>TODO IN LIFE@2022</h4>
    </div>
  );
};

export default Footer;