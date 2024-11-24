import React, { useState } from 'react';
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
    CircularProgress
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faUserPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { searchUserByEmail, shareTaskWithUser, removeSharedUser } from '../../services/shareTaskService';

const ShareTaskDialog = ({ open, onClose, task, db }) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleShare = async () => {
        setLoading(true);
        setError('');
        try {
            const user = await searchUserByEmail(db, email);
            if (!user) {
                setError('Usuario no encontrado');
                return;
            }

            if (task.sharedWith.includes(user.id)) {
                setError('Esta tarea ya está compartida con este usuario');
                return;
            }

            await shareTaskWithUser(db, task.id, user.id);
            setEmail('');
            setError('');
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveShare = async (userId) => {
        try {
            await removeSharedUser(db, task.id, userId);
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <Dialog 
            open={open} 
            onClose={onClose}
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
                    onClick={onClose}
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
                    <TextField
                        fullWidth
                        label="Email del usuario"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                            {task.sharedWith.map((userId) => (
                                <ListItem 
                                    key={userId}
                                    sx={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                        borderRadius: 1,
                                        mb: 1,
                                    }}
                                >
                                    <Avatar sx={{ mr: 2, bgcolor: '#FFC247' }}>
                                        {userId[0]?.toUpperCase()}
                                    </Avatar>
                                    <ListItemText 
                                        primary={userId}
                                        sx={{ color: 'white' }}
                                    />
                                    <ListItemSecondaryAction>
                                        <IconButton
                                            edge="end"
                                            onClick={() => handleRemoveShare(userId)}
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

            <DialogActions sx={{ p: 2 }}>
                <Button 
                    onClick={onClose}
                    sx={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        }
                    }}
                >
                    Cerrar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ShareTaskDialog;
