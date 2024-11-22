import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    Typography,
    Box,
    TextField,
    Button,
    Divider,
    Chip,
    Avatar,
    DialogActions,
    Slide,
    Snackbar,
    DialogContentText,
    IconButton,
    Zoom,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPaperclip,
    faCalendarAlt,
    faFolderOpen,
    faXmark,
    faCheckCircle,
    faExclamationCircle,
    faClock,
    faBars,
    faCircleArrowUp,
    faTrash,
    faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../config/firebase";
import { Timestamp } from "firebase/firestore";
import useDeleteTask from "../../hooks/tasks/useDeleteTask";
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import SchoolIcon from '@mui/icons-material/School';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const TaskDetailDialog = ({ open, handleClose, task, db, deleteTask }) => {
    const [user] = useAuthState(auth);
    const { deleteTask: deleteTaskHook, loading, error } = useDeleteTask(db);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [deleteButtonState, setDeleteButtonState] = useState('initial'); // 'initial', 'confirm', 'success'

    const parseDueDate = (dueDate) =>
        dueDate && dueDate instanceof Timestamp ? dueDate.toDate() : null;

    const dueDateFormatted = parseDueDate(task.dueDate);
    const isOverdue =
        dueDateFormatted && dueDateFormatted < new Date() && task.estado === "Pendiente";

    const getStatusIcon = () => {
        if (task.estado === "Completada")
            return <FontAwesomeIcon icon={faCheckCircle} style={{ color: "green" }} />;
        if (task.estado === "Pendiente") {
            return isOverdue ? (
                <FontAwesomeIcon icon={faExclamationCircle} style={{ color: "red" }} />
            ) : (
                <FontAwesomeIcon icon={faClock} style={{ color: "orange" }} />
            );
        }
        return <FontAwesomeIcon icon={faFolderOpen} />;
    };

    // Función para manejar la apertura del diálogo de confirmación
    const handleDeleteClick = () => {
        setConfirmDialogOpen(true);
        setDeleteButtonState('confirm');
    };

    // Función para cancelar la eliminación
    const handleCancelDelete = () => {
        setConfirmDialogOpen(false);
        setDeleteButtonState('initial');
    };

    const handleDelete = async () => {
        try {
            console.log('Intentando eliminar tarea:', task);
            
            if (!task) {
                throw new Error("No se ha seleccionado ninguna tarea");
            }
            
            // Verificar que task.id sea un string válido
            if (!task.id || typeof task.id !== 'string') {
                console.error('ID de tarea inválido:', task.id);
                throw new Error("La tarea no tiene un ID válido");
            }

            if (!db) {
                throw new Error("No hay conexión con la base de datos");
            }

            // Intentar eliminar la tarea
            console.log('Eliminando tarea con ID:', task.id);
            await deleteTaskHook(task.id);
            
            // Si la eliminación fue exitosa
            setDeleteButtonState('success');
            setSnackbarMessage("Tarea eliminada con éxito");
            setSnackbarOpen(true);
            
            // Cerrar el diálogo después de un breve delay
            setTimeout(() => {
                handleClose();
                if (deleteTask) {
                    deleteTask(task.id);
                }
            }, 1500);
        } catch (err) {
            console.error("Error al eliminar la tarea:", err);
            setSnackbarMessage(err.message || "Hubo un problema al eliminar la tarea");
            setSnackbarOpen(true);
            setDeleteButtonState('initial');
        }
    };

    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}
                fullWidth
                maxWidth="sm"
                TransitionComponent={Transition}
                keepMounted
                sx={{
                    "& .MuiDialog-paper": {
                        borderRadius: 3,
                        backgroundColor: "#F9F7F3",
                        boxShadow: 3,
                        display: "flex",
                        flexDirection: "column",
                        overflow: "hidden",
                        height: "80vh",
                    },
                }}
            >
                <DialogActions
                    sx={{
                        backgroundColor: "#f8f9fa",
                        padding: "12px 24px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderBottom: "1px solid #e9ecef",
                    }}
                >
                    <Typography 
                        variant="h6" 
                        sx={{ 
                            fontWeight: 500,
                            color: "#2c3e50",
                            fontSize: "1.1rem",
                            letterSpacing: "0.5px"
                        }}
                    >
                        Detalles de la tarea:
                    </Typography>
                    <IconButton
                        onClick={handleClose}
                        size="small"
                        sx={{
                            color: "#6c757d",
                            '&:hover': {
                                color: "#dc3545",
                                backgroundColor: "rgba(220, 53, 69, 0.1)",
                            },
                            transition: "all 0.2s ease-in-out",
                        }}
                    >
                        <FontAwesomeIcon icon={faXmark} />
                    </IconButton>
                </DialogActions>

                <DialogTitle>
                    <Box display="flex" alignItems="center" gap={2}>
                        <Box
                            sx={{
                                fontSize: "1.5rem",
                                color: isOverdue ? "error.main" : "text.primary",
                            }}
                        >
                            {getStatusIcon()}
                        </Box>
                        <Typography variant="h6" component="div">
                            {task.titulo}
                        </Typography>
                    </Box>
                </DialogTitle>

                <DialogContent sx={{ 
                    display: "flex", 
                    p: 2, 
                    height: "100%",
                    position: "relative"
                }}>
                    {/* Columna Izquierda */}
                    <Box
                        flex={2}
                        sx={{
                            pr: 2,
                            backgroundColor: "#F9F7F3",
                            display: "flex",
                            flexDirection: "column",
                            height: "100%",
                            justifyContent: "space-between",
                            overflowY: "auto"
                        }}
                    >
                        {/* Contenedor scrolleable para la descripción */}
                        <Box sx={{ flex: 1 }}>
                            <Typography
                                variant="body1"
                                sx={{
                                    whiteSpace: "pre-wrap",
                                    wordBreak: "break-word"
                                }}
                            >
                                {task.descripcion || "Sin descripción"}
                            </Typography>
                        </Box>

                        {/* Contenedor para los botones */}
                        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                placeholder="Comentar"
                                InputProps={{
                                    startAdornment: (
                                        <Avatar
                                            alt={user?.displayName || "Usuario"}
                                            src={user?.photoURL || ""}
                                            sx={{ width: 40, height: 40, mr: 2 }}
                                        />
                                    ),
                                }}
                            />
                            <Button
                                sx={{
                                    marginLeft: "8px",
                                    padding: 0,
                                    minWidth: "auto",
                                    display: "flex",
                                    alignItems: "center",
                                    fontSize: "1.5rem",
                                }}
                                aria-label="Enviar comentario"
                            >
                                <FontAwesomeIcon
                                    icon={faCircleArrowUp}
                                    size="lg"
                                    style={{
                                        fontSize: "2rem",
                                        color: "#757575",
                                    }}
                                />
                            </Button>
                        </Box>
                    </Box>

                    {/* Columna Derecha */}
                    <Box
                        flex={1}
                        sx={{
                            pl: 2,
                            backgroundColor: "#F9F7F3",
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            position: "relative",
                            borderLeft: "1px solid #d0d0d0",
                        }}
                    >
                        {/* Contenedor scrolleable para el contenido */}
                        <Box sx={{ 
                            overflowY: "auto", 
                            flex: 1,
                            pb: "80px" // Espacio para el botón
                        }}>
                            <Box sx={{ mb: 1 }}>
                                <Typography variant="body2" color="textSecondary">
                                    Proyecto:
                                </Typography>
                                <Typography variant="body1">#Tareas</Typography>
                            </Box>
                            <Divider />
                            <Box sx={{ my: 1 }}>
                                <Typography variant="body2" color="textSecondary">
                                    Fecha de vencimiento:
                                </Typography>
                                <Box display="flex" alignItems="center" gap={1}>
                                    <FontAwesomeIcon icon={faCalendarAlt} style={{ color: "#CE2121" }} />
                                    <Typography variant="body1">
                                        {task.dueDate
                                            ? task.dueDate.toDate().toLocaleDateString("es-ES", {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                            })
                                            : "Sin fecha"}
                                    </Typography>
                                </Box>
                            </Box>
                            <Divider />
                            <Box sx={{ my: 1 }}>
                                <Typography variant="body2" color="textSecondary">
                                    Prioridad:
                                </Typography>
                                <Typography variant="body1">Media</Typography>
                            </Box>
                            <Divider />
                            <Box sx={{ mt: 1 }}>
                                <Typography variant="body2" color="textSecondary">
                                    Etiquetas:
                                </Typography>
                                <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                                    {task.tags && task.tags.length > 0 ? (
                                        task.tags.map((tag, index) => {
                                            const tagConfigs = {
                                                "Importante": { 
                                                    color: "#dc3545",
                                                    icon: <PriorityHighIcon sx={{ fontSize: 20, color: 'white' }} />
                                                },
                                                "Urgente": { 
                                                    color: "#fd7e14",
                                                    icon: <NotificationsActiveIcon sx={{ fontSize: 20, color: 'white' }} />
                                                },
                                                "Escuela": { 
                                                    color: "#0d6efd",
                                                    icon: <SchoolIcon sx={{ fontSize: 20, color: 'white' }} />
                                                },
                                                "Bajo": { 
                                                    color: "#198754",
                                                    icon: <AccessTimeIcon sx={{ fontSize: 20, color: 'white' }} />
                                                }
                                            };

                                            const tagConfig = tagConfigs[tag] || { 
                                                color: "#4caf50",
                                                icon: <PriorityHighIcon sx={{ fontSize: 20, color: 'white' }} />
                                            };

                                            return (
                                                <Chip 
                                                    key={index} 
                                                    label={tag}
                                                    icon={tagConfig.icon}
                                                    size="small" 
                                                    sx={{
                                                        backgroundColor: tagConfig.color,
                                                        color: 'white',
                                                        '& .MuiChip-icon': {
                                                            color: 'white',
                                                            marginLeft: '5px'
                                                        },
                                                        '& .MuiChip-label': {
                                                            paddingLeft: '8px'
                                                        },
                                                        '&:hover': {
                                                            backgroundColor: tagConfig.color,
                                                            opacity: 0.8
                                                        }
                                                    }}
                                                />
                                            );
                                        })
                                    ) : (
                                        <Typography variant="body2" color="textSecondary">
                                            No hay etiquetas
                                        </Typography>
                                    )}
                                </Box>
                            </Box>
                        </Box>

                        {/* Botón de eliminar con posición fija */}
                        <Box
                            sx={{
                                position: "absolute",
                                bottom: 0,
                                left: 0,
                                right: 0,
                                padding: "16px",
                                backgroundColor: "#F9F7F3",
                                borderTop: "1px solid rgba(0, 0, 0, 0.12)",
                                display: "flex",
                                justifyContent: "left"
                            }}
                        >
                            <Zoom in={true}>
                                <Button
                                    variant="contained"
                                    color={deleteButtonState === 'success' ? 'success' : 'error'}
                                    size="small"
                                    onClick={handleDeleteClick}
                                    disabled={deleteButtonState === 'success'}
                                    startIcon={
                                        deleteButtonState === 'success' ? (
                                            <CheckIcon />
                                        ) : deleteButtonState === 'confirm' ? (
                                            <CloseIcon />
                                        ) : (
                                            <FontAwesomeIcon icon={faTrash} />
                                        )
                                    }
                                    sx={{
                                        transition: 'all 0.3s ease-in-out',
                                        transform: deleteButtonState === 'success' ? 'scale(1.1)' : 'scale(1)',
                                    }}
                                >
                                    {deleteButtonState === 'success'
                                        ? 'Eliminado'
                                        : deleteButtonState === 'confirm'
                                        ? '¿Confirmar?'
                                        : 'Eliminar'}
                                </Button>
                            </Zoom>
                        </Box>
                    </Box>
                </DialogContent>
            </Dialog>

            {/* Diálogo de confirmación */}
            <Dialog
                open={confirmDialogOpen}
                onClose={handleCancelDelete}
                TransitionComponent={Slide}
                TransitionProps={{ direction: "up" }}
            >
                <DialogTitle>
                    {"¿Estás seguro de que quieres eliminar esta tarea?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Esta acción no se puede deshacer.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button 
                        onClick={handleCancelDelete}
                        color="primary"
                        variant="outlined"
                    >
                        No, Cancelar
                    </Button>
                    <Button 
                        onClick={handleDelete}
                        color="error"
                        variant="contained"
                        disabled={loading}
                        autoFocus
                    >
                        Sí, Eliminar
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                message={snackbarMessage}
            />
        </>
    );
};

export default TaskDetailDialog;
