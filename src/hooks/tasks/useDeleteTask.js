import { doc, deleteDoc } from "firebase/firestore";
import { useState } from "react";

const useDeleteTask = (db) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteTask = async (taskId) => {
    setLoading(true);
    setError(null);
    console.log("Eliminando tarea con ID:", taskId); // Verificar el taskId

    try {
      const taskRef = doc(db, "tasks", taskId);
      await deleteDoc(taskRef);
      console.log("Tarea eliminada con éxito");
    } catch (err) {
      console.error("Error al eliminar la tarea:", err);
      setError("Hubo un problema al eliminar la tarea.");
    } finally {
      setLoading(false);
    }
  };

  return { deleteTask, loading, error };
};

export default useDeleteTask;
