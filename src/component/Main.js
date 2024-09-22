import React from "react";
// import { useNavigate } from "react-router-dom";
import "../css/Main.css";
import Cam1 from "./Cam1";
import Cam2 from "./Cam2";
import Imoji from "./Imoji";

const Main = () => {
  return (
    <div className="main_total">
      <div className="main_container_1">
        <div className="main_Box_1">
          <Cam1 />
        </div>
      </div>
      <div className="main_container_2">
        <div className="main_Box_2">
          <Cam2 />
        </div>
        <div className="main_Box_2">
          <Imoji />
        </div>
      </div>
    </div>
  );
};

export default Main;
