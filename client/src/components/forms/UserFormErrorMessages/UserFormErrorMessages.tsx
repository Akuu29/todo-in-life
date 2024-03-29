import { useEffect, useState } from "react";
import { css } from "@emotion/react";
import { useCookies } from "react-cookie";

const errorMessageContainer = css({
  height: 120,
  width: "100%",
});

const errorMessageWrapper = css({
  margin: "auto",
  height: 120,
  width: 400,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
});

const errorMessageContent = css({
  color: "#CC0033",
  paddingBottom: 10,
});

interface Message {
  form_type: string;
  title: string;
  content: string;
}

function UserFormErrorMessages({ formType }: { formType: string }) {
  const [cookies,] = useCookies(["messages"]);

  const [isError, setIsError] = useState(false);

  const [errorMessages, setErrorMessages] = useState<Array<Message>>([]);

  useEffect(() => {
    const getCookieMessages = () => {
      const messagesFromCookie = cookies.messages;

      const messages: Array<Message> = [];

      if (messagesFromCookie) {
        messagesFromCookie
          .filter((message: Message) => formType == message.form_type)
          .forEach((message: Message) => {
            if (message.title == "error") {
              messages.push(message);
            }
          });
      }

      setErrorMessages(messages);
    };

    getCookieMessages();
  }, [cookies]);

  useEffect(() => {
    const controlErrorMessagesDisp = () => {
      if (errorMessages.length) {
        setIsError(true);
      }
    };

    controlErrorMessagesDisp();
  }, [errorMessages]);

  return (
    <div css={errorMessageContainer}>
      {isError && (
        <div css={errorMessageWrapper}>
          {errorMessages.map((errorMessage, i) => {
            return (
              <div css={errorMessageContent} key={i}>
                ・{errorMessage.content}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default UserFormErrorMessages;
