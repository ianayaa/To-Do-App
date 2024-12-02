import React, { useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faExclamationCircle,
  faClock,
  faCalendarAlt,
  faEllipsisV,
  faCheck,
  faShare,
  faTrash,
  faFlag,
  faCircle,
  faExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { Timestamp } from "firebase/firestore";
import TaskDetailDialog from "../dialog/TaskDetailDialog.jsx";
import ShareTaskDialog from "../dialog/ShareTaskDialog.jsx";
import { db } from "../../config/firebase";
import useUpdateTaskStatus from "../../hooks/tasks/useUpdateTaskStatus";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Fade,
  Avatar,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

const TaskCard = React.memo(({ task, deleteTask }) => {
  const { titulo, descripcion, dueDate, estado, id, priority } = task;
  const [open, setOpen] = React.useState(false);
  const [shareDialogOpen, setShareDialogOpen] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openMenu = Boolean(anchorEl);
  const { updateTaskStatus } = useUpdateTaskStatus(db);

  const isDueDateValid = dueDate && dueDate instanceof Timestamp;
  const dueDateFormatted = isDueDateValid ? dueDate.toDate() : null;

  const isOverdue = useMemo(() => {
    if (!dueDateFormatted || estado === "Completada") return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const taskDate = new Date(dueDateFormatted);
    taskDate.setHours(0, 0, 0, 0);
    
    return taskDate.getTime() < today.getTime();
  }, [dueDateFormatted, estado]);

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "baja":
        return { icon: faCircle, color: "#4CAF50" };
      case "alta":
        return { icon: faExclamation, color: "#f44336" };
      default:
        return { icon: faFlag, color: "#FFC247" };
    }
  };

  const priorityInfo = getPriorityIcon(priority);

  const handleClick = useCallback((event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleDelete = useCallback((event) => {
    event.stopPropagation();
    setDeleteDialogOpen(true);
    handleClose();
  }, [handleClose]);

  const handleConfirmDelete = useCallback((event) => {
    event.stopPropagation();
    deleteTask(task.id);
    setDeleteDialogOpen(false);
  }, [deleteTask, task.id]);

  const handleCancelDelete = useCallback((event) => {
    event.stopPropagation();
    setDeleteDialogOpen(false);
  }, []);

  const handleToggleComplete = useCallback(async (event) => {
    event.stopPropagation();
    const newStatus = estado === "Completada" ? "Pendiente" : "Completada";
    await updateTaskStatus(id, newStatus);
  }, [estado, id, updateTaskStatus]);

  const handleShare = useCallback((event) => {
    event.stopPropagation();
    setShareDialogOpen(true);
    handleClose();
  }, [handleClose]);

  const getStatusColor = useMemo(() => {
    if (estado === "Completada") return "success";
    if (isOverdue) return "error";
    return "warning";
  }, [estado, isOverdue]);

  const getStatusIcon = useMemo(() => {
    if (estado === "Completada") return faCheckCircle;
    if (isOverdue) return faExclamationCircle;
    return faClock;
  }, [estado, isOverdue]);

  const formatDate = (date) => {
    if (!date) return "";
    const options = { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    };
    return date.toLocaleDateString('es-ES', options);
  };

  return (
    <>
      <Card 
        onClick={() => setOpen(true)}
        sx={{
          cursor: "pointer",
          transition: "all 0.3s ease",
          position: "relative",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: (theme) => theme.shadows[4],
          },
        }}
      >
        <CardContent sx={{ pb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: (theme) => theme.palette[getStatusColor].light,
                color: (theme) => theme.palette[getStatusColor].main,
                mr: 2,
              }}
            >
              <FontAwesomeIcon icon={getStatusIcon} />
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontSize: "1rem",
                  fontWeight: 600,
                  mb: 1,
                  lineHeight: 1.2,
                  textDecoration: estado === "Completada" ? "line-through" : "none",
                  color: estado === "Completada" ? "text.disabled" : "text.primary",
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: '100%'
                }}
                title={titulo}  
              >
                <Box component="span" sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  flexShrink: 0 
                }}>
                  <FontAwesomeIcon 
                    icon={priorityInfo.icon} 
                    style={{ 
                      color: priorityInfo.color,
                      fontSize: '0.8rem'
                    }} 
                  />
                </Box>
                <Box component="span" sx={{ 
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {titulo}
                </Box>
              </Typography>
              {descripcion && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: 1.5,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    textDecoration: estado === "Completada" ? "line-through" : "none",
                    color: estado === "Completada" ? "text.disabled" : "text.secondary"
                  }}
                >
                  {descripcion}
                </Typography>
              )}
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title={estado === "Completada" ? "Marcar como pendiente" : "Marcar como completada"}>
                <IconButton
                  size="small"
                  onClick={handleToggleComplete}
                  sx={{ 
                    color: estado === "Completada" ? "success.main" : "action.disabled",
                    '&:hover': {
                      color: estado === "Completada" ? "success.dark" : "success.main",
                    }
                  }}
                >
                  <FontAwesomeIcon icon={faCheck} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Compartir tarea">
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShareDialogOpen(true);
                  }}
                  sx={{ 
                    color: task.sharedWith?.length > 0 ? "primary.main" : "action.disabled",
                    '&:hover': {
                      color: "primary.main",
                    }
                  }}
                >
                  <FontAwesomeIcon icon={faShare} />
                </IconButton>
              </Tooltip>
              <IconButton
                size="small"
                onClick={handleClick}
              >
                <FontAwesomeIcon icon={faEllipsisV} />
              </IconButton>
            </Box>
          </Box>
          
          <Box sx={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "space-between", 
            mt: 2,
            gap: 2 
          }}>
            <Chip
              size="small"
              icon={<FontAwesomeIcon icon={getStatusIcon} />}
              label={estado}
              color={getStatusColor}
              sx={{ height: 24 }}
            />
            {dueDateFormatted && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <FontAwesomeIcon 
                  icon={faCalendarAlt} 
                  style={{ 
                    fontSize: "0.875rem",
                    color: isOverdue ? "#d32f2f" : "#666"
                  }}
                />
                <Typography 
                  variant="caption" 
                  color={isOverdue ? "error" : "text.secondary"}
                >
                  {formatDate(dueDateFormatted)}
                </Typography>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>

      <Menu
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        <MenuItem onClick={handleShare}>
          <FontAwesomeIcon icon={faShare} style={{ marginRight: '8px' }} />
          Compartir
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          Eliminar
        </MenuItem>
      </Menu>

      <TaskDetailDialog
        open={open}
        onClose={() => setOpen(false)}
        task={task}
        db={db}
      />

      <ShareTaskDialog
        open={shareDialogOpen}
        onClose={() => setShareDialogOpen(false)}
        task={task}
        db={db}
      />

      <Dialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
        onClick={(e) => e.stopPropagation()}
        PaperProps={{
          sx: {
            backgroundColor: '#25283D',
            borderRadius: 2,
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#fff',
            maxWidth: '400px',
            width: '100%',
            '& .MuiDialogTitle-root': {
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              padding: 2,
            },
            '& .MuiDialogContent-root': {
              padding: 3,
            },
            '& .MuiDialogActions-root': {
              padding: 2,
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            },
          },
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1.5,
          color: '#FF6B6B',
          fontWeight: 600,
        }}>
          <FontAwesomeIcon icon={faTrash} />
          Eliminar Tarea
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            ¿Estás seguro de que quieres eliminar esta tarea?
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.7)',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              p: 1.5,
              borderRadius: 1,
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            {titulo}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleCancelDelete}
            sx={{ 
              color: 'rgba(255, 255, 255, 0.7)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
              }
            }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirmDelete}
            sx={{
              backgroundColor: '#FF6B6B',
              color: '#fff',
              '&:hover': {
                backgroundColor: '#ff5252',
              }
            }}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
});

TaskCard.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.string.isRequired,
    titulo: PropTypes.string.isRequired,
    descripcion: PropTypes.string,
    dueDate: PropTypes.object,
    estado: PropTypes.string.isRequired,
    priority: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  deleteTask: PropTypes.func.isRequired,
};

export default TaskCard;
