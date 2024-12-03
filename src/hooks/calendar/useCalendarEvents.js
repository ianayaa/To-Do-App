import { useMemo, useCallback } from 'react';

export function useCalendarEvents(tasks) {
  // Función para obtener el nombre de clase del evento
  const getEventClassName = useCallback((task) => {
    if (!task) return '';
    
    if (task.priority === "Alta") return "task-high-priority";
    switch (task.estado) {
      case "Completada":
        return "task-completed";
      case "Pendiente":
        return "task-pending";
      case "En Progreso":
        return "task-in-progress";
      default:
        return "";
    }
  }, []);

  // Eventos formateados para el calendario completo
  const fullCalendarEvents = useMemo(() => {
    if (!tasks || !Array.isArray(tasks)) return [];
    
    return tasks.map((task) => ({
      id: task.id,
      title: task.titulo,
      start: task.dueDate?.toDate?.(),
      end: task.dueDate?.toDate?.(),
      className: getEventClassName(task),
      extendedProps: {
        task: task,
        description: task.descripcion,
        priority: task.priority,
        status: task.estado,
      }
    }));
  }, [tasks, getEventClassName]);

  // Eventos formateados para el calendario móvil
  const mobileCalendarEvents = useMemo(() => {
    if (!tasks || !Array.isArray(tasks)) return [];
    
    return tasks.map(task => ({
      id: task.id,
      title: task.titulo,
      start: task.dueDate?.toDate?.(),
      end: task.dueDate?.toDate?.(),
      estado: task.estado,
      priority: task.priority,
      descripcion: task.descripcion
    }));
  }, [tasks]);

  return {
    fullCalendarEvents,
    mobileCalendarEvents,
    getEventClassName
  };
}
