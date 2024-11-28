import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { confirmPasswordReset, checkActionCode } from "firebase/auth";
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
  const [validCode, setValidCode] = useState(false);
  const recaptchaRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const oobCode = queryParams.get("oobCode");

  useEffect(() => {
    const verifyActionCode = async () => {
      if (!oobCode) {
        toast.error("No se proporcionó un código de verificación");
        navigate("/login");
        return;
      }

      try {
        await checkActionCode(auth, oobCode);
        setValidCode(true);
      } catch (error) {
        console.error("Error al verificar el código:", error);
        toast.error("El enlace no es válido o ha expirado");
        navigate("/login");
      }
    };

    verifyActionCode();
  }, [oobCode, navigate]);

  const togglePasswordVisibility = (field) => {
    if (field === "password") {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validCode) {
      toast.error("El enlace no es válido o ha expirado");
      return;
    }

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
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Restablecer Contraseña</h2>
          <p className="text-gray-600">Ingresa tu nueva contraseña</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {/* Campo de Nueva Contraseña */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nueva Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ingresa tu nueva contraseña"
                  required
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("password")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </button>
              </div>
            </div>

            {/* Campo de Confirmar Contraseña */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirmar Contraseña
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Confirma tu nueva contraseña"
                  required
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("confirm")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </button>
              </div>
            </div>
          </div>

          {/* ReCAPTCHA */}
          <div className="flex justify-center">
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
              theme="light"
            />
          </div>

          {/* Botón de Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                Procesando...
              </div>
            ) : (
              "Restablecer Contraseña"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
