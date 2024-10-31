import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faExclamationCircle,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import { Timestamp } from "firebase/firestore";

const TaskCard = ({ task, deleteTask }) => { // Agregar deleteTask como prop
  const { titulo, descripcion, dueDate, estado } = task;

  // Verificar si dueDate es válido antes de convertirlo a fecha
  const isDueDateValid = dueDate && dueDate instanceof Timestamp;
  const dueDateFormatted = isDueDateValid ? dueDate.toDate() : null;
  const isOverdue =
      dueDateFormatted && dueDateFormatted < new Date() && estado === "Pendiente";

  const getStatusClass = () => {
    if (estado === "Completada") return "completed";
    if (isOverdue) return "overdue";
    if (estado === "Pendiente") return "pending";
    return "";
  };

  const getStatusIcon = () => {
    if (estado === "Completada") {
      return <FontAwesomeIcon icon={faCheckCircle} />;
    }
    if (isOverdue) {
      return <FontAwesomeIcon icon={faExclamationCircle} />;
    }
    if (estado === "Pendiente") {
      return <FontAwesomeIcon icon={faClock} />;
    }
    return null;
  };

  const handleDelete = () => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta tarea?")) {
      deleteTask(task.id); // Llamar a deleteTask con el ID de la tarea
    }
  };

  return (
      <div className="taskCard">
        <div className={`statusIcon ${getStatusClass()}`}>{getStatusIcon()}</div>
        <h3>{titulo}</h3>
        <p>
          Vencimiento:{" "}
          {dueDateFormatted ? dueDateFormatted.toLocaleString() : "No disponible"}
        </p>
        <div className="actions">
          <button className="btn btn-warning me-3" aria-label="Editar tarea">
            Editar
          </button>
          <button className="btn btn-danger me-3" aria-label="Eliminar tarea" onClick={handleDelete}>
            Eliminar
          </button>
          <button
              className="btn btn-success me-3"
              aria-label="Marcar tarea como completa"
          >
            Completar
          </button>
        </div>
      </div>
  );
};

TaskCard.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.string.isRequired, // Asegúrate de que id esté definido en la tarea
    titulo: PropTypes.string.isRequired,
    descripcion: PropTypes.string,
    dueDate: PropTypes.instanceOf(Timestamp), // Verifica si es de tipo Timestamp
    estado: PropTypes.string.isRequired,
  }).isRequired,
  deleteTask: PropTypes.func.isRequired, // Asegúrate de que deleteTask sea una función requerida
};

export default TaskCard;
