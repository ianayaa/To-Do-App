import React from 'react';
import { Card, Box, Typography } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const TasksChart = ({ tasks }) => {
  // Procesar datos para el gráfico
  const processData = () => {
    const today = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      return date;
    }).reverse();

    return last7Days.map(date => {
      const dayTasks = tasks.filter(task => {
        const taskDate = task.dueDate.toDate();
        return taskDate.getDate() === date.getDate() &&
               taskDate.getMonth() === date.getMonth() &&
               taskDate.getFullYear() === date.getFullYear();
      });

      return {
        date: date.toLocaleDateString('es-ES', { weekday: 'short' }),
        completadas: dayTasks.filter(task => task.estado === 'Completada').length,
        pendientes: dayTasks.filter(task => task.estado === 'Pendiente').length,
      };
    });
  };

  return (
    <Card sx={{ 
      p: 2, 
      height: '100%',
      backgroundColor: '#25283D',
      color: 'white'
    }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Actividad Semanal
      </Typography>
      <Box sx={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={processData()} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <XAxis dataKey="date" stroke="white" />
            <YAxis stroke="white" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#25283D',
                border: 'none',
                borderRadius: '8px',
                color: 'white'
              }}
            />
            <Bar dataKey="completadas" stackId="a" fill="#4CAF50" name="Completadas" />
            <Bar dataKey="pendientes" stackId="a" fill="#FFC247" name="Pendientes" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Card>
  );
};

export default TasksChart;
