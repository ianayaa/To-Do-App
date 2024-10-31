import React, { useState } from "react";

const AddTask = ({ addTask }) => {
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");

  const handleAddTask = () => {
    if (!taskName) {
      alert("Por favor, ingresa un nombre para la tarea");
      return;
    }

    const newTask = {
      titulo: taskName,
      descripcion: taskDescription,
      estado: "Pendiente", // Estado inicial
      fechaCreacion: new Date(),
      dueDate: new Date(), //TEMPORAL HASTA USO DE DATE PICKER
      complete: false,
    };

    addTask(newTask);
    setTaskName("");
    setTaskDescription("");
  };

  return (
    <div className="task-form border rounded p-2 mt-3">
      <div className="mb-3">
        <input
          type="text"
          className="form-control custom-input"
          id="taskName"
          placeholder="Nombre de la tarea"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <textarea
          className="form-control custom-input"
          id="taskDescription"
          rows="3"
          placeholder="Descripción"
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
        ></textarea>
      </div>
      <div className="mb-3 d-flex">
        <button className="btn custom-button">
          <i className="fas fa-calendar-days"></i> Fecha de vencimiento
        </button>

        <button className="btn custom-button">
          <i className="fas fa-bell"></i> Recordatorios
        </button>
        <button className="btn custom-button">
          <i className="fas fa-ellipsis"></i>
        </button>
      </div>
      <div className="d-flex justify-content-end">
        <button
          className="btn btn-secondary custom-button"
          onClick={() => {
            setTaskName("");
            setTaskDescription("");
          }}
        >
          Cancelar
        </button>
        <button
          className="btn btn-danger custom-button"
          onClick={handleAddTask}
        >
          Añadir tarea
        </button>
      </div>
    </div>
  );
};

export default AddTask;
