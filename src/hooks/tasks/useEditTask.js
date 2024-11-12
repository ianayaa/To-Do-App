import { doc, updateDoc } from "firebase/firestore";
import { useState } from "react";

const useEditTask = (db) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const editTask = async (taskId, updatedFields) => {
    setLoading(true);
    setError(null);

    try {
      const taskRef = doc(db, "tasks", taskId);
      await updateDoc(taskRef, updatedFields);
    } catch (err) {
      console.error("Error al editar la tarea:", err);
      setError("Hubo un problema al editar la tarea.");
    } finally {
      setLoading(false);
    }
  };

  return { editTask, loading, error };
};

export default useEditTask;
