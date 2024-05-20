import React, { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase-config";
import dlticon from "../../assets/Images/dlt-icon.gif";
import "./taskcard.css";
import { ToastContainer, toast } from "react-toastify";


const TaskCard = ({ title, task, userid }) => {
  const [isTimeUp, setIsTimeUp] = useState(false);

  useEffect(() => {
    const checkTime = () => {
      if (task.dueTime) {
        const currentTime = new Date();
        const dueTime = new Date(task.dueTime);

        setIsTimeUp(currentTime > dueTime);
      }
    };

    checkTime();

    const timer = setInterval(checkTime, 60000); // Check every minute
    return () => clearInterval(timer);
  }, [task.dueTime]);

  const handleTaskCompletion = async () => {
    try {
      const userDocRef = doc(db, "users", userid);
      const userDocSnapshot = await getDoc(userDocRef);

      if (!userDocSnapshot.exists()) {
        toast.error("User document does not exist");
        return;
      }

      const todos = userDocSnapshot.data().todos || [];
      const taskIndex = todos.findIndex((t) => t.task === task.task);

      if (taskIndex === -1 || todos[taskIndex].status === "done") {
        toast.error(`Task with content "${task.task}" either not found or already marked as "done"`);
        return;
      }

      todos[taskIndex].status = "done";

      await updateDoc(userDocRef, { todos });

    } catch (error) {
      toast.error("Error updating todo: ", error);
    }
  };

  const handleTaskStart = async () => {
    try {
      const userDocRef = doc(db, "users", userid);
      const userDocSnapshot = await getDoc(userDocRef);

      if (!userDocSnapshot.exists()) {
        toast.error("User document does not exist");
        return;
      }

      const todos = userDocSnapshot.data().todos || [];
      const taskIndex = todos.findIndex((t) => t.task === task.task);

      if (taskIndex === -1 || todos[taskIndex].status === "ongoing") {
        toast.error(`Task with content "${task.task}" either not found or already marked as "ongoing"`);
        return;
      }

      todos[taskIndex].status = "ongoing";

      await updateDoc(userDocRef, { todos });

      toast.success(`Task marked as "in progress" successfully`, taskIndex);
    } catch (error) {
      toast.error("Error updating todo: ", error);
    }
  };

  const handleTaskDelete = async () => {
    try {
      const userDocRef = doc(db, "users", userid);
      const userDocSnapshot = await getDoc(userDocRef);

      if (!userDocSnapshot.exists()) {
        toast.error("User document does not exist");
        return;
      }

      const todos = userDocSnapshot.data().todos || [];
      const newTodos = todos.filter((t) => t.task !== task.task);

      await updateDoc(userDocRef, { todos: newTodos });

      toast.success(`Task deleted successfully`, task.task);
    } catch (error) {
      toast.error("Error deleting todo: ", error);
    }
  };

  return (
    <div id="taskcard" style={{ backgroundColor: isTimeUp ? "red" : "white", color: isTimeUp ? "white" : "black" }}>

      <div id="task-card-text">
        <h5>{task.task}</h5>
      </div>
      <div id="task-card-btns">
        {task.dueTime && (
          <p id="duedate">
            Due:{" "}
            {new Date(task.dueTime).toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
              hour: "numeric",
              minute: "numeric",
              hour12: true, 
              
            })}
          </p>
        )}
        <div id="btns-box">
          {task.status !== "ongoing" && task.status !== "done" && (
            <button className="btns" onClick={handleTaskStart}>
              <i className="fa-solid fa-play"></i>
            </button>
          )}
          {task.status !== "done" && (
            <button className="btns" onClick={handleTaskCompletion}>
              <i className="fa-regular fa-circle-check"></i>
            </button>
          )}
          <button className="btns" onClick={handleTaskDelete}>
            <i className="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </div>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default TaskCard;
