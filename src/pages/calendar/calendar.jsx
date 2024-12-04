import React, { useState, useEffect, useCallback, useMemo } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";
import useTasks from "../../hooks/tasks/useTasks";
import { auth, db } from "../../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import "../../styles/components/calendar/calendar.css";
import {
  Box,
  Paper,
  Fade,
  Tooltip,
  IconButton,
  Typography,
  Chip,
} from "@mui/material";
import TaskDetailDialog from "../../components/dialog/TaskDetailDialog";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import MobileCalendar from "../../components/calendar/MobileCalendar";

const PageCalendar = () => {
  const [user] = useAuthState(auth);
  const { tasks } = useTasks(db, user);
  const [open, setOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const handleEventClick = useCallback((info) => {
    setSelectedTask(info.event.extendedProps.task);
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    setSelectedTask(null);
  }, []);

  const handleResize = useCallback(() => {
    setIsMobile(window.innerWidth <= 768);
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  const getStatusIcon = useCallback((status) => {
    switch (status) {
      case "Completada":
        return <CheckCircleIcon fontSize="small" />;
      case "Pendiente":
        return <AccessTimeIcon fontSize="small" />;
      case "En Progreso":
        return <ErrorIcon fontSize="small" />;
      default:
        return null;
    }
  }, []);

  const getEventClassName = useCallback((task) => {
    if (!task) return '';
    if (task.priority === "Alta") return "task-high-priority";
    switch (task.estado) {
      case "Completada":
        return "task-completed";
      case "Pendiente":
        return "task-pending";
      case "En Progreso":
        return "task-in-progress";
      default:
        return "";
    }
  }, []);

  const renderEventContent = useCallback((eventInfo) => {
    const task = eventInfo.event.extendedProps.task;
    const isListView = eventInfo.view.type === 'listWeek' || eventInfo.view.type === 'listMonth';

    if (isListView) {
      return (
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          width: '100%',
          py: 1,
          px: 2,
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          borderRadius: 2,
          transition: 'background-color 0.3s',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          }
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            flex: 1
          }}>
            {task.priority === "Alta" && (
              <PriorityHighIcon 
                fontSize="small" 
                sx={{ color: '#f44336' }}
              />
            )}
            <Typography 
              sx={{ 
                fontWeight: task.priority === "Alta" ? 600 : 400,
                color: task.estado === "Completada" ? "text.disabled" : "text.primary",
                textDecoration: task.estado === "Completada" ? "line-through" : "none"
              }}
            >
              {task.titulo}
            </Typography>
          </Box>
          
          <Chip 
            icon={getStatusIcon(task.estado)}
            label={task.estado}
            size="small"
            sx={{
              backgroundColor: task.estado === "Completada" 
                ? 'success.main' 
                : task.estado === "En Progreso"
                ? 'warning.main'
                : 'info.main',
              color: '#fff',
              '& .MuiChip-icon': {
                color: '#fff'
              }
            }}
          />
        </Box>
      );
    }

    return (
      <Tooltip
        title={
          <Box sx={{ 
            p: 2,
            minWidth: '250px',
            backgroundColor: 'rgba(37, 40, 61, 0.95)',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <Typography variant="h6" component="div" sx={{ mb: 2, fontSize: '1rem', fontWeight: 600, color: '#fff' }}>
              {task.titulo}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              {getStatusIcon(task.estado)}
              <Chip 
                label={task.estado} 
                size="small" 
                sx={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  fontWeight: 500,
                  borderRadius: '8px',
                  '& .MuiChip-label': {
                    px: 2
                  }
                }}
              />
            </Box>
          </Box>
        }
        arrow
        placement="top"
        componentsProps={{
          tooltip: {
            sx: {
              bgcolor: 'transparent',
              '& .MuiTooltip-arrow': {
                color: 'rgba(37, 40, 61, 0.95)'
              }
            }
          }
        }}
      >
        <div className={`fc-event-content ${getEventClassName(task)}`}>
          <div className="event-title">
            {task.titulo}
          </div>
          <div className="event-meta">
            {task.priority === "Alta" && <PriorityHighIcon fontSize="small" />}
            {getStatusIcon(task.estado)}
          </div>
        </div>
      </Tooltip>
    );
  }, [getStatusIcon, getEventClassName]);

  const calendarEvents = useMemo(() => {
    if (!tasks || !Array.isArray(tasks)) return [];
    return tasks.map(task => ({
      id: task.id,
      title: task.titulo,
      start: task.dueDate?.toDate?.(),
      end: task.dueDate?.toDate?.(),
      extendedProps: {
        task: task,
      }
    }));
  }, [tasks]);

  return (
    <Fade in={true} timeout={500}>
      <Box sx={{ p: 3, height: '100vh' }}>
        <Paper
          elevation={0}
          sx={{
            height: '100%',
            backgroundColor: '#25283D',
            borderRadius: 4,
            p: 3,
            overflow: 'hidden'
          }}
        >
          {isMobile ? (
            <MobileCalendar 
              events={calendarEvents}
              onEventClick={(event) => {
                setSelectedTask(event);
                setOpen(true);
              }}
            />
          ) : (
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,listWeek'
              }}
              locale={esLocale}
              events={calendarEvents}
              eventContent={renderEventContent}
              eventClick={handleEventClick}
              height="100%"
              views={{
                listWeek: {
                  titleFormat: { year: 'numeric', month: 'long', day: 'numeric' },
                  eventContent: renderEventContent,
                  noEventsContent: 'No hay tareas programadas'
                }
              }}
              slotLabelFormat={{
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              }}
            />
          )}
        </Paper>
        {selectedTask && (
          <TaskDetailDialog
            open={open}
            onClose={handleClose}
            task={selectedTask}
            db={db}
          />
        )}
      </Box>
    </Fade>
  );
};

export default PageCalendar;
