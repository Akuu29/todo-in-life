import { FC, useEffect, useState } from "react";
import { css } from "@emotion/react";
import { useCookies } from "react-cookie";

const errorMessageArea = css({
  height: 120,
  width: "100%",
});

const errorMessageConteiner = css({
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
};

const UserFormErrorMessages: FC<{formType: string}> = ({formType}) => {
  const [cookies, setCookie] = useCookies(["messages"]);
  
  const [isError, setIsError] = useState(false);

  const [errorMessages, setErrorMessages] = useState<Array<Message>>([]);

  useEffect(() => {
    const getCookieMessages = () => {
      const messagesFromCookie = cookies.messages;

      const messages: Array<Message> = [];

      if(messagesFromCookie) {
        messagesFromCookie
          .filter((message: Message) => formType == message.form_type)
          .forEach((message: Message) => {
          if(message.title == "error") {
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
      if(errorMessages.length) {
        setIsError(true);
      }
    }

    controlErrorMessagesDisp();
  }, [errorMessages]);

  return (
    <div css={errorMessageArea}>
      {isError && 
        <div css={errorMessageConteiner}>
          {errorMessages.map((errorMessage, i) => {
            return (
              <div css={errorMessageContent} key={i}>
                ・{errorMessage.content}
              </div>
            )
          })}
        </div>
      }
    </div>
  );
};

export default UserFormErrorMessages;