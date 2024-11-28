import React, { useState } from "react";
import { 
  auth, 
  db, 
  googleProvider, 
  facebookProvider 
} from "../../config/firebase";
import { 
  signInWithEmailAndPassword,
  signInWithPopup,
  createUserWithEmailAndPassword,
  setPersistence,
  browserSessionPersistence
} from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faEye, 
  faEyeSlash, 
  faEnvelope, 
  faLock, 
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { 
  faGoogle,
  faFacebookF
} from "@fortawesome/free-brands-svg-icons";
import {
  Box,
  TextField,
  Button,
  Typography,
  IconButton,
  Container,
  Paper,
  Divider,
  CircularProgress,
  Snackbar,
  Alert,
  useTheme,
  useMediaQuery,
  Slide,
} from "@mui/material";
import logo from "../../assets/To-Do-Logo.png";

const MobileLogin = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [errors, setErrors] = useState({
    email: false,
    password: false,
    name: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error",
  });
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isDarkMode = theme.palette.mode === 'dark';

  if (!isMobile) {
    return null; // No renderizar en dispositivos de escritorio
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    setErrors(prev => ({
      ...prev,
      [name]: false
    }));
  };

  const validateForm = () => {
    const newErrors = {
      email: !credentials.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.email),
      password: !credentials.password || credentials.password.length < 6,
      name: isSignUp && (!credentials.name || credentials.name.length < 2)
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await setPersistence(auth, browserSessionPersistence);
      
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          credentials.email,
          credentials.password
        );
        await setDoc(doc(db, "users", userCredential.user.uid), {
          name: credentials.name,
          email: credentials.email,
        });
      } else {
        await signInWithEmailAndPassword(
          auth,
          credentials.email,
          credentials.password
        );
      }
      navigate("/dashboard");
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message,
        severity: "error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    setIsLoading(true);
    try {
      await setPersistence(auth, browserSessionPersistence);
      const result = await signInWithPopup(auth, provider);
      await setDoc(doc(db, "users", result.user.uid), {
        name: result.user.displayName,
        email: result.user.email,
      });
      navigate("/dashboard");
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message,
        severity: "error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleModeChange = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setIsSignUp(!isSignUp);
      setIsTransitioning(false);
    }, 300);
  };

  return (
    <Container maxWidth="sm" sx={{ 
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      py: 3
    }}>
      <Slide direction="up" in={true}>
        <Paper
          elevation={3}
          sx={{
            width: "100%",
            p: 3,
            backgroundColor: theme.palette.mode === 'dark' ? '#1A1C2C' : '#F5F5F7',
            color: theme.palette.mode === 'dark' ? '#fff' : '#25283D',
            borderRadius: 2,
            border: theme.palette.mode === 'dark' 
              ? '1px solid rgba(255, 255, 255, 0.1)' 
              : '1px solid rgba(0, 0, 0, 0.1)',
            position: "relative",
            overflow: "hidden"
          }}
        >
          <Box sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: "linear-gradient(90deg, #FFC247 0%, #FF6B6B 100%)",
            transform: isTransitioning ? "translateX(0%)" : "translateX(-100%)",
            transition: "transform 0.3s ease-in-out"
          }} />

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: 4,
              transition: "transform 0.3s ease-in-out, opacity 0.3s ease-in-out",
              transform: isTransitioning ? "scale(0.95)" : "scale(1)",
              opacity: isTransitioning ? 0.5 : 1
            }}
          >
            <Box
              component="img"
              src={logo}
              alt="MyDoTime Logo"
              sx={{
                width: '180px',
                height: 'auto',
                mb: 2
              }}
            />
            <Typography
              variant="h4"
              align="center"
              sx={{
                color: theme.palette.mode === 'dark' ? "#FFC247" : "#25283D",
                fontWeight: "bold",
                textShadow: theme.palette.mode === 'dark' ? '0 2px 4px rgba(0,0,0,0.2)' : 'none'
              }}
            >
              {isSignUp ? "Crear Cuenta" : "Iniciar Sesión"}
            </Typography>
          </Box>

          <Box 
            component="form" 
            onSubmit={handleSubmit} 
            sx={{ 
              mt: 2,
              transition: "opacity 0.3s ease-in-out",
              opacity: isTransitioning ? 0.5 : 1,
              pointerEvents: isTransitioning ? "none" : "auto"
            }}
          >
            {isSignUp && (
              <TextField
                fullWidth
                variant="outlined"
                label="Nombre"
                name="name"
                value={credentials.name}
                onChange={handleChange}
                error={errors.name}
                helperText={errors.name && "Ingresa un nombre válido"}
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    color: theme.palette.mode === 'dark' ? "white" : "#25283D",
                    "& fieldset": {
                      borderColor: theme.palette.mode === 'dark' ? "rgba(255, 255, 255, 0.23)" : "rgba(0, 0, 0, 0.23)",
                    },
                    "&:hover fieldset": {
                      borderColor: "#FFC247",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#FFC247",
                    }
                  },
                  "& .MuiInputLabel-root": {
                    color: theme.palette.mode === 'dark' ? "rgba(255, 255, 255, 0.7)" : "#25283D"
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <FontAwesomeIcon 
                      icon={faUser} 
                      style={{ marginRight: 8, color: "#FFC247" }}
                    />
                  ),
                }}
              />
            )}

            <TextField
              fullWidth
              variant="outlined"
              label="Email"
              name="email"
              type="email"
              value={credentials.email}
              onChange={handleChange}
              error={errors.email}
              helperText={errors.email && "Ingresa un email válido"}
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  color: theme.palette.mode === 'dark' ? "white" : "#25283D",
                  "& fieldset": {
                    borderColor: theme.palette.mode === 'dark' ? "rgba(255, 255, 255, 0.23)" : "rgba(0, 0, 0, 0.23)",
                  },
                  "&:hover fieldset": {
                    borderColor: "#FFC247",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#FFC247",
                  }
                },
                "& .MuiInputLabel-root": {
                  color: theme.palette.mode === 'dark' ? "rgba(255, 255, 255, 0.7)" : "#25283D"
                },
              }}
              InputProps={{
                startAdornment: (
                  <FontAwesomeIcon 
                    icon={faEnvelope} 
                    style={{ marginRight: 8, color: "#FFC247" }}
                  />
                ),
              }}
            />

            <TextField
              fullWidth
              variant="outlined"
              label="Contraseña"
              name="password"
              type={showPassword ? "text" : "password"}
              value={credentials.password}
              onChange={handleChange}
              error={errors.password}
              helperText={errors.password && "La contraseña debe tener al menos 6 caracteres"}
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  color: theme.palette.mode === 'dark' ? "white" : "#25283D",
                  "& fieldset": {
                    borderColor: theme.palette.mode === 'dark' ? "rgba(255, 255, 255, 0.23)" : "rgba(0, 0, 0, 0.23)",
                  },
                  "&:hover fieldset": {
                    borderColor: "#FFC247",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#FFC247",
                  }
                },
                "& .MuiInputLabel-root": {
                  color: theme.palette.mode === 'dark' ? "rgba(255, 255, 255, 0.7)" : "#25283D"
                },
              }}
              InputProps={{
                startAdornment: (
                  <FontAwesomeIcon 
                    icon={faLock} 
                    style={{ marginRight: 8, color: "#FFC247" }}
                  />
                ),
                endAdornment: (
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    sx={{ color: theme.palette.mode === 'dark' ? "white" : "#25283D" }}
                  >
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                  </IconButton>
                ),
              }}
            />

            <Button
              fullWidth
              variant="contained"
              type="submit"
              disabled={isLoading}
              sx={{
                mb: 2,
                py: 1.5,
                backgroundColor: "#FFC247",
                color: "#25283D",
                fontWeight: "bold",
                "&:hover": {
                  backgroundColor: "#FFD47F",
                }
              }}
            >
              {isLoading ? (
                <CircularProgress size={24} />
              ) : (
                isSignUp ? "Registrarse" : "Iniciar Sesión"
              )}
            </Button>

            <Divider sx={{ 
              my: 2, 
              "&::before, &::after": {
                borderColor: theme.palette.mode === 'dark' ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
              },
              color: theme.palette.mode === 'dark' ? "rgba(255, 255, 255, 0.7)" : "#25283D"
            }}>
              o continuar con
            </Divider>

            <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => handleSocialLogin(googleProvider)}
                disabled={isLoading}
                sx={{
                  py: 1.5,
                  borderColor: theme.palette.mode === 'dark' ? "rgba(255, 255, 255, 0.23)" : "rgba(0, 0, 0, 0.23)",
                  color: theme.palette.mode === 'dark' ? "white" : "#25283D",
                  "&:hover": {
                    borderColor: "#FFC247",
                    backgroundColor: theme.palette.mode === 'dark' ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 194, 71, 0.1)",
                  },
                }}
              >
                <FontAwesomeIcon icon={faGoogle} style={{ marginRight: 8 }} />
                Google
              </Button>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => handleSocialLogin(facebookProvider)}
                disabled={isLoading}
                sx={{
                  py: 1.5,
                  borderColor: theme.palette.mode === 'dark' ? "rgba(255, 255, 255, 0.23)" : "rgba(0, 0, 0, 0.23)",
                  color: theme.palette.mode === 'dark' ? "white" : "#25283D",
                  "&:hover": {
                    borderColor: "#FFC247",
                    backgroundColor: theme.palette.mode === 'dark' ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 194, 71, 0.1)",
                  },
                }}
              >
                <FontAwesomeIcon icon={faFacebookF} style={{ marginRight: 8 }} />
                Facebook
              </Button>
            </Box>

            <Box sx={{ 
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              mt: 3
            }}>
              <Typography
                align="center"
                sx={{ color: theme.palette.mode === 'dark' ? "rgba(255, 255, 255, 0.7)" : "#25283D" }}
              >
                {isSignUp ? "¿Ya tienes una cuenta?" : "¿No tienes una cuenta?"}
              </Typography>
              <Button
                onClick={handleModeChange}
                disabled={isTransitioning}
                sx={{
                  color: "#FFC247",
                  borderColor: "#FFC247",
                  "&:hover": {
                    backgroundColor: "#FFC247",
                    color: theme.palette.mode === 'dark' ? "#1A1C2C" : "#25283D"
                  }
                }}
              >
                {isSignUp ? "Iniciar Sesión" : "Registrarse"}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Slide>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default MobileLogin;
