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
    Autocomplete,
    Chip
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faUserPlus, faTrash, faShare } from '@fortawesome/free-solid-svg-icons';
import { searchUserByEmail, shareTaskWithUser, removeSharedUser } from '../../services/shareTaskService';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth } from '../../config/firebase';

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
        
        const unsubscribes = currentTask.sharedWith.map(sharedUser => {
            return onSnapshot(
                doc(db, "users", sharedUser.id),
                (userDoc) => {
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        // Solo actualizar si la foto realmente cambió y es diferente a la actual
                        if (userData.photoURL !== sharedUser.photoURL && 
                            userData.photoURL !== userPhotoUpdates[sharedUser.id]) {
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
            unsubscribes.forEach(unsubscribe => unsubscribe());
        };
    }, [db, currentTask?.id, currentTask?.sharedWith]); // Solo depender del ID y sharedWith

    // Aplicar actualizaciones de fotos al currentTask
    useEffect(() => {
        if (Object.keys(userPhotoUpdates).length === 0) return;

        // Verificar si realmente hay cambios antes de actualizar
        const needsUpdate = currentTask?.sharedWith?.some(
            user => userPhotoUpdates[user.id] && userPhotoUpdates[user.id] !== user.photoURL
        );

        if (!needsUpdate) {
            setUserPhotoUpdates({});
            return;
        }

        const updatedTask = {
            ...currentTask,
            sharedWith: currentTask.sharedWith.map(user => ({
                ...user,
                photoURL: userPhotoUpdates[user.id] || user.photoURL
            }))
        };

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
        const savedEmails = localStorage.getItem('recentSharedEmails');
        if (savedEmails) {
            setRecentEmails(JSON.parse(savedEmails));
        }
    }, []);

    const handleShare = async () => {
        try {
            setError('');
            setLoading(true);

            if (!isValidEmail(email)) {
                setError('Correo electrónico inválido');
                return;
            }

            // Verificar que no sea el correo del usuario actual
            const currentUserEmail = auth.currentUser?.email;
            if (email.toLowerCase() === currentUserEmail?.toLowerCase()) {
                setError('No puedes compartir la tarea contigo mismo');
                return;
            }

            const user = await searchUserByEmail(db, email);
            
            if (!user) {
                setError('Usuario no encontrado');
                return;
            }

            // Verificar si ya está compartido con este usuario
            if (currentTask.sharedWith?.some(u => u.email.toLowerCase() === email.toLowerCase())) {
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
                        borderRadius: '16px',
                        backgroundColor: '#25283D',
                        color: 'white',
                        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
                    }
                }}
            >
                <DialogTitle 
                    sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        pb: 1,
                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <FontAwesomeIcon 
                            icon={faShare} 
                            style={{ 
                                color: '#FFC247',
                                fontSize: '1.2rem' 
                            }} 
                        />
                        <Typography 
                            variant="h6" 
                            component="div"
                            sx={{
                                fontWeight: 600,
                                color: '#FFC247'
                            }}
                        >
                            Compartir Tarea
                        </Typography>
                    </Box>
                    <IconButton
                        onClick={handleClose}
                        size="small"
                        sx={{ 
                            color: 'rgba(255, 255, 255, 0.7)',
                            transition: 'all 0.2s',
                            '&:hover': {
                                color: '#FFC247',
                                backgroundColor: 'rgba(255, 194, 71, 0.1)',
                            }
                        }}
                    >
                        <FontAwesomeIcon icon={faTimes} />
                    </IconButton>
                </DialogTitle>

                <DialogContent sx={{ mt: 2 }}>
                    <Box sx={{ mb: 3 }}>
                        <Typography 
                            variant="subtitle1" 
                            sx={{ 
                                mb: 1,
                                color: 'rgba(255, 255, 255, 0.9)',
                                fontWeight: 500
                            }}
                        >
                            {currentTask?.titulo}
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
                                    placeholder="Ingresa un correo electrónico"
                                    error={!!error}
                                    helperText={error}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            color: 'white',
                                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                            borderRadius: '12px',
                                            transition: 'all 0.2s',
                                            '& fieldset': { 
                                                borderColor: 'rgba(255, 255, 255, 0.1)',
                                                borderWidth: '1px',
                                            },
                                            '&:hover fieldset': { 
                                                borderColor: '#FFC247',
                                                borderWidth: '1px',
                                            },
                                            '&.Mui-focused fieldset': { 
                                                borderColor: '#FFC247',
                                                borderWidth: '2px',
                                            },
                                        },
                                        '& .MuiInputLabel-root': {
                                            color: 'rgba(255, 255, 255, 0.7)',
                                            '&.Mui-focused': { color: '#FFC247' },
                                        },
                                        '& .MuiFormHelperText-root': {
                                            color: '#ff6b6b',
                                            marginLeft: '14px',
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
                                borderRadius: '12px',
                                minWidth: '50px',
                                height: '56px',
                                transition: 'all 0.2s',
                                '&:hover': {
                                    backgroundColor: '#ffb014',
                                },
                                '&.Mui-disabled': {
                                    backgroundColor: 'rgba(255, 194, 71, 0.3)',
                                    color: 'rgba(37, 40, 61, 0.7)',
                                }
                            }}
                        >
                            {loading ? (
                                <CircularProgress size={24} sx={{ color: '#25283D' }} />
                            ) : (
                                <FontAwesomeIcon icon={faUserPlus} />
                            )}
                        </Button>
                    </Box>

                    {/* Correos recientes */}
                    {recentEmails.length > 0 && (
                        <Box sx={{ mt: 4 }}>
                            <Typography 
                                variant="subtitle2" 
                                sx={{ 
                                    mb: 2,
                                    color: 'rgba(255, 255, 255, 0.7)',
                                    fontWeight: 500,
                                    letterSpacing: '0.5px'
                                }}
                            >
                                Correos recientes
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                {recentEmails.map((recentEmail, index) => (
                                    <Chip
                                        key={index}
                                        label={recentEmail}
                                        onClick={() => setEmail(recentEmail)}
                                        sx={{
                                            bgcolor: 'rgba(255, 255, 255, 0.05)',
                                            color: 'white',
                                            borderRadius: '8px',
                                            transition: 'all 0.2s',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            '&:hover': {
                                                bgcolor: 'rgba(255, 194, 71, 0.1)',
                                                color: '#FFC247',
                                            }
                                        }}
                                    />
                                ))}
                            </Box>
                        </Box>
                    )}

                    {currentTask?.sharedWith?.length > 0 && (
                        <Box sx={{ mt: 4 }}>
                            <Typography 
                                variant="subtitle2" 
                                sx={{ 
                                    mb: 2,
                                    color: 'rgba(255, 255, 255, 0.7)',
                                    fontWeight: 500,
                                    letterSpacing: '0.5px'
                                }}
                            >
                                Compartido con
                            </Typography>
                            <List sx={{ 
                                bgcolor: 'rgba(255, 255, 255, 0.03)',
                                borderRadius: '12px',
                                overflow: 'hidden'
                            }}>
                                {currentTask.sharedWith.map((user, index) => (
                                    <ListItem 
                                        key={user.id}
                                        sx={{
                                            transition: 'all 0.2s',
                                            '&:hover': {
                                                bgcolor: 'rgba(255, 255, 255, 0.05)',
                                            },
                                            borderBottom: index < currentTask.sharedWith.length - 1 ? 
                                                '1px solid rgba(255, 255, 255, 0.1)' : 'none',
                                        }}
                                    >
                                        <Avatar 
                                            src={user.photoURL}
                                            sx={{ 
                                                mr: 2, 
                                                bgcolor: '#FFC247',
                                                width: 40,
                                                height: 40,
                                            }}
                                        >
                                            {user.displayName?.[0]?.toUpperCase()}
                                        </Avatar>
                                        <ListItemText 
                                            primary={user.displayName}
                                            secondary={user.email}
                                            primaryTypographyProps={{
                                                sx: { 
                                                    color: 'white',
                                                    fontWeight: 500
                                                }
                                            }}
                                            secondaryTypographyProps={{
                                                sx: { 
                                                    color: 'rgba(255, 255, 255, 0.5)',
                                                    fontSize: '0.875rem'
                                                }
                                            }}
                                        />
                                        <IconButton
                                            edge="end"
                                            onClick={() => handleRemoveShare(user.id)}
                                            sx={{ 
                                                color: 'rgba(255, 107, 107, 0.7)',
                                                transition: 'all 0.2s',
                                                '&:hover': {
                                                    color: '#ff6b6b',
                                                    backgroundColor: 'rgba(255, 107, 107, 0.1)',
                                                }
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faTrash} />
                                        </IconButton>
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
                    sx={{ 
                        backgroundColor: '#25283D',
                        color: '#FFC247',
                        '& .MuiAlert-icon': {
                            color: '#FFC247'
                        }
                    }}
                >
                    {success}
                </Alert>
            </Snackbar>
        </>
    );
};

export default ShareTaskDialog;
