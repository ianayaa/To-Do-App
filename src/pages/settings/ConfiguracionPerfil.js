import React, { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../config/firebase";
import { auth } from "../../config/firebase";
import "../../styles/configUsuario.css"; // CSS global
import useUserData from "../../hooks/user/useUserData";
import { useNavigate } from "react-router-dom";
import useUpdateUserData from "../../hooks/user/useUpdateUserData";
import noProfileImage from "../../assets/no-profile-image.webp";
import DatePickerBtn from "../../components/inputs/DatePickerBtn";
import LogoutIcon from "@mui/icons-material/Logout";
import SaveIcon from "@mui/icons-material/Save";

function ConfiguracionPerfil() {
  const { userData, loading } = useUserData();
  const { updateUserData } = useUpdateUserData();

  const [name, setNombre] = useState("");
  const [user] = useAuthState(auth);
  const [photoURL, setPhotoURL] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState(new Date());
  const [genero, setGenero] = useState("");
  const [telefono, setTelefono] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (user?.email) {
      localStorage.setItem("lastEmail", user.email);
    }
    await auth.signOut();
    navigate("/");
  };

  useEffect(() => {
    if (!loading && userData) {
      setNombre(userData.name || "");
      setPhotoURL(userData.photoURL || noProfileImage);
      setFechaNacimiento(userData.fechaNacimiento || "");
      setGenero(userData.genero || "");
      setTelefono(userData.telefono || "");
    }
  }, [userData, loading]);

  const handleSaveChanges = async () => {
    const updatedData = {
      name,
      photoURL,
      fechaNacimiento,
      genero,
      telefono,
    };
    await updateUserData(updatedData);
    alert("Datos actualizados con éxito.");
  };

  const handleChangePhoto = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      alert("Por favor selecciona una imagen válida.");
      return;
    }
    if (!userData?.uid) {
      alert("Usuario no encontrado. Inténtalo de nuevo.");
      return;
    }

    setIsUploading(true);
    try {
      // Subir la imagen a Firebase Storage
      const storageRef = ref(storage, `profilePictures/${userData.uid}`);
      await uploadBytes(storageRef, file);

      // Obtener la URL de descarga
      const downloadURL = await getDownloadURL(storageRef);
      setPhotoURL(downloadURL);

      // Actualizar en Firestore
      await updateUserData({ photoURL: downloadURL });
      alert("Foto de perfil actualizada con éxito.");
    } catch (error) {
      console.error("Error al subir la imagen:", error);
      alert("Hubo un error al subir la imagen. Inténtalo de nuevo.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeletePhoto = async () => {
    try {
      await updateUserData({ photoURL: "" });
      setPhotoURL(noProfileImage);
      alert("Foto de perfil eliminada.");
    } catch (error) {
      console.error("Error al eliminar la foto:", error);
      alert("Hubo un error al eliminar la foto.");
    }
  };
  const handleSelectDate = (date) => {
    setFechaNacimiento(new Date(date));
  };

  if (loading) {
    return <p>Cargando...</p>;
  }

  return (
      <div className="configuracion-usuario-container">
        <div className="configuracion-content">
          <h1>Configuración de Perfil</h1>
          <div className="user-info">
            <img src={photoURL} alt="Foto de perfil" className="profile-photo" />
            <div className="settings">
              <input
                  type="file"
                  id="uploadPhoto"
                  style={{ display: "none" }}
                  onChange={handleChangePhoto}
              />
              <button
                  className="btn change-photo"
                  onClick={() => document.getElementById("uploadPhoto").click()}
                  disabled={isUploading}
              >
                {isUploading ? "Subiendo..." : "Cambiar foto"}
              </button>
              <button
                  className="btn delete-photo"
                  onClick={handleDeletePhoto}
                  disabled={isUploading}
              >
                Eliminar foto
              </button>
            </div>
          </div>

          <div className="info-section">
            <h2>Información Básica</h2>
            <label>Nombre</label>
            <input
                type="text"
                value={name}
                onChange={(e) => setNombre(e.target.value)}
                className="input-field"
            />
            <label>Fecha de nacimiento</label>
            <div className="me-3">
              <DatePickerBtn handleSelectDate={handleSelectDate} />
            </div>
            <label>Género</label>
            <select
                value={genero}
                onChange={(e) => setGenero(e.target.value)}
                className="input-field"
            >
              <option value="">Selecciona tu género</option>
              <option value="masculino">Masculino</option>
              <option value="femenino">Femenino</option>
              <option value="No Binario">No Binario</option>
              <option value="Otro">Otro</option>
              <option value="prefiero-no-decirlo">Prefiero no decirlo</option>
            </select>
            <label>Teléfono</label>
            <input
                type="tel"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                className="input-field"
            />
            <button onClick={handleSaveChanges} className="save-changes">
              <SaveIcon style={{ marginRight: "8px", fontSize: "20px" }} />
              Guardar Cambios
            </button>
            <button onClick={handleLogout} className="logout-button">
              <LogoutIcon style={{ marginRight: "8px", fontSize: "20px" }} />
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
  );
}

export default ConfiguracionPerfil;