import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import TaskIcon from "@mui/icons-material/Task";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SettingsIcon from "@mui/icons-material/Settings";
import HelpIcon from "@mui/icons-material/Help";

export default function MobileNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = React.useState(location.pathname);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    navigate(newValue); // Cambia la ruta según el valor seleccionado
  };

  return (
    <BottomNavigation
      sx={{
        width: "100%",
        position: "fixed",
        bottom: 0,
        backgroundColor: "#25283d",
      }}
      value={value}
      onChange={handleChange}
    >
      <BottomNavigationAction
        label="Tareas"
        value="/home"
        icon={<TaskIcon />}
        sx={{
          color: value === "/home" ? "#ffc247" : "white",
          "&.Mui-selected": { color: "#ffc247" },
        }}
      />
      <BottomNavigationAction
        label="Calendario"
        value="/calendar"
        icon={<CalendarMonthIcon />}
        sx={{
          color: value === "/calendar" ? "#ffc247" : "white",
          "&.Mui-selected": { color: "#ffc247" },
        }}
      />
      <BottomNavigationAction
        label="Configuración"
        value="/configuracion"
        icon={<SettingsIcon />}
        sx={{
          color: value === "/configuracion" ? "#ffc247" : "white",
          "&.Mui-selected": { color: "#ffc247" },
        }}
      />
      <BottomNavigationAction
        label="Soporte"
        value="/soporte"
        icon={<HelpIcon />}
        sx={{
          color: value === "/soporte" ? "ffc247" : "white",
          "&.Mui-selected": { color: "#ffc247" },
        }}
      />
    </BottomNavigation>
  );
}
