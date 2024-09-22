import React, { useRef, useEffect } from "react";

const Cam1 = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    // FastAPI 서버에 웹소켓 연결
    const cam = new WebSocket(`ws://localhost:8000/Cam1?token=${token}`);

    // 서버로부터 메시지(프레임 데이터)를 수신할 때마다 호출되는 함수
    cam.onmessage = (event) => {
      if (videoRef.current) {
        // 수신한 프레임 데이터를 이미지로 변환하여 화면에 표시
        videoRef.current.src = `data:image/jpeg;base64,${event.data}`;
      }
    };

    // 컴포넌트가 언마운트될 때 웹소켓 연결 해제
    cam.onerror = (error) => {
      console.error("WebSoket error: ", error);
    };

    return () => {
      cam.close();
    };
  }, []);
  return (
    <div style={{ width: "100%", height: "100%", zIndex: 10 }}>
      <img
        ref={videoRef}
        autoPlay
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
      />
    </div>
  );
};

export default Cam1;
