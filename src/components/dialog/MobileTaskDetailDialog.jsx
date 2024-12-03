import React from "react";
import {
  Dialog,
  DialogContent,
  Typography,
  Box,
  IconButton,
  Button,
  Avatar,
  TextField,
  List,
  ListItem,
  Slide,
  Divider,
  Chip,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faCircleArrowUp,
  faCheckCircle,
  faExclamationCircle,
  faClock,
  faFolderOpen,
  faCalendarAlt,
  faExclamation,
  faMinus,
  faArrowDown,
} from "@fortawesome/free-solid-svg-icons";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import SchoolIcon from "@mui/icons-material/School";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const MobileTaskDetailDialog = ({ 
  open, 
  onClose, 
  task,
  user,
  comentarios,
  comentario,
  setComentario,
  handleEnviarComentario,
  handleEliminarComentario,
  handleDeleteClick,
  handleEditDescription,
  isEditingDescription,
  editedDescription,
  setEditedDescription,
  handleSaveDescription,
  handleCancelEdit,
  savingDescription,
  setOpenAssistant
}) => {
  if (!task) return null;
  
  const getStatusIcon = () => {
    if (task.estado === "Completada")
      return <FontAwesomeIcon icon={faCheckCircle} style={{ color: "#4caf50" }} />;
    if (task.estado === "Pendiente") {
      return task.isOverdue ? (
        <FontAwesomeIcon icon={faExclamationCircle} style={{ color: "#f44336" }} />
      ) : (
        <FontAwesomeIcon icon={faClock} style={{ color: "#ff9800" }} />
      );
    }
    return <FontAwesomeIcon icon={faFolderOpen} style={{ color: "#2196f3" }} />;
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen
      TransitionComponent={Transition}
    >
      {/* Barra superior fija */}
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 1100,
          background: '#25283d',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          px: 2,
          py: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <IconButton 
          onClick={onClose}
          sx={{ color: 'white' }}
        >
          <CloseIcon />
        </IconButton>
        <Typography
          variant="h6"
          sx={{
            color: 'white',
            fontWeight: 600,
            flex: 1,
            textAlign: 'center',
            mx: 2
          }}
        >
          Detalles de tarea
        </Typography>
        <IconButton
          onClick={handleDeleteClick}
          sx={{ color: '#ff4d4d' }}
        >
          <FontAwesomeIcon icon={faTrash} />
        </IconButton>
      </Box>

      <DialogContent
        sx={{
          p: 2,
          bgcolor: '#F9F7F3',
          height: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Título y estado */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Box sx={{ fontSize: '1.5rem', color: task.isOverdue ? 'error.main' : 'text.primary' }}>
              {getStatusIcon()}
            </Box>
            <Typography variant="h5" sx={{ 
              fontWeight: 'bold',
              color: '#25283d',
              fontSize: '1.5rem',
              marginLeft: 1
            }}>
              {task.title}
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
              mb: 2,
              width: '100%'
            }}
            onClick={() => setOpenAssistant(true)}
          >
            Asistente IA
          </Button>
        </Box>

        {/* Descripción */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#25283d" }}>
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
              <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
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
                  variant="contained"
                >
                  Guardar
                </Button>
              </Box>
            </Box>
          ) : (
            <Typography variant="body1" sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
              {task.descripcion || "Sin descripción"}
            </Typography>
          )}
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Información adicional */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
            Detalles
          </Typography>
          
          {/* Fecha de vencimiento */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Fecha de vencimiento:
            </Typography>
            <Box display="flex" alignItems="center" gap={1}>
              <FontAwesomeIcon icon={faCalendarAlt} style={{ color: "#CE2121" }} />
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

          {/* Prioridad */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Prioridad:
            </Typography>
            <Chip
              icon={
                task.priority === "alta" ? (
                  <FontAwesomeIcon icon={faExclamation} />
                ) : task.priority === "normal" ? (
                  <FontAwesomeIcon icon={faMinus} />
                ) : (
                  <FontAwesomeIcon icon={faArrowDown} />
                )
              }
              label={task.priority || "Normal"}
              sx={{
                backgroundColor: 
                  task.priority === "alta" ? "#f44336" :
                  task.priority === "normal" ? "#FFC247" :
                  "#4CAF50",
                color: "white",
                "& .MuiChip-icon": { color: "white" }
              }}
            />
          </Box>

          {/* Etiquetas */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Etiquetas:
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {task?.tags && task.tags.length > 0 ? (
                task.tags.map((tag, index) => {
                  const tagConfigs = {
                    Importante: {
                      color: "#dc3545",
                      icon: <PriorityHighIcon sx={{ fontSize: 20, color: "white" }} />,
                    },
                    Urgente: {
                      color: "#fd7e14",
                      icon: <NotificationsActiveIcon sx={{ fontSize: 20, color: "white" }} />,
                    },
                    Escuela: {
                      color: "#0d6efd",
                      icon: <SchoolIcon sx={{ fontSize: 20, color: "white" }} />,
                    },
                    Bajo: {
                      color: "#198754",
                      icon: <AccessTimeIcon sx={{ fontSize: 20, color: "white" }} />,
                    },
                  };

                  const tagConfig = tagConfigs[tag] || {
                    color: "#4caf50",
                    icon: <PriorityHighIcon sx={{ fontSize: 20, color: "white" }} />,
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
                          color: "white !important",
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

        <Divider sx={{ mb: 3 }} />

        {/* Sección de comentarios */}
        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
          Comentarios ({comentarios.length})
        </Typography>

        <List sx={{ flex: 1, overflowY: 'auto', mb: 2 }}>
          {comentarios.map((com) => (
            <ListItem
              key={com.id}
              sx={{
                backgroundColor: 'white',
                borderRadius: 1,
                mb: 1,
                flexDirection: 'column',
                alignItems: 'flex-start',
                p: 2,
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  mb: 1
                }}
              >
                <Avatar
                  src={com.userPhoto}
                  sx={{ width: 32, height: 32, mr: 1 }}
                >
                  {!com.userPhoto && com.userName?.charAt(0)}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" color="primary">
                    {com.userName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {com.fecha.toDate().toLocaleString()}
                  </Typography>
                </Box>
                {com.userId === user?.uid && (
                  <IconButton
                    size="small"
                    onClick={() => handleEliminarComentario(com.id)}
                    sx={{ 
                      color: '#757575',
                      '&:hover': {
                        color: '#d32f2f'
                      }
                    }}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </IconButton>
                )}
              </Box>
              <Typography variant="body2" color="text.primary">
                {com.texto}
              </Typography>
            </ListItem>
          ))}
        </List>

        {/* Campo de comentario fijo en la parte inferior */}
        <Box
          sx={{
            position: 'sticky',
            bottom: 0,
            left: 0,
            right: 0,
            pt: 2,
            pb: 1,
            bgcolor: '#F9F7F3',
            borderTop: '1px solid rgba(0, 0, 0, 0.12)',
            display: 'flex',
            gap: 1,
            alignItems: 'flex-end'
          }}
        >
          <TextField
            fullWidth
            multiline
            maxRows={4}
            variant="outlined"
            placeholder="Escribe un comentario..."
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            InputProps={{
              startAdornment: (
                <Avatar
                  alt={user?.displayName || "Usuario"}
                  src={user?.photoURL || ""}
                  sx={{ width: 32, height: 32, mr: 1 }}
                />
              ),
            }}
          />
          <IconButton
            onClick={handleEnviarComentario}
            disabled={!comentario.trim()}
            sx={{
              color: comentario.trim() ? '#1976d2' : 'rgba(0, 0, 0, 0.26)',
              p: 1,
            }}
          >
            <FontAwesomeIcon icon={faCircleArrowUp} size="lg" />
          </IconButton>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default MobileTaskDetailDialog;
