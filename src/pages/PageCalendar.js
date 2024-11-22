import React, { useState } from "react";
import useTasks from "../hooks/tasks/useTasks";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../config/firebase";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../styles/calendar.css";
import { CardContent, Box } from "@mui/material";
import moment from "moment";
import 'moment/locale/es';
import TaskDetailDialog from "../components/dialog/TaskDetailDialog";

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

// Mensajes en español para el calendario
const messages = {
  allDay: 'Todo el día',
  previous: 'Anterior',
  next: 'Siguiente',
  today: 'Hoy',
  month: 'Mes',
  week: 'Semana',
  day: 'Día',
  agenda: 'Lista de Tareas',
  date: 'Fecha',
  time: 'Orden',
  event: 'Tarea',
  noEventsInRange: 'No hay tareas en este período',
  showMore: total => `+ Ver más (${total})`
};

const PageCalendar = () => {
  const [user] = useAuthState(auth);
  const { tasks } = useTasks(db, user);
  const [open, setOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // Ordenar tareas por fecha de creación
  const sortedTasks = [...tasks].sort((a, b) => {
    return a.createdAt?.toDate() - b.createdAt?.toDate();
  });

  const events = sortedTasks.map((task, index) => {
    const fecha = new Date(task.dueDate.toDate());
    fecha.setHours(0, 0, 0, 0);
    
    return {
      title: task.titulo,
      allDay: true,
      start: fecha,
      end: fecha,
      color: task.estado,
      resource: index + 1,
      estado: task.estado,
      task: task // Guardamos la tarea completa
    };
  });

  const eventColors = (event) => {
    let style = {
      backgroundColor: "lightblue",
      color: "black",
      borderRadius: "12px",
      border: "none",
    };

    if (event.color === "Completada") {
      style.backgroundColor = "#ffc247";
    } else if (event.color === "Pendiente") {
      style.backgroundColor = "#ffc247";
    }

    return {
      style: style,
    };
  };

  const handleEventSelect = (event) => {
    setSelectedTask(event.task); // Pasamos la tarea completa
    setOpen(true);
  };

  // Componente personalizado para la vista de agenda
  const AgendaEvent = ({ event }) => (
    <div className="agenda-event">
      <span className="agenda-event-number">{event.resource}</span>
      <span className="agenda-event-title">{event.title}</span>
      <span className={`agenda-event-status ${event.estado.toLowerCase()}`}>
        {event.estado}
      </span>
    </div>
  );

  return (
    <>
      <Box
        className="calendar-container"
        sx={{ height: "80vh", padding: 1.5, margin: 0 }}
      >
        <CardContent sx={{ height: "100%", padding: 2 }}>
          <BigCalendar
            culture='es'
            messages={messages}
            formats={{
              monthHeaderFormat: 'MMMM YYYY',
              weekHeaderFormat: 'MMMM YYYY',
              dayHeaderFormat: 'dddd D [de] MMMM [de] YYYY',
              dayRangeHeaderFormat: ({ start, end }) => {
                return `${moment(start).format('D [de] MMMM')} - ${moment(end).format('D [de] MMMM [de] YYYY')}`;
              },
              dayFormat: 'D',
              weekdayFormat: 'dddd',
              agendaDateFormat: 'dddd D [de] MMMM',
              agendaHeaderFormat: 'dddd D [de] MMMM [de] YYYY'
            }}
            components={{
              agenda: {
                event: AgendaEvent
              }
            }}
            selectable
            defaultView="agenda"
            events={events}
            defaultDate={new Date()}
            localizer={localizer}
            style={{ height: "100%", width: "100%" }}
            eventPropGetter={eventColors}
            onSelectEvent={handleEventSelect}
            views={["month", "week", "agenda"]}
            startAccessor="start"
            endAccessor="end"
            popup
            showAllEvents
          />
        </CardContent>
      </Box>
      <TaskDetailDialog
        open={open}
        handleClose={() => setOpen(false)}
        task={selectedTask || {}}
        db={db}
      />
    </>
  );
};

export default PageCalendar;
