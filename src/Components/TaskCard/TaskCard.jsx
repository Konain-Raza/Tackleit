import React from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase-config";
import "./taskcard.css";

const TaskCard = ({ title, task }) => {
  const handleTaskCompletion = async () => {
    try {
      const userDocRef = doc(db, "users", "6nCvfdnCNZTAu6YEYnJ4DxOFzpP2");
      const userDocSnapshot = await getDoc(userDocRef);
      
      if (!userDocSnapshot.exists()) {
        console.error("User document does not exist");
        return;
      }
      
      const todos = userDocSnapshot.data().todos || [];
      const taskIndex = todos.findIndex(t => t.task === task.task);

      if (taskIndex === -1){
        console.error(`Task with content "${task.task}" either not found or already marked as "done"`);
        return;
      } 
        if(todos[taskIndex].status === "done") {
        console.error(`Task with content "${task.task}" either not found or already marked as "done"`);
        return;
      }


      todos[taskIndex].status = "done";
      
      await updateDoc(userDocRef, { todos });

      console.log(`Task marked as "done" successfully`,taskIndex);
    } catch (error) {
      console.error("Error updating todo: ", error);
    }
  };

  return (
    <div id="taskcard" onClick={handleTaskCompletion}>
      <div id="task-content">
        <h3>{title}</h3>
        <p>{task.task}</p>
      </div>
      <button className="starttask-btn">Start</button>
    </div>
  );
};

export default TaskCard;
