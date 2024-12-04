import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import TaskIcon from "@mui/icons-material/Task";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import HelpIcon from "@mui/icons-material/Help";
import LogoutIcon from "@mui/icons-material/Logout";
import Avatar from "@mui/material/Avatar";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../config/firebase";
import { useAuth } from "../../context/AuthContext";

export default function MobileNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = React.useState(location.pathname);
  const { logout } = useAuth();
  const [user] = useAuthState(auth);

  const handleChange = (event, newValue) => {
    if (newValue === "logout") {
      handleLogout();
    } else {
      setValue(newValue);
      navigate(newValue);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  // Componente personalizado para el Avatar
  const ProfileButton = () => {
    const isActive = location.pathname === '/settings';
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        position: 'relative',
        height: '100%',
        paddingTop: '8px'
      }}>
        <Avatar
          src={user?.photoURL || ""}
          alt={user?.displayName || user?.email?.charAt(0).toUpperCase() || "P"}
          sx={{
            width: 35,
            height: 35,
            border: `2px solid ${isActive ? '#ffc247' : 'transparent'}`,
            backgroundColor: '#ffc247',
            color: '#25283d',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            transition: 'all 0.2s ease',
            transform: isActive ? 'scale(1.1)' : 'scale(1)'
          }}
        />
      </div>
    );
  };

  return (
    <>
      <div style={{ paddingBottom: "70px" }} />

      <BottomNavigation
        sx={{
          width: "100%",
          position: "fixed",
          bottom: 0,
          backgroundColor: "#25283d",
          height: "70px",
          zIndex: 1200,
          borderTop: "2px solid rgba(255, 194, 71, 0.1)",
          "& .MuiBottomNavigationAction-root": {
            minWidth: "auto",
            padding: "6px 0",
            color: "#666",
            position: "relative",
            "&::after": {
              content: '""',
              position: "absolute",
              bottom: "2px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "4px",
              height: "4px",
              borderRadius: "50%",
              backgroundColor: "#ffc247",
              opacity: 0,
              transition: "all 0.2s ease",
              boxShadow: '0 0 4px rgba(255, 194, 71, 0.5)'
            },
            "&.Mui-selected": {
              color: "#ffc247",
              "& .MuiSvgIcon-root": {
                transform: 'scale(1.1)',
                filter: "drop-shadow(0 0 4px rgba(255, 194, 71, 0.5))",
              },
              "&::after": {
                opacity: 1
              },
              "& .MuiBottomNavigationAction-label": {
                fontSize: "0.75rem"
              }
            },
          },
          "& .MuiBottomNavigationAction-label": {
            fontSize: "0.7rem",
            marginTop: "4px",
            transition: "all 0.2s ease"
          },
          "& .MuiSvgIcon-root": {
            fontSize: "1.6rem",
            transition: "all 0.2s ease"
          },
        }}
        value={value}
        onChange={handleChange}
      >
        <BottomNavigationAction
          label="Tareas"
          value="/home"
          icon={<TaskIcon />}
        />
        <BottomNavigationAction
          label="Calendario"
          value="/calendar"
          icon={<CalendarMonthIcon />}
        />
        <BottomNavigationAction
          value="/settings"
          icon={<ProfileButton />}
          sx={{
            "& .MuiBottomNavigationAction-label": {
              display: 'none'
            },
            "&.Mui-selected::after": {
              opacity: 0 // Oculta el punto indicador para el botón de perfil
            }
          }}
        />
        <BottomNavigationAction
          label="Ayuda"
          value="/help"
          icon={<HelpIcon />}
        />
        <BottomNavigationAction
          label="Salir"
          value="logout"
          icon={<LogoutIcon />}
          sx={{
            "&::after": {
              backgroundColor: "#ff4757 !important"
            },
            "& .MuiSvgIcon-root": {
              color: "#ff6b6b",
              transition: "all 0.2s ease"
            },
            "&.Mui-selected": {
              "& .MuiSvgIcon-root": {
                color: "#ff4757",
                transform: 'scale(1.1)',
                filter: "drop-shadow(0 0 4px rgba(255, 71, 87, 0.5))"
              }
            }
          }}
        />
      </BottomNavigation>
    </>
  );
}
