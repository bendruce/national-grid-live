/**
 * @function getNextFiveMinuteMark
 * @description This utility function calculates the time remaining until the next five-minute mark.
 * It adjusts the current time to the nearest future multiple of five minutes and returns the difference
 * between the adjusted time and the current time in milliseconds.
 *
 * @returns {number} The number of milliseconds until the next five-minute mark.
 */
export const getNextFiveMinuteMark = () => {
  // Create a new Date object representing the current date and time
  const now = new Date();

  // Get the current minutes from the Date object
  const minutes = now.getMinutes();

  // Calculate how many minutes are left until the next multiple of 5
  const remaining = 5 - (minutes % 5);

  // Adjust the Date object by adding the remaining minutes and resetting seconds and milliseconds to 0
  now.setMinutes(minutes + remaining, 0, 0);

  // Return the difference between the adjusted time and the current time in milliseconds
  return now.getTime() - Date.now();
};
