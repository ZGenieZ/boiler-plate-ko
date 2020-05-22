import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { registerUser } from "../../../_actions/user_action";
import { withRouter } from "react-router-dom";

function RegisterPage(props) {
  const dispatch = useDispatch();

  const [Email, setEmail] = useState("");
  const [Name, setName] = useState("");
  const [Password, setPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");

  //input창에 입력을 했을때 onchange 이벤트가 발생하여 입력한 내용이 setEmail로 들어가서 Email State를 변경
  const onEmailHandler = (event) => {
    setEmail(event.currentTarget.value);
  };

  //input창에 입력을 했을때 onchange 이벤트가 발생하여 입력한 내용이 setName로 들어가서 Name State를 변경
  const onNameHandler = (event) => {
    setName(event.currentTarget.value);
  };

  //input창에 입력을 했을때 onchange 이벤트가 발생하여 입력한 내용이 setPassword로 들어가서 Password State를 변경
  const onPasswordHandler = (event) => {
    setPassword(event.currentTarget.value);
  };

  //input창에 입력을 했을때 onchange 이벤트가 발생하여 입력한 내용이 setConfirmPassword로 들어가서 ConfirmPassword State를 변경
  const onConfirmPasswordHandler = (event) => {
    setConfirmPassword(event.currentTarget.value);
  };

  const onSubmitHandler = (event) => {
    //페이지 refresh 방지
    event.preventDefault();

    if (Password !== ConfirmPassword) {
      return alert("비밀번호와 비밀번호 확인은 같아야 합니다.");
    }

    let body = {
      email: Email,
      password: Password,
      name: Name,
    };

    //registerUser action을 실행
    dispatch(registerUser(body)).then((response) => {
      if (response.payload.success) {
        //메인 페이지로 이동시킴
        props.history.push("/login");
      } else {
        alert("Failed to Sign!");
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

        <label>Name</label>
        <input type="text" value={Name} onChange={onNameHandler} />

        <label>Password</label>
        <input type="password" value={Password} onChange={onPasswordHandler} />

        <label>Confirm Password</label>
        <input
          type="password"
          value={ConfirmPassword}
          onChange={onConfirmPasswordHandler}
        />

        <br />
        <button type="submit">회원가입</button>
      </form>
    </div>
  );
}

export default withRouter(RegisterPage);
