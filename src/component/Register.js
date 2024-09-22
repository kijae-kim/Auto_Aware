import React, { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import TopList from "./TopList";
import "../css/Register.css";
import { CheckCircle, Upload, Loader } from "lucide-react";

const Register = () => {
  const [name, setName] = useState("");
  const [classValue, setClassValue] = useState("");
  const [registerDate, setRegisterDate] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault(); // submit 시 기본 폼 제출 방지
    setLoading(true); // 로딩 시작
    // Handle registration logic here
    // console.log("Registration submitted:", {
    //   name,
    //   class: classValue,
    //   registerDate,
    //   images: selectedImages,
    // });

    const token = localStorage.getItem("authToken");
    // 24.09.03 이미지 string형태로 저장
    const imageData = {
      image0: selectedImages[0]["name"],
      image1: selectedImages[1]["name"],
      image2: selectedImages[2]["name"],
      image3: selectedImages[3]["name"],
      token: token,
      name: name,
    };
    try {
      // 24.09.03 이미지 서버로 전송 후 모델 적용
      const response = await fetch("http://localhost:8000/registerImage", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(imageData),
      });

      const data = await response.json();
      console.log(data);

      if (data == true) {
        window.alert("등록이 완료되었습니다.");
        navigate("/main");
        window.location.reload();
      }
    } catch (error) {
      console.error("Registration failed:", error);
      window.alert("등록 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false); // 로딩 종료
    }
  };

  // 24.09.03 업로드 이벤트
  const onUploadImages = useCallback((e) => {
    const files = Array.from(e.target.files);
    if (files.length !== 4) {
      alert("Please select exactly 4 images.");
      return;
    }

    const imageFiles = files.filter((file) => file.type.startsWith("image/"));
    if (imageFiles.length !== 4) {
      alert("Please make sure all selected files are images.");
      return;
    }

    setSelectedImages(imageFiles);
  }, []);

  const onUploadClick = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  return (
    <div className="register-container">
      <TopList activeItem="Register" />
      <div className="register-main">
        <div className="register-left">
          <div className="id-section">#ID</div>
          <div className="upload-section" onClick={onUploadClick}>
            {/* 24.09.03 업로드 이벤트 사진 보이기 --- */}
            {selectedImages.length === 4 ? (
              <div className="image-grid">
                {selectedImages.map((image, index) => (
                  <img
                    key={index}
                    src={URL.createObjectURL(image)}
                    alt={`Selected ${index + 1}`}
                    className="preview-image"
                  />
                ))}
              </div>
            ) : (
              <div className="upload-circle">
                {selectedImages.length === 4 ? (
                  <CheckCircle size={48} color="green" />
                ) : (
                  <Upload size={48} color="green" />
                )}
                <p>Click to upload 4 images</p>
              </div>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            multiple
            ref={fileInputRef}
            onChange={onUploadImages}
            style={{ display: "none" }}
          />
          {/* ----- */}
        </div>
        <div className="register-right">
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label>Class</label>
              <input
                type="text"
                value={classValue}
                onChange={(e) => setClassValue(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label>Register date</label>
              <input
                type="date"
                value={registerDate}
                onChange={(e) => setRegisterDate(e.target.value)}
              />
            </div>
            <div className="button-group">
              <button
                type="button"
                onClick={() => navigate(-1)}
                disabled={loading}
              >
                Back
              </button>
              <button type="submit" disabled={loading}>
                {loading ? "Processing..." : "Register"}
              </button>
            </div>
          </form>
        </div>
      </div>
      {loading && (
        <div className="loading-overlay">
          <div className="loading-content">
            <Loader size={48} className="spinner" color="#4CAF50" />
            <p className="loading-text">
              등록중
              <span className="dot dot1">.</span>
              <span className="dot dot2">.</span>
              <span className="dot dot3">.</span>
            </p>
            <p>Learning in progress... {loadingProgress}%</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
