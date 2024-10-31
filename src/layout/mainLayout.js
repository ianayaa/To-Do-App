import React from "react";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

const mainLayout = () => {
  return (
    <div className="home-container">
      <Sidebar />
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
};

export default mainLayout;
