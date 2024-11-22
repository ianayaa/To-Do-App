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
        if (!task.id) {
            setSnackbarMessage("ID de tarea no válido");
            setSnackbarOpen(true);
            return;
        }

        try {
            await deleteTaskHook(task.id);
            setDeleteButtonState('success');
            setSnackbarMessage("Tarea eliminada con éxito");
            setSnackbarOpen(true);
            
            // Esperar un momento antes de cerrar para mostrar la animación
            setTimeout(() => {
                handleClose();
                if (deleteTask) {
                    deleteTask(task.id);
                }
            }, 1500);
        } catch (err) {
            console.error("Error al eliminar la tarea:", err);
            setSnackbarMessage(err.message || "Hubo un problema al eliminar la tarea.");
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
                        backgroundColor: "#FFFFFF", // Color blanco para toda la barra
                        padding: "8px 16px", // Espaciado
                        display: "flex",
                        justifyContent: "space-between", // Asegura la distribución correcta
                        alignItems: "center",
                    }}
                >
                    <Typography variant="h6" sx={{ fontWeight: "Light" }}>
                        Detalles de la tarea:
                    </Typography>
                    <Button
                        onClick={handleClose}
                        startIcon={<FontAwesomeIcon icon={faXmark} />}
                        aria-label="Cerrar diálogo"
                        sx={{
                            color: "text.secondary",
                            alignSelf: "flex-end",
                        }}
                    />
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

                <DialogContent sx={{ display: "flex", p: 2, height: "100%" }}>
                    {/* Columna Izquierda */}
                    <Box
                        flex={2}
                        sx={{
                            pr: 2,
                            backgroundColor: "#F9F7F3",
                            overflowY: "auto",
                            display: "flex",
                            flexDirection: "column",
                            height: "100%",
                            justifyContent: "space-between",
                        }}
                    >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <FontAwesomeIcon icon={faBars} style={{ color: "#757575" }} />
                            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                                Descripción:
                            </Typography>
                        </Box>
                        <Typography
                            variant="body1"
                            sx={{
                                mt: 0.5,
                                mb: 50,
                                fontSize: "0.9rem",
                                lineHeight: 1.4,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                            }}
                        >
                            {task.descripcion || "No hay descripción"}
                        </Typography>
                        <Box sx={{ mt: 2, display: "flex", alignItems: "center" }}>
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
                            justifyContent: "flex-start",
                            overflow: "hidden",
                            borderLeft: "1px solid #d0d0d0",
                        }}
                    >
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
                                    task.tags.map((tag, index) => (
                                        <Chip 
                                            key={index} 
                                            label={tag} 
                                            size="small" 
                                            color="primary"
                                            sx={{
                                                backgroundColor: '#4caf50',
                                                color: 'white',
                                                '&:hover': {
                                                    backgroundColor: '#388e3c'
                                                }
                                            }}
                                        />
                                    ))
                                ) : (
                                    <Typography variant="body2" color="textSecondary">
                                        No hay etiquetas
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                        <Box sx={{ mt: 36.5, display: "flex", justifyContent: "left" }}>
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
