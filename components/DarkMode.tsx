import React, { useState, useEffect } from "react";

/**
 * @file DarkMode.tsx
 * @description This component provides a button to toggle between dark mode and light mode for the entire application.
 * It uses the `useState` and `useEffect` hooks to manage and apply the dark mode state.
 * When toggled, the `dark` class is added or removed from the body element to enable or disable dark mode styling.
 * The button also updates its SVG fill color dynamically based on the current mode (black for light mode and white for dark mode).
 *
 * The component is minimal in its structure and does not handle any persistent dark mode state (such as saving in localStorage).
 * It strictly toggles the mode for the current session.
 *
 * @component
 * @example
 * <DarkMode />
 *
 * This will render a button that allows the user to toggle between dark and light mode.
 */

const DarkMode: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false); // State to manage dark mode

  // Effect to toggle the "dark" class on the body element based on the dark mode state
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark"); // Enable dark mode by adding the class
    } else {
      document.body.classList.remove("dark"); // Disable dark mode by removing the class
    }
  }, [isDarkMode]);

  // Function to toggle the dark mode state when the button is clicked
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode); // Flip the dark mode state
  };

  return (
    <button onClick={toggleDarkMode}>
      {/* SVG icon for the dark mode button, changing fill based on mode */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`w-6 h-6 ${isDarkMode ? "fill-white" : "fill-black"}`}
        viewBox="0 -960 960 960"
      >
        <path d="M480-120q-150 0-255-105T120-480q0-150 105-255t255-105q14 0 27.5 1t26.5 3q-41 29-65.5 75.5T444-660q0 90 63 153t153 63q55 0 101-24.5t75-65.5q2 13 3 26.5t1 27.5q0 150-105 255T480-120zm0-80q88 0 158-48.5T740-375q-20 5-40 8t-40 3q-123 0-209.5-86.5T364-660q0-20 3-40t8-40q-78 32-126.5 102T200-480q0 116 82 198t198 82zm-10-270z"></path>
      </svg>
    </button>
  );
};

export default DarkMode;
