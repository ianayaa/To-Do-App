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
import LoadingSpinner from './components/common/LoadingSpinner';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./config/firebase.js";
import { useTheme, useMediaQuery } from "@mui/material";
import BlankLayout from "./components/layout/BlankLayout";
import MainLayout from "./components/layout/MainLayout";
import { AuthProvider } from './context/AuthContext';

// Lazy loading para mejorar el rendimiento
const Home = lazy(() => import('./pages/dashboard/home'));
const Calendar = lazy(() => import('./pages/calendar/calendar'));
const ProfileSettings = lazy(() => import('./pages/settings/ConfiguracionPerfil'));
const FAQ = lazy(() => import('./pages/help/faq'));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'));
const MobileLogin = lazy(() => import('./pages/auth/MobileLogin'));
const Login = lazy(() => import('./pages/auth/Login'));

// Determina si mostrar la versión móvil o de escritorio del login
const LoginPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  return isMobile ? <MobileLogin /> : <Login />;
};

// Protege las rutas que requieren autenticación
const PrivateRoute = ({ element: Element }) => {
  const location = useLocation();
  const [user] = useAuthState(auth);

  return user ? (
    Element
  ) : (
    <Navigate to="/" state={{ from: location }} replace />
  );
};

// Actualiza el título de la página según la ruta
const TitleHandler = () => {
  const location = useLocation();
  
  useEffect(() => {
    const path = location.pathname;
    const title = path.charAt(1).toUpperCase() + path.slice(2);
    document.title = `Do-Time | ${title || 'Home'}`;
  }, [location]);

  return null;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <TitleHandler />
        <ToastContainer position="top-right" autoClose={3000} />
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Rutas públicas */}
            <Route element={<BlankLayout />}>
              <Route 
                path="/" 
                element={<LoginPage />} 
              />
              <Route path="/reset-password" element={<ResetPassword />} />
            </Route>

            {/* Rutas privadas */}
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
    </AuthProvider>
  );
}

export default App;
