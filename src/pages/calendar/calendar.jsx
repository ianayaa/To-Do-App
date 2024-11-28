import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";
import useTasks from "../../hooks/tasks/useTasks";
import { auth, db } from "../../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import "../../styles/calendar.css";
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

const PageCalendar = () => {
  const [user] = useAuthState(auth);
  const { tasks } = useTasks(db, user);
  const [open, setOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const getEventClassName = (task) => {
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
  };

  const getStatusIcon = (status) => {
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
  };

  const renderEventContent = (eventInfo) => {
    const task = eventInfo.event.extendedProps.task;
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
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                mb: 2,
                fontSize: '1rem',
                fontWeight: 600,
                color: '#fff'
              }}
            >
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
            
            {task.priority === "Alta" && (
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1, 
                mb: 2,
                backgroundColor: 'rgba(244, 67, 54, 0.1)',
                padding: '8px 12px',
                borderRadius: '8px'
              }}>
                <PriorityHighIcon sx={{ color: '#f44336' }} fontSize="small" />
                <Typography 
                  variant="body2" 
                  component="span"
                  sx={{
                    color: '#f44336',
                    fontWeight: 500
                  }}
                >
                  Prioridad Alta
                </Typography>
              </Box>
            )}
            
            {task.descripcion && (
              <Box sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                padding: '12px',
                borderRadius: '8px'
              }}>
                <Typography 
                  variant="caption" 
                  component="div"
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.7)',
                    mb: 1,
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    fontSize: '0.7rem'
                  }}
                >
                  Descripción
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.9)',
                    lineHeight: 1.6,
                    fontSize: '0.875rem',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    maxHeight: '100px',
                    overflow: 'auto',
                    '&::-webkit-scrollbar': {
                      width: '4px',
                    },
                    '&::-webkit-scrollbar-track': {
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '4px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      background: 'rgba(255, 255, 255, 0.2)',
                      borderRadius: '4px',
                    }
                  }}
                >
                  {task.descripcion}
                </Typography>
              </Box>
            )}
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
  };

  const events = tasks
    .filter(task => task && task.dueDate)
    .map((task) => {
      const dueDate = task.dueDate?.toDate();
      if (!dueDate) {
        console.error('Fecha inválida para la tarea:', task);
        return null;
      }

      return {
        id: task.id,
        title: task.titulo || 'Sin título',
        start: dueDate,
        end: dueDate,
        allDay: true,
        className: getEventClassName(task),
        extendedProps: {
          task: task
        }
      };
    })
    .filter(Boolean);

  const handleEventClick = (info) => {
    setSelectedTask(info.event.extendedProps.task);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedTask(null);
  };

  const handleDateClick = (arg) => {
    console.log('Date clicked:', arg.date);
  };

  return (
    <Fade in={true} timeout={500}>
      <Box sx={{ height: "calc(100vh - 100px)", p: 3 }}>
        <Paper 
          elevation={0}
          sx={{ 
            height: "100%", 
            p: 2,
            borderRadius: "16px",
            backgroundColor: "#ffffff",
            overflow: "visible",
            position: "relative",
            '& .fc': {
              '--fc-border-color': '#ebedf0',
              position: 'relative',
              zIndex: 1
            },
            '& .fc .fc-popover': {
              zIndex: 10000
            },
            '& .fc-popover-body': {
              zIndex: 10000
            }
          }}
        >
          <FullCalendar
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              listPlugin,
              interactionPlugin
            ]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,today,next",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek"
            }}
            locale={esLocale}
            events={events}
            eventContent={renderEventContent}
            eventClick={handleEventClick}
            dateClick={handleDateClick}
            height="100%"
            dayMaxEventRows={2}
            moreLinkText={count => `${count} más`}
            moreLinkClick="popover"
            views={{
              timeGridWeek: {
                dayMaxEventRows: 2,
                moreLinkText: count => `${count} más`
              },
              dayGridMonth: {
                dayMaxEventRows: 2,
                moreLinkText: count => `${count} más`
              }
            }}
            slotDuration="00:30:00"
            slotMinTime="06:00:00"
            slotMaxTime="22:00:00"
            expandRows={true}
            allDaySlot={false}
            nowIndicator={true}
            buttonText={{
              today: "Hoy",
              month: "Mes",
              week: "Semana",
              day: "Día",
              list: "Lista"
            }}
            eventTimeFormat={{
              hour: "2-digit",
              minute: "2-digit",
              meridiem: false,
              hour12: false
            }}
            slotLabelFormat={{
              hour: "2-digit",
              minute: "2-digit",
              hour12: false
            }}
            views={{
              dayGridMonth: {
                titleFormat: { year: 'numeric', month: 'long' }
              },
              timeGridWeek: {
                titleFormat: { year: 'numeric', month: 'long', day: '2-digit' }
              },
              timeGridDay: {
                titleFormat: { year: 'numeric', month: 'long', day: '2-digit', weekday: 'long' }
              }
            }}
          />
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
