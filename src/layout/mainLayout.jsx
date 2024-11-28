import React, { useState } from "react";
import Navbar from "../components/navigation/Navbar.jsx";
import Sidebar from "../components/navigation/Sidebar.jsx";
import { useMediaQuery } from "@mui/material";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  const [open, setOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width:600px)");

  // Función para alternar el Drawer
  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <div style={{ display: "flex" }}>
      {isMobile ? (
        <Navbar />
      ) : (
        <Sidebar open={open} toggleDrawer={toggleDrawer} />
      )}
      <div
        style={{
          marginLeft: open ? 10 : 40,
          marginRight: open ? "10%" : "10%",
          marginTop: "7%",
          marginBottom: "5%",
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
