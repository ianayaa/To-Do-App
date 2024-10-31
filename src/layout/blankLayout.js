import React from "react";
import { Outlet } from "react-router-dom";

const blankLayout = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default blankLayout;
