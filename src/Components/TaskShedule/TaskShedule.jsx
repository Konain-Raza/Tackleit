import React from "react";
import "./taskshedule.css";

const TaskDates = ({ dates }) => {
  console.log("Dates prop:", dates); // Add this line to log the dates prop

  if (!dates || dates.length === 0) {
    return <div>No dates available</div>;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const day = date.toLocaleDateString("en-US", {
      day: "numeric",
    });

    const month = date.toLocaleDateString("en-US", {
      month: "long",
    });

    const today = new Date().toISOString().split("T")[0];

    const formattedDate = date.toISOString().split("T")[0];

    return { day, month, isToday: today === formattedDate };
  };

  const uniqueDateParts = [...new Set(dates.map((date) => date.slice(0, 10)))];

  const today = new Date().toISOString().split("T")[0];
  const isTodayWithTask = dates.some((date) => date.slice(0, 10) === today);

  return (
    <div>
      {uniqueDateParts.map((date) => {
        const { day, month, isToday } = formatDate(date);
        return (
          <div
            key={date}
            className={`date-box ${isToday ? "isToday" : ""} ${
              isToday && isTodayWithTask ? "specificDateToday" : ""
            }`}
          >
            <p>{day}</p>
            <p>{month}</p>
          </div>
        );
      })}
    </div>
  );
};

export default TaskDates;
