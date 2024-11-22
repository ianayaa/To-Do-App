import React, { useState, useEffect } from "react";
import {
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  setPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { auth, googleProvider, facebookProvider } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import { db } from "../config/firebase";
import { setDoc, doc } from "firebase/firestore";
import "../styles/login.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const AppLogin = () => {
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);
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
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setPersistence(auth, browserSessionPersistence).then(() => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          navigate("/home");
        }
      });
    });

    // Cargar el correo del último usuario desde localStorage
    const lastEmail = localStorage.getItem("lastEmail");
    if (lastEmail) {
      setCredentials((prev) => ({ ...prev, email: lastEmail }));
    }
  }, [navigate]);

  const togglePanel = (isActive) => setIsRightPanelActive(isActive);

  const validateFields = () => {
    const { email, password, name } = credentials;
    const isValid = email && password && (isRightPanelActive ? name : true);
    setErrors({
      email: !email,
      password: !password,
      ...(isRightPanelActive && { name: !name }),
    });
    if (!isValid) setMessage("*Por favor, completa todos los campos.");
    return isValid;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: !value }));
  };

  const handleAuth = async (provider) => {
    try {
      const result = await signInWithPopup(auth, provider);
      const { user } = result;
      await saveUser(user, provider.providerId);
      localStorage.setItem("lastEmail", user.email); // Guardar el correo
      setMessage(`Inicio de sesión con ${provider.providerId} exitoso.`);
      navigate("/home");
    } catch (error) {
      setMessage(
        `Error al autenticar con ${provider.providerId}: ${error.message}`
      );
    }
  };

  const handleEmailAuth = async (isSignUp) => {
    if (!validateFields()) return;
    try {
      const authFunc = isSignUp
        ? createUserWithEmailAndPassword
        : signInWithEmailAndPassword;
      const { user } = await authFunc(
        auth,
        credentials.email,
        credentials.password
      );
      if (isSignUp) await saveUser(user, "email");
      localStorage.setItem("lastEmail", credentials.email); // Guardar el correo
      setMessage(`${isSignUp ? "Registro" : "Inicio de sesión"} exitoso.`);
      navigate("/home");
    } catch (error) {
      let errorMessage = "";
      switch (error.code) {
        case "auth/weak-password":
          errorMessage = "La contraseña debe tener al menos 6 caracteres.";
          break;
        case "auth/email-already-in-use":
          errorMessage = "Este correo ya está registrado.";
          break;
        case "auth/invalid-email":
          errorMessage = "El correo no es válido.";
          break;
        case "auth/wrong-password":
          errorMessage = "La contraseña es incorrecta.";
          break;
        case "auth/user-not-found":
          errorMessage = "No existe una cuenta con este correo.";
          break;
        case "auth/password-does-not-meet-requirements":
          // Extraer el mensaje de los requisitos y simplificarlo
          const requirements =
            error.message.match(/\[(.*)\]/)?.[1] ||
            "No cumple con los requisitos de seguridad.";
          errorMessage = `Contraseña inválida: ${requirements.replace(
            "Password must",
            "Debe"
          )}.`;
          break;
        default:
          errorMessage = "Error al procesar la solicitud. Inténtalo de nuevo.";
          break;
      }
      setMessage(errorMessage);
    }
  };

  const saveUser = async (user, provider) => {
    const userData = {
      uid: user.uid,
      email: user.email,
      name: provider === "email" ? credentials.name : user.displayName,
      provider,
      lastLogin: new Date(),
      ...(provider === "email" && { createdAt: new Date() }),
    };
    await setDoc(doc(db, "users", user.uid), userData, { merge: true });
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="login-container">
      <div
        className={`container ${
          isRightPanelActive ? "right-panel-active" : ""
        }`}
      >
        <div className="form-container sign-in-container">
          <form>
            <h1>Iniciar Sesión</h1>
            {message && (
              <p
                className={`message ${
                  message === "*Por favor, completa todos los campos."
                    ? "error-message"
                    : ""
                }`}
              >
                {message}
              </p>
            )}
            <div className="social-container">
              <a
                href="#"
                className="social"
                onClick={() => handleAuth(facebookProvider)}
              >
                <i className="fab fa-facebook-f"></i>
              </a>
              <a
                href="#"
                className="social"
                onClick={() => handleAuth(googleProvider)}
              >
                <i className="fab fa-google-plus-g"></i>
              </a>
            </div>
            <span className="account-option">o usa tu cuenta</span>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={credentials.email}
              onChange={handleInputChange}
              className={`input ${errors.email ? "input-error" : ""}`}
            />
            <div className="password-container">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Contraseña"
                value={credentials.password}
                onChange={handleInputChange}
                className={`input ${errors.password ? "input-error" : ""}`}
              />
              <span
                onClick={togglePasswordVisibility}
                className="password-toggle"
              >
                <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
              </span>
            </div>
            <button type="button" onClick={() => handleEmailAuth(false)}>
              Iniciar Sesión
            </button>
          </form>
        </div>

        <div className="form-container sign-up-container">
          <form>
            <h1>Crear Cuenta</h1>
            {message && (
              <p
                className={`message ${
                  message === "*Por favor, completa todos los campos."
                    ? "error-message"
                    : ""
                }`}
              >
                {message}
              </p>
            )}
            <div className="social-container">
              <a
                href="#"
                className="social"
                onClick={() => handleAuth(facebookProvider)}
              >
                <i className="fab fa-facebook-f"></i>
              </a>
              <a
                href="#"
                className="social"
                onClick={() => handleAuth(googleProvider)}
              >
                <i className="fab fa-google-plus-g"></i>
              </a>
            </div>
            <span className="account-option">
              o usa tu email para registrarte
            </span>
            <input
              type="text"
              name="name"
              placeholder="Nombre"
              value={credentials.name}
              onChange={handleInputChange}
              className={`input ${errors.name ? "input-error" : ""}`}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={credentials.email}
              onChange={handleInputChange}
              className={`input ${errors.email ? "input-error" : ""}`}
            />
            <div className="password-container">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Contraseña"
                value={credentials.password}
                onChange={handleInputChange}
                className={`input ${errors.password ? "input-error" : ""}`}
              />
              <span
                onClick={togglePasswordVisibility}
                className="password-toggle"
              >
                <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
              </span>
            </div>
            <button type="button" onClick={() => handleEmailAuth(true)}>
              Crear Cuenta
            </button>
          </form>
        </div>

        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>¡Bienvenido de nuevo!</h1>
              <p>
                Para mantenerte conectado, por favor inicia sesión con tu
                información personal.
              </p>
              <button className="ghost" onClick={() => togglePanel(false)}>
                Iniciar Sesión
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>¡Hola, Amigo!</h1>
              <p>Ingresa tus datos personales y comienza tu lista de tareas.</p>
              <button className="ghost" onClick={() => togglePanel(true)}>
                Crear Cuenta
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppLogin;
