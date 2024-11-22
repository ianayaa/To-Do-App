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
        createdAt: serverTimestamp(),
        tags: selectedTags.map((tag) => tag.value), // Asegurarnos de que solo guardamos los valores
      };

      try {
        const docRef = await addDoc(collection(db, "tasks"), taskWithUserId);
        console.log("Tarea añadida con ID:", docRef.id);
      } catch (error) {
        console.error("Error añadiendo la tarea:", error);
        throw error;
      }
    },
    [db, user?.uid]
  );

  return { addTask };
};

export default useAddTasks;
