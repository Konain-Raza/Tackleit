import React, { useState } from "react";
import "./Addtask.css";
import { updateDoc, arrayUnion, doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase-config";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "universal-cookie";
const Addtask = (props) => {
  const [userid, setuseruid] = useState(props.userid);
  const cookies = new Cookies();
  const uidFromCookie = cookies.get("auth-token");
  const handleAddTask = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const taskinput = data.get("taskinput").trim();
    const option = data.get("options");
    const dueTime = data.get("dueTime");

    const taskformat = {
      task: taskinput,
      status: option,
      dueTime: dueTime ? new Date(dueTime).toISOString() : null,
    };
    e.target.reset();

    if (taskinput.length !== 0) {
      try {
        const userDocRef = doc(db, "users", uidFromCookie);
        const userDocSnapshot = await getDoc(userDocRef);

        if (!userDocSnapshot.exists()) {
          toast.error("User document does not exist");
          return;
        }

        const userData = userDocSnapshot.data();
        const todos = userData.todos || [];

        // Check if the task already exists in the todos array
        const taskAlreadyExists = todos.some((task) => task.task === taskinput);

        if (taskAlreadyExists) {
          toast.error("Task already exists");
          return;
        }

        // Check if the due time is before today
        if (dueTime) {
          const dueDate = new Date(dueTime);
          const today = new Date();
          today.setHours(0, 0, 0, 0); // Set the time to the start of the day

          if (dueDate < today) {
            toast.error("The due date is in the past.");
          }
        }

        await updateDoc(userDocRef, {
          todos: arrayUnion(taskformat),
        });
        toast.success("Todo added successfully");
      } catch (error) {
        toast.error(`Error adding todo: ${error.message}`);
      }
    } else {
      toast.error("Cannot accept blank task");
      return;
    }
  };

  return (
    <div>
      <form id="addTask" onSubmit={handleAddTask}>
        <input type="text" name="taskinput" placeholder="Enter your task" />
        <input type="datetime-local" name="dueTime" placeholder="Set due time" />
        <div id="addTask-btn">
          <select name="options" id="select-status">
            <option value="todo">Todo</option>
            <option value="ongoing">Ongoing</option>
            <option value="done">Done</option>
          </select>
          <button type="submit">Add</button>
        </div>
      </form>
      {/* <ToastContainer
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
      /> */}
    </div>
  );
};

export default Addtask;
