import React, { useState, useEffect } from "react";
import {
  auth,
  db,
  googleProvider,
  facebookProvider,
} from "../../config/firebase";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  setPersistence,
  browserSessionPersistence,
  sendPasswordResetEmail,
} from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "../../styles/pages/login.css";
import logo from "../../assets/To-Do-Logo.png";

const AppLogin = () => {
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
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
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[!@#$%^&*]/.test(password)) strength++;
    return strength;
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/home");
      }
    });

    const lastEmail = localStorage.getItem("lastEmail");
    if (lastEmail) {
      setCredentials((prev) => ({ ...prev, email: lastEmail }));
    }
  }, [navigate]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const createParticles = () => {
      const container = document.querySelector('.login-container');
      if (!container) return;

      const particleCount = Math.min(50, Math.floor(window.innerWidth / 20));
      const particles = [];

      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        const size = Math.random();
        
        if (size < 0.4) {
          particle.className = 'particle particle-small';
        } else if (size < 0.7) {
          particle.className = 'particle particle-medium';
        } else {
          particle.className = 'particle particle-large';
        }

        const left = Math.random() * 100;
        const top = Math.random() * 100;
        particle.style.left = `${left}%`;
        particle.style.top = `${top}%`;

        particle.style.animationDelay = `${Math.random() * 5}s`;

        container.appendChild(particle);
        particles.push(particle);
      }

      return () => {
        particles.forEach(particle => {
          if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
          }
        });
      };
    };

    const cleanup = createParticles();
    
    const handleResize = () => {
      if (cleanup) cleanup();
      createParticles();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      if (cleanup) cleanup();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const togglePanel = (isActive) => {
    if (!isMobile) {
      setIsRightPanelActive(isActive);
    } else {
      setIsRightPanelActive(isActive);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: !value }));

    if (name === "password") {
      setPasswordStrength(calculatePasswordStrength(value));
    }
    if (name === "email") {
      setErrors((prev) => ({ ...prev, email: !isValidEmail(value) }));
    }
  };

  const validateFields = () => {
    const { email, password, name } = credentials;
    const emailValid = isValidEmail(email);
    const passwordValid = password.length >= 6;
    const nameValid = !isRightPanelActive || (name && name.length >= 2);

    setErrors({
      email: !emailValid,
      password: !passwordValid,
      name: isRightPanelActive && !nameValid,
    });

    if (!emailValid || !passwordValid || (isRightPanelActive && !nameValid)) {
      setMessage("*Por favor, verifica los campos marcados en rojo.");
      return false;
    }
    return true;
  };

  const handleAuth = async (provider) => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const { user } = result;
      await saveUser(user, provider.providerId);
      localStorage.setItem("lastEmail", user.email);
      setMessage(`Inicio de sesión con ${provider.providerId} exitoso.`);
      navigate("/home");
    } catch (error) {
      setMessage(
        `Error al autenticar con ${provider.providerId}: ${error.message}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (isSignUp) => {
    if (!validateFields()) return;
    setIsLoading(true);
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
      localStorage.setItem("lastEmail", credentials.email);
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
    } finally {
      setIsLoading(false);
    }
  };

  const saveUser = async (user, provider) => {
    const userData = {
      uid: user.uid,
      email: user.email,
      name: provider === "email" ? credentials.name : user.displayName,
      photoURL: user.photoURL || null,
      provider,
      lastLogin: new Date(),
      ...(provider === "email" && { createdAt: new Date() }),
    };
    await setDoc(doc(db, "users", user.uid), userData, { merge: true });
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleForgotPassword = async () => {
    if (!credentials.email) {
      setMessage("Por favor, ingresa tu correo electrónico para restablecer la contraseña.");
      setErrors(prev => ({ ...prev, email: true }));
      return;
    }
    
    if (!isValidEmail(credentials.email)) {
      setMessage("Por favor, ingresa un correo electrónico válido.");
      setErrors(prev => ({ ...prev, email: true }));
      return;
    }

    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, credentials.email);
      setMessage("Te hemos enviado un correo con las instrucciones para restablecer tu contraseña.");
    } catch (error) {
      let errorMessage;
      switch (error.code) {
        case "auth/user-not-found":
          errorMessage = "No existe una cuenta con este correo.";
          break;
        default:
          errorMessage = "Error al enviar el correo. Inténtalo de nuevo.";
      }
      setMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div
        className={`container ${isRightPanelActive ? "right-panel-active" : ""}`}
      >
        <div className="form-container sign-in-container">
          <form>
            <img src={logo} alt="MyDoTime Logo" className="auth-logo" />
            <h1>Iniciar Sesión</h1>
            {message && <p className="message error-message">{message}</p>}
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
            {credentials.password && (
              <div className="password-strength">
                <div
                  className={`password-strength-bar ${
                    passwordStrength <= 1
                      ? "strength-weak"
                      : passwordStrength <= 2
                      ? "strength-medium"
                      : "strength-strong"
                  }`}
                />
              </div>
            )}
            <button
              type="button"
              onClick={() => handleEmailAuth(false)}
              className={isLoading ? "loading" : ""}
              disabled={isLoading}
            >
              Iniciar Sesión
            </button>
            <a
              href="#"
              onClick={handleForgotPassword}
              className="account-option"
            >
              ¿Olvidaste tu contraseña?
            </a>
          </form>
        </div>

        <div className="form-container sign-up-container">
          <form>
            <img src={logo} alt="MyDoTime Logo" className="auth-logo" />
            <h1>Crear Cuenta</h1>
            {message && <p className="message error-message">{message}</p>}
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
            {credentials.password && (
              <div className="password-strength">
                <div
                  className={`password-strength-bar ${
                    passwordStrength <= 1
                      ? "strength-weak"
                      : passwordStrength <= 2
                      ? "strength-medium"
                      : "strength-strong"
                  }`}
                />
              </div>
            )}
            <button
              type="button"
              onClick={() => handleEmailAuth(true)}
              className={isLoading ? "loading" : ""}
              disabled={isLoading}
            >
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
