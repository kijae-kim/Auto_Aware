import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../css/Header.css";
import Sidebar from "./Sidebar";
import { DataContext } from "./DataContext";
import Bell from "./Bell";

const Header = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isLogin, setLogin] = useState(false);
  const location = useLocation(); // 현재 경로를 추적
  const navigator = useNavigate();

  // const { listData, faceData } = useContext(DataContext);

  // 사이드바 열고 닫힘 확인
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  // 24.08.30 페이지로 이동
  const Move_to_Main = () => {
    navigator("/main");
  };
  const Move_to_List = () => {
    navigator("/list");
  };
  const Move_to_Map = () => {
    navigator("/map");
  };

  // localStorage에 저장된 토큰이 있는지 확인
  useEffect(() => {
    const token = localStorage.getItem("authToken");

    setLogin(!!token);
  }, [location]);

  return (
    <div className="header_total">
      <header className="header">
        <div className="menu_logo">
          <button onClick={toggleSidebar}>
            <img src="/image/menu.png" alt="menu" />
            {/* <div className="logoBox">
              <img src="./image/logo.png" alt="logo" />
              <h2>GUARDIAN</h2>
            </div> */}
          </button>
          <div className="logoBox">
            <img src="./image/logo.png" alt="logo" />
            <h2>Auto Aware</h2>
          </div>
        </div>
        <nav className="menu">
          <ul>
            <li>
              <div onClick={Move_to_Main}>main ▼</div>
            </li>
            <li>
              <div onClick={Move_to_List}>List ▼</div>
            </li>
            <li>
              <div onClick={Move_to_Map}>Map ▼</div>
            </li>
          </ul>
        </nav>
        <div className="bell_logo">
          <Bell />
        </div>
      </header>
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={toggleSidebar}
        isLogin={isLogin}
        setLogin={setLogin}
      />
    </div>
  );
};

export default Header;
