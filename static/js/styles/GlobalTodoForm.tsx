import {css, Global} from "@emotion/react";

const todoForm = {
  ".todoFormWrapper": css({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  }),
  ".todoForm": css({
    paddingTop: 50,
  }),
  ".titleWrapper": css({
    textAlign: "center",
    marginBottom: 20, 
    "& h1": {
      fontSize: 30,
      borderBottom: "solid",
      paddingBottom: 5,
    }
  }),
  ".todoFormContent": css({
    width: 400,
    marginBottom: 20,
    "& label": {
    },
    "& input": {
      width: 400,
    },
    "& textarea": {
      width: 400,
      height: 150,
    },
    "& select": {
      width: 150,
      display: "block",
    },
    ".inputDate": {
      width: 150,
      display: "block",
    }
  }),
  ".btnWrapper": css({
    textAlign: "center",
    paddingTop: 20,
    "& input": {
      width: "100%",
      height: 30,
      backgroundColor: "#000000",
      color: "#ffffff",
      borderRadius: 6,
      "&:hover": css({
        backgroundColor: "#2b2b2b",
      })
    }
  })
};

const GlobalTodoForm = () => {
  return (
    <Global styles={todoForm} />
  );
};

export default GlobalTodoForm;