import { doc, deleteDoc } from "firebase/firestore";
import { useState } from "react";

const useDeleteTask = (db) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteTask = async (taskId) => {
    setLoading(true);
    setError(null);
    console.log("Eliminando tarea con ID:", taskId);

    try {
      if (!taskId) {
        throw new Error("El ID de la tarea no es válido.");
      }

      if (!db) {
        throw new Error("La instancia de Firestore no es válida.");
      }

      const taskRef = doc(db, "tasks", taskId);
      await deleteDoc(taskRef);
      console.log("Tarea eliminada con éxito");
    } catch (err) {
      console.error("Error al eliminar la tarea:", err);
      setError(err.message || "Hubo un problema al eliminar la tarea.");
      throw err; // Re-throw the error so the component can handle it
    } finally {
      setLoading(false);
    }
  };

  return { deleteTask, loading, error };
};

export default useDeleteTask;
