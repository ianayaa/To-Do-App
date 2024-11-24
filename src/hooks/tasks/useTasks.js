import { collection, query, where, onSnapshot, or } from "firebase/firestore";
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

    console.log('Iniciando suscripción a tareas para usuario:', user.uid);

    // Crear una consulta que incluya tareas propias y compartidas
    const q = query(
        collection(db, "tasks"),
        or(
            where("user_id", "==", user.uid),
            where("sharedWith", "array-contains", user.uid)
        )
    );

    // Escuchar los cambios en tiempo real
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedTasks = [];
      querySnapshot.forEach((doc) => {
        // Validar el documento
        if (!doc.exists()) {
          console.error('Documento no existe:', doc.id);
          return;
        }

        // Obtener y validar los datos
        const taskData = doc.data();
        if (!taskData) {
          console.error('Datos inválidos para el documento:', doc.id);
          return;
        }

        // Crear objeto de tarea con validación de campos
        const task = {
          id: doc.id,
          docId: doc.id,
          descripcion: taskData.descripcion || '',
          titulo: taskData.titulo || '',
          estado: taskData.estado || 'Pendiente',
          tags: Array.isArray(taskData.tags) ? taskData.tags : [],
          dueDate: taskData.dueDate || null,
          user_id: taskData.user_id,
          sharedWith: taskData.sharedWith || [],
          isShared: taskData.user_id !== user.uid,
          canEdit: taskData.user_id === user.uid || (taskData.sharedWith && taskData.sharedWith.includes(user.uid))
        };

        console.log('Tarea procesada:', task);
        fetchedTasks.push(task);
      });

      console.log('Total de tareas obtenidas:', fetchedTasks.length);
      setTasks(fetchedTasks);

      // Actualiza los contadores
      const completed = fetchedTasks.filter(task => task.estado === "Completada");
      const overdue = fetchedTasks.filter(task => {
        const dueDate = task.dueDate?.toDate();
        return task.estado === "Pendiente" && dueDate && dueDate < new Date();
      });
      const pending = fetchedTasks.filter(task => {
        const dueDate = task.dueDate?.toDate();
        return task.estado === "Pendiente" && (!dueDate || dueDate >= new Date());
      });

      setCompletedCount(completed.length);
      setOverdueCount(overdue.length);
      setPendingCount(pending.length);
    });

    return () => {
      console.log('Limpiando suscripción a tareas');
      unsubscribe();
    };
  }, [db, user]);

  return { tasks, completedCount, pendingCount, overdueCount };
};

export default useTasks;
