import React, { useContext } from "react";
import "../css/Sidebar.css";
import { useNavigate } from "react-router-dom";
import { DataContext } from "./DataContext";

const Sidebar = ({ isOpen, onClose, isLogin, setLogin }) => {
  const navigator = useNavigate(); // 이동을 위한 변수
  const { listData, faceData } = useContext(DataContext);

  // Resiter 페이지로 이동
  const RegisterOn = () => {
    navigator("/register");
    onClose();
  };

  // List 페이지로 이동
  const ListOn = () => {
    navigator("/List");
    onClose();
  };

  // Face 페이지로 이동
  // const FaceOn = () => {
  //   navigator("/Face");
  //   onClose();
  // };

  // 로그아웃 버튼을 눌렀을 때 확인
  const Move_to_login = async () => {
    const token = localStorage.getItem("authToken");

    if (token) {
      const response = await fetch("http://localhost:8000/validateToken", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      });
      // .then((response) => console.log(response));

      localStorage.removeItem("authToken");
      setLogin(false); // isLogin 상태 변경
      navigator("/");
      onClose();
    } else {
      navigator("/");
      onClose();
    }
  };
  return (
    <div className="sidebar_total">
      {/* 백드롭 추가: 사이드바가 열렸을 때만 보이도록 설정 */}
      {isOpen && <div className="backdrop" onClick={onClose}></div>}
      {/* 사이드바 설정: open, closed 나눠서 보이도록 설정 */}
      <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
        <div className="upload_Box">
          <button onClick={RegisterOn}>Register</button>
        </div>
        <div className="listTitle_Box">
          <h1>List</h1>
        </div>
        <div className="list_container">
          {listData.slice(0, 2).map((item) => (
            <div key={item.id} className="list-item">
              {item.id} - {item.person} - {item.date} - {item.shape}
            </div>
          ))}
          <button onClick={ListOn}>
            <img src="./image/read_more.png" alt="logo" />
          </button>
        </div>
        {/* <div className="faceTitle_Box">
          <h1>Face</h1>
        </div>
        <div className="face_container">
          {faceData.slice(0, 2).map((item) => (
            <div key={item.id} className="face-item">
              {item.id} - {item.person} - {item.date} - {item.part}
            </div>
          ))}
          <button onClick={FaceOn}>
            <img src="./image/read_more.png" alt="logo" />
          </button>
        </div> */}
        <div className="login_Box">
          <button className="sidebar_Login_Btn" onClick={Move_to_login}>
            {isLogin ? "Logout" : "Login"}{" "}
            {/* isLogin에 상태에 따라 Logout, Login 버튼 글자 변환 */}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
