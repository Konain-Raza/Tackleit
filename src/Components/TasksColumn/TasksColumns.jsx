import React from "react";
import TaskCard from "../TaskCard/TaskCard";
import "./taskscolumn.css";

const TasksCard = (props) => {

  return (
    <div id="taskcol">
      {[...props.tasks].reverse().map((task, index) => (
        <TaskCard key={index} title={props.title} task={task} alltodos={[props]} index={index} />
      ))}
    </div>
  );
};

export default TasksCard;
