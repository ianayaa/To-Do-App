import React, { useEffect, memo, useState, Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  Outlet
} from "react-router-dom";
import "./styles/app.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingSpinner from './components/LoadingSpinner';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./config/firebase.js";
import { useTheme, useMediaQuery } from "@mui/material";
import BlankLayout from "./layout/blankLayout";
import MainLayout from "./layout/mainLayout";

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
const PrivateRoute = ({ element: Element }) => {
  const location = useLocation();
  const [user] = useAuthState(auth);

  return user ? (
    Element
  ) : (
    <Navigate to="/" state={{ from: location }} replace />
  );
};

// Componente para manejar el título de la página
const TitleHandler = () => {
  const location = useLocation();
  
  useEffect(() => {
    const path = location.pathname;
    const title = path.charAt(1).toUpperCase() + path.slice(2);
    document.title = title || "Home";
  }, [location]);

  return null;
};

// Lazy loading de componentes
const Home = lazy(() => import('./pages/dashboard/home'));
const Calendar = lazy(() => import('./pages/calendar/calendar'));
const ProfileSettings = lazy(() => import('./pages/settings/ConfiguracionPerfil'));
const FAQ = lazy(() => import('./pages/help/faq'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const MobileLogin = lazy(() => import('./pages/auth/MobileLogin'));
const Login = lazy(() => import('./pages/auth/Login'));

const App = () => {
  const [user] = useAuthState(auth);

  return (
    <Router>
      <TitleHandler />
      <ToastContainer position="top-right" autoClose={3000} />
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route element={<BlankLayout />}>
            <Route 
              path="/" 
              element={user ? <Navigate to="/home" replace /> : <LoginPage />} 
            />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Route>
          <Route element={<PrivateRoute element={<MainLayout />} />}>
            <Route path="/home" element={<Home />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/settings" element={<ProfileSettings />} />
            <Route path="/help" element={<FAQ />} />
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
