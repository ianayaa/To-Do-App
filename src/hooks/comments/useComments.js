import { useState, useCallback } from 'react';
import { collection, addDoc, query, where, getDocs, deleteDoc, doc, Timestamp } from 'firebase/firestore';

const useComments = (db) => {
    const [comentarios, setComentarios] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const cargarComentarios = useCallback(async (taskId) => {
        if (!taskId) return;
        
        setLoading(true);
        setError(null);
        try {
            const comentariosRef = collection(db, 'comentario');
            const q = query(
                comentariosRef,
                where("taskId", "==", taskId)
            );
            const querySnapshot = await getDocs(q);
            const comentariosData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            // Ordenar los comentarios por fecha después de obtenerlos
            comentariosData.sort((a, b) => b.fecha.seconds - a.fecha.seconds);
            setComentarios(comentariosData);
        } catch (error) {
            console.error("Error al cargar comentarios:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }, [db]);

    const agregarComentario = async (comentarioData) => {
        if (!comentarioData.taskId) return;

        try {
            const docRef = await addDoc(collection(db, 'comentario'), {
                ...comentarioData,
                fecha: Timestamp.now()
            });
            
            // Actualizar el estado local inmediatamente
            const nuevoComentario = {
                id: docRef.id,
                ...comentarioData,
                fecha: Timestamp.now()
            };
            
            setComentarios(prevComentarios => 
                [nuevoComentario, ...prevComentarios]
            );
            
            return docRef;
        } catch (error) {
            console.error("Error al agregar comentario:", error);
            setError(error.message);
            throw error;
        }
    };

    const eliminarComentario = async (comentarioId) => {
        if (!comentarioId) return;

        try {
            await deleteDoc(doc(db, 'comentario', comentarioId));
            // Actualizar el estado local inmediatamente
            setComentarios(prevComentarios => 
                prevComentarios.filter(com => com.id !== comentarioId)
            );
        } catch (error) {
            console.error("Error al eliminar comentario:", error);
            setError(error.message);
            throw error;
        }
    };

    return {
        comentarios,
        loading,
        error,
        cargarComentarios,
        agregarComentario,
        eliminarComentario
    };
};

export default useComments;
