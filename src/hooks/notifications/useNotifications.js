import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';

const useNotifications = (db, user) => {
    const [notifications, setNotifications] = useState({
        tasks: 0,
        calendar: 0
    });

    useEffect(() => {
        const fetchNotifications = async () => {
            if (!db || !user) return;

            try {
                // Obtener tareas pendientes
                const tasksRef = collection(db, 'tareas');
                const q = query(
                    tasksRef,
                    where("userId", "==", user.uid),
                    where("estado", "==", "Pendiente")
                );
                const querySnapshot = await getDocs(q);
                
                // Contar tareas pendientes
                const pendingTasks = querySnapshot.docs.length;
                
                // Contar tareas para hoy
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const tomorrow = new Date(today);
                tomorrow.setDate(tomorrow.getDate() + 1);

                const tasksForToday = querySnapshot.docs.filter(doc => {
                    const dueDate = doc.data().dueDate?.toDate();
                    return dueDate >= today && dueDate < tomorrow;
                }).length;

                setNotifications({
                    tasks: pendingTasks,
                    calendar: tasksForToday
                });

            } catch (error) {
                console.error("Error fetching notifications:", error);
            }
        };

        fetchNotifications();
    }, [db, user]);

    return notifications;
};

export default useNotifications;
