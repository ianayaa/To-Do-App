import React, { useState, useEffect } from "react";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import 'moment/locale/es';
import useTasks from "../../hooks/tasks/useTasks";
import { auth, db } from "../../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../../styles/calendar.css";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  CardContent,
  Box,
  Tooltip,
  Paper,
  Chip
} from "@mui/material";
import ViewWeek from '@mui/icons-material/ViewWeek';
import ViewModule from '@mui/icons-material/ViewModule';
import Today from '@mui/icons-material/Today';
import ViewAgenda from '@mui/icons-material/ViewAgenda';
import TaskDetailDialog from "../../components/dialog/TaskDetailDialog";

// Configuración de moment.js en español
moment.locale('es');

const localizer = momentLocalizer(moment);

const defaultMessages = {
  date: 'Fecha',
  time: 'Hora',
  event: 'Evento',
  allDay: 'Todo el día',
  week: 'Semana',
  work_week: 'Semana laboral',
  day: 'Día',
  month: 'Mes',
  previous: 'Anterior',
  next: 'Siguiente',
  yesterday: 'Ayer',
  tomorrow: 'Mañana',
  showMore: total => `+ Ver más (${total})`
};

const formats = {
  monthHeaderFormat: date => moment(date).format('MMMM YYYY'),
  weekHeaderFormat: date => moment(date).format('MMMM YYYY'),
  dayHeaderFormat: date => moment(date).format('dddd D [de] MMMM'),
  dayRangeHeaderFormat: ({ start, end }) =>
    `${moment(start).format('D [de] MMMM')} - ${moment(end).format('D [de] MMMM YYYY')}`,
  agendaHeaderFormat: ({ start, end }) =>
    `${moment(start).format('D [de] MMMM')} - ${moment(end).format('D [de] MMMM YYYY')}`,
  agendaDateFormat: date => moment(date).format('ddd D'),
  agendaTimeFormat: date => moment(date).format('HH:mm'),
  agendaTimeRangeFormat: ({ start, end }) =>
    `${moment(start).format('HH:mm')} - ${moment(end).format('HH:mm')}`,
  dayFormat: date => moment(date).format('ddd D'),
  dayRangeFormat: ({ start, end }) =>
    `${moment(start).format('D')} - ${moment(end).format('D [de] MMMM YYYY')}`,
  timeGutterFormat: date => moment(date).format('HH:mm')
};

const PageCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(moment());
  const [currentMonth, setCurrentMonth] = useState(moment());
  const [user] = useAuthState(auth);
  const { tasks } = useTasks(db, user);
  const [open, setOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [view, setView] = useState("month");

  useEffect(() => {
    console.log('Tasks actualizadas:', tasks);
  }, [tasks]);

  // Convertir las tareas a eventos del calendario
  const events = tasks.filter(task => task && task.dueDate).map((task) => {
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
      resource: task
    };
  }).filter(Boolean);

  const eventStyleGetter = (event) => {
    let style = {
      backgroundColor: "#E3E3E3",
      color: "#000000",
      borderRadius: "8px",
      border: "none",
      padding: "4px",
      fontSize: "14px",
      fontWeight: "500",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    };

    const estado = event.resource?.estado;
    if (estado === "Completada") {
      style.backgroundColor = "#4CAF50";
      style.color = "#FFFFFF";
    } else if (estado === "Pendiente") {
      style.backgroundColor = "#ffc247";
      style.color = "#000000";
    }

    return { style };
  };

  const handleSelectEvent = (event) => {
    setSelectedTask(event.resource);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedTask(null);
  };

  return (
    <Box sx={{ height: "calc(100vh - 100px)", p: 3 }}>
      <Paper elevation={3} sx={{ height: "100%", p: 2 }}>
        <BigCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "100%" }}
          messages={defaultMessages}
          formats={formats}
          eventPropGetter={eventStyleGetter}
          onSelectEvent={handleSelectEvent}
          view={view}
          onView={setView}
          popup
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
  );
};

export default PageCalendar;
