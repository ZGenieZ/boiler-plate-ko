import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../../../_actions/user_action";
import { withRouter } from "react-router-dom";

function LoginPage(props) {
  const dispatch = useDispatch();

  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");

  //input창에 입력을 했을때 onchange 이벤트가 발생하여 입력한 내용이 setEmail로 들어가서 Email State를 변경
  const onEmailHandler = (event) => {
    setEmail(event.currentTarget.value);
  };

  //input창에 입력을 했을때 onchange 이벤트가 발생하여 입력한 내용이 setPassword로 들어가서 Password State를 변경
  const onPasswordHandler = (event) => {
    setPassword(event.currentTarget.value);
  };

  const onSubmitHandler = (event) => {
    //페이지 refresh 방지
    event.preventDefault();

    let body = {
      email: Email,
      password: Password,
    };

    //loginUser action을 실행
    dispatch(loginUser(body)).then((response) => {
      if (response.payload.loginSuccess) {
        //메인 페이지로 이동시킴
        props.history.push("/");
      } else {
        alert("Error!");
      }
    });
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100vh",
      }}
    >
      <form
        style={{ display: "flex", flexDirection: "column" }}
        onSubmit={onSubmitHandler}
      >
        <label>Email</label>
        <input type="email" value={Email} onChange={onEmailHandler} />
        <label>Password</label>
        <input type="password" value={Password} onChange={onPasswordHandler} />

        <br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default withRouter(LoginPage);
