import { useReducer, useCallback } from 'react';

// Definir tipos de acciones
const ACTIONS = {
  SET_TASKS: 'SET_TASKS',
  ADD_TASK: 'ADD_TASK',
  UPDATE_TASK: 'UPDATE_TASK',
  DELETE_TASK: 'DELETE_TASK',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR'
};

// Estado inicial
const initialState = {
  tasks: [],
  loading: false,
  error: null
};

// Reducer para manejar las actualizaciones de estado
function tasksReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_TASKS:
      return {
        ...state,
        tasks: action.payload,
        loading: false
      };
    case ACTIONS.ADD_TASK:
      return {
        ...state,
        tasks: [...state.tasks, action.payload]
      };
    case ACTIONS.UPDATE_TASK:
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? action.payload : task
        )
      };
    case ACTIONS.DELETE_TASK:
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload)
      };
    case ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    case ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    default:
      return state;
  }
}

export function useTasksState() {
  const [state, dispatch] = useReducer(tasksReducer, initialState);

  // Acciones memoizadas
  const setTasks = useCallback((tasks) => {
    dispatch({ type: ACTIONS.SET_TASKS, payload: tasks });
  }, []);

  const addTask = useCallback((task) => {
    dispatch({ type: ACTIONS.ADD_TASK, payload: task });
  }, []);

  const updateTask = useCallback((task) => {
    dispatch({ type: ACTIONS.UPDATE_TASK, payload: task });
  }, []);

  const deleteTask = useCallback((taskId) => {
    dispatch({ type: ACTIONS.DELETE_TASK, payload: taskId });
  }, []);

  const setLoading = useCallback((isLoading) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: isLoading });
  }, []);

  const setError = useCallback((error) => {
    dispatch({ type: ACTIONS.SET_ERROR, payload: error });
  }, []);

  return {
    ...state,
    setTasks,
    addTask,
    updateTask,
    deleteTask,
    setLoading,
    setError
  };
}
