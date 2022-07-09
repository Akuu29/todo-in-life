import { FC } from "react";
import { css } from "@emotion/react";

const message = css({
  color: "#CC0033"
});

const FormErrorMessage: FC<{errorMessages: Array<string>}> = ({errorMessages}) => {
  return (
    <div>
      {errorMessages.map((errorMessage, i) => (
        <p css={message} key={i}>{errorMessage}</p>
      ))}
    </div>
  );
};

export default FormErrorMessage;