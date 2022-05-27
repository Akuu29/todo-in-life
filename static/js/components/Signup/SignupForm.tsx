import React, {useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye, faEyeSlash} from "@fortawesome/free-solid-svg-icons";
import GlobalUserForm from "../../styles/GlobalUserForm";

type HundleSubmit = () => void;

const SinupForm: React.FC = () => {
  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
    password: "",
  });
  // パスワードの表示、非表示の切り替え用のstate
  const [isShowPassword, setIsShowPassword] = useState(false);

  const handleSubmit: HundleSubmit = async () => {
    const params = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(userInfo),
    };

    const createUserResult = await fetch("/signup", params);
  };

  const handleChange: React.ChangeEventHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const key = event.target.name;
    const val = event.target.value;
    setUserInfo({...userInfo, [key]: val});
// TODO formバリデーション
  };

  const handleChangeIsShow: React.MouseEventHandler = () => {
    setIsShowPassword((prevState) => !prevState);
  };

  return(
    <div className="userFormWrapper">
      <GlobalUserForm />
      <form className="userForm" onSubmit={handleSubmit} >
        <div className="titleWrapper">
          <h1>Sign Up</h1>
        </div>
        <div className="userFormContent">
          <label className="inputLabel">Username</label>
          <input
            type="text"
            name="username"
            placeholder="username"
            required
            onChange={handleChange} />
        </div>
        <div className="userFormContent">
          <label className="inputLabel">E-mail</label>
          <input
            type="text"
            name="email"
            placeholder="mail@address.com"
            required
            onChange={handleChange} />
          </div>
        <div className="userFormContentPassWord">
          <label className="inputLabel">password</label>
          <input
            type={isShowPassword ? "text" : "password"}
            name="password"
            placeholder="password"
            required
            onChange={handleChange} />
          <span onClick={handleChangeIsShow}>
            {isShowPassword ? (
              <FontAwesomeIcon icon={faEyeSlash} />
            ) : (
              <FontAwesomeIcon icon={faEye} />
            )}
          </span>
        </div>
        <div className="btnWrapper">
          <input type="submit" value="Sign Up" />
        </div>
      </form>
    </div>
  );
};

export default SinupForm;