import { FC } from "react";
import { css } from "@emotion/react"

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

const TopContents: FC = () => {
  return (
    <div css={messageWrapper}>
      <p css={message}>
        There is much todo in life.<br/>
        Manage them here.<br/>
        Todo can be managed in three categories:<br/>
        short term, medium term, and long term.<br/>
      </p>
    </div>
  )
};

export default TopContents;