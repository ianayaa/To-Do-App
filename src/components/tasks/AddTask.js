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
      setShowAIHelper(true);
      setIsAILoading(true);
      try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.REACT_APP_CLAUDE_API_KEY,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: 'claude-3-opus-20240229',
            max_tokens: 1000,
            messages: [{
              role: 'user',
              content: `Actúa como un asistente de tareas. Basado en esta descripción parcial de tarea: "${value.slice(0, -1)}", sugiere una descripción más detallada y estructurada.`
            }]
          })
        });

        if (!response.ok) throw new Error('Error al obtener sugerencia');
        
        const data = await response.json();
        setTaskDescription(data.content[0].text);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsAILoading(false);
        setShowAIHelper(false);
      }
    } else {
      setShowAIHelper(false);
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
            placeholder="Escribe '/' para recibir ayuda de Checkmate"
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
            InputProps={{
              endAdornment: isAILoading && (
                <Box sx={{ color: '#FFC247', p: 1 }}>
                  <CircularProgress size={20} sx={{ color: 'inherit' }} />
                </Box>
              )
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
