import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faExclamationCircle,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import { Timestamp } from "firebase/firestore";
import TaskDetailDialog from "../dialog/TaskDetailDialog";
import { db } from "../../config/firebase";

const TaskCard = ({ task, deleteTask }) => {
  // Agregar deleteTask como prop
  const { titulo, descripcion, dueDate, estado } = task;

  const [open, setOpen] = React.useState(false);

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
    <>
      <div
        onClick={() => setOpen(true)}
        className="progress-component p-3"
        style={{ cursor: "pointer" }}
      >
        <div className="d-flex align-items-center">
          <div className={`statusIcon ${getStatusClass()}`}>
            {getStatusIcon()}
          </div>
          <div className="ms-3 flex-grow-1">
            <h6>{titulo}</h6>
            <small>{dueDate.toDate().toLocaleString()}</small>
          </div>
        </div>
      </div>
      <TaskDetailDialog
        open={open}
        handleClose={() => setOpen(false)}
        task={task}
        db={db}
        deleteTask={deleteTask}
      />
    </>
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
