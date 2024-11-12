import { collection, query, where, onSnapshot } from "firebase/firestore";
import { useState, useEffect } from "react";

const useTasks = (db, user) => {
  const [tasks, setTasks] = useState([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [overdueCount, setOverdueCount] = useState(0);

  useEffect(() => {
    if (!user?.uid) {
      setTasks([]);
      setCompletedCount(0);
      setPendingCount(0);
      setOverdueCount(0);
      return;
    }

    // Crear una consulta
    const q = query(
        collection(db, "tasks"),
        where("user_id", "==", user.uid)
    );

    // Escuchar los cambios en tiempo real
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedTasks = [];
      querySnapshot.forEach((doc) => {
        fetchedTasks.push({ id: doc.id, ...doc.data() });
      });

      setTasks(fetchedTasks);

      // Actualiza los contadores
      const completed = fetchedTasks.filter(
          (task) => task.estado === "Completada"
      );
      setCompletedCount(completed.length);

      const overdue = fetchedTasks.filter((task) => {
        const dueDate = task.dueDate?.toDate();
        return task.estado === "Pendiente" && dueDate && dueDate < new Date();
      });
      setOverdueCount(overdue.length);

      const pending = fetchedTasks.filter((task) => {
        const dueDate = task.dueDate?.toDate();
        return (
            task.estado === "Pendiente" && (!dueDate || dueDate >= new Date())
        );
      });
      setPendingCount(pending.length);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [db, user?.uid]);

  // Función para añadir una nueva tarea directamente al estado
  const addTaskToList = (newTask) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  return {
    tasks,
    completedCount,
    pendingCount,
    overdueCount,
    addTaskToList, // Añadir el callback
  };
};

export default useTasks;
