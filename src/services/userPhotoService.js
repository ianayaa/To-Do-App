import { doc, updateDoc, writeBatch, collection, getDocs } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';

export const updateUserPhoto = async (db, auth, photoURL) => {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('No hay usuario autenticado');

        console.log('Iniciando actualización de foto de usuario:', {
            userId: user.uid,
            newPhotoURL: photoURL
        });

        await updateProfile(user, { photoURL });
        console.log('Foto actualizada en Firebase Auth');

        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, { photoURL });
        console.log('Foto actualizada en documento de usuario');

        const batch = writeBatch(db);
        const tasksSnapshot = await getDocs(collection(db, 'tasks'));
        let updatedCount = 0;

        tasksSnapshot.forEach((taskDoc) => {
            const taskData = taskDoc.data();
            const sharedWith = taskData.sharedWith || [];
            const userIndex = sharedWith.findIndex(u => u.id === user.uid);

            if (userIndex !== -1) {
                const updatedSharedWith = [...sharedWith];
                updatedSharedWith[userIndex] = {
                    ...updatedSharedWith[userIndex],
                    photoURL
                };
                
                batch.update(doc(db, 'tasks', taskDoc.id), {
                    sharedWith: updatedSharedWith
                });
                updatedCount++;
            }
        });

        if (updatedCount > 0) {
            await batch.commit();
            console.log(`Foto actualizada en ${updatedCount} tareas compartidas`);
        }

        return true;
    } catch (error) {
        console.error('Error actualizando foto de usuario:', error);
        throw error;
    }
};
