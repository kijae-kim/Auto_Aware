import React, { useState, useEffect } from "react";

const Imoji = () => {
  const [imojiData, setImojiData] = useState(null);

  useEffect(() => {
    const imojiSocket = new WebSocket("ws://localhost:8000/imoji");

    imojiSocket.onmessage = (event) => {
      setImojiData(event.data); // WebSocket에서 수신한 이미지 데이터를 상태에 저장
    };

    // 컴포넌트 언마운트 시 WebSocket 연결 해제
    return () => {
      imojiSocket.close();
    };
  }, []);

  return (
    <div style={{ width: "100%", height: "100%", zIndex: 10 }}>
      {imojiData && (
        <img
          src={`data:image/jpeg;base64,${imojiData}`}
          alt="Imoji"
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      )}
    </div>
  );
};

export default Imoji;
