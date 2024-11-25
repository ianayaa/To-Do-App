import React, { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../config/firebase";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  styled,
  useTheme,
  Box,
  CssBaseline,
  Typography,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Badge,
  Toolbar,
  Menu,
  MenuItem,
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
import useUserData from "../../hooks/user/useUserData";
import { db } from "../../config/firebase";
import useNotifications from "../../hooks/notifications/useNotifications";
import NotificationsIcon from '@mui/icons-material/Notifications';
import Logo from '../../assets/To-Do-Logo.png';

const drawerWidth = 240;

// Estilos para el AppBar
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  background: 'transparent',
  backgroundColor: 'transparent',
  boxShadow: 'none',
  '& .MuiAppBar-root': {
    background: 'transparent',
    backgroundColor: 'transparent',
  },
  '& .MuiToolbar-root': {
    background: 'transparent',
    backgroundColor: 'transparent',
  },
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
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  "& .MuiDrawer-paper": {
    backgroundColor: '#25283D',
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
    ...(open
      ? {
          width: drawerWidth,
          transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }
      : {
          width: theme.spacing(9),
          transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }),
  },
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
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);

  useEffect(() => {
    if (user) {
      console.log("Usuario autenticado:", user);
      console.log("Nombre del usuario:", user.displayName);
    }
  }, [user]);

  const { userData, loading } = useUserData();
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

  const handleNotificationClick = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleNotificationsClick = () => {
    console.log('Notificaciones clicadas');
  };

  const handleProfileClick = () => {
    console.log('Perfil clicado');
  };

  const menuItems = [
    {
      text: "Tareas",
      icon: <TaskIcon />,
      path: "/home",
      badge: notifications.tasks,
      tooltip: "Ver todas tus tareas",
    },
    {
      text: "Calendario",
      icon: <CalendarMonthIcon />,
      path: "/calendar",
      badge: notifications.calendar,
      tooltip: "Ver calendario de tareas",
    },
    {
      text: "Configuración",
      icon: <SettingsIcon />,
      path: "/settings",
      tooltip: "Ajustes de la aplicación",
    },
    {
      text: "Ayuda",
      icon: <HelpIcon />,
      path: "/help",
      tooltip: "Centro de ayuda",
    },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar 
        position="fixed" 
        open={drawerOpen}
        sx={{
          background: 'transparent',
          backgroundColor: 'transparent',
          '& .MuiPaper-root': {
            background: 'transparent',
            backgroundColor: 'transparent',
          }
        }}
      >
        <Toolbar
          sx={{
            background: 'transparent',
            backgroundColor: 'transparent'
          }}
        >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              visibility: drawerOpen ? 'hidden' : 'visible',
              opacity: drawerOpen ? 0 : 1,
              transition: theme.transitions.create(['visibility', 'opacity'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
              }),
              color: '#FFC247',
              '&:hover': {
                backgroundColor: 'rgba(255, 194, 71, 0.1)',
              },
            }}
          >
            <MenuIcon />
          </IconButton>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              flexGrow: 1,
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img 
                src={Logo} 
                alt="DoTime Logo" 
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain'
                }}
              />
            </Box>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                color: '#FFC247',
                fontWeight: 'bold',
              }}
            >
              DoTime
            </Typography>
          </Box>
          <IconButton
            color="inherit"
            onClick={handleNotificationClick}
            sx={{
              color: '#FFC247',
              '&:hover': {
                backgroundColor: 'rgba(255, 194, 71, 0.1)',
              },
            }}
          >
            <Badge badgeContent={notifications.length} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          <Menu
            anchorEl={notificationAnchorEl}
            open={Boolean(notificationAnchorEl)}
            onClose={handleNotificationClose}
            PaperProps={{
              elevation: 3,
              sx: {
                mt: 1.5,
                width: 320,
                maxHeight: 400,
                backgroundColor: '#25283D',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 1,
                overflow: 'auto',
                '& .MuiMenuItem-root': {
                  borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                  py: 1.5,
                  '&:last-child': {
                    borderBottom: 'none'
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(255, 194, 71, 0.1)',
                  }
                }
              }
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <Box sx={{ p: 2, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <Typography variant="subtitle1" sx={{ color: '#FFC247', fontWeight: 600 }}>
                Notificaciones
              </Typography>
            </Box>
            {notifications && notifications.length > 0 ? (
              notifications.map((notification, index) => (
                <MenuItem 
                  key={index}
                  onClick={handleNotificationClose}
                >
                  <ListItemText
                    primary={
                      <Typography variant="subtitle2" sx={{ color: 'white', mb: 0.5 }}>
                        {notification.title || 'Nueva notificación'}
                      </Typography>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                          {notification.message || 'Tienes una nueva notificación'}
                        </Typography>
                        {notification.time && (
                          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', mt: 0.5 }}>
                            {notification.time}
                          </Typography>
                        )}
                      </Box>
                    }
                  />
                </MenuItem>
              ))
            ) : (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                  No hay notificaciones
                </Typography>
              </Box>
            )}
          </Menu>
        </Toolbar>
      </AppBar>

      <Drawer
        variant={windowWidth < 600 ? "temporary" : "permanent"}
        open={drawerOpen}
        onClose={handleDrawerClose}
        PaperProps={{
          sx: {
            backgroundColor: '#25283D',
            color: 'white',
          },
        }}
      >
        <DrawerHeader
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            px: 2.5,
            position: 'relative',
            minHeight: 64,
          }}
        >
          <IconButton 
            onClick={handleDrawerClose}
            sx={{
              color: '#FFC247',
              position: 'absolute',
              right: 8,
              visibility: !drawerOpen ? 'hidden' : 'visible',
              opacity: !drawerOpen ? 0 : 1,
              transition: theme.transitions.create(['visibility', 'opacity'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
              }),
              '&:hover': {
                backgroundColor: 'rgba(255, 194, 71, 0.1)',
              },
            }}
          >
            <ChevronLeftIcon />
          </IconButton>
        </DrawerHeader>

        {user && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: drawerOpen ? 'flex-start' : 'center',
              gap: 2,
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              minHeight: 80,
              p: 2,
            }}
          >
            <Avatar
              alt={user.displayName || 'Usuario'}
              src={user.photoURL}
              sx={{
                width: drawerOpen ? 45 : 50,
                height: drawerOpen ? 45 : 50,
                border: '2px solid #FFC247',
                transition: 'all 0.2s ease-in-out',
              }}
            />
            {drawerOpen && (
              <Box sx={{ minWidth: 0, flex: 1, width: '100%', overflow: 'hidden' }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: 'white',
                    fontWeight: 600,
                    whiteSpace: 'normal',
                    wordBreak: 'break-word',
                    width: '100%',
                    mb: 0.5
                  }}
                >
                  {user.displayName || 'Usuario'}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    whiteSpace: 'normal',
                    wordBreak: 'break-all',
                    width: '100%'
                  }}
                >
                  {user.email}
                </Typography>
              </Box>
            )}
          </Box>
        )}

        <List sx={{ px: 2, flexGrow: 1 }}>
          {menuItems.map((item) => (
            <ListItem
              key={item.text}
              disablePadding
              sx={{
                display: "block",
                mb: 1,
              }}
            >
              <ListItemButton
                component={Link}
                to={item.path}
                selected={location.pathname === item.path}
                sx={{
                  minHeight: 48,
                  justifyContent: drawerOpen ? "initial" : "center",
                  px: 2.5,
                  borderRadius: 2,
                  backgroundColor: location.pathname === item.path ? 'rgba(255, 194, 71, 0.1)' : 'transparent',
                  color: location.pathname === item.path ? '#FFC247' : 'rgba(255, 255, 255, 0.7)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 194, 71, 0.1)',
                    color: '#FFC247',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: drawerOpen ? 3 : "auto",
                    justifyContent: "center",
                    color: 'inherit',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{
                    opacity: drawerOpen ? 1 : 0,
                    '& .MuiTypography-root': {
                      fontWeight: location.pathname === item.path ? 600 : 400,
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Box sx={{ px: 2, pb: 2 }}>
          <ListItem
            disablePadding
            sx={{
              display: "block",
              mb: 1,
            }}
          >
            <ListItemButton
              onClick={handleLogout}
              sx={{
                minHeight: 48,
                justifyContent: drawerOpen ? "initial" : "center",
                px: 2.5,
                borderRadius: 2,
                color: 'rgba(255, 255, 255, 0.7)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 194, 71, 0.1)',
                  color: '#FFC247',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: drawerOpen ? 3 : "auto",
                  justifyContent: "center",
                  color: 'inherit',
                }}
              >
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText
                primary="Cerrar Sesión"
                sx={{
                  opacity: drawerOpen ? 1 : 0,
                }}
              />
            </ListItemButton>
          </ListItem>
        </Box>
      </Drawer>
    </Box>
  );
}
