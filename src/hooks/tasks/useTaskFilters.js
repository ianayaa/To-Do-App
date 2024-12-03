import { useMemo } from 'react';

export function useTaskFilters(tasks, filters) {
  return useMemo(() => {
    let filteredTasks = [...tasks];

    // Filtrar por estado
    if (filters.status) {
      filteredTasks = filteredTasks.filter(task => task.estado === filters.status);
    }

    // Filtrar por prioridad
    if (filters.priority) {
      filteredTasks = filteredTasks.filter(task => task.priority === filters.priority);
    }

    // Filtrar por fecha
    if (filters.startDate) {
      filteredTasks = filteredTasks.filter(task => {
        const taskDate = task.dueDate?.toDate?.();
        return taskDate >= filters.startDate;
      });
    }

    if (filters.endDate) {
      filteredTasks = filteredTasks.filter(task => {
        const taskDate = task.dueDate?.toDate?.();
        return taskDate <= filters.endDate;
      });
    }

    // Ordenar tareas
    if (filters.sortBy) {
      filteredTasks.sort((a, b) => {
        switch (filters.sortBy) {
          case 'dueDate':
            return (a.dueDate?.toDate?.() || 0) - (b.dueDate?.toDate?.() || 0);
          case 'priority':
            const priorityOrder = { 'Alta': 3, 'Normal': 2, 'Baja': 1 };
            return priorityOrder[b.priority] - priorityOrder[a.priority];
          case 'status':
            return a.estado.localeCompare(b.estado);
          default:
            return 0;
        }
      });

      // Invertir orden si es descendente
      if (filters.sortOrder === 'desc') {
        filteredTasks.reverse();
      }
    }

    return filteredTasks;
  }, [tasks, filters]);
}
