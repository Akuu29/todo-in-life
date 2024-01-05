import { css } from "@emotion/react";

const message = css({
  color: "#CC0033",
});

function TodoFormErrorMessages(
  { errorMessages }:
    { errorMessages: Array<string> }) {
  return (
    <div>
      {errorMessages.map((errorMessage, i) => (
        <p css={message} key={i}>
          {errorMessage}
        </p>
      ))}
    </div>
  );
}

export default TodoFormErrorMessages;
