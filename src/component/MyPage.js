import React from "react";
import { useNavigate } from "react-router-dom";
import TopList from "./TopList";
import "../css/MyPage.css";

const MyPage = () => {
  const navigate = useNavigate();

  // 임시 사용자 데이터
  const userData = {
    id: "2233",
    name: "Ki-jae",
    date: "24-08-22",
    class: "Sub_oner",
    registerDate: "2024-08-22 12:43",
    imageUrl: "/Users/gimgijae/Desktop/ga/client/public/image/enfj.jpeg", // 실제 이미지 경로로 교체 필요
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleModify = () => {
    // 수정 로직 구현
    console.log("Modify user data");
  };

  return (
    <div className="mypage-container">
      <TopList activeItem="MyPage" />
      <div className="mypage-content">
        <div className="user-header">
          <div className="user-id">#{userData.id}</div>
          <div className="user-name">{userData.name}</div>
          <div className="user-date">{userData.date}</div>
        </div>
        <div className="user-details">
          <div className="user-image">
            <img src={userData.imageUrl} alt={userData.name} />
          </div>
          <div className="user-info">
            <div className="info-item">
              <span className="info-label">Class</span>
              <span className="info-value">{userData.class}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Register date</span>
              <span className="info-value">{userData.registerDate}</span>
            </div>
          </div>
        </div>
        <div className="action-buttons">
          <button onClick={handleBack} className="back-button">
            Back
          </button>
          <button onClick={handleModify} className="modify-button">
            Modify
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
