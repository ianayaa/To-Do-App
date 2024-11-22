import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useCallback } from "react";

const useAddTasks = (db, user) => {
  const addTask = useCallback(
    async (newTask) => {
      if (!user?.uid) return;

      // Asegúrate de que el campo tags sea siempre un array
      const taskWithUserId = {
        ...newTask,
        user_id: user.uid,
        createdAt: serverTimestamp(),
        tags: Array.isArray(newTask.tags) ? newTask.tags : [] // Aseguramos que tags sea un array
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
