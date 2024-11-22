import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import useTasks from "../hooks/tasks/useTasks";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../config/firebase";
import { Calendar as BigCalendar } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../styles/Calendar.css";
import { 
  CardContent, 
  Box, 
  Typography,
  IconButton,
  Tooltip,
  Paper,
  Chip
} from "@mui/material";
import moment from "moment";
import 'moment/locale/es';
import { momentLocalizer } from "react-big-calendar";
import TaskDetailDialog from "../components/dialog/TaskDetailDialog";
import TodayIcon from "@mui/icons-material/Today";
import ViewWeekIcon from "@mui/icons-material/ViewWeek";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import ViewAgendaIcon from "@mui/icons-material/ViewAgenda";

// Configuración de moment.js en español
moment.locale('es', {
  months: 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split('_'),
  monthsShort: 'Ene._Feb._Mar._Abr._May._Jun._Jul._Ago._Sep._Oct._Nov._Dic.'.split('_'),
  weekdays: 'Domingo_Lunes_Martes_Miércoles_Jueves_Viernes_Sábado'.split('_'),
  weekdaysShort: 'Dom._Lun._Mar._Mié._Jue._Vie._Sáb.'.split('_'),
  weekdaysMin: 'Do_Lu_Ma_Mi_Ju_Vi_Sá'.split('_')
});

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
  today: 'Hoy',
  agenda: 'Agenda',
  noEventsInRange: 'No hay eventos en este rango.',
  showMore: (total) => `+ Ver más (${total})`
};

const formats = {
  monthHeaderFormat: (date) => moment(date).format('MMMM YYYY'),
  weekHeaderFormat: (date) => moment(date).format('MMMM YYYY'),
  dayHeaderFormat: (date) => moment(date).format('dddd, D [de] MMMM [de] YYYY'),
  dayRangeHeaderFormat: ({ start, end }) => {
    return `${moment(start).format('D [de] MMMM')} - ${moment(end).format('D [de] MMMM [de] YYYY')}`;
  },
  agendaHeaderFormat: ({ start, end }) => {
    return `${moment(start).format('D [de] MMMM')} - ${moment(end).format('D [de] MMMM [de] YYYY')}`;
  },
  agendaDateFormat: (date) => moment(date).format('D [de] MMMM'),
  agendaTimeFormat: (date) => moment(date).format('HH:mm'),
  agendaTimeRangeFormat: ({ start, end }) => {
    return `${moment(start).format('HH:mm')} - ${moment(end).format('HH:mm')}`;
  },
  dayFormat: (date) => moment(date).format('dddd D'),
  dayRangeFormat: ({ start, end }) => {
    return `${moment(start).format('D [de] MMMM')} - ${moment(end).format('D [de] MMMM')}`;
  },
  timeGutterFormat: (date) => moment(date).format('HH:mm'),
};

const PageCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [user] = useAuthState(auth);
  const { tasks } = useTasks(db, user);
  const [open, setOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [view, setView] = useState("month");

  useEffect(() => {
    console.log('Tasks actualizadas:', tasks);
  }, [tasks]);

  // Convertir las tareas a eventos del calendario
  const events = tasks.map((task) => {
    console.log('Procesando tarea:', task);
    if (!task || !task.id) {
      console.error('Tarea inválida:', task);
      return null;
    }

    const dueDate = task.dueDate?.toDate();
    if (!dueDate) {
      console.error('Fecha inválida para la tarea:', task);
      return null;
    }

    // Crear una copia segura de la tarea
    const taskCopy = {
      id: task.id,
      descripcion: task.descripcion || '',
      titulo: task.titulo || '',
      estado: task.estado || 'Pendiente',
      etiquetas: task.etiquetas || [],
      dueDate: task.dueDate,
      user_id: task.user_id,
    };

    return {
      ...taskCopy,
      allDay: true,
      title: taskCopy.descripcion || '',
      start: dueDate,
      end: dueDate,
    };
  }).filter(Boolean); // Eliminar eventos nulos

  const eventColors = (event) => {
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

    if (event.estado === "Completada") {
      style.backgroundColor = "#4CAF50";
      style.color = "#FFFFFF";
    } else if (event.estado === "Pendiente") {
      style.backgroundColor = "#ffc247";
      style.color = "#000000";
    }

    return { style };
  };

  const CustomToolbar = (toolbar) => {
    const goToToday = () => {
      toolbar.onNavigate('TODAY');
    };

    const viewOptions = [
      { key: "month", icon: <ViewModuleIcon />, label: "Mes" },
      { key: "week", icon: <ViewWeekIcon />, label: "Semana" },
      { key: "day", icon: <TodayIcon />, label: "Día" },
      { key: "agenda", icon: <ViewAgendaIcon />, label: "Agenda" }
    ];

    const navigate = {
      PREVIOUS: 'PREV',
      NEXT: 'NEXT',
      TODAY: 'TODAY'
    };

    const getNavigateLabel = (date, view) => {
      const formats = {
        month: 'MMMM YYYY',
        week: "D [de] MMMM YYYY",
        day: "dddd, D [de] MMMM YYYY",
        agenda: "D [de] MMMM YYYY"
      };
      return moment(date).format(formats[view]);
    };

    return (
      <Box sx={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        p: 2, 
        backgroundColor: "#f5f5f5",
        borderRadius: "8px 8px 0 0"
      }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton onClick={() => toolbar.onNavigate(navigate.PREVIOUS)}>
            <Tooltip title="Anterior">
              <span>{"<"}</span>
            </Tooltip>
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            {getNavigateLabel(toolbar.date, toolbar.view)}
          </Typography>
          <IconButton onClick={() => toolbar.onNavigate(navigate.NEXT)}>
            <Tooltip title="Siguiente">
              <span>{">"}</span>
            </Tooltip>
          </IconButton>
          <Tooltip title="Hoy">
            <IconButton onClick={goToToday} color="primary">
              <TodayIcon />
            </IconButton>
          </Tooltip>
        </Box>
        
        <Box sx={{ display: "flex", gap: 1 }}>
          {viewOptions.map(({key, icon, label}) => (
            <Tooltip key={key} title={label}>
              <IconButton 
                onClick={() => toolbar.onView(key)}
                color={view === key ? "primary" : "default"}
              >
                {icon}
              </IconButton>
            </Tooltip>
          ))}
        </Box>
      </Box>
    );
  };

  const CustomEvent = ({ event }) => (
    <Box sx={{ p: 0.5 }}>
      <Typography variant="body2" noWrap>{event.title}</Typography>
      <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", mt: 0.5 }}>
        {event.etiquetas?.map((tag, index) => (
          <Chip 
            key={index}
            label={tag}
            size="small"
            sx={{ 
              height: "16px",
              fontSize: "10px",
              backgroundColor: "rgba(255,255,255,0.3)"
            }}
          />
        ))}
      </Box>
    </Box>
  );

  return (
    <Paper elevation={3} sx={{ height: "90vh", m: 2, overflow: "hidden" }}>
      <BigCalendar
        culture='es'
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        onSelectEvent={(event) => {
          console.log('Evento seleccionado:', event);
          console.log('ID del evento:', event.id);
          console.log('Lista de tareas actual:', tasks);
          
          // Buscar la tarea original para asegurarnos de tener todos los datos correctos
          const originalTask = tasks.find(t => {
            console.log('Comparando con tarea:', t);
            return t.id === event.id;
          });
          
          if (originalTask) {
            console.log('Tarea original encontrada:', originalTask);
            setSelectedTask(originalTask);
          } else {
            console.error('No se encontró la tarea original para el ID:', event.id);
            setSelectedTask(null);
            return; // No abrir el diálogo si no hay tarea
          }
          setOpen(true);
        }}
        style={{ height: "85vh" }}
        views={{
          month: true,
          week: true,
          day: true,
          agenda: true
        }}
        view={view}
        onView={(newView) => setView(newView)}
        popup
        selectable
        onSelectSlot={() => {}}
        messages={defaultMessages}
        formats={formats}
        components={{
          toolbar: CustomToolbar,
          event: CustomEvent
        }}
      />
      <TaskDetailDialog
        open={open && selectedTask !== null}
        handleClose={() => {
          setOpen(false);
          setSelectedTask(null);
        }}
        task={selectedTask}
        db={db}
      />
    </Paper>
  );
};

export default PageCalendar;
