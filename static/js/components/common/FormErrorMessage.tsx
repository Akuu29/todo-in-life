import { FC } from "react";
import { css } from "@emotion/react";

const message = css({
  color: "#CC0033"
});

const FormErrorMessage: FC<{errorMessages: Array<string>}> = ({errorMessages}) => {
  return (
    <div>
      {errorMessages.map((errorMessage) => (
        <p css={message}>{errorMessage}</p>
      ))}
    </div>
  );
};

export default FormErrorMessage;