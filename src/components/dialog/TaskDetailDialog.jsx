import React, { useState, useEffect } from "react";
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
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
  AlertTitle,
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
  faExclamation,
  faMinus,
  faArrowDown,
} from "@fortawesome/free-solid-svg-icons";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../config/firebase";
import {
  Timestamp,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import useDeleteTask from "../../hooks/tasks/useDeleteTask";
import useComments from "../../hooks/comments/useComments";
import useDeleteComment from "../../hooks/comments/useDeleteComment";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import SchoolIcon from "@mui/icons-material/School";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import Fade from "@mui/material/Fade";
import WarningIcon from "@mui/icons-material/Warning";
import AssignmentIcon from "@mui/icons-material/Assignment";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import AssistantAI from "./AssistantAI.jsx";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const TaskDetailDialog = ({ open, onClose, task, db }) => {
  const [user] = useAuthState(auth);
  const {
    deleteTask,
    loading: loadingDelete,
    error: errorDelete,
  } = useDeleteTask(db);
  const { deleteComment, loading: loadingDeleteComment } = useDeleteComment(db);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [deleteButtonState, setDeleteButtonState] = useState("initial"); // 'initial', 'confirm', 'success'
  const [comentario, setComentario] = useState("");
  const {
    comentarios,
    loading: loadingComments,
    error: errorComments,
    cargarComentarios,
    agregarComentario,
    eliminarComentario,
  } = useComments(db);

  const [confirmDeleteCommentId, setConfirmDeleteCommentId] = useState(null);
  const [confirmCommentDialogOpen, setConfirmCommentDialogOpen] =
    useState(false);
  const [commentDeleteState, setCommentDeleteState] = useState("initial"); // 'initial', 'confirm', 'success'

  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editedDescription, setEditedDescription] = useState("");
  const [savingDescription, setSavingDescription] = useState(false);
  const [openAssistant, setOpenAssistant] = useState(false);

  const parseDueDate = (dueDate) =>
    dueDate && dueDate instanceof Timestamp ? dueDate.toDate() : null;

  const dueDateFormatted = task?.dueDate ? parseDueDate(task.dueDate) : null;
  const isOverdue =
    dueDateFormatted &&
    dueDateFormatted < new Date() &&
    task?.estado === "Pendiente";

  const getStatusIcon = () => {
    if (!task) return null;

    if (task.estado === "Completada")
      return (
        <FontAwesomeIcon icon={faCheckCircle} style={{ color: "green" }} />
      );
    if (task.estado === "Pendiente") {
      return isOverdue ? (
        <FontAwesomeIcon icon={faExclamationCircle} style={{ color: "red" }} />
      ) : (
        <FontAwesomeIcon icon={faClock} style={{ color: "orange" }} />
      );
    }
    return <FontAwesomeIcon icon={faFolderOpen} />;
  };

  const getPriorityIcon = () => {
    if (!task) return null;
    switch (task.priority || "normal") {
      case "alta":
        return (
          <FontAwesomeIcon icon={faExclamation} style={{ color: "#f44336" }} />
        );
      case "normal":
        return <FontAwesomeIcon icon={faMinus} style={{ color: "#FFC247" }} />;
      case "baja":
        return (
          <FontAwesomeIcon icon={faArrowDown} style={{ color: "#4CAF50" }} />
        );
      default:
        return <FontAwesomeIcon icon={faMinus} style={{ color: "#FFC247" }} />;
    }
  };

  const getPriorityLabel = () => {
    if (!task) return "No asignada";
    switch (task.priority || "normal") {
      case "alta":
        return "Alta";
      case "normal":
        return "Normal";
      case "baja":
        return "Baja";
      default:
        return "Normal";
    }
  };

  // Función para manejar la apertura del diálogo de confirmación
  const handleDeleteClick = () => {
    setConfirmDialogOpen(true);
    setDeleteButtonState("confirm");
  };

  // Función para cancelar la eliminación
  const handleCancelDelete = () => {
    setConfirmDialogOpen(false);
    setDeleteButtonState("initial");
  };

  const handleDelete = async () => {
    try {
      setDeleteButtonState("confirm");

      if (!task?.id) {
        throw new Error("No se ha seleccionado ninguna tarea");
      }

      await deleteTask(task.id);

      setDeleteButtonState("success");
      setConfirmDialogOpen(false); // Cerramos el diálogo de confirmación
      setSnackbarMessage("Tarea eliminada con éxito");
      setSnackbarOpen(true);

      // Cerrar el diálogo principal después de un breve delay
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      console.error("Error al eliminar la tarea:", err);
      setSnackbarMessage(
        err.message || "Hubo un problema al eliminar la tarea"
      );
      setSnackbarOpen(true);
      setDeleteButtonState("initial");
      setConfirmDialogOpen(false); // Cerramos el diálogo de confirmación en caso de error
    }
  };

  useEffect(() => {
    if (task?.id) {
      cargarComentarios(task.id);
    }
  }, [task?.id, cargarComentarios]);

  useEffect(() => {
    if (task) {
      setEditedDescription(task.descripcion || "");
    }
  }, [task]);

  const handleEditDescription = () => {
    setIsEditingDescription(true);
  };

  const handleSaveDescription = async () => {
    try {
      setSavingDescription(true);
      // Verificar que tengamos un ID válido
      if (!task.docId) {
        throw new Error("ID de tarea no válido");
      }

      const taskRef = doc(db, "tasks", task.docId);
      await updateDoc(taskRef, {
        descripcion: editedDescription,
        updatedAt: Timestamp.now(),
      });

      // Actualizar la UI inmediatamente
      task.descripcion = editedDescription;

      setIsEditingDescription(false);
      setSnackbarMessage("Descripción actualizada correctamente");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error al actualizar la descripción:", error);
      setSnackbarMessage(error.message || "Error al actualizar la descripción");
      setSnackbarOpen(true);
    } finally {
      setSavingDescription(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditingDescription(false);
    setEditedDescription(task.descripcion || "");
  };

  const handleEnviarComentario = async () => {
    if (!comentario.trim()) return;

    try {
      const comentarioData = {
        texto: comentario,
        userId: user.uid,
        userName: user.displayName || user.email,
        userPhoto: user.photoURL || "",
        taskId: task.id,
      };

      await agregarComentario(comentarioData);
      setComentario("");
      setSnackbarMessage("Comentario agregado con éxito");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error al enviar comentario:", error);
      setSnackbarMessage("Error al enviar el comentario");
      setSnackbarOpen(true);
    }
  };

  const handleEliminarComentario = async (comentarioId) => {
    setConfirmDeleteCommentId(comentarioId);
    setConfirmCommentDialogOpen(true);
    setCommentDeleteState("initial");
  };

  const handleConfirmDeleteComment = async () => {
    try {
      setCommentDeleteState("success");
      await deleteComment(confirmDeleteCommentId);
      await cargarComentarios(task.id);
      setSnackbarMessage("Comentario eliminado con éxito");
      setSnackbarOpen(true);
      setTimeout(() => {
        setConfirmCommentDialogOpen(false);
        setConfirmDeleteCommentId(null);
        setCommentDeleteState("initial");
      }, 1500); // Aumentado para dar tiempo a la animación
    } catch (error) {
      console.error("Error al eliminar comentario:", error);
      setSnackbarMessage("Error al eliminar el comentario");
      setSnackbarOpen(true);
      setCommentDeleteState("initial");
      setConfirmCommentDialogOpen(false);
      setConfirmDeleteCommentId(null);
    }
  };

  const handleCancelDeleteComment = () => {
    setConfirmCommentDialogOpen(false);
    setConfirmDeleteCommentId(null);
    setCommentDeleteState("initial");
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
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
        <Box
          sx={{
            backgroundColor: "#25283d",
            p: 2,
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <AssignmentIcon sx={{ fontSize: 24 }} />
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, letterSpacing: 0.5 }}
            >
              Detalles de tarea
            </Typography>
          </Box>
          <IconButton
            onClick={onClose}
            sx={{
              color: "white",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <DialogTitle sx={{ px: 3 }}>
          <Box display="flex" flexDirection="column" gap={2}>
            {/* Título y estado */}
            <Box display="flex" alignItems="center" gap={1}>
              <Box
                sx={{
                  fontSize: "1.5rem",
                  color: isOverdue ? "error.main" : "text.primary",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {getStatusIcon()}
              </Box>
              <Typography
                variant="h6"
                component="div"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  minHeight: "32px",
                }}
              >
                {task.titulo}
              </Typography>
            </Box>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#2196f3",
                color: "white",
                fontWeight: "bold",
                textTransform: "none",
                px: 3,
                py: 1,
                borderRadius: "8px",
                alignSelf: "flex-start",
              }}
              onClick={() => setOpenAssistant(true)}
            >
              Asistente IA
            </Button>
          </Box>
        </DialogTitle>

        <DialogContent
          sx={{
            display: "flex",
            p: 3,
            height: "100%",
            position: "relative",
          }}
        >
          <Box
            flex={2}
            sx={{
              pr: 2,
              backgroundColor: "#F9F7F3",
              display: "flex",
              flexDirection: "column",
              height: "100%",
              position: "relative",
            }}
          >
            {/* Contenedor scrolleable */}
            <Box
              sx={{
                flex: 1,
                overflowY: "auto",
                pb: "80px", // Espacio para el campo de comentarios
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 600,
                    color: "#25283d",
                  }}
                >
                  Descripción:
                </Typography>
                {!isEditingDescription && (
                  <Button
                    size="small"
                    onClick={handleEditDescription}
                    startIcon={<EditIcon />}
                    sx={{ color: "#25283d" }}
                  >
                    Editar
                  </Button>
                )}
              </Box>

              {isEditingDescription ? (
                <Box sx={{ mt: 1 }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    variant="outlined"
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                    placeholder="Escribe la descripción de la tarea..."
                    sx={{ mb: 2 }}
                  />
                  <Box
                    sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}
                  >
                    <Button
                      onClick={handleCancelEdit}
                      disabled={savingDescription}
                      startIcon={<CloseIcon />}
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleSaveDescription}
                      disabled={savingDescription}
                      startIcon={<SaveIcon />}
                      variant="contained"
                    >
                      Guardar
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Typography
                  variant="body1"
                  sx={{
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  {task.descripcion || "Sin descripción"}
                </Typography>
              )}

              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Comentarios ({comentarios.length})
                </Typography>
                {loadingComments ? (
                  <Box
                    sx={{ display: "flex", justifyContent: "center", my: 2 }}
                  >
                    <CircularProgress size={24} />
                  </Box>
                ) : errorComments ? (
                  <Typography color="error" variant="body2">
                    Error al cargar comentarios: {errorComments}
                  </Typography>
                ) : comentarios.length === 0 ? (
                  <Typography color="text.secondary" variant="body2">
                    No hay comentarios aún
                  </Typography>
                ) : (
                  <List>
                    {comentarios.map((com) => (
                      <ListItem
                        key={com.id}
                        alignItems="flex-start"
                        sx={{
                          backgroundColor: "#fff",
                          borderRadius: 1,
                          mb: 1,
                          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                          p: 2,
                        }}
                      >
                        <Box sx={{ display: "flex", width: "100%" }}>
                          <Avatar
                            alt={com.userName}
                            src={com.userPhoto}
                            sx={{
                              width: 40,
                              height: 40,
                              mr: 2,
                              bgcolor: !com.userPhoto ? "#1976d2" : "inherit",
                            }}
                          >
                            {!com.userPhoto &&
                              com.userName?.charAt(0).toUpperCase()}
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <Typography
                                component="span"
                                variant="subtitle2"
                                color="primary"
                              >
                                {com.userName}
                              </Typography>
                              {com.userId === user.uid && (
                                <IconButton
                                  size="small"
                                  onClick={() =>
                                    handleEliminarComentario(com.id)
                                  }
                                  disabled={loadingDeleteComment}
                                  sx={{
                                    color: "#757575",
                                    "&:hover": {
                                      color: "#d32f2f",
                                    },
                                  }}
                                >
                                  {loadingDeleteComment ? (
                                    <CircularProgress
                                      size={16}
                                      color="inherit"
                                    />
                                  ) : (
                                    <FontAwesomeIcon icon={faTrash} />
                                  )}
                                </IconButton>
                              )}
                            </Box>
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.primary"
                              sx={{ display: "block", my: 0.5 }}
                            >
                              {com.texto}
                            </Typography>
                            <Typography
                              component="span"
                              variant="caption"
                              color="text.secondary"
                            >
                              {com.fecha.toDate().toLocaleString()}
                            </Typography>
                          </Box>
                        </Box>
                      </ListItem>
                    ))}
                  </List>
                )}
              </Box>
            </Box>

            {/* Campo de comentarios fijo */}
            <Box
              sx={{
                position: "sticky",
                bottom: 0,
                left: 0,
                right: "16px",
                backgroundColor: "#F9F7F3",
                pt: 2,
                display: "flex",
                gap: 2,
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Comentar"
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
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
                onClick={handleEnviarComentario}
                disabled={!comentario.trim()}
                sx={{
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
                    color: comentario.trim() ? "#1976d2" : "#757575",
                  }}
                />
              </Button>
            </Box>
          </Box>

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
            <Box
              sx={{
                overflowY: "auto",
                flex: 1,
                pb: "80px", // Espacio para el botón
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
                  <FontAwesomeIcon
                    icon={faCalendarAlt}
                    style={{ color: "#CE2121" }}
                  />
                  <Typography variant="body1">
                    {task?.dueDate
                      ? task.dueDate.toDate().toLocaleDateString("es-ES", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "Sin fecha"}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ my: 1 }}>
                <Typography variant="body2" color="textSecondary">
                  Prioridad:
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    mt: 1,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      backgroundColor: task.priority === 'alta' ? '#f44336' : task.priority === 'normal' ? '#FFC247' : '#4CAF50',
                      color: 'white',
                      padding: '2px 8px',
                      borderRadius: '15px',
                      fontSize: '0.875rem',
                    }}
                  >
                    {task.priority === 'alta' ? (
                      <FontAwesomeIcon icon={faExclamation} style={{ color: 'white' }} />
                    ) : task.priority === 'normal' ? (
                      <FontAwesomeIcon icon={faMinus} style={{ color: 'white' }} />
                    ) : (
                      <FontAwesomeIcon icon={faArrowDown} style={{ color: 'white' }} />
                    )}
                    <span>{getPriorityLabel()}</span>
                  </Box>
                </Box>
              </Box>
              <Divider />
              <Box sx={{ mt: 1 }}>
                <Typography variant="body2" color="textSecondary">
                  Etiquetas:
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                  {task?.tags && task.tags.length > 0 ? (
                    task.tags.map((tag, index) => {
                      const tagConfigs = {
                        Importante: {
                          color: "#dc3545",
                          icon: (
                            <PriorityHighIcon
                              sx={{ fontSize: 20, color: "white" }}
                            />
                          ),
                        },
                        Urgente: {
                          color: "#fd7e14",
                          icon: (
                            <NotificationsActiveIcon
                              sx={{ fontSize: 20, color: "white" }}
                            />
                          ),
                        },
                        Escuela: {
                          color: "#0d6efd",
                          icon: (
                            <SchoolIcon sx={{ fontSize: 20, color: "white" }} />
                          ),
                        },
                        Bajo: {
                          color: "#198754",
                          icon: (
                            <AccessTimeIcon
                              sx={{ fontSize: 20, color: "white" }}
                            />
                          ),
                        },
                      };

                      const tagConfig = tagConfigs[tag] || {
                        color: "#4caf50",
                        icon: (
                          <PriorityHighIcon
                            sx={{ fontSize: 20, color: "white" }}
                          />
                        ),
                      };

                      return (
                        <Chip
                          key={index}
                          label={tag}
                          icon={tagConfig.icon}
                          size="small"
                          sx={{
                            backgroundColor: tagConfig.color,
                            color: "white",
                            "& .MuiChip-icon": {
                              color: "white",
                              marginLeft: "5px",
                            },
                            "& .MuiChip-label": {
                              paddingLeft: "8px",
                            },
                            "&:hover": {
                              backgroundColor: `${tagConfig.color}cc`,
                              "& .MuiChip-icon, & svg": {
                                color: "white !important",
                              },
                            },
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

            <Box
              sx={{
                position: "absolute",
                bottom: -8,
                left: 0,
                right: 0,
                padding: "16px",
                backgroundColor: "#F9F7F3",
                borderTop: "1px solid rgba(0, 0, 0, 0.12)",
                display: "flex",
                justifyContent: "left",
              }}
            >
              <Zoom in={true}>
                <Button
                  variant="contained"
                  color={deleteButtonState === "success" ? "success" : "error"}
                  size="small"
                  onClick={handleDeleteClick}
                  disabled={deleteButtonState === "success"}
                  startIcon={
                    deleteButtonState === "success" ? (
                      <CheckIcon />
                    ) : deleteButtonState === "confirm" ? (
                      <CloseIcon />
                    ) : (
                      <FontAwesomeIcon icon={faTrash} />
                    )
                  }
                >
                  {deleteButtonState === "success"
                    ? "Eliminado"
                    : deleteButtonState === "confirm"
                    ? "¿Confirmar?"
                    : "Eliminar"}
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
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          sx: {
            borderRadius: 2,
            p: 1,
          },
        }}
      >
        <DialogTitle id="alert-dialog-title" sx={{ pb: 1 }}>
          {"¿Eliminar esta tarea?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Esta acción no se puede deshacer. ¿Estás seguro de que deseas
            eliminar esta tarea?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={handleCancelDelete}
            color="inherit"
            disabled={loadingDelete}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={loadingDelete}
            autoFocus
            sx={{
              minWidth: "100px",
              position: "relative",
            }}
          >
            {loadingDelete ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              <>
                <FontAwesomeIcon
                  icon={faTrash}
                  style={{ marginRight: "8px" }}
                />
                Eliminar
              </>
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de confirmación para eliminar comentario */}
      <Dialog
        open={confirmCommentDialogOpen}
        onClose={() => {
          setConfirmCommentDialogOpen(false);
          setCommentDeleteState("initial");
        }}
        aria-labelledby="alert-dialog-title-comment"
        aria-describedby="alert-dialog-description-comment"
        TransitionComponent={Transition}
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 0,
            minWidth: "400px",
            overflow: "hidden",
          },
        }}
      >
        <Box
          sx={{
            p: 2,
          }}
        >
          <Fade in={true} timeout={300}>
            <Alert
              severity={
                commentDeleteState === "success" ? "success" : "warning"
              }
              variant="filled"
              sx={{
                "& .MuiAlert-icon": {
                  fontSize: "2rem",
                },
                "& .MuiAlert-message": {
                  width: "100%",
                },
                py: 1,
                backgroundColor:
                  commentDeleteState === "success"
                    ? "success.main"
                    : "warning.main",
                transform:
                  commentDeleteState === "success" ? "scale(1.02)" : "scale(1)",
                transition: "all 0.3s ease-in-out",
              }}
            >
              <AlertTitle
                sx={{
                  fontWeight: 700,
                  fontSize: "1.1rem",
                  mb: 0.5,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                {commentDeleteState === "success" ? (
                  <Fade in={true} timeout={400}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      ¡Operación Exitosa!
                    </Box>
                  </Fade>
                ) : (
                  <Fade in={true} timeout={400}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      ¡Atención!
                    </Box>
                  </Fade>
                )}
              </AlertTitle>
              <Fade in={commentDeleteState !== "success"} timeout={500}>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {commentDeleteState === "success"
                    ? null
                    : "Esta acción no se puede deshacer. ¿Estás seguro de que deseas continuar?"}
                </Typography>
              </Fade>
            </Alert>
          </Fade>

          <Fade in={commentDeleteState !== "success"} timeout={600}>
            <DialogActions
              sx={{
                px: 0.5,
                pt: 2,
                pb: 0,
                justifyContent: "center",
                "& .MuiButton-root": {
                  minHeight: 0,
                  py: 1,
                },
              }}
            >
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  onClick={handleCancelDeleteComment}
                  disabled={loadingDeleteComment}
                  sx={{
                    px: 3,
                    borderRadius: 2,
                    color: "text.secondary",
                    "&:hover": {
                      backgroundColor: "grey.100",
                    },
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleConfirmDeleteComment}
                  color="error"
                  variant="contained"
                  disabled={loadingDeleteComment}
                  autoFocus
                  sx={{
                    px: 3,
                    borderRadius: 2,
                    position: "relative",
                    backgroundColor: "error.main",
                    "&:hover": {
                      backgroundColor: "error.dark",
                    },
                  }}
                >
                  {loadingDeleteComment ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    <>
                      <FontAwesomeIcon
                        icon={faTrash}
                        style={{
                          marginRight: "8px",
                          fontSize: "0.9rem",
                        }}
                      />
                      Eliminar
                    </>
                  )}
                </Button>
              </Box>
            </DialogActions>
          </Fade>
        </Box>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
      <AssistantAI
        open={openAssistant}
        onClose={() => setOpenAssistant(false)}
        TaskInfo={task}
      />
    </>
  );
};

export default TaskDetailDialog;
