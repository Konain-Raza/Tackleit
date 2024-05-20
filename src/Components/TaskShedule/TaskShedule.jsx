import React from "react";
import "./taskshedule.css";

const TaskDates = ({ dates }) => {
  // Function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const day = date.toLocaleDateString("en-US", {
      day: "numeric"
    });

    const month = date.toLocaleDateString("en-US", {
      month: "long"
    });

    // Get today's date
    const today = new Date().toISOString().split('T')[0];
    
    // Convert the given date to a comparable format
    const formattedDate = date.toISOString().split('T')[0];

    // Return the formatted day, month, and a boolean indicating if it is today
    return { day, month, isToday: today === formattedDate };
  };

  // Extract unique date parts
  const uniqueDateParts = [...new Set(dates.map(date => date.slice(0, 10)))];

  // Check if today's date has a task due
  const today = new Date().toISOString().split('T')[0];
  const isTodayWithTask = dates.some(date => date.slice(0, 10) === today);

  return (
    <>
      {uniqueDateParts.map((date) => {
        const { day, month, isToday } = formatDate(date);
        return (
          <div
            key={date}
            className={`date-box ${isToday ? "isToday" : ""} ${isToday && isTodayWithTask ? "specificDateToday" : ""}`}
          >
            <p>{day}</p>
            <p>{month}</p>
          </div>
        );
      })}
    </>
  );
};

export default TaskDates;
