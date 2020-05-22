import React, { useEffect } from "react";
import Axios from "axios";
import { useDispatch } from "react-redux";
import { auth } from "../_actions/user_action";

//SpecificComponent = hoc가 감쌀 컴포넌트
//option = null : 아무나 출입이 가능한 페이지, true : 로그인한 유저만 출입이 가능한 페이지, false : 로그인한 유저는 출입 불가능한 페이지
//adminRoute : 어드민만 출입이 가능하게 하려면 true, 반대는 false, 기본값은 null로 설정(ES6 문법)
export default function (SpecificComponent, option, adminRoute = null) {
  function AuthenticationCheck(props) {
    const dispatch = useDispatch();
    useEffect(() => {
      dispatch(auth()).then((response) => {
        console.log(response);

        //로그인 하지 않은 상태
        if (!response.payload.isAuth) {
          if (option) {
            props.history.push("/login");
          }
        } else {
          //로그인 한 상태에서 관리자가 아닌데 관리자 페이지에 들어가려 하는경우
          if (adminRoute && !response.payload.isAdmin) {
            props.history.push("/");
          } else {
            if (option === false) {
              //로그인한 유저가 출입 불가능한 페이지에 접근할 때
              props.history.push("/");
            }
          }
        }
      });
    }, []);

    return <SpecificComponent />;
  }

  return AuthenticationCheck;
}
