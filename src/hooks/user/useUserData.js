import { useState, useEffect } from "react";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { auth, db } from "../../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { updateUserPhoto } from "../../services/userPhotoService";

const useUserData = () => {
  const [user] = useAuthState(auth);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [photoUpdateInProgress, setPhotoUpdateInProgress] = useState(false);

  useEffect(() => {
    if (!user) {
      setUserData(null);
      setLoading(false);
      return;
    }

    // Suscribirse a cambios en el documento del usuario
    const unsubscribe = onSnapshot(
      doc(db, "users", user.uid),
      async (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          
          // Solo actualizar la foto si no hay una actualización en progreso
          if (!photoUpdateInProgress && user.photoURL !== data.photoURL) {
            console.log('Detectado cambio en la foto del usuario:', {
              authPhoto: user.photoURL,
              firestorePhoto: data.photoURL
            });
            
            try {
              setPhotoUpdateInProgress(true);
              await updateUserPhoto(db, auth, user.photoURL);
              console.log('Foto actualizada exitosamente en todos los lugares');
            } catch (error) {
              console.error('Error al actualizar la foto del usuario:', error);
            } finally {
              setPhotoUpdateInProgress(false);
            }
          }
          
          setUserData(data);
        } else {
          // Si el documento no existe, crear uno nuevo
          const newUserData = {
            uid: user.uid,
            email: user.email,
            name: user.displayName,
            photoURL: user.photoURL,
          };
          
          try {
            await updateDoc(doc(db, "users", user.uid), newUserData);
            setUserData(newUserData);
          } catch (error) {
            console.error('Error al crear documento de usuario:', error);
          }
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error al obtener datos del usuario:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, photoUpdateInProgress]);

  return { userData, loading };
};

export default useUserData;
