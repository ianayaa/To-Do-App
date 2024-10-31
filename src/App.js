import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import AppLogin from "./pages/Login"; // Componente de login
import Home from "./pages/home"; // Pantalla de inicio después del login
import Calendar from "./pages/calendar";
import ConfiguracionPerfil from "./pages/ConfiguracionPerfil"; // Nueva página de configuración de perfil
import BlankLayout from "./layout/blankLayout";
import MainLayout from "./layout/mainLayout";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./config/firebase"; // Autenticación de Firebase

// Componente para proteger rutas privadas
const PrivateRoute = ({ element }) => {
  const navigate = useNavigate();
  const [user] = useAuthState(auth); // Usa el estado de autenticación de Firebase

  useEffect(() => {
    if (!user) {
      navigate("/"); // Si no está autenticado, redirigir al login
    }
  }, [user, navigate]);

  return user ? element : null; // Mostrar el componente si está autenticado
};

const App = () => {
  return (
      <Router>
        <Routes>
          <Route element={<BlankLayout />}>
            <Route path="/" element={<AppLogin />} />
          </Route>
          <Route element={<PrivateRoute element={<MainLayout />} />}>
            <Route path="/home" element={<Home />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/configuracion" element={<ConfiguracionPerfil />} />
          </Route>
        </Routes>
      </Router>
  );
};

export default App;
