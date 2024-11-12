import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  const [open, setOpen] = useState(false);

  // Función para alternar el Drawer
  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar open={open} toggleDrawer={toggleDrawer} />
      <div
        style={{
          marginLeft: open ? 10 : -40,
          marginRight: open ? "10%" : "10%",
          marginTop: "7%",
          transition: "margin-left 0.3s ease",
          width: "95%",
        }}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
