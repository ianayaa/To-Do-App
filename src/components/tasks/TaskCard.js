import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faExclamationCircle,
  faClock,
  faCalendarAlt,
  faEllipsisV,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { Timestamp } from "firebase/firestore";
import TaskDetailDialog from "../dialog/TaskDetailDialog";
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
} from "@mui/material";

const TaskCard = ({ task, deleteTask }) => {
  const { titulo, descripcion, dueDate, estado, id } = task;
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openMenu = Boolean(anchorEl);
  const { updateTaskStatus } = useUpdateTaskStatus(db);

  const isDueDateValid = dueDate && dueDate instanceof Timestamp;
  const dueDateFormatted = isDueDateValid ? dueDate.toDate() : null;
  const isOverdue =
    dueDateFormatted && dueDateFormatted < new Date() && estado === "Pendiente";

  const handleClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = (event) => {
    event.stopPropagation();
    if (window.confirm("¿Estás seguro de que quieres eliminar esta tarea?")) {
      deleteTask(task.id);
    }
    handleClose();
  };

  const handleToggleComplete = async (event) => {
    event.stopPropagation();
    const newStatus = estado === "Completada" ? "Pendiente" : "Completada";
    await updateTaskStatus(id, newStatus);
  };

  const getStatusColor = () => {
    if (estado === "Completada") return "success";
    if (isOverdue) return "error";
    return "warning";
  };

  const getStatusIcon = () => {
    if (estado === "Completada") return faCheckCircle;
    if (isOverdue) return faExclamationCircle;
    return faClock;
  };

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
          <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1.5 }}>
            <Avatar
              sx={{
                width: 40,
                height: 40,
                bgcolor: (theme) => theme.palette[getStatusColor()].light,
                color: (theme) => theme.palette[getStatusColor()].main,
                mr: 1.5,
              }}
            >
              <FontAwesomeIcon icon={getStatusIcon()} />
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontSize: "1rem",
                  fontWeight: 600,
                  mb: 0.5,
                  lineHeight: 1.2,
                  textDecoration: estado === "Completada" ? "line-through" : "none",
                  color: estado === "Completada" ? "text.disabled" : "text.primary"
                }}
              >
                {titulo}
              </Typography>
              {descripcion && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: 1,
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
              <IconButton
                size="small"
                onClick={handleClick}
              >
                <FontAwesomeIcon icon={faEllipsisV} />
              </IconButton>
            </Box>
          </Box>
          
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 2 }}>
            <Chip
              size="small"
              icon={<FontAwesomeIcon icon={getStatusIcon()} />}
              label={estado}
              color={getStatusColor()}
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
        <MenuItem onClick={handleDelete}>Eliminar</MenuItem>
      </Menu>

      <TaskDetailDialog
        open={open}
        onClose={() => setOpen(false)}
        task={task}
        db={db}
      />
    </>
  );
};

TaskCard.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.string.isRequired,
    titulo: PropTypes.string.isRequired,
    descripcion: PropTypes.string,
    dueDate: PropTypes.object,
    estado: PropTypes.string.isRequired,
  }).isRequired,
  deleteTask: PropTypes.func.isRequired,
};

export default TaskCard;
