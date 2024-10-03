import React from "react";
import { FuelSource } from "../types";

/**
 * @file FuelList.tsx
 * @description This component displays a list of fuel types, their associated percentages, and color-coded indicators.
 * It receives a title, a list of fuel types, the full generation mix data, and a mapping of fuel types to specific colors.
 * The component filters the generation data based on the provided fuel types and shows the carbon intensity percentages
 * for each source in a clean and simple UI layout. The percentages are summed up and displayed as a total for the category.
 *
 * This component is designed for modularity, allowing various fuel categories (e.g., Fossil Fuels, Renewables) to be displayed
 * dynamically in the same format. Tailwind CSS classes are used for styling, and a gap between the items is managed for visual clarity.
 *
 * @param {string} title - The title of the fuel category (e.g., "Fossil Fuels", "Renewables").
 * @param {string[]} fuelTypes - An array of fuel types (e.g., ['coal', 'gas']) that should be displayed.
 * @param {FuelSource[]} generationMix - The full generation mix data containing all fuels and their carbon intensity percentages.
 * @param {Object} fuelColors - A mapping of fuel types to specific color codes for their corresponding visual indicators.
 *
 * @returns JSX element rendering a styled list of fuels and their carbon intensity percentages.
 *
 * @example
 * <FuelList
 *   title="Fossil Fuels"
 *   fuelTypes={['coal', 'gas']}
 *   generationMix={generationMix}
 *   fuelColors={fuelColors}
 * />
 *
 * This will render a section for fossil fuels, showing the total percentage for coal and gas, along with individual values.
 */

interface FuelListProps {
  title: string;
  fuelTypes: string[];
  generationMix: FuelSource[];
  fuelColors: { [key: string]: string };
}

const FuelList: React.FC<FuelListProps> = ({
  title,
  fuelTypes,
  generationMix,
  fuelColors,
}) => {
  return (
    <div className="flex flex-col gap-1 h-full">
      {/* Display the title and total percentage for the fuel category */}
      <h2 className="w-full flex flex-row justify-between items-end">
        <p className="font-semibold text-xl">{title}</p>
        <p className="text-medium-greyscale">
          {/* Sum the carbon intensity percentages for the provided fuel types */}
          {generationMix
            .filter((source) => fuelTypes.includes(source.fuel.toLowerCase()))
            .reduce(
              (sum, source) => sum + (source.carbonIntensityPercentage || 0),
              0
            )
            .toFixed(2)}
          %
        </p>
      </h2>

      {/* Display individual fuel types with their associated colors and percentages */}
      <div className="main-container gap-0 flex-col h-full">
        {generationMix
          .filter((source) => fuelTypes.includes(source.fuel.toLowerCase()))
          .map((source) => (
            <li key={source.fuel} className="flex flex-row justify-between">
              {/* Left side: Color indicator and fuel name */}
              <div className="flex flex-row gap-2 items-center">
                {/* Display a color indicator for each fuel type */}
                <div
                  className={`w-3 h-3 rounded-full ${
                    fuelColors[source.fuel.toLowerCase()] || "bg-gray-400"
                  }`}
                ></div>
                <p className="capitalize">
                  {/* Display the fuel type name */}
                  {source.fuel}
                </p>
              </div>

              {/* Right side: Carbon intensity percentage */}
              <p>
                {source.carbonIntensityPercentage || 0}
                <span className="text-medium-greyscale">%</span>
              </p>
            </li>
          ))}
      </div>
    </div>
  );
};

export default FuelList;
