import React, { useState, forwardRef } from "react";
import DatePickerBtn from "../inputs/DatePickerBtn";
import SelectLabels from "../inputs/SelectLabels";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  IconButton,
  Typography,
  Tooltip,
  Fade,
  Slide,
  CircularProgress
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faTimes, 
  faCalendarAlt,
  faTags,
  faPlus
} from "@fortawesome/free-solid-svg-icons";
import { generateTaskDescription } from "../../services/aiService";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const AddTask = ({ open = false, addTask, handleClose }) => {
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [showAIHelper, setShowAIHelper] = useState(false);
  const [isAILoading, setIsAILoading] = useState(false);
  
  // Inicializar la fecha con el día actual sin hora
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [taskDate, setTaskDate] = useState(today);

  const handleDescriptionChange = async (e) => {
    const value = e.target.value;
    setTaskDescription(value);

    // Detectar cuando el usuario escribe '/'
    if (value.endsWith('/')) {
      setIsAILoading(true);
      try {
        const aiDescription = await generateTaskDescription(taskName);
        setTaskDescription(aiDescription);
      } catch (error) {
        console.error('Error al generar la descripción:', error);
        // Opcional: Mostrar un mensaje de error al usuario
      } finally {
        setIsAILoading(false);
      }
    }
  };

  const onSelectDate = (date) => {
    // Asegurarnos de que la fecha seleccionada no tenga hora
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    setTaskDate(newDate);
  };

  const handleAddTask = () => {
    if (!taskName.trim()) {
      alert("Por favor, ingresa un nombre para la tarea");
      return;
    }

    const taskWithTags = {
      titulo: taskName.trim(),
      descripcion: taskDescription.trim(),
      estado: "Pendiente",
      fechaCreacion: new Date(),
      dueDate: taskDate, // Esta fecha ya no tendrá hora
      complete: false,
      tags: selectedTags && selectedTags.length > 0 
        ? selectedTags.map(tag => tag.value) 
        : []
    };

    addTask(taskWithTags);
    resetForm();
    handleClose();
  };

  const resetForm = () => {
    setTaskName("");
    setTaskDescription("");
    setSelectedTags([]);
    // Resetear la fecha al día actual sin hora
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    setTaskDate(today);
  };

  const handleCancel = () => {
    resetForm();
    handleClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleCancel}
      TransitionComponent={Transition}
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
        <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
          Nueva Tarea
        </Typography>
        <IconButton
          onClick={handleCancel}
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

      <DialogContent sx={{ pb: 0 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            autoFocus
            margin="dense"
            label="Nombre de la tarea"
            fullWidth
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
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
            }}
          />
          <TextField
            margin="dense"
            label="Descripción"
            fullWidth
            multiline
            rows={4}
            value={taskDescription}
            onChange={handleDescriptionChange}
            placeholder="Escribe una descripción detallada de la tarea (usa '/' para generar una descripción con IA)"
            variant="outlined"
            InputProps={{
              endAdornment: isAILoading && (
                <CircularProgress 
                  size={20} 
                  sx={{ 
                    color: '#FFC247',
                    position: 'absolute',
                    right: 10,
                    top: '50%',
                    transform: 'translateY(-50%)'
                  }} 
                />
              )
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: 'white',
                '& fieldset': { 
                  borderColor: 'rgba(255, 255, 255, 0.23)',
                },
                '&:hover fieldset': { borderColor: '#FFC247' },
                '&.Mui-focused fieldset': { borderColor: '#FFC247' },
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255, 255, 255, 0.7)',
                '&.Mui-focused': { color: '#FFC247' },
              },
              '& .MuiInputLabel-outlined': {
                backgroundColor: '#25283D',
                paddingLeft: '4px',
                paddingRight: '4px',
              },
            }}
          />

          <Box sx={{ 
            display: 'flex', 
            gap: 2,
            alignItems: 'center'
          }}>
            <Tooltip title="Fecha de vencimiento">
              <Box sx={{ 
                display: 'inline-flex',
                alignItems: 'center'
              }}>
                <DatePickerBtn 
                  handleSelectDate={onSelectDate}
                  customIcon={
                    <FontAwesomeIcon 
                      icon={faCalendarAlt} 
                      style={{ marginRight: '8px' }}
                    />
                  }
                />
              </Box>
            </Tooltip>

            <Tooltip title="Etiquetas">
              <Box sx={{ 
                display: 'inline-flex',
                alignItems: 'center',
                flex: 1
              }}>
                <SelectLabels
                  selectedTags={selectedTags}
                  setSelectedTags={setSelectedTags}
                  customIcon={
                    <FontAwesomeIcon 
                      icon={faTags} 
                      style={{ marginRight: '8px' }}
                    />
                  }
                />
              </Box>
            </Tooltip>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ 
        p: 2,
        gap: 1
      }}>
        <Button
          variant="outlined"
          onClick={handleCancel}
          sx={{
            color: '#f44336',
            borderColor: '#f44336',
            '&:hover': {
              borderColor: '#d32f2f',
              backgroundColor: 'rgba(244, 67, 54, 0.04)',
            },
          }}
        >
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleAddTask}
          startIcon={<FontAwesomeIcon icon={faPlus} />}
          sx={{
            backgroundColor: '#FFC247',
            color: '#25283D',
            '&:hover': {
              backgroundColor: '#FFB014',
            },
          }}
        >
          Crear Tarea
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddTask;
