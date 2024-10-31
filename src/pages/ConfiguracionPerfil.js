import React, { useState, useEffect } from 'react';
import { auth } from "../config/firebase"; // Importa la configuración de Firebase
import "../styles/configUsuario.css"; // CSS global

function ConfiguracionPerfil() {
    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [photoURL, setPhotoURL] = useState(""); // Para almacenar la URL de la foto de perfil
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isSocialLogin, setIsSocialLogin] = useState(false); // Para determinar si el usuario inició sesión con Google o Facebook
    const [fechaNacimiento, setFechaNacimiento] = useState("No disponible");
    const [genero, setGenero] = useState("No disponible");

    // Cargar datos del usuario al montar el componente
    useEffect(() => {
        if (auth.currentUser) {
            setNombre(auth.currentUser.displayName || "Usuario"); // Nombre del usuario
            setEmail(auth.currentUser.email); // Correo electrónico del usuario
            setPhotoURL(auth.currentUser.photoURL || "https://via.placeholder.com/80"); // URL de la foto

            // Verificar si el usuario inició sesión con Google o Facebook
            const providerData = auth.currentUser.providerData;
            if (providerData.some(provider => provider.providerId === "google.com" || provider.providerId === "facebook.com")) {
                setIsSocialLogin(true);
            }

            // Extraer fecha de nacimiento y género (si están disponibles)
            const birthDate = auth.currentUser.providerData.find(provider => provider.providerId === "google.com" || provider.providerId === "facebook.com")?.userInfo?.birthdate || "No disponible";
            const gender = auth.currentUser.providerData.find(provider => provider.providerId === "google.com" || provider.providerId === "facebook.com")?.userInfo?.gender || "No disponible";

            setFechaNacimiento(birthDate);
            setGenero(gender);
        }
    }, []);

    const handleChangePhoto = () => {
        const uploadPhotoInput = document.getElementById("uploadPhoto");
        uploadPhotoInput.click(); // Abrir el selector de archivos
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const profileImagePreview = document.getElementById("profileImagePreview");
                profileImagePreview.src = e.target.result; // Mostrar la imagen seleccionada
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDeletePhoto = () => {
        console.log("Eliminando foto");
        // Aquí puedes implementar la lógica para eliminar la foto de perfil
    };

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            alert("Las contraseñas no coinciden.");
            return;
        }
        try {
            await auth.currentUser.updatePassword(newPassword);
            alert("Contraseña cambiada con éxito.");
        } catch (error) {
            alert(`Error al cambiar la contraseña: ${error.message}`);
        }
    };

    return (
        <div className="configuracion-usuario-container">
            <div className="configuracion-content">
                <h1>Configuración de Perfil</h1>
                <div className="user-info">
                    <div className="profile-section">
                        <img id="profileImagePreview" src={photoURL} alt="Foto de perfil" />
                        <div className="settings">
                            <input type="file" id="uploadPhoto" style={{ display: 'none' }} accept="image/*" onChange={handleFileChange} />
                            <button className="btn change-photo" onClick={handleChangePhoto}>Cambiar foto</button>
                            <button className="btn delete-photo" onClick={handleDeletePhoto}>Eliminar foto</button>
                        </div>
                    </div>
                </div>

                {/* Sección 1: Información básica */}
                <div className="basic-info-section info-section">
                    <h2>Información Básica</h2>
                    <label>Nombre</label>
                    <input
                        type="text"
                        value={nombre}
                        readOnly
                        className="input-field"
                    />
                    <label>Fecha de nacimiento</label>
                    <input
                        type="date"
                        value={fechaNacimiento === "No disponible" ? "" : fechaNacimiento} // Deja vacío si es "No disponible"
                        onChange={(e) => setFechaNacimiento(e.target.value)}
                        className="input-field"
                        readOnly={fechaNacimiento === "No disponible"} // No editable si no hay fecha
                    />
                    <label>Género</label>
                    <input
                        type="text"
                        value={genero}
                        onChange={(e) => setGenero(e.target.value)}
                        className="input-field"
                        readOnly={genero === "No disponible"} // No editable si no hay género
                    />
                </div>

                {/* Sección 2: Información de contacto y contraseña */}
                <div className="contact-info-section info-section">
                    <h2>Información de Contacto y Contraseña</h2>
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        readOnly // No permitimos modificar el correo
                        className="input-field"
                    />
                    <label>Teléfono</label>
                    <input
                        type="tel"
                        className="input-field"
                        // lógica para manejar el teléfono aquí
                    />
                    {!isSocialLogin && (
                        <>
                            <label>Nueva Contraseña</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="input-field"
                            />
                            <label>Confirmar Contraseña</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="input-field"
                            />
                            <button className="btn change-password" onClick={handleChangePassword}>Cambiar contraseña</button>
                        </>
                    )}
                    {isSocialLogin && (
                        <p className="info-message">No puedes cambiar la contraseña, ya que iniciaste sesión con Google o Facebook.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ConfiguracionPerfil;
