import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Typography,
    Box,
    Avatar,
    CircularProgress,
    Snackbar,
    Alert,
    Autocomplete
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faUserPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { searchUserByEmail, shareTaskWithUser, removeSharedUser } from '../../services/shareTaskService';
import { doc, onSnapshot } from 'firebase/firestore';

const ShareTaskDialog = ({ open, onClose, task, db }) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [recentEmails, setRecentEmails] = useState([]);
    const [currentTask, setCurrentTask] = useState(task);
    const [userPhotoUpdates, setUserPhotoUpdates] = useState({});

    // Suscribirse a cambios en la tarea
    useEffect(() => {
        if (!open || !task?.id) return;

        console.log('Suscribiéndose a cambios en la tarea:', task.id);
        
        const unsubscribe = onSnapshot(
            doc(db, "tasks", task.id),
            (doc) => {
                if (doc.exists()) {
                    const taskData = { id: doc.id, ...doc.data() };
                    console.log('Tarea actualizada:', taskData);
                    setCurrentTask(taskData);
                }
            },
            (error) => {
                console.error("Error al observar la tarea:", error);
            }
        );

        return () => {
            console.log('Desuscribiéndose de cambios en la tarea');
            unsubscribe();
        };
    }, [db, task?.id, open]);

    // Suscribirse a cambios en los usuarios compartidos
    useEffect(() => {
        if (!currentTask?.sharedWith?.length) return;

        console.log('Configurando suscripciones para usuarios compartidos');
        
        const unsubscribes = currentTask.sharedWith.map(sharedUser => {
            return onSnapshot(
                doc(db, "users", sharedUser.id),
                (userDoc) => {
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        if (userData.photoURL !== sharedUser.photoURL) {
                            console.log('Detectado cambio en foto de usuario compartido:', {
                                userId: sharedUser.id,
                                oldPhoto: sharedUser.photoURL,
                                newPhoto: userData.photoURL
                            });
                            setUserPhotoUpdates(prev => ({
                                ...prev,
                                [sharedUser.id]: userData.photoURL
                            }));
                        }
                    }
                }
            );
        });

        return () => {
            console.log('Limpiando suscripciones de usuarios compartidos');
            unsubscribes.forEach(unsubscribe => unsubscribe());
        };
    }, [db, currentTask?.sharedWith]);

    // Aplicar actualizaciones de fotos al currentTask
    useEffect(() => {
        if (Object.keys(userPhotoUpdates).length === 0) return;

        const updatedTask = {
            ...currentTask,
            sharedWith: currentTask.sharedWith.map(user => ({
                ...user,
                photoURL: userPhotoUpdates[user.id] || user.photoURL
            }))
        };

        console.log('Aplicando actualizaciones de fotos:', {
            updates: userPhotoUpdates,
            newTask: updatedTask
        });

        setCurrentTask(updatedTask);
        setUserPhotoUpdates({});
    }, [userPhotoUpdates]);

    // Validación de email
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Cargar correos recientes del localStorage
    useEffect(() => {
        const saved = localStorage.getItem('recentSharedEmails');
        if (saved) {
            setRecentEmails(JSON.parse(saved));
        }
    }, []);

    const handleShare = async () => {
        if (!isValidEmail(email)) {
            setError('Por favor, ingresa un correo electrónico válido');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const user = await searchUserByEmail(db, email);
            if (!user) {
                setError('No se encontró ningún usuario con este correo electrónico');
                return;
            }

            if (currentTask.sharedWith?.some(sharedUser => sharedUser.id === user.id)) {
                setError('Esta tarea ya está compartida con este usuario');
                return;
            }

            await shareTaskWithUser(db, currentTask.id, user);
            
            // Guardar email en recientes
            const updatedRecents = [email, ...recentEmails.filter(e => e !== email)].slice(0, 5);
            setRecentEmails(updatedRecents);
            localStorage.setItem('recentSharedEmails', JSON.stringify(updatedRecents));
            
            setEmail('');
            setSuccess('¡Tarea compartida exitosamente!');
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveShare = async (userId) => {
        try {
            await removeSharedUser(db, currentTask.id, userId);
            setSuccess('Usuario removido exitosamente');
        } catch (error) {
            setError(error.message);
        }
    };

    const handleClose = () => {
        setEmail('');
        setError('');
        setSuccess('');
        onClose();
    };

    return (
        <>
            <Dialog 
                open={open} 
                onClose={handleClose}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        backgroundColor: '#25283D',
                        color: 'white'
                    }
                }}
            >
                <DialogTitle sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    pb: 1
                }}>
                    <Typography variant="h6">
                        Compartir Tarea
                    </Typography>
                    <IconButton
                        onClick={handleClose}
                        size="small"
                        sx={{ 
                            color: 'rgba(255, 255, 255, 0.7)',
                            '&:hover': {
                                color: 'white',
                                backgroundColor: 'rgba(255, 255, 255, 0.1)'
                            }
                        }}
                    >
                        <FontAwesomeIcon icon={faTimes} />
                    </IconButton>
                </DialogTitle>

                <DialogContent>
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle1" sx={{ mb: 1 }}>
                            Tarea: {currentTask?.titulo}
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                        <Autocomplete
                            fullWidth
                            freeSolo
                            options={recentEmails}
                            value={email}
                            onChange={(event, newValue) => {
                                setEmail(newValue || '');
                            }}
                            onInputChange={(event, newInputValue) => {
                                setEmail(newInputValue);
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Correo electrónico"
                                    error={!!error}
                                    helperText={error}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            color: 'white',
                                            '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                                            '&:hover fieldset': { borderColor: '#FFC247' },
                                            '&.Mui-focused fieldset': { borderColor: '#FFC247' },
                                        },
                                        '& .MuiInputLabel-root': {
                                            color: 'rgba(255, 255, 255, 0.7)',
                                            '&.Mui-focused': { color: '#FFC247' },
                                        },
                                        '& .MuiFormHelperText-root': {
                                            color: '#ff6b6b',
                                        },
                                    }}
                                />
                            )}
                        />
                        <Button
                            variant="contained"
                            onClick={handleShare}
                            disabled={loading || !email}
                            sx={{
                                backgroundColor: '#FFC247',
                                color: '#25283D',
                                '&:hover': {
                                    backgroundColor: '#ffb014',
                                },
                                minWidth: '50px',
                                height: '56px'
                            }}
                        >
                            {loading ? (
                                <CircularProgress size={24} sx={{ color: '#25283D' }} />
                            ) : (
                                <FontAwesomeIcon icon={faUserPlus} />
                            )}
                        </Button>
                    </Box>

                    {currentTask?.sharedWith?.length > 0 && (
                        <Box>
                            <Typography variant="subtitle1" sx={{ mb: 1 }}>
                                Compartido con:
                            </Typography>
                            <List>
                                {currentTask.sharedWith.map((user) => (
                                    <ListItem 
                                        key={user.id}
                                        sx={{
                                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                            borderRadius: 1,
                                            mb: 1,
                                        }}
                                    >
                                        <Avatar 
                                            src={user.photoURL}
                                            sx={{ 
                                                mr: 2, 
                                                bgcolor: '#FFC247',
                                                width: 40,
                                                height: 40
                                            }}
                                        >
                                            {user.displayName?.[0]?.toUpperCase()}
                                        </Avatar>
                                        <ListItemText 
                                            primary={user.displayName}
                                            secondary={user.email}
                                            primaryTypographyProps={{
                                                sx: { color: 'white' }
                                            }}
                                            secondaryTypographyProps={{
                                                sx: { color: 'rgba(255, 255, 255, 0.7)' }
                                            }}
                                        />
                                        <ListItemSecondaryAction>
                                            <IconButton
                                                edge="end"
                                                onClick={() => handleRemoveShare(user.id)}
                                                sx={{ 
                                                    color: '#ff6b6b',
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(255, 107, 107, 0.1)',
                                                    }
                                                }}
                                            >
                                                <FontAwesomeIcon icon={faTrash} />
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    )}
                </DialogContent>
            </Dialog>

            <Snackbar 
                open={!!success} 
                autoHideDuration={3000} 
                onClose={() => setSuccess('')}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert 
                    onClose={() => setSuccess('')} 
                    severity="success" 
                    sx={{ width: '100%' }}
                >
                    {success}
                </Alert>
            </Snackbar>
        </>
    );
};

export default ShareTaskDialog;
