import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Signup.css";

const Signup = () => {
  const navigate = useNavigate();
  // 상태 관리
  const [userid, setID] = useState("");
  const [password, setPW] = useState("");
  const [passwordCheck, setPWC] = useState("");
  const [number, setNum] = useState("");
  const [finish_pw_check, setCheck] = useState(false);

  // 정규 표현식
  // 24/08/30 아이디 최소 8자에서 6자로 변경
  const idRegEx = /^[A-Za-z0-9]{6,20}$/;
  const passwordRegEx = /^[A-Za-z0-9]{8,20}$/;
  const numberRegEx = /^\d{3}-\d{4}-\d{4}$/;

  // 비밀번호 확인(정규식 검증 포함)
  const CheckPw = async (e) => {
    e.preventDefault();

    if (!passwordRegEx.test(password)) {
      setPW("");
      setPWC("");
      return window.alert("비밀번호를 확인해주세요");
    }

    if (password === passwordCheck) {
      setCheck(true);
      return window.alert("확인되었습니다.");
    } else {
      setPW("");
      setPWC("");
      setCheck(false);
      return window.alert("비밀번호가 맞지 않습니다.");
    }
  };

  // 정규식 검증(아이디, 전화번호)
  const validateInput = () => {
    if (!idRegEx.test(userid)) {
      setID("");
      window.alert("아이디를 확인해주세요.");
      return false;
    }
    if (!numberRegEx.test(number)) {
      setNum("");
      window.alert("전화번호를 확인해주세요.");
      return false;
    }
    return true;
  };

  // 전화번호 입력 시 자동 하이픈 추가
  const numberAddHypen = (e) => {
    const { value } = e.target;

    // 입력 값에서 숫자만 필터링
    const filterValue = value.replace(/[^0-9]/g, "");

    // 하이픈 자동 추가
    let formatValue = "";
    if (filterValue.length < 4) {
      formatValue = filterValue;
    } else if (filterValue.length < 8) {
      formatValue = `${filterValue.slice(0, 3)}-${filterValue.slice(3)}`;
    } else {
      formatValue = `${filterValue.slice(0, 3)}-${filterValue.slice(
        3,
        7
      )}-${filterValue.slice(7, 11)}`;
    }

    setNum(formatValue);
  };

  // 서버 통신 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!finish_pw_check) {
      window.alert("비밀번호 확인을 해주세요.");
      return;
    } else if (!userid || !password || !number) {
      window.alert("모든 필드를 입력해 주세요.");
      return;
    }

    if (!validateInput()) {
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/signup", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ userid, password, number }),
      });

      const data = await response.json();

      if (data === "true") {
        window.alert("회원가입이 완료되었습니다.");
        navigate("/");
      } else if (data === "false") {
        window.alert("중복된 아이디입니다.");
        setID("");
      }
    } catch (error) {
      window.alert("error: ", error.massage);
    }
  };

  return (
    <div className="signup_total">
      <div className="signup_container">
        <h1>GUARDIAN</h1>
        <form onSubmit={handleSubmit}>
          <div className="signup_inputBox">
            <div>
              <div>ID</div>
              <input
                type="text"
                id="userid"
                value={userid}
                placeholder="영문, 숫자 포함 최소 6자 이상"
                className="signup_input"
                onChange={(e) => setID(e.target.value)}
              />
            </div>
            <div>
              <div>Password</div>
              <input
                type="password"
                id="password"
                value={password}
                placeholder="영문, 숫자 포함 최소 8자 이상"
                className="signup_input"
                onChange={(e) => setPW(e.target.value)}
              />
            </div>
            <div>
              <div>Password Check</div>
              <input
                type="password"
                id="passwordCheck"
                value={passwordCheck}
                placeholder="비밀번호 확인"
                className="signup_input checkpw"
                onChange={(e) => setPWC(e.target.value)}
              />
              <button type="button" className="checkpw_Btn" onClick={CheckPw}>
                Check
              </button>
            </div>
            <div>
              <div>HP</div>
              <input
                type="text"
                id="Number"
                value={number}
                placeholder="'-'없이 입력"
                className="signup_input"
                onChange={numberAddHypen}
              />
            </div>
          </div>
          <button type="submit" className="signup_signupBtn">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
