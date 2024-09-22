import React, { useState, useContext } from "react";
import { DataContext } from "./DataContext";
import "../css/Bell.css";

const Bell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { listData } = useContext(DataContext);

  const toggleNotifications = () => setIsOpen(!isOpen);

  const alerts = [...listData]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <div className="bell-container">
      <button onClick={toggleNotifications}>
        <img src="/image/bell.png" alt="notifications" />
        {alerts.length > 0 && (
          <span className="notification-badge">{alerts.length}</span>
        )}
      </button>

      {isOpen && (
        <div className="notifications-dropdown">
          {alerts.map((alert, index) => (
            <div key={index} className="notification-item">
              <img
                src={`data:image/jpeg;base64,${alert.image}`}
                alt={alert.person}
              />
              <div>
                <p>{alert.person}</p>
                <p>{alert.date}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bell;
