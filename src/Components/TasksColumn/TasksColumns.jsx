import React from "react";
import TaskCard from "../TaskCard/TaskCard";
import "./taskscolumn.css";

const TasksCard = (props) => {
  // Sort tasks by due time in ascending order
  const sortedTasks = [...props.tasks].sort((a, b) => {
    if (a.dueTime && b.dueTime) {
      return new Date(a.dueTime) - new Date(b.dueTime);
    } else if (a.dueTime) {
      return -1;
    } else if (b.dueTime) {
      return 1;
    } else {
      return 0;
    }
  });


  return (
    <div id="taskcol">
      {sortedTasks.map((task, index) => (
        <TaskCard
          key={index}
          title={props.title}
          task={task}
          alltodos={[props]}
          index={index}
          userid={props.userid}
        />
      ))}
    </div>
  );
};

export default TasksCard;
