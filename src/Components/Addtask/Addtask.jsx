import React from "react";
import "./Addtask.css";
import { updateDoc, arrayUnion, doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase-config";

const Addtask = () => {
  const handleAddTask = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const taskinput = data.get("taskinput").trim();
    const option = data.get("options");
    const taskformat = {
      task: taskinput,
      status: option,
    };
    e.target.reset();

    if (taskinput.length !== 0) {
      try {
        const userDocRef = doc(db, "users", "6nCvfdnCNZTAu6YEYnJ4DxOFzpP2");
        const userDocSnapshot = await getDoc(userDocRef);

        if (!userDocSnapshot.exists()) {
          console.error("User document does not exist");
          return;
        }

        const userData = userDocSnapshot.data();
        const todos = userData.todos || [];

        const taskAlreadyExists = todos.some((task) => task.task === taskinput);

        if (taskAlreadyExists) {
          console.log("Task already exists");
          return;
        }

        await updateDoc(userDocRef, {
          todos: arrayUnion(taskformat),
        });
        console.log("Todo added successfully");
      } catch (error) {
        console.error("Error adding todo: ", error);
      }
    } else {
      console.log("Cannot accept blank task");
      return;
    }
  };

  return (
    <div>
      <form action="submit" id="addTask" onSubmit={handleAddTask}>
        <input type="text" name="taskinput" />
        <div id="addTask-btn">
          <button type="submit">Add</button>
          <select name="options" id="select-status">
            <option value="todo">Todo</option>
            <option value="ongoing">Ongoing</option>
            <option value="done">Done</option>
          </select>
        </div>
      </form>
    </div>
  );
};

export default Addtask;
