import React from "react";
import "./taskshedule.css";

const TaskDates = ({ dates }) => {
  if (!dates || dates.length === 0) {
    return <div>No dates available</div>;
  }

  const isValidDate = (dateString) => {
    const date = new Date(dateString);
    return !isNaN(date);
  };

  const formatDate = (dateString) => {
    if (!isValidDate(dateString)) {
      console.error('Invalid date:', dateString);
      return { day: 'Invalid', month: 'Date', isToday: false };
    }

    const date = new Date(dateString);
    const day = date.toLocaleDateString("en-US", { day: "numeric" });
    const month = date.toLocaleDateString("en-US", { month: "long" });
    const today = new Date().toISOString().split("T")[0];
    const formattedDate = date.toISOString().split("T")[0];

    return { day, month, isToday: today === formattedDate };
  };

  const uniqueDateParts = [...new Set(dates.map((date) => {
    if (typeof date !== 'string') {
      date = date.toString();
    }
    return date.slice(0, 10);
  }))];

  const today = new Date().toISOString().split("T")[0];
  const isTodayWithTask = dates.some((date) => {
    if (typeof date !== 'string') {
      date = date.toString();
    }
    return date.slice(0, 10) === today;
  });

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
