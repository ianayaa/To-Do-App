import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../config/firebase";
import { updateProfile } from "firebase/auth";
import { updateUserPhoto } from "../../services/userPhotoService";

const useUpdateUserData = () => {
  const updateUserData = async (updatedData) => {
    if (!auth.currentUser) {
      console.error("No hay usuario autenticado");
      return;
    }

    try {
      console.log("Actualizando datos del usuario:", updatedData);

      // Si hay una actualización de foto, usar el servicio especializado
      if (updatedData.photoURL) {
        console.log("Detectada actualización de foto, usando servicio especializado");
        await updateUserPhoto(db, auth, updatedData.photoURL);
        
        // Remover photoURL de updatedData ya que ya fue manejado
        const { photoURL, ...otherData } = updatedData;
        updatedData = otherData;
      }

      // Si hay otros datos para actualizar además de la foto
      if (Object.keys(updatedData).length > 0) {
        const userDocRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(userDocRef, updatedData);
        console.log("Otros datos del usuario actualizados con éxito");

        // Si hay un cambio de nombre, actualizarlo en Auth también
        if (updatedData.name) {
          await updateProfile(auth.currentUser, {
            displayName: updatedData.name
          });
          console.log("Nombre actualizado en Auth");
        }
      }

      return true;
    } catch (error) {
      console.error("Error al actualizar los datos del usuario:", error);
      throw error;
    }
  };

  return { updateUserData };
};

export default useUpdateUserData;
