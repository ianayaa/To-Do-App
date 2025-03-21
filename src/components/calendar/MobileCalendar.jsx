import React, { useState, useEffect } from 'react';
import {
  Box,
  IconButton,
  Typography,
  Paper,
  Stack,
  Chip,
  Grid,
  Divider
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  AccessTime as AccessTimeIcon,
  CalendarMonth
} from '@mui/icons-material';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faExclamation,
  faMinus,
  faArrowDown
} from "@fortawesome/free-solid-svg-icons";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';
import { es } from 'date-fns/locale';
import PropTypes from 'prop-types';
import "../../styles/components/calendar/mobileCalendar.css";

const MobileCalendar = ({ events, onEventClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
  }, [events]);

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getEventsForDate = (date) => {
    return events.filter(event => {
      const eventDate = new Date(event.start);
      return isSameDay(eventDate, date);
    });
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  const getPriorityIcon = (priority) => {
    const priorityValue = priority?.toLowerCase() || '';
    switch (priorityValue) {
      case 'alta':
        return <FontAwesomeIcon icon={faExclamation} style={{ color: '#f44336' }} />;
      case 'normal':
        return <FontAwesomeIcon icon={faMinus} style={{ color: '#FFC247' }} />;
      case 'baja':
        return <FontAwesomeIcon icon={faArrowDown} style={{ color: '#4CAF50' }} />;
      default:
        return <FontAwesomeIcon icon={faMinus} style={{ color: '#FFC247' }} />;
    }
  };

  const getPriorityColor = (priority) => {
    const priorityValue = priority?.toLowerCase() || '';
    switch (priorityValue) {
      case 'alta':
        return '#f44336';
      case 'normal':
        return '#FFC247';
      case 'baja':
        return '#4CAF50';
      default:
        return '#FFC247';
    }
  };

  const getStatusColor = (estado) => {
    switch (estado) {
      case "Completada":
        return "#4caf50";
      case "En Progreso":
        return "#2196f3";
      case "Pendiente":
        return "#ff9800";
      default:
        return "#757575";
    }
  };

  return (
    <Paper className="mobile-calendar">
      {/* Cabecera del calendario */}
      <Box className="calendar-header">
        <IconButton onClick={handlePrevMonth} size="large">
          <ChevronLeftIcon />
        </IconButton>
        <Typography variant="h6" className="month-title">
          {format(currentDate, 'MMMM yyyy', { locale: es })}
        </Typography>
        <IconButton onClick={handleNextMonth} size="large">
          <ChevronRightIcon />
        </IconButton>
      </Box>

      {/* Días de la semana */}
      <Grid container className="weekdays">
        {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day) => (
          <Grid item xs key={day}>
            <Typography className="weekday">{day}</Typography>
          </Grid>
        ))}
      </Grid>

      {/* Días del mes */}
      <Grid container className="days-grid">
        {Array(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay() || 7)
          .fill(null)
          .map((_, index) => (
            <Grid item xs key={`empty-${index}`} className="day-cell empty" />
          ))}

        {daysInMonth.map((day) => {
          const dayEvents = getEventsForDate(day);
          const isSelected = isSameDay(day, selectedDate);
          const dayIsToday = isToday(day);

          return (
            <Grid
              item
              xs
              key={day.toString()}
              className={`day-cell ${isSelected ? 'selected' : ''} ${
                dayIsToday ? 'today' : ''
              }`}
              onClick={() => handleDateClick(day)}
            >
              <Typography className="day-number">
                {format(day, 'd')}
              </Typography>
              {dayEvents.length > 0 && (
                <Box className="event-indicator" />
              )}
            </Grid>
          );
        })}
      </Grid>

      {/* Lista de eventos del día seleccionado */}
      <Box className="events-list">
        <Typography variant="h6" className="selected-date">
          {format(selectedDate, "EEEE, d 'de' MMMM", { locale: es })}
        </Typography>
        <Divider sx={{ my: 2 }} />
        {getEventsForDate(selectedDate).length > 0 ? (
          <Stack spacing={2}>
            {getEventsForDate(selectedDate).map((event, index) => (
              <Paper 
                key={index} 
                className={`event-card priority-${event.priority?.toLowerCase()}`}
                onClick={() => onEventClick(event)}
                elevation={0}
              >
                <div className="event-time">
                  <AccessTimeIcon fontSize="small" />
                  {format(new Date(event.start), 'HH:mm')}
                </div>

                <Typography className="event-title">
                  {event.title}
                </Typography>
                
                {event.descripcion && (
                  <Typography className="event-description">
                    {event.descripcion}
                  </Typography>
                )}

                {event.estado && (
                  <Typography className={`status-${event.estado?.toLowerCase().replace(/\s+/g, '')}`}>
                    {event.estado}
                  </Typography>
                )}
              </Paper>
            ))}
          </Stack>
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1,
              py: 3
            }}
          >
            <CalendarMonth 
              sx={{ 
                color: '#f5f5f5',
                fontSize: '2rem',
                mb: 1
              }} 
            />
            <Typography 
              className="no-events-message" 
              sx={{ 
                color: '#f5f5f5',
                textAlign: 'center',
                fontSize: '1rem',
                fontWeight: 400
              }}
            >
              No hay eventos para este día
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

MobileCalendar.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      start: PropTypes.instanceOf(Date),
      end: PropTypes.instanceOf(Date),
      estado: PropTypes.string,
      priority: PropTypes.string,
      descripcion: PropTypes.string
    })
  ).isRequired,
  onEventClick: PropTypes.func.isRequired
};

export default MobileCalendar;
