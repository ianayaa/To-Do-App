import { useState } from "react";
import { db } from "../../config/firebase";
import { collection, addDoc } from "firebase/firestore";

const useAddTag = (userId) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addTag = async (newTag) => {
    setLoading(true);
    try {
      const tagsRef = collection(db, "users", userId, "tags");
      await addDoc(tagsRef, newTag);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return { addTag, loading, error };
};

export default useAddTag;
