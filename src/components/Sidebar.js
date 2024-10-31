import React from "react";
import "../styles/sidebar.css";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../config/firebase";
import { Link, useNavigate, useLocation } from "react-router-dom";

function Sidebar() {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const location = useLocation(); // Obtener la ubicación actual

  const handleLogout = async () => {
    // Almacena el correo electrónico del usuario en localStorage
    localStorage.setItem("lastEmail", user?.email);
    await auth.signOut();
    navigate("/"); // Redirige a la página de login
  };

  return (
      <div className="sidebar">
        <div className="user-info">
          <img src={user?.photoURL} alt="Foto de perfil" className="user-image" />
          <span className="user-name">
          {user?.displayName?.split(" ").slice(0, 2).join(" ")}
        </span>
          <i className="fas fa-bell"></i>
        </div>
        <ul>
          <li className={location.pathname === "/home" ? "active" : ""}>
            <Link to="/home">
              <i className="fas fa-list-check"></i> Tareas
            </Link>
          </li>
          <li className={location.pathname === "/calendar" ? "active" : ""}>
            <Link to="/calendar">
              <i className="fas fa-calendar"></i> Calendario
            </Link>
          </li>
          <li className={location.pathname === "/configuracion" ? "active" : ""}>
            <Link to="/configuracion">
              <i className="fas fa-gear"></i> Configuración
            </Link>
          </li>
          <li className={location.pathname === "/soporte" ? "active" : ""}>
            <Link to="/soporte">
              <i className="fas fa-question-circle"></i> Soporte y ayuda
            </Link>
          </li>
          <li onClick={handleLogout}>
            <Link to="#">
              <i className="fas fa-sign-out-alt"></i> Cerrar sesión
            </Link>
          </li>
        </ul>
      </div>
  );
}

export default Sidebar;
