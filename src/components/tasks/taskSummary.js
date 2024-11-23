import React from 'react';
import {
  Box,
  Card,
  Typography,
  Grid,
} from '@mui/material';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faHourglassHalf,
  faExclamationTriangle,
  faCalendarCheck,
} from "@fortawesome/free-solid-svg-icons";

const cardStyles = {
  completed: {
    border: '2px solid #4CAF50',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    icon: '#4CAF50'
  },
  pending: {
    border: '2px solid #FF9800',
    backgroundColor: 'rgba(255, 152, 0, 0.1)',
    icon: '#FF9800'
  },
  overdue: {
    border: '2px solid #f44336',
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    icon: '#f44336'
  },
  total: {
    border: '2px solid #9C27B0',
    backgroundColor: 'rgba(156, 39, 176, 0.1)',
    icon: '#9C27B0'
  }
};

const StatCard = ({ icon, title, value, type }) => {
  const style = cardStyles[type];
  
  return (
    <Card
      sx={{
        p: 2,
        height: '100%',
        border: style.border,
        backgroundColor: style.backgroundColor,
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <FontAwesomeIcon 
          icon={icon} 
          style={{ 
            fontSize: '1.5rem', 
            color: style.icon,
            marginRight: '12px'
          }} 
        />
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 500, 
            fontSize: '1rem',
            color: style.icon
          }}
        >
          {title}
        </Typography>
      </Box>
      
      <Typography 
        variant="h4" 
        sx={{ 
          mb: 1, 
          fontWeight: 600,
          color: style.icon
        }}
      >
        {value}
      </Typography>
    </Card>
  );
};

const TaskSummary = ({ completedCount, pendingCount, overdueCount }) => {
  const totalTasks = completedCount + pendingCount;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          icon={faCheckCircle}
          title="Completadas"
          value={completedCount}
          type="completed"
        />
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          icon={faHourglassHalf}
          title="Pendientes"
          value={pendingCount}
          type="pending"
        />
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          icon={faExclamationTriangle}
          title="Vencidas"
          value={overdueCount}
          type="overdue"
        />
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          icon={faCalendarCheck}
          title="Total Tareas"
          value={totalTasks}
          type="total"
        />
      </Grid>
    </Grid>
  );
};

export default TaskSummary;
