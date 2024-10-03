import React, { useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";

// Register Chart.js components
Chart.register(ArcElement, Tooltip, Legend);

/**
 * @interface FuelSource
 * @description Interface that represents the structure of a fuel source with an optional carbon intensity percentage.
 * This is used to describe the fuel types and their respective contribution to the energy generation mix.
 */
interface FuelSource {
  fuel: string;
  carbonIntensityPercentage?: number;
}

/**
 * @interface GenerationPieChartProps
 * @description This interface defines the props for the `GenerationPieChart` component.
 * It accepts an array of fuel sources and an optional generation value in GW.
 */
interface GenerationPieChartProps {
  generationMix: FuelSource[];
  generationInGW?: string;
}

/**
 * @function GenerationPieChart
 * @description This component renders a doughnut chart showing the energy generation breakdown by fuel type
 * and another ring grouping fuels into broader categories such as Renewables, Fossil Fuels, and Other Sources.
 * It includes dynamic hover effects that display the selected fuel type or aggregate label in the center of the chart.
 *
 * The component uses `chart.js` for creating the doughnut chart and manages label updates on hover via React state.
 *
 * @param {FuelSource[]} generationMix - An array of fuel sources with their respective percentages.
 * @param {string} generationInGW - Optional string representing the total generation in gigawatts (GW).
 *
 * @returns {React.FC} The `GenerationPieChart` React component.
 *
 * @example
 * <GenerationPieChart generationMix={generationMix} generationInGW="10.5" />
 */
const GenerationPieChart: React.FC<GenerationPieChartProps> = ({
  generationMix,
  generationInGW,
}) => {
  // Define colors for each fuel type and the aggregate categories
  const fuelColors: { [key: string]: string } = {
    coal: "#2d3748",
    gas: "#e53e3e",
    oil: "#d69e2e",
    wind: "#48bb78",
    solar: "#faf089",
    hydro: "#4299e1",
    biomass: "#2f855a",
    nuclear: "#805ad5",
    imports: "#ed64a6",
    other: "#a0aec0",
    renewables: "#4CAF50",
    "fossil fuels": "#F44336",
    "other sources": "#9E9E9E",
  };

  const [label, setLabel] = useState("Generation"); // Manages the label displayed in the center of the chart
  const [percentage, setPercentage] = useState(generationInGW); // Manages the percentage/value displayed under the label

  // Calculate data for the individual fuel sources ring
  const fuelLabels = generationMix.map((fuel) => fuel.fuel); // Fuel types labels
  const fuelData = generationMix.map((fuel) =>
    parseFloat(fuel.carbonIntensityPercentage?.toString() || "0")
  ); // Percentages for each fuel
  const fuelColorsList = generationMix.map((fuel) => fuelColors[fuel.fuel]); // Colors for each fuel

  // Calculate the grouped data for Renewables, Fossil Fuels, and Other Sources
  const renewables = generationMix
    .filter((fuel) => ["wind", "solar", "hydro"].includes(fuel.fuel))
    .reduce(
      (acc, fuel) =>
        acc + parseFloat(fuel.carbonIntensityPercentage?.toString() || "0"),
      0
    );

  const fossilFuels = generationMix
    .filter((fuel) => ["coal", "gas", "oil"].includes(fuel.fuel))
    .reduce(
      (acc, fuel) =>
        acc + parseFloat(fuel.carbonIntensityPercentage?.toString() || "0"),
      0
    );

  const others = generationMix
    .filter(
      (fuel) =>
        !["wind", "solar", "hydro", "coal", "gas", "oil"].includes(fuel.fuel)
    )
    .reduce(
      (acc, fuel) =>
        acc + parseFloat(fuel.carbonIntensityPercentage?.toString() || "0"),
      0
    );

  // Data for the outer (aggregate) ring
  const aggregateData = [renewables, fossilFuels, others];
  const aggregateLabels = ["Renewables", "Fossil Fuels", "Other Sources"];
  const aggregateColors = ["#4CAF50", "#F44336", "#9E9E9E"];

  // Chart.js data object defining the structure of the doughnut chart
  const chartData = {
    datasets: [
      {
        label: "Generation %",
        data: fuelData, // Fuel-specific data
        backgroundColor: fuelColorsList,
        hoverOffset: 4,
        borderWidth: 0,
        cutout: "70%", // Larger cutout for the inner ring
      },
      {
        label: "Generation %",
        data: aggregateData, // Grouped data for Renewables, Fossil Fuels, and Others
        backgroundColor: aggregateColors,
        hoverOffset: 4,
        borderWidth: 0,
        cutout: "60%", // Smaller cutout for the outer ring
      },
    ],
  };

  // Chart.js options object, disabling animations and tooltips, and customizing hover effects
  const chartOptions = {
    responsive: true,
    animations: false,
    plugins: {
      legend: {
        display: false, // Disable the legend to avoid clutter
      },
      tooltip: {
        enabled: false, // Disable tooltips to use custom hover effects
      },
    },
    events: ["mousemove", "mouseout", "click"] as const, // Define valid event types
    onHover: (event: any, chartElement: any[]) => {
      if (chartElement.length) {
        const index = chartElement[0].index; // Get the hovered index
        const datasetIndex = chartElement[0].datasetIndex; // Identify whether it's the inner or outer ring

        if (datasetIndex === 0) {
          // Update the label and percentage for individual fuel sources
          setLabel(fuelLabels[index]);
          setPercentage(`${fuelData[index]}%`);
        } else {
          // Update the label and percentage for aggregate categories
          setLabel(aggregateLabels[index]);
          setPercentage(`${aggregateData[index]}%`);
        }
      } else {
        // Reset to default label and value
        setLabel("Generation");
        setPercentage(generationInGW);
      }
    },
  };

  return (
    <div className="flex flex-col gap-1">
      <h2 className="w-full flex flex-row justify-between items-end">
        <p className="font-semibold text-xl">Generation</p>
      </h2>
      <div className="main-container relative flex lg:px-24 h-full items-center justify-center">
        {/* Central label showing the current fuel type or category */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center">
          <p className="font-semibold text-lg capitalize">{label}</p>
          <div
            className="w-full h-1 bg-black rounded"
            style={{
              backgroundColor:
                label === "Generation"
                  ? "#000"
                  : fuelColors[label.toLowerCase()],
            }}
          ></div>
          <p className="font-semibold text-xl">
            {label === "Generation"
              ? `${percentage ? percentage : "--"}GW`
              : `${percentage}`}
          </p>
        </div>
        {/* Render the Doughnut chart */}
        <Doughnut data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default GenerationPieChart;
