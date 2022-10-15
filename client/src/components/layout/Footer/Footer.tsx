import { FC } from "react";
import { css } from "@emotion/react";

const footer = css({
  width: "100%",
});

const footerTitle = css({
  textAlign: "center",
  opacity: 0.5,
  margin: 50,
});

const Footer: FC = () => {
  return (
    <div css={footer}>
      <h4 css={footerTitle}>TODO IN LIFE@2022</h4>
    </div>
  );
};

export default Footer;
