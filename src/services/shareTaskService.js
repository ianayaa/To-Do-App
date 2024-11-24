import { 
    collection, 
    query, 
    where, 
    getDocs, 
    updateDoc, 
    doc, 
    arrayUnion, 
    arrayRemove 
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
        return {
            id: querySnapshot.docs[0].id,
            email: userData.email,
            displayName: userData.displayName || email.split('@')[0],
            photoURL: userData.photoURL
        };
    } catch (error) {
        console.error("Error buscando usuario:", error);
        throw new Error("No se pudo buscar el usuario");
    }
};

export const shareTaskWithUser = async (db, taskId, userId) => {
    try {
        const taskRef = doc(db, "tasks", taskId);
        await updateDoc(taskRef, {
            sharedWith: arrayUnion(userId)
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
        await updateDoc(taskRef, {
            sharedWith: arrayRemove(userId)
        });
        return true;
    } catch (error) {
        console.error("Error removiendo usuario compartido:", error);
        throw new Error("No se pudo remover el usuario compartido");
    }
};
