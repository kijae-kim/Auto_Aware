import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [userid, setUserid] = useState("");
  const [password, setUserpw] = useState("");

  const handleSignupClick = () => {
    navigate("/signup"); // 회원가입 페이지로 이동
  };

  const CheckID = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ userid, password }),
      });

      const data = await response.json(); // text() -> json()으로 수정, text()일 경우 문자열은 bool값으로 인식되지 않기 때문에 json으로 받아줘야함

      if (data !== "false") {
        console.log(data);
        window.alert("로그인 완료!");
        localStorage.setItem("authToken", data);
        navigate("/main");
      } else {
        window.alert("아이디 또는 비밀번호를 확인해주세요.");
        setUserid("");
        setUserpw("");
      }
    } catch (error) {
      window.alert("error: ", error.message);
    }
  };

  return (
    <div className="login_total">
      <div className="login_container">
        <h1>GUARDIAN</h1>
        <form onSubmit={CheckID}>
          <div className="login_inputBox">
            <input
              type="text"
              id="userid"
              value={userid}
              placeholder="아이디"
              className="login_input login_ID"
              onChange={(e) => setUserid(e.target.value)}
            />
            <input
              type="password"
              id="password"
              value={password}
              placeholder="비밀번호"
              className="login_input login_PW"
              onChange={(e) => setUserpw(e.target.value)}
            />
          </div>
          <div className="login_BtnBox">
            <button type="submit" className="login_loginBtn">
              로그인
            </button>
            <button className="login_signupBtn" onClick={handleSignupClick}>
              회원가입
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
