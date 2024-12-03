import { collection, query, where, onSnapshot, getDocs } from "firebase/firestore";
import { useState, useEffect, useCallback } from "react";

const useTasks = (db, user) => {
  const [tasks, setTasks] = useState([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [overdueCount, setOverdueCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const processTask = useCallback((doc) => {
    if (!doc.exists()) {
      console.error('Documento no existe:', doc.id);
      return null;
    }

    const taskData = doc.data();
    if (!taskData) {
      console.error('Datos inválidos para el documento:', doc.id);
      return null;
    }

    const sharedUsers = taskData.sharedWith || [];
    const isSharedWithUser = sharedUsers.some(sharedUser => sharedUser.email === user.email);

    return {
      id: doc.id,
      docId: doc.id,
      descripcion: taskData.descripcion || '',
      titulo: taskData.titulo || '',
      estado: taskData.estado || 'Pendiente',
      tags: Array.isArray(taskData.tags) ? taskData.tags : [],
      dueDate: taskData.dueDate || null,
      priority: taskData.priority || 'normal',
      user_id: taskData.user_id,
      sharedWith: sharedUsers,
      isShared: taskData.user_id !== user.uid,
      canEdit: taskData.user_id === user.uid || isSharedWithUser,
      fechaInicio: taskData.dueDate || new Date(),
      fechaFin: taskData.dueDate || new Date()
    };
  }, [user.uid, user.email]);

  const updateCounts = useCallback((tasksList) => {
    const completed = tasksList.filter(task => task.estado === "Completada");
    const overdue = tasksList.filter(task => {
      const dueDate = task.dueDate?.toDate();
      return task.estado === "Pendiente" && dueDate && dueDate < new Date();
    });
    const pending = tasksList.filter(task => {
      const dueDate = task.dueDate?.toDate();
      return task.estado === "Pendiente" && (!dueDate || dueDate >= new Date());
    });

    setCompletedCount(completed.length);
    setOverdueCount(overdue.length);
    setPendingCount(pending.length);
  }, []);

  useEffect(() => {
    if (!user?.uid || !user?.email) {
      setTasks([]);
      setCompletedCount(0);
      setPendingCount(0);
      setOverdueCount(0);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('Iniciando suscripción a tareas para usuario:', user.email);

      // Primero, obtenemos las tareas propias del usuario
      const ownTasksQuery = query(
        collection(db, "tasks"),
        where("user_id", "==", user.uid)
      );

      // Luego, obtenemos todas las tareas y filtramos las compartidas
      const allTasksQuery = query(collection(db, "tasks"));

      const unsubscribe = onSnapshot(allTasksQuery, async (querySnapshot) => {
        try {
          // Obtener tareas propias
          const ownTasksSnapshot = await getDocs(ownTasksQuery);
          const ownTasks = ownTasksSnapshot.docs.map(processTask).filter(task => task !== null);

          // Filtrar tareas compartidas
          const sharedTasks = querySnapshot.docs
            .map(processTask)
            .filter(task => {
              if (!task) return false;
              const sharedUsers = task.sharedWith || [];
              return sharedUsers.some(sharedUser => sharedUser.email === user.email);
            });

          // Combinar tareas propias y compartidas
          const allTasks = [...ownTasks, ...sharedTasks];
          
          // Eliminar duplicados si los hay
          const uniqueTasks = Array.from(new Map(allTasks.map(task => [task.id, task])).values());

          console.log('Total de tareas obtenidas:', uniqueTasks.length);
          setTasks(uniqueTasks);
          updateCounts(uniqueTasks);
          setLoading(false);
        } catch (error) {
          console.error("Error procesando tareas:", error);
          setError(error);
          setLoading(false);
        }
      }, (error) => {
        console.error("Error en la suscripción:", error);
        setError(error);
        setLoading(false);
      });

      return () => {
        console.log('Limpiando suscripción a tareas');
        unsubscribe();
      };
    } catch (error) {
      console.error("Error al configurar la suscripción:", error);
      setError(error);
      setLoading(false);
    }
  }, [db, user, processTask, updateCounts]);

  return {
    tasks,
    loading,
    error,
    completedCount,
    pendingCount,
    overdueCount
  };
};

export default useTasks;
