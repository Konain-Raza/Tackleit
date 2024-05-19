import React, { useState, useEffect } from "react";

import Tasks from "../Tasks/Task";

const Authentication = () => {
  const [isUser, setUser] = useState(false); // State to track if user is authenticated

  useEffect(() => {
    // Function to handle authentication redirect result
    const handleRedirectResult = async () => {
 
    };

    handleRedirectResult(); // Call function to handle redirect result
  }, []); // Empty dependency array ensures this effect runs only once on component mount

  // Function to handle authentication


  return (
    <div>
      {isUser && <Tasks />} {/* Render Tasks component if user is authenticated */}

  
    </div>
  );
};

export default Authentication;
