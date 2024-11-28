import React, { useEffect, memo, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate
} from "react-router-dom";
import "./styles/app.css";
import Login from "./pages/auth/Login.jsx";
import MobileLogin from "./pages/auth/MobileLogin.jsx";
import Home from "./pages/dashboard/home.jsx";
import Calendar from "./pages/calendar/calendar.jsx";
import ProfileSettings from "./pages/settings/ConfiguracionPerfil.jsx";
import BlankLayout from "./layout/blankLayout.jsx";
import MainLayout from "./layout/mainLayout.jsx";
import FAQ from "./pages/help/faq.jsx";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./config/firebase.js";
import { useTheme, useMediaQuery } from "@mui/material";

// Componente para la página de login que selecciona la versión correcta según el dispositivo
const LoginPage = () => {
  const theme = useTheme();
  const [mounted, setMounted] = useState(false);
  const [showMobile, setShowMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      const isMobile = window.innerWidth < 600;
      setShowMobile(isMobile);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      setMounted(false);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  if (!mounted) return null;

  const MobileLoginMemo = React.memo(MobileLogin);
  const LoginMemo = React.memo(Login);

  return showMobile ? <MobileLoginMemo /> : <LoginMemo />;
};

// Componente para proteger rutas privadas
const PrivateRoute = ({ element }) => {
  const [user, loading] = useAuthState(auth);
  const location = useLocation();

  // Mientras se verifica la autenticación, no redirigir
  if (loading) {
    return null;
  }

  // Solo redirigir si no hay usuario autenticado
  if (!user) {
    return <Navigate to="/" state={{ from: location }} />;
  }

  return element;
};

const App = () => {
  const [user] = useAuthState(auth);

  return (
    <Router>
      <Routes>
        <Route element={<BlankLayout />}>
          <Route 
            path="/" 
            element={user ? <Navigate to="/home" replace /> : <LoginPage />} 
          />
        </Route>
        <Route element={<PrivateRoute element={<MainLayout />} />}>
          <Route path="/home" element={<Home />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/settings" element={<ProfileSettings />} />
          <Route path="/help" element={<FAQ />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
