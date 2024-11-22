import React, { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../config/firebase";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  styled,
  useTheme,
  Box,
  CssBaseline,
  Toolbar,
  IconButton,
  List,
  Divider,
  Typography,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
} from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TaskIcon from "@mui/icons-material/Task";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SettingsIcon from "@mui/icons-material/Settings";
import HelpIcon from "@mui/icons-material/Help";
import LogoutIcon from "@mui/icons-material/Logout";
import useUserData from "../hooks/user/useUserData";
import Badge from "@mui/material/Badge";
import Tooltip from "@mui/material/Tooltip";
import { db } from "../config/firebase";
import useNotifications from "../hooks/notifications/useNotifications";

const drawerWidth = 240;

// Estilos para el AppBar
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
  backgroundColor: "#f9f7f3",
  boxShadow: "none",
  color: "#25283d",
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  transition: "all 0.3s ease-in-out", // Transición suave
  ...(open && {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    "& .MuiDrawer-paper": {
      width: drawerWidth,
      backgroundColor: "#25283d",
      transition: "all 0.3s ease-in-out", // Transición suave
    },
  }),
  ...(!open && {
    width: `calc(${theme.spacing(7)} + 1px)`,
    "& .MuiDrawer-paper": {
      width: `calc(${theme.spacing(7)} + 1px)`,
      backgroundColor: "#25283d",
      transition: "all 0.3s ease-in-out", // Transición suave
    },
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

export default function Sidebar() {
  const theme = useTheme();
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const { displayName, loading } = useUserData();
  const notifications = useNotifications(db, user);

  // Manejo responsivo automático
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth < 600) {
        setDrawerOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    if (windowWidth < 600) {
      setDrawerOpen(false);
    }
  };

  const handleLogout = async () => {
    if (user?.email) {
      localStorage.setItem("lastEmail", user.email);
    }
    await auth.signOut();
    navigate("/");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={drawerOpen}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label={drawerOpen ? "cerrar menú" : "abrir menú"}
            onClick={drawerOpen ? handleDrawerClose : handleDrawerOpen}
            edge="start"
            sx={{ marginRight: 5, ...(drawerOpen && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: "bold",
              letterSpacing: ".1rem",
              color: theme.palette.primary.main,
            }}
          >
            DoTime
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        variant={windowWidth < 600 ? "temporary" : "permanent"}
        open={drawerOpen}
        onClose={handleDrawerClose}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronLeftIcon sx={{ color: "white" }} />
            ) : (
              <ChevronRightIcon sx={{ color: "white" }} />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />

        {user && (
          <Box
            sx={{
              padding: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: drawerOpen ? "flex-start" : "center",
              flexDirection: drawerOpen ? "row" : "column",
              transition: "all 0.3s ease-in-out", // Transición suave para el perfil
            }}
          >
            <Avatar
              alt={displayName}
              src={user?.photoURL || ""}
              sx={{
                width: 50,
                height: 50,
                marginRight: drawerOpen ? 2 : 0,
                marginBottom: drawerOpen ? 0 : 1,
              }}
            />
            {drawerOpen && (
              <Typography
                variant="h6"
                sx={{
                  color: "white",
                  whiteSpace: "normal",
                  overflowWrap: "break-word",
                  transition: "all 0.3s ease-in-out", // Transición suave para el nombre
                }}
              >
                {loading ? "Cargando..." : displayName}
              </Typography>
            )}
          </Box>
        )}

        <List>
          {[
            {
              text: "Tareas",
              icon: <TaskIcon />,
              to: "/home",
              badge: notifications.tasks,
              tooltip: "Ver todas tus tareas",
            },
            {
              text: "Calendario",
              icon: <CalendarMonthIcon />,
              to: "/calendar",
              badge: notifications.calendar,
              tooltip: "Ver calendario de tareas",
            },
            {
              text: "Configuración",
              icon: <SettingsIcon />,
              to: "/configuracion",
              tooltip: "Ajustes de la aplicación",
            },
            {
              text: "Soporte y ayuda",
              icon: <HelpIcon />,
              to: "/soporte",
              tooltip: "Obtener ayuda",
            },
            {
              text: "Cerrar sesión",
              icon: <LogoutIcon sx={{ color: "#dc3545" }} />,
              onClick: handleLogout,
              tooltip: "Cerrar sesión",
            },
          ].map(({ text, icon, to, badge, tooltip, onClick }) => (
            <Tooltip key={text} title={tooltip} placement="right" arrow>
              <ListItem
                button
                component={onClick ? "div" : Link}
                to={to}
                onClick={onClick}
                selected={location.pathname === to}
                sx={{
                  margin: "5px 0",
                  justifyContent: drawerOpen ? "initial" : "center",
                  px: 2.5,
                  transition: "background-color 0.3s ease",
                  "&:hover": {
                    backgroundColor: "rgba(255, 194, 71, 0.5)",
                  },
                  ...(location.pathname === to && {
                    border: "2px solid #ffc247",
                    borderRadius: "5px",
                    backgroundColor: "rgba(255, 194, 71, 0.7)",
                  }),
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: drawerOpen ? 3 : "auto",
                    justifyContent: "center",
                    color: "white",
                    transition: "color 0.3s ease",
                  }}
                >
                  {badge > 0 ? (
                    <Badge badgeContent={badge} color="error">
                      {icon}
                    </Badge>
                  ) : (
                    icon
                  )}
                </ListItemIcon>
                {drawerOpen && (
                  <ListItemText primary={text} sx={{ color: "white" }} />
                )}
              </ListItem>
            </Tooltip>
          ))}
        </List>
      </Drawer>
    </Box>
  );
}
