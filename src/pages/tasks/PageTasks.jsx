import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Paper,
  Divider,
  Badge,
  useTheme
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import ViewWeekIcon from '@mui/icons-material/ViewWeek';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AddTask from '../../components/tasks/AddTask';
import TaskList from '../../components/tasks/TaskList';

const PageTasks = () => {
  const theme = useTheme();
  const [notifications] = useState(3); // Ejemplo de número de notificaciones

  return (
    <Box sx={{ p: 3, height: '100vh', backgroundColor: '#F9F7F3' }}>
      <Paper
        elevation={0}
        sx={{
          backgroundColor: '#25283D',
          borderRadius: 4,
          p: 3,
          mb: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 3
        }}
      >
        {/* Header con título y acciones */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Typography
            variant="h5"
            sx={{
              color: '#FFC247',
              fontWeight: 600,
              letterSpacing: 0.5
            }}
          >
            Mis Tareas
          </Typography>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Filtrar">
              <IconButton
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 194, 71, 0.1)',
                    color: '#FFC247'
                  }
                }}
              >
                <FilterListIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Vista">
              <IconButton
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 194, 71, 0.1)',
                    color: '#FFC247'
                  }
                }}
              >
                <ViewWeekIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Notificaciones">
              <IconButton
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 194, 71, 0.1)',
                    color: '#FFC247'
                  }
                }}
              >
                <Badge 
                  badgeContent={notifications} 
                  color="error"
                  sx={{
                    '& .MuiBadge-badge': {
                      backgroundColor: '#FFC247',
                      color: '#25283D'
                    }
                  }}
                >
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />

        {/* Componente para agregar tareas */}
        <AddTask />

        {/* Lista de tareas */}
        <Box
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            borderRadius: 2,
            p: 2
          }}
        >
          <TaskList />
        </Box>
      </Paper>
    </Box>
  );
};

export default PageTasks;
