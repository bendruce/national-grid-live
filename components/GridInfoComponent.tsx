import React from "react";

/**
 * @file GridInfoComponent.tsx
 * @description This file defines a reusable `GridInfoComponent` component that displays a series of label-value pairs
 * in a flexbox layout. It is a simple layout component, ideal for showing grid information such as energy metrics,
 * pricing, or other statistics. The data is passed as props in the form of an array of objects, each containing
 * a label and its associated value.
 *
 * This component is designed to be flexible and can be reused across different contexts where label-value pairs
 * need to be displayed. The layout is styled using Tailwind CSS classes for responsiveness and structure.
 *
 * @param {GridInfoProps} props - The component accepts an array of objects, where each object contains:
 * - `label`: A string representing the label to be displayed.
 * - `value`: A string representing the corresponding value for the label.
 *
 * @returns A JSX element rendering the grid information.
 *
 * @example
 * <GridInfoComponent
 *   data={[
 *     { label: "Time", value: "12:00" },
 *     { label: "Price", value: "£50/MWh" },
 *     { label: "Emissions", value: "150g/kWh" }
 *   ]}
 * />
 */

interface GridInfoProps {
  data: { label: string; value: string }[]; // Takes an array of label-value pairs
}

const GridInfoComponent: React.FC<GridInfoProps> = ({ data }) => {
  console.log(data);
  return (
    <div className="main-container justify-center w-full">
      {/* Flex container for displaying the label-value pairs */}
      <div className="flex flex-row justify-between gap-4 w-full">
        {/* Iterate over the data array and display each label-value pair */}
        {data.map((item, index) => (
          <div className="flex flex-col items-center" key={index}>
            <strong>{item.label}</strong> {/* Display the label in bold */}
            {item.value.includes("undefined") ? "fetching..." : item.value}{" "}
            {/* Display the corresponding value */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GridInfoComponent;
