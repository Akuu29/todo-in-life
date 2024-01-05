import { css } from "@emotion/react";

const messageWrapper = css({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "70vh",
  testAlign: "center",
});

const message = css({
  fontSize: 30,
  lineHeight: 1.5,
});

function TopContents() {
  return (
    <div css={messageWrapper}>
      <p css={message}>
        There is much todo in life.<br />
        Manage them here.<br />
        Todo can be managed in three categories:<br />
        short term, medium term, and long term.<br />
      </p>
    </div>
  );
}

export default TopContents;
