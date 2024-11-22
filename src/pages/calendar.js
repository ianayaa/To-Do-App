import React, { useState } from "react";
import dayjs from "dayjs";
import useTasks from "../hooks/tasks/useTasks";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../config/firebase";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../styles/calendar.css";
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
import TaskDetailDialog from "../components/dialog/TaskDetailDialog";
import TodayIcon from "@mui/icons-material/Today";
import ViewWeekIcon from "@mui/icons-material/ViewWeek";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import ViewAgendaIcon from "@mui/icons-material/ViewAgenda";

moment.locale("es"); 
const localizer = momentLocalizer(moment);

const PageCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [user] = useAuthState(auth);
  const { tasks } = useTasks(db, user);
  const [open, setOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [view, setView] = useState("month");

  const events = tasks.map((task) => ({
    id: task.id,
    title: task.descripcion,
    allDay: true,
    start: new Date(task.dueDate.toDate()),
    end: new Date(task.dueDate.toDate()),
    estado: task.estado,
    etiquetas: task.etiquetas || [],
  }));

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
      toolbar.date.setMonth(new Date().getMonth());
      toolbar.date.setYear(new Date().getFullYear());
      toolbar.onNavigate('TODAY');
    };

    const viewOptions = [
      { key: "month", icon: <ViewModuleIcon />, label: "Mes" },
      { key: "week", icon: <ViewWeekIcon />, label: "Semana" },
      { key: "day", icon: <TodayIcon />, label: "Día" },
      { key: "agenda", icon: <ViewAgendaIcon />, label: "Agenda" }
    ];

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
          <IconButton onClick={() => toolbar.onNavigate('PREV')}>
            {"<"}
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            {moment(toolbar.date).format('MMMM YYYY')}
          </Typography>
          <IconButton onClick={() => toolbar.onNavigate('NEXT')}>
            {">"}
          </IconButton>
          <Tooltip title="Ir a hoy">
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
        selectable
        defaultView="month"
        view={view}
        onView={setView}
        events={events}
        scrollToTime={new Date(1970, 1, 1, 6)}
        defaultDate={new Date()}
        localizer={localizer}
        style={{ height: "100%" }}
        eventPropGetter={eventColors}
        onSelectEvent={(event) => {
          setOpen(true);
          setSelectedTask(event);
        }}
        components={{
          toolbar: CustomToolbar,
          event: CustomEvent
        }}
        messages={{
          next: "Siguiente",
          previous: "Anterior",
          today: "Hoy",
          month: "Mes",
          week: "Semana",
          day: "Día",
          agenda: "Agenda",
          date: "Fecha",
          time: "Hora",
          event: "Evento",
          noEventsInRange: "No hay tareas en este período"
        }}
      />
      <TaskDetailDialog
        open={open}
        handleClose={() => setOpen(false)}
        task={selectedTask}
      />
    </Paper>
  );
};

export default PageCalendar;
