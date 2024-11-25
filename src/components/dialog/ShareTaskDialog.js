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

const ShareTaskDialog = ({ open, onClose, task, db }) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [recentEmails, setRecentEmails] = useState([]);

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

            if (task.sharedWith?.some(sharedUser => sharedUser.id === user.id)) {
                setError('Esta tarea ya está compartida con este usuario');
                return;
            }

            await shareTaskWithUser(db, task.id, user);
            
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
            await removeSharedUser(db, task.id, userId);
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
                            Tarea: {task?.titulo}
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

                    {task?.sharedWith?.length > 0 && (
                        <Box>
                            <Typography variant="subtitle1" sx={{ mb: 1 }}>
                                Compartido con:
                            </Typography>
                            <List>
                                {task.sharedWith.map((user) => (
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
