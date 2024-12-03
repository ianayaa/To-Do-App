/**
 * @component ResetPassword
 * @description Componente que maneja el proceso de restablecimiento de contraseña.
 * Permite a los usuarios establecer una nueva contraseña después de recibir un token de restablecimiento.
 * 
 * @example
 * return (
 *   <ResetPassword />
 * )
 */

import React, { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { confirmPasswordReset } from "firebase/auth";
import { auth } from "../config/firebase";
import { toast } from "react-toastify";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import ReCAPTCHA from "react-google-recaptcha";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const recaptchaRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Obtener el código de acción de la URL
  const queryParams = new URLSearchParams(location.search);
  const oobCode = queryParams.get("oobCode");

  const togglePasswordVisibility = (field) => {
    if (field === "password") {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Verificar reCAPTCHA
    const recaptchaValue = recaptchaRef.current.getValue();
    if (!recaptchaValue) {
      toast.error("Por favor, completa el captcha");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    try {
      setLoading(true);
      await confirmPasswordReset(auth, oobCode, newPassword);
      toast.success("Contraseña actualizada con éxito");
      navigate("/login");
    } catch (error) {
      console.error("Error al restablecer la contraseña:", error);
      let errorMessage = "Error al restablecer la contraseña";
      
      switch (error.code) {
        case "auth/expired-action-code":
          errorMessage = "El enlace ha expirado. Solicita un nuevo enlace.";
          break;
        case "auth/invalid-action-code":
          errorMessage = "El enlace no es válido. Verifica o solicita uno nuevo.";
          break;
        case "auth/weak-password":
          errorMessage = "La contraseña es demasiado débil.";
          break;
        default:
          errorMessage = "Error al restablecer la contraseña. Intenta nuevamente.";
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      recaptchaRef.current.reset();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-blue-500 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <div className="text-center">
          <img src="/logo192.png" alt="Do-Time Logo" className="mx-auto h-16 mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Restablecer Contraseña
          </h2>
          <p className="text-gray-600 mb-6">
            Ingresa tu nueva contraseña para continuar
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nueva Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Ingresa tu nueva contraseña"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => togglePasswordVisibility("password")}
                >
                  {showPassword ? (
                    <FaEyeSlash className="h-5 w-5 text-gray-400" />
                  ) : (
                    <FaEye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirmar Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Confirma tu nueva contraseña"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => togglePasswordVisibility("confirm")}
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash className="h-5 w-5 text-gray-400" />
                  ) : (
                    <FaEye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
              theme="light"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
              loading ? "opacity-75 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Actualizando...
              </>
            ) : (
              "Actualizar Contraseña"
            )}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-sm text-indigo-600 hover:text-indigo-500"
            >
              Volver al inicio de sesión
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
