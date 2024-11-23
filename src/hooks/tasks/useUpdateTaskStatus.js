import { doc, updateDoc } from 'firebase/firestore';

const useUpdateTaskStatus = (db) => {
  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, {
        estado: newStatus,
        completedAt: newStatus === 'Completada' ? new Date() : null
      });
      return true;
    } catch (error) {
      console.error('Error updating task status:', error);
      return false;
    }
  };

  return { updateTaskStatus };
};

export default useUpdateTaskStatus;
