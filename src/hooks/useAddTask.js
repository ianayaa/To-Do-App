import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useCallback } from "react";

const useAddTasks = (db, user) => {
    const addTask = useCallback(
        async (newTask) => {
            if (!user?.uid) return;

            const taskWithUserId = {
                ...newTask,
                user_id: user.uid,
                createdAt: serverTimestamp(), // Añade la marca de tiempo del servidor
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
