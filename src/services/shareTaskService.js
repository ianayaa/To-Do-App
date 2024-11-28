import { 
    collection, 
    query, 
    where, 
    getDocs, 
    updateDoc, 
    doc, 
    arrayUnion, 
    arrayRemove,
    getDoc,
    onSnapshot,
    writeBatch
} from "firebase/firestore";

export const searchUserByEmail = async (db, email) => {
    try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("email", "==", email));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
            return null;
        }

        const userData = querySnapshot.docs[0].data();
        const userId = querySnapshot.docs[0].id;
        
        if (!userData.name && !userData.displayName) {
            throw new Error("Usuario encontrado pero no tiene nombre configurado");
        }
        
        return {
            id: userId,
            email: email,
            displayName: userData.name || userData.displayName,
            photoURL: userData.photoURL
        };
    } catch (error) {
        console.error("Error buscando usuario:", error);
        throw error;
    }
};

const updateSharedUserInfo = async (db, taskId, userId) => {
    try {
        // Obtener la información actualizada del usuario
        const userDoc = await getDoc(doc(db, "users", userId));
        if (!userDoc.exists()) return null;
        
        const userData = userDoc.data();
        return {
            id: userId,
            email: userData.email,
            displayName: userData.name || userData.displayName,
            photoURL: userData.photoURL
        };
    } catch (error) {
        console.error("Error actualizando información del usuario compartido:", error);
        return null;
    }
};

export const shareTaskWithUser = async (db, taskId, user) => {
    try {
        if (!user.displayName) {
            throw new Error("El usuario debe tener un nombre configurado");
        }

        // Obtener los datos más recientes del usuario
        const updatedUser = await searchUserByEmail(db, user.email);
        if (!updatedUser) {
            throw new Error("No se pudo encontrar el usuario");
        }

        const userToShare = {
            id: updatedUser.id,
            email: updatedUser.email,
            displayName: updatedUser.displayName,
            photoURL: updatedUser.photoURL
        };

        const taskRef = doc(db, "tasks", taskId);
        
        // Obtener la tarea actual
        const taskDoc = await getDoc(taskRef);
        if (!taskDoc.exists()) {
            throw new Error("La tarea no existe");
        }

        const taskData = taskDoc.data();
        const sharedWith = taskData.sharedWith || [];

        // Verificar si el usuario ya está en la lista
        const existingUserIndex = sharedWith.findIndex(u => u.id === userToShare.id);
        
        if (existingUserIndex !== -1) {
            // Actualizar la información del usuario existente
            sharedWith[existingUserIndex] = userToShare;
            await updateDoc(taskRef, { sharedWith });
        } else {
            // Agregar nuevo usuario
            await updateDoc(taskRef, {
                sharedWith: arrayUnion(userToShare)
            });
        }

        return true;
    } catch (error) {
        console.error("Error compartiendo tarea:", error);
        throw error;
    }
};

export const removeSharedUser = async (db, taskId, userId) => {
    try {
        const taskRef = doc(db, "tasks", taskId);
        const taskDoc = await getDoc(taskRef);
        const taskData = taskDoc.data();
        
        const userToRemove = taskData.sharedWith.find(user => user.id === userId);
        
        if (userToRemove) {
            await updateDoc(taskRef, {
                sharedWith: arrayRemove(userToRemove)
            });
        }
        
        return true;
    } catch (error) {
        console.error("Error removiendo usuario:", error);
        throw error;
    }
};

// Función para actualizar la información de un usuario en todas sus tareas compartidas
export const updateUserInfoInSharedTasks = async (db, userId, newUserInfo) => {
    try {
        console.log('Actualizando información del usuario en tareas compartidas:', { userId, newUserInfo });
        
        // Buscar todas las tareas donde el usuario está compartido
        const tasksRef = collection(db, "tasks");
        const q = query(tasksRef);
        const querySnapshot = await getDocs(q);
        const batch = writeBatch(db);
        let updatedCount = 0;

        // Actualizar cada tarea que tenga al usuario en sharedWith
        querySnapshot.docs.forEach((taskDoc) => {
            const taskData = taskDoc.data();
            const sharedWith = taskData.sharedWith || [];
            
            // Buscar si el usuario está en la lista de compartidos
            const userIndex = sharedWith.findIndex(user => user.id === userId);
            
            if (userIndex !== -1) {
                // Actualizar la información del usuario
                const updatedSharedWith = [...sharedWith];
                updatedSharedWith[userIndex] = {
                    ...updatedSharedWith[userIndex],
                    ...newUserInfo
                };
                
                // Agregar la actualización al batch
                batch.update(doc(db, "tasks", taskDoc.id), {
                    sharedWith: updatedSharedWith
                });
                updatedCount++;
            }
        });

        if (updatedCount > 0) {
            await batch.commit();
            console.log(`Actualizadas ${updatedCount} tareas con la nueva información del usuario`);
        } else {
            console.log('No se encontraron tareas para actualizar');
        }

        return true;
    } catch (error) {
        console.error("Error actualizando información del usuario en tareas compartidas:", error);
        throw error;
    }
};
