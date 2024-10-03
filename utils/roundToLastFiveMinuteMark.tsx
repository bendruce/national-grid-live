/**
 * @function roundToLastFiveMinuteMark
 * @description This utility function rounds a given date/time to the nearest previous five-minute mark.
 * It takes the provided `Date` object, rounds down the minutes to the closest multiple of five, and
 * returns the time in a simplified "HH:MM" format.
 *
 * @param {Date} time - The Date object representing the time you want to round down.
 * @returns {string} A string representing the rounded time in "HH:MM" format.
 */
export const roundToLastFiveMinuteMark = (time: Date): string => {
  // Create a new Date object from the provided time to avoid modifying the original object
  const date = new Date(time);

  // Get the current minutes from the Date object
  const minutes = date.getMinutes();

  // Round down the minutes to the nearest 5-minute interval
  const roundedMinutes = Math.floor(minutes / 5) * 5;

  // Set the rounded minutes on the Date object
  date.setMinutes(roundedMinutes);

  // Reset seconds and milliseconds to 0 for cleaner output
  date.setSeconds(0);
  date.setMilliseconds(0);

  // Return the time in "HH:MM" format using slice to extract the first 5 characters
  return date.toTimeString().slice(0, 5);
};
