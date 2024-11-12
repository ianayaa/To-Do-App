import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useCallback } from "react";

const useAddTasks = (db, user) => {
  const addTask = useCallback(
    async (newTask, selectedTags) => {
      if (!user?.uid) return;

      // Asegúrate de que el campo tags contiene solo los valores de las etiquetas seleccionadas
      const taskWithUserId = {
        ...newTask,
        user_id: user.uid,
        createdAt: serverTimestamp(), // Añadir la marca de tiempo del servidor
        tags: selectedTags.map((tag) => tag.value), // Agregar las etiquetas como array de valores
      };

      try {
        await addDoc(collection(db, "tasks"), taskWithUserId);
        console.log("Tarea añadida!");
      } catch (error) {
        console.error("Error añadiendo la tarea: ", error);
      }
    },
    [db, user?.uid]
  );

  return { addTask };
};

export default useAddTasks;
