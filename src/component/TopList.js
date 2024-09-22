import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/TopList.css";

const TopList = ({ activeItem }) => {
  const navigate = useNavigate();

  const menuItems = ["List", "Register", "MyPage"];

  const handleNavigation = (path) => {
    navigate(`/${path.toLowerCase()}`);
  };

  return (
    <div className="register-top-container">
      <div className="register-top">
        {menuItems.map((item) => (
          <div
            key={item}
            className={activeItem === item ? "active" : ""}
            onClick={() => handleNavigation(item)}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopList;
