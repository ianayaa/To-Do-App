import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../config/firebase";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  styled,
  useTheme,
  Box,
  Drawer,
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
import MuiAppBar from "@mui/material/AppBar";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TaskIcon from "@mui/icons-material/Task";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SettingsIcon from "@mui/icons-material/Settings";
import HelpIcon from "@mui/icons-material/Help";
import LogoutIcon from "@mui/icons-material/Logout";

const drawerWidth = 300;

// Estilo para el AppBar
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
  backgroundColor: "#f9f7f3",
  boxShadow: "none",
  color: "#25283d",
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export default function Sidebar({ open, toggleDrawer }) {
  const theme = useTheme();
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    localStorage.setItem("lastEmail", user?.email);
    await auth.signOut();
    navigate("/");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            edge="start"
            sx={{ mr: 2, ...(open && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            DoTime
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#25283d", // Fondo blanco
            boxShadow: "none", // Sin sombra
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={toggleDrawer}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon sx={{ color: "white" }} />
            ) : (
              <ChevronRightIcon sx={{ color: "white" }} />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />

        {/* Perfil del usuario */}
        {user && (
          <Box sx={{ padding: 2, display: "flex", alignItems: "center" }}>
            <Avatar
              alt={user.displayName || "User"}
              src={user.photoURL || ""}
              sx={{ width: 50, height: 50, marginRight: 2 }}
            />
            <Typography variant="h6" sx={{ color: "white" }}>
              {user.displayName || "Nombre de usuario"}
            </Typography>
          </Box>
        )}
        <List>
          <ListItem
            button
            component={Link}
            to="/home"
            selected={location.pathname === "/home"}
            sx={{
              margin: "5px 0",
              padding: "5px 20px",
              "&:hover": {
                backgroundColor: "rgba(255, 194, 71, 0.5)", // Color de hover
              },
              ...(location.pathname === "/home" && {
                border: "2px solid #ffc247", // Borde amarillo
                borderRadius: "5px",
                backgroundColor: "rgba(255, 194, 71, 0.7)", // Color al estar en la sección
              }),
            }}
          >
            <ListItemIcon>
              <TaskIcon sx={{ color: "white" }} />
            </ListItemIcon>
            <ListItemText primary="Tareas" sx={{ color: "white" }} />
          </ListItem>
          <ListItem
            button
            component={Link}
            to="/calendar"
            selected={location.pathname === "/calendar"}
            sx={{
              margin: "5px 0",
              "&:hover": {
                backgroundColor: "rgba(255, 194, 71, 0.5)", // Color de hover
              },
              ...(location.pathname === "/calendar" && {
                border: "2px solid #ffc247", // Borde amarillo
                borderRadius: "5px",
                backgroundColor: "rgba(255, 194, 71, 0.7)", // Color al estar en la sección
              }),
            }}
          >
            <ListItemIcon>
              <CalendarMonthIcon sx={{ color: "white" }} />
            </ListItemIcon>
            <ListItemText primary="Calendario" sx={{ color: "white" }} />
          </ListItem>
          <ListItem
            button
            component={Link}
            to="/configuracion"
            selected={location.pathname === "/configuracion"}
            sx={{
              margin: "5px 0",
              "&:hover": {
                backgroundColor: "rgba(255, 194, 71, 0.5)", // Color de hover
              },
              ...(location.pathname === "/configuracion" && {
                border: "2px solid #ffc247", // Borde amarillo
                borderRadius: "5px",
                backgroundColor: "#ffc247", // Color al estar en la sección
              }),
            }}
          >
            <ListItemIcon>
              <SettingsIcon sx={{ color: "white" }} />
            </ListItemIcon>
            <ListItemText primary="Configuración" sx={{ color: "white" }} />
          </ListItem>
          <ListItem
            button
            component={Link}
            to="/soporte"
            selected={location.pathname === "/soporte"}
            sx={{
              margin: "5px 0",
              "&:hover": {
                backgroundColor: "rgba(255, 194, 71, 0.5)", // Color de hover
              },
              ...(location.pathname === "/soporte" && {
                border: "2px solid #ffc247", // Borde amarillo
                borderRadius: "5px",
                backgroundColor: "#ffc247", // Color al estar en la sección
              }),
            }}
          >
            <ListItemIcon>
              <HelpIcon sx={{ color: "white" }} />
            </ListItemIcon>
            <ListItemText primary="Soporte y ayuda" sx={{ color: "white" }} />
          </ListItem>
          <ListItem button onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon sx={{ color: "#CE2121" }} />
            </ListItemIcon>
            <ListItemText primary="Cerrar sesión" sx={{ color: "#CE2121" }} />
          </ListItem>
        </List>
      </Drawer>
    </Box>
  );
}
