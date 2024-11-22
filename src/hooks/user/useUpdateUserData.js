import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../config/firebase";

const useUpdateUserData = () => {
  const updateUserData = async (updatedData) => {
    if (!auth.currentUser) {
      console.error("No hay usuario autenticado");
      return;
    }

    try {
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userDocRef, updatedData);
      console.log("Datos del usuario actualizados con éxito.");
    } catch (error) {
      console.error("Error al actualizar los datos del usuario:", error);
    }
  };

  return { updateUserData };
};

export default useUpdateUserData;
