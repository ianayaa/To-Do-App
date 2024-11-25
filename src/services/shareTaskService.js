import { 
    collection, 
    query, 
    where, 
    getDocs, 
    updateDoc, 
    doc, 
    arrayUnion, 
    arrayRemove,
    getDoc 
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
        
        // Asegurarnos de obtener el nombre real del usuario
        if (!userData.name && !userData.displayName) {
            throw new Error("Usuario encontrado pero no tiene nombre configurado");
        }
        
        // Asegurarnos de obtener la foto del usuario
        const photoURL = userData.photoURL || userData.profilePicture || null;
        
        return {
            id: querySnapshot.docs[0].id,
            email: email,
            displayName: userData.name || userData.displayName,
            photoURL: photoURL
        };
    } catch (error) {
        console.error("Error buscando usuario:", error);
        if (error.message === "Usuario encontrado pero no tiene nombre configurado") {
            throw new Error("El usuario debe configurar su nombre antes de poder compartir tareas");
        }
        throw new Error("No se pudo buscar el usuario");
    }
};

export const shareTaskWithUser = async (db, taskId, user) => {
    try {
        if (!user.displayName) {
            throw new Error("El usuario debe tener un nombre configurado");
        }

        // Asegurarnos de que la URL de la foto sea válida
        const photoURL = user.photoURL || null;

        const userToShare = {
            id: user.id || '',
            email: user.email || '',
            displayName: user.displayName,
            photoURL: photoURL
        };

        const taskRef = doc(db, "tasks", taskId);
        await updateDoc(taskRef, {
            sharedWith: arrayUnion(userToShare)
        });
        return true;
    } catch (error) {
        console.error("Error compartiendo tarea:", error);
        throw new Error("No se pudo compartir la tarea");
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
        throw new Error("No se pudo remover el usuario");
    }
};
