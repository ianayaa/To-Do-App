import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import "./styles/app.css";
import Login from "./pages/auth/Login.js";
import Home from "./pages/dashboard/home.js";
import Calendar from "./pages/calendar/calendar.js";
import ProfileSettings from "./pages/settings/ConfiguracionPerfil.js";
import BlankLayout from "./layout/blankLayout.js";
import MainLayout from "./layout/mainLayout.js";
import FAQ from "./pages/help/faq.js";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./config/firebase.js";

// Componente para proteger rutas privadas
const PrivateRoute = ({ element }) => {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  return user ? element : null;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route element={<BlankLayout />}>
          <Route path="/" element={<Login />} />
        </Route>
        <Route element={<PrivateRoute element={<MainLayout />} />}>
          <Route path="/home" element={<Home />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/settings" element={<ProfileSettings />} />
          <Route path="/help" element={<FAQ />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
