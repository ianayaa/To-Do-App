import { useState } from 'react';
import { doc, deleteDoc } from 'firebase/firestore';

const useDeleteComment = (db) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const deleteComment = async (commentId) => {
        if (!commentId) return;
        
        setLoading(true);
        setError(null);
        
        try {
            await deleteDoc(doc(db, 'comentario', commentId));
            return true;
        } catch (error) {
            console.error("Error al eliminar comentario:", error);
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return {
        deleteComment,
        loading,
        error
    };
};

export default useDeleteComment;
