import React, { useState, useEffect } from "react";
import Addtask from "../Addtask/Addtask";
import TasksColumns from "../TasksColumn/TasksColumns";
import "./Task.css";
import { db } from "../../../firebase-config";
import { doc, onSnapshot } from "firebase/firestore";
const Task = (props) => {
  const [todos, setTodos] = useState([]);
console.log(props.authUser);
  useEffect(() => {
    const userId = "6nCvfdnCNZTAu6YEYnJ4DxOFzpP2";
    const userDocRef = doc(db, "users", userId);

    const unsubscribe = onSnapshot(userDocRef, (doc) => {
      if (doc.exists()) {
        const userData = doc.data();
        const todosData = userData.todos || [];
        setTodos(todosData);
      } else {
        console.log("User document does not exist");
      }
    });

    return () => unsubscribe();
  }, []);
  const todoTasks = todos.filter((todo) => todo.status === "todo");
  const ongoingTasks = todos.filter((todo) => todo.status === "ongoing");
  const doneTasks = todos.filter((todo) => todo.status === "done");
  return (
    <div id="tasks">
      <header>
        <Addtask />
      </header>
      <div id="taskscol-row">
        <TasksColumns title="To do" tasks={todoTasks} />
        <TasksColumns title="Doing" tasks={ongoingTasks} />
        <TasksColumns title="Done" tasks={doneTasks} />
      </div>
    </div>
  );
};

export default Task;
