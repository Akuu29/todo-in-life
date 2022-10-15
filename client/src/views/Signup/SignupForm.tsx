import {
  FC,
  useState,
  ChangeEventHandler,
  ChangeEvent,
  MouseEventHandler,
} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons/faEye";
import { faEyeSlash } from "@fortawesome/free-solid-svg-icons/faEyeSlash";
import GlobalStylesUserForm from "../../components/layout/GlobalStyles/GlobalStylesUserForm/GlobalStylesUserForm";

const SinupForm: FC = () => {
  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
    password: "",
  });

  // パスワードの表示、非表示の切り替え用のstate
  const [isShowPassword, setIsShowPassword] = useState(false);

  const handleChange: ChangeEventHandler = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const key = event.target.name;
    const val = event.target.value;
    setUserInfo({ ...userInfo, [key]: val });
    // TODO formバリデーション
  };

  const handleChangeIsShow: MouseEventHandler = () => {
    setIsShowPassword((prevState) => !prevState);
  };

  return (
    <div className="userFormContainer">
      <GlobalStylesUserForm />
      <form action="/signup" method="POST" className="userForm">
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
            onChange={handleChange}
          />
        </div>
        <div className="userFormContent">
          <label className="inputLabel">E-mail</label>
          <input
            type="text"
            name="email"
            placeholder="mail@address.com"
            required
            onChange={handleChange}
          />
        </div>
        <div className="userFormContentPassWord">
          <label className="inputLabel">password</label>
          <input
            type={isShowPassword ? "text" : "password"}
            name="password"
            placeholder="password"
            required
            onChange={handleChange}
          />
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
