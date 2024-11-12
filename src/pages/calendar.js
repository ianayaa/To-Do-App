import React, { useState } from "react";
import dayjs from "dayjs";
import "../styles/calendar.css";
import useTasks from "../hooks/tasks/useTasks";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../config/firebase";

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [user] = useAuthState(auth);
  const { tasks } = useTasks(db, user);

  // Filtrar tareas para el día seleccionado
  const tasksForSelectedDate = tasks.filter((task) => {
    const taskDate = task.dueDate?.toDate();
    return taskDate && dayjs(taskDate).isSame(selectedDate, "day");
  });

  const handlePrevMonth = () => {
    setCurrentMonth(currentMonth.subtract(1, "month"));
  };

  const handleNextMonth = () => {
    setCurrentMonth(currentMonth.add(1, "month"));
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  const generateCalendar = () => {
    const daysInMonth = currentMonth.daysInMonth();
    const startDay = currentMonth.startOf("month").day();
    const calendar = [];
    let dayCounter = 1;

    for (let week = 0; week < 6; week++) {
      const days = [];
      for (let day = 0; day < 7; day++) {
        if (week === 0 && day < startDay) {
          days.push(<td key={`${week}-${day}`} className="empty-cell"></td>);
        } else if (dayCounter > daysInMonth) {
          days.push(<td key={`${week}-${day}`} className="empty-cell"></td>);
        } else {
          const date = dayjs(
            new Date(currentMonth.year(), currentMonth.month(), dayCounter)
          );
          const isSelected = date.isSame(selectedDate, "day");
          days.push(
            <td
              key={`${week}-${day}`}
              className={`date-cell ${isSelected ? "selected" : ""}`}
              onClick={() => handleDateClick(date)}
            >
              {dayCounter}
            </td>
          );
          dayCounter++;
        }
      }
      calendar.push(<tr key={week}>{days}</tr>);
    }
    return calendar;
  };

  return (
    <div className="custom-calendar">
      <div className="calendar-header">
        <button onClick={handlePrevMonth}>&lt;</button>
        <span>{currentMonth.format("MMMM YYYY")}</span>
        <button onClick={handleNextMonth}>&gt;</button>
      </div>
      <div className="calendar-date-display">
        <h2>{selectedDate.format("ddd, MMM D")}</h2>
      </div>
      <table>
        <thead>
          <tr>
            <th>D</th>
            <th>L</th>
            <th>M</th>
            <th>M</th>
            <th>J</th>
            <th>V</th>
            <th>S</th>
          </tr>
        </thead>
        <tbody>{generateCalendar()}</tbody>
      </table>
      <div className="tasks-for-selected-date">
        <h3>Tareas para {selectedDate.format("DD MMM YYYY")}:</h3>
        {tasksForSelectedDate.length > 0 ? (
          <ul>
            {tasksForSelectedDate.map((task) => (
              <li key={task.id}>{task.titulo}</li>
            ))}
          </ul>
        ) : (
          <p>No hay tareas para esta fecha.</p>
        )}
      </div>
    </div>
  );
};

export default Calendar;
