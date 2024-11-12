import { useEffect, useState } from "react";
import { db } from "../../config/firebase";
import { collection, getDocs } from "firebase/firestore";

const useFetchTags = (userId) => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTags = async () => {
      setLoading(true);
      try {
        // Obtener etiquetas predeterminadas
        const defaultTagsSnapshot = await getDocs(
          collection(db, "defaultTags")
        );
        const defaultTags = defaultTagsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Obtener etiquetas personalizadas del usuario
        const userTagsSnapshot = await getDocs(
          collection(db, "users", userId, "tags")
        );
        const userTags = userTagsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Combinar etiquetas predeterminadas y personalizadas
        setTags([...defaultTags, ...userTags]);
      } catch (error) {
        console.error("Error al obtener etiquetas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, [userId]);

  return { tags, loading };
};

export default useFetchTags;
