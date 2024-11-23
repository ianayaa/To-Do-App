import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Checkbox,
  Typography,
  Box,
  Chip
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const TaskList = ({ tasks = [] }) => {
  // Ejemplo de tareas para visualización
  const demoTasks = [
    {
      id: 1,
      title: 'Completar proyecto de React',
      description: 'Terminar la implementación del nuevo diseño',
      dueDate: new Date(),
      tags: [
        { label: 'Importante', color: '#dc3545' },
        { label: 'Trabajo', color: '#0d6efd' }
      ],
      completed: false
    },
    {
      id: 2,
      title: 'Reunión con el equipo',
      description: 'Discutir los próximos objetivos',
      dueDate: new Date(),
      tags: [
        { label: 'Urgente', color: '#fd7e14' }
      ],
      completed: true
    }
  ];

  const handleToggleComplete = (taskId) => {
    // Implementar lógica para marcar como completada
  };

  const handleEdit = (taskId) => {
    // Implementar lógica para editar
  };

  const handleDelete = (taskId) => {
    // Implementar lógica para eliminar
  };

  return (
    <List sx={{ width: '100%', p: 0 }}>
      {(tasks.length > 0 ? tasks : demoTasks).map((task, index) => (
        <ListItem
          key={task.id}
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            borderRadius: 2,
            mb: 1,
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
            }
          }}
        >
          <ListItemIcon>
            <Checkbox
              checked={task.completed}
              onChange={() => handleToggleComplete(task.id)}
              sx={{
                color: 'rgba(255, 255, 255, 0.7)',
                '&.Mui-checked': {
                  color: '#FFC247',
                },
              }}
            />
          </ListItemIcon>

          <ListItemText
            primary={
              <Typography
                variant="subtitle1"
                sx={{
                  color: task.completed ? 'rgba(255, 255, 255, 0.5)' : 'white',
                  textDecoration: task.completed ? 'line-through' : 'none',
                }}
              >
                {task.title}
              </Typography>
            }
            secondary={
              <Box sx={{ mt: 1 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.5)',
                    mb: 1
                  }}
                >
                  {format(task.dueDate, "d 'de' MMMM", { locale: es })}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {task.tags.map((tag, tagIndex) => (
                    <Chip
                      key={tagIndex}
                      label={tag.label}
                      size="small"
                      sx={{
                        backgroundColor: tag.color,
                        color: 'white',
                        height: '24px',
                        '& .MuiChip-label': {
                          px: 1,
                        },
                      }}
                    />
                  ))}
                </Box>
              </Box>
            }
          />

          <ListItemSecondaryAction>
            <IconButton
              edge="end"
              onClick={() => handleEdit(task.id)}
              sx={{
                color: 'rgba(255, 255, 255, 0.5)',
                '&:hover': {
                  color: '#FFC247',
                  backgroundColor: 'rgba(255, 194, 71, 0.1)',
                },
              }}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              edge="end"
              onClick={() => handleDelete(task.id)}
              sx={{
                ml: 1,
                color: 'rgba(255, 255, 255, 0.5)',
                '&:hover': {
                  color: '#dc3545',
                  backgroundColor: 'rgba(220, 53, 69, 0.1)',
                },
              }}
            >
              <DeleteOutlineIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  );
};

export default TaskList;
