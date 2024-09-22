import React from "react";
import "../css/DetailModal.css";

const DetailModal = ({ item, onClose }) => {
  return (
    <div className="detail-modal-overlay">
      <div className="detail-modal-content">
        <div className="detail-modal-header">
          <h2>
            {item.userid} {item.person}
          </h2>
        </div>
        <div className="detail-modal-body">
          <img
            src={`data:image/jpeg;base64,${item.image}`}
            alt={item.person}
            className="detail-modal-image"
          />
          <div className="detail-modal-info">
            <p>
              Register-date: {item.date} {item.time || "12:43"}
            </p>
          </div>
        </div>
        <div className="detail-modal-footer">
          <button onClick={onClose} className="back-button">
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;
