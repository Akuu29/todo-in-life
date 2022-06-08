import { css, Global } from "@emotion/react";

const userForm = {
  ".userFormWrapper": css({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  }),
  ".userForm": css({
    width: 400,
    borderRight: "2px solid #000000",
    borderLeft: "2px solid #000000",
    borderBottom: "2px solid #000000",
    borderRadius: 20,
  }),
  ".titleWrapper": css({
    height: 60,
    width: 400,
    backgroundColor: "#000000",
    borderTop: "2px solid #000000",
    borderRadius: "20px 20px 0 0",
    marginBottom: 30,
    position: "relative",
    "& h1": {
      color: "#ffffff",
      fontSize: 26,
      width: 300,
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translateY(-50%) translateX(-50%)",
    }
  }),
  ".userFormContent": css({
    width: 300,
    margin: "auto",
    paddingBottom: 20,
    ".inputLabel": {
      color: "#777",
    },
    "& input": {
      width: 300,
      height: 30,
      backgroundColor: "#eee",
      border: "none",
      outline: "none",
    },
  }),
  ".userFormContentPassWord": css({
    width: 300,
    height: 30,
    margin: "auto",
    paddingBottom: 20,
    "& label": {
      color: "#777",
    },
    "& input": {
      width: 275,
      height: 30,
      backgroundColor: "#eee",
      border: "none",
      outline: "none",
    },
    "& span": {
      position: "absolute",
      width: 25,
      height: 24,
      backgroundColor: "#eee",
      paddingTop: 8,
    },
  }),
  ".btnWrapper": css({
    paddingTop: 20,
    paddingBottom: 20,
    width: 120,
    margin: "auto",
    "& input": {
      width: 120,
      height: 40,
      backgroundColor: "#000000",
      color: "#ffffff",
      borderRadius: 6,
      cursor: "pointer",
      "&:hover": {
        opacity: 0.6,
      }
    }
  }),
};

const GlobalUserForm = () => {
  return (
    <Global styles={userForm} />
  );
};

export default GlobalUserForm;