import React, { useState, useEffect } from "react";
import Addtask from "../Addtask/Addtask";
import TasksColumns from "../TasksColumn/TasksColumns";
import "./Task.css";
import { db } from "../../../firebase-config";
import { doc, onSnapshot } from "firebase/firestore";
import TaskShedule from "../TaskShedule/TaskShedule";
import Loading from "../Loading/Loading";
import { Cookies } from "react-cookie";
import { ToastContainer, toast } from "react-toastify";
import avatar from "../../assets/Images/avatar.jpg"
const Task = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [todos, setTodos] = useState([]);
  const cookies = new Cookies();
  const uidFromCookie = cookies.get("auth-token");
  const [username, setUsername] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [loadingTodoTasks, setLoadingTodoTasks] = useState(true);
  const [loadingOngoingTasks, setLoadingOngoingTasks] = useState(true);
  const [loadingDoneTasks, setLoadingDoneTasks] = useState(true);
  const [showAddTask, setShowAddTask] = useState(false);
  const [loadingDates, setLoadingDates] = useState(true);
  const handlesignout = () => {
    cookies.remove("auth-token");
    window.location.reload();
  };
  useEffect(() => {
    if (!uidFromCookie) {
      toast.error("UID is missing in the cookie.");
      return;
    }

    const userDocRef = doc(db, "users", uidFromCookie);

    const unsubscribe = onSnapshot(userDocRef, (doc) => {
      if (doc.exists()) {
        const userData = doc.data();
        const todosData = userData.todos || [];
        setUsername(userData.username);
        setPhotoUrl(userData.photourl);
        setTodos(todosData);
        setLoadingTodoTasks(false);
        setLoadingOngoingTasks(false);
        setLoadingDoneTasks(false);
        setIsLoading(false);
        setLoadingDates(false);
      } else {
        toast.error("User document does not exist");
      }
    });

    return () => unsubscribe();
  }, [uidFromCookie]);

  const uniqueDates = [...new Set(todos.map((todo) => todo.dueTime))].filter(
    Boolean
  );
  const todoTasks = todos.filter((todo) => todo.status === "todo");
  const ongoingTasks = todos.filter((todo) => todo.status === "ongoing");
  const doneTasks = todos.filter((todo) => todo.status === "done");

  const handleAddTaskClick = () => {
    setShowAddTask((prevState) => !prevState);
  };

  return (
    <div id="tasks">
      <div id="user-info">
        {isLoading ? (
          <div className="loading-container">
            <div className="loading-avatar"></div>
            <div className="loading-content">
              <div className="loading-title"></div>
              <div className="loading-subtitle"></div>
            </div>
          </div>
        ) : (
          <div id="user-info-text">
           <img src={photoUrl ? photoUrl : avatar} alt="User Avatar" />
            <div id="user-info-content">
              <h5>Welcome Back,</h5>
              <h3>{username}</h3>
            </div>
          </div>
        )}
        <div id="user-info-btn">
          <button id="addtaskbtn" onClick={handleAddTaskClick}>
            <i className="fa-solid fa-plus"></i>
            <span>Add Task</span>
          </button>
          <i
            className="fa-solid fa-arrow-right-from-bracket"
            onClick={handlesignout}
          ></i>
        </div>
      </div>
<div id="scroll-div">
<div id="dates">
        {loadingDates ? (
          <div
            className="loading-container"
            style={{
              width: "5%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div className="loading-avatar"></div>
          </div>
        ) : (
          <TaskShedule dates={uniqueDates} id="dates" />
        )}
      </div>

      <div id="taskscol-row">
        {loadingTodoTasks ? (
          <Loading id="taskcol" />
        ) : (
          <div className="col">
            <h1>To do 📋</h1>
            <TasksColumns
              title="To do"
              tasks={todoTasks}
              userid={uidFromCookie}
            />
          </div>
        )}

        {loadingOngoingTasks ? (
          <Loading />
        ) : (
          <div className="col">
            <h1>In Progress ⏳</h1>
            <TasksColumns
              title="Doing"
              tasks={ongoingTasks}
              userid={uidFromCookie}
            />
          </div>
        )}

        {loadingDoneTasks ? (
          <Loading />
        ) : (
          <div className="col">
            <h1>Done ✅</h1>
            <TasksColumns
              title="Done"
              tasks={doneTasks}
              userid={uidFromCookie}
            />
          </div>
        )}
      </div>
</div>

      {showAddTask && <Addtask userid={uidFromCookie} />}
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

export default Task;
