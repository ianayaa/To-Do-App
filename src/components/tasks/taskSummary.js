import React from "react";

const TaskSummary = ({ completedCount, pendingCount, overdueCount }) => (
  <div className="taskSummaryContainer">
    <div className="taskSummaryCard completed">
      <div className="taskCount">{completedCount}</div>
      <div>Completadas</div>
    </div>
    <div className="taskSummaryCard pending">
      <div className="taskCount">{pendingCount}</div>
      <div>Pendientes</div>
    </div>
    <div className="taskSummaryCard overdue">
      <div className="taskCount">{overdueCount}</div>
      <div>Vencidas</div>
    </div>
  </div>
);

export default TaskSummary;
