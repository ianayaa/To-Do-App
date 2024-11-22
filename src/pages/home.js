import TaskCard from "../components/tasks/TaskCard";
import TaskSummary from "../components/tasks/taskSummary";
import AddTask from "../components/tasks/AddTask";
import useTasks from "../hooks/tasks/useTasks";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../config/firebase";
import useAddTask from "../hooks/tasks/useAddTask";
import useDeleteTask from "../hooks/tasks/useDeleteTask";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import useUserData from "../hooks/user/useUserData";

const Home = () => {
  const [user] = useAuthState(auth);
  const { userData, loading } = useUserData();
  const { tasks, completedCount, pendingCount, overdueCount, addTaskToList } =
    useTasks(db, user);
  const { addTask } = useAddTask(db, user, addTaskToList); // Pasa el callback
  const { deleteTask } = useDeleteTask(db); // Usa el hook para eliminar tareas
  const [openAddTask, setOpenAddTask] = useState(false);
  const displayName = userData?.name || user?.displayName || "Usuario";

  return (
    <div>
      <header>
        <h1>
          Hola,{" "}
          {loading
            ? "Cargando..."
            : displayName.split(" ").slice(0, 2).join(" ")}{" "}
        </h1>
      </header>
      <TaskSummary
        completedCount={completedCount}
        pendingCount={pendingCount}
        overdueCount={overdueCount}
      />
      <section className="task-section">
        <h2>Mis Tareas</h2>
        <div className="task-list">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                deleteTask={deleteTask} // Pasa la función deleteTask
              />
            ))
          ) : (
            <p>No tienes tareas pendientes</p>
          )}
        </div>

        {!openAddTask && (
          <button className="btn" onClick={() => setOpenAddTask(true)}>
            <FontAwesomeIcon className="me-3 text-danger" icon={faPlus} />
            <span>Agregar tarea</span>
          </button>
        )}

        {openAddTask && (
          <AddTask
            addTask={addTask}
            closeAddTask={() => setOpenAddTask(false)}
          />
        )}
      </section>
    </div>
  );
};

export default Home;
