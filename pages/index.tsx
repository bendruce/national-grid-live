import React, { useEffect, useState } from "react";
import Head from "next/head"; // Import Head component for setting meta tags
import { getNextFiveMinuteMark } from "../utils/getNextFiveMinuteMark"; // Utility to round to the next 5-minute mark
import GitLogoLink from "../components/GitLogoLink"; // GitHub logo component with a link to the user's repository
import FuelList from "../components/FuelList"; // Component to list fuels and their corresponding data
import axios from "axios"; // Axios library for HTTP requests
import GridInfoComponent from "../components/GridInfoComponent"; // Component to display grid information like time, price, and emissions
import { roundToLastFiveMinuteMark } from "../utils/roundToLastFiveMinuteMark"; // Utility to round the time to the last 5-minute mark
import GenerationPieChart from "../components/GenerationPieChart"; // Component for displaying a generation pie chart
import DarkMode from "../components/DarkMode"; // Dark mode toggle button
import { GenerationMixItem, GridInfo } from "../types"; // Adjust the import path as needed
import PortfolioLink from "../components/PortfolioLink";

/**
 * @file This is the main page of the National Grid dashboard. It fetches live energy data from
 * an API and displays it, including grid info, fuel sources, and generation data in both
 * list and pie chart formats. The data includes live generation statistics (GW) for different fuel
 * types, current electricity prices, emissions data, and interconnector flows. The user can also
 * toggle between light and dark modes.
 */

/**
 * @typedef {Object} GenerationMixItem
 * @property {string} fuel - The type of fuel (e.g., wind, solar, gas).
 * @property {string} generation - The amount of electricity generated by the fuel in GW.
 * @property {string} time - The timestamp when the data was last updated.
 * @property {number} [carbonIntensityPercentage] - Optional field for the carbon intensity percentage of the fuel.
 */

/**
 * @typedef {Object} GridInfo
 * @property {string} time - The current time rounded to the last 5-minute mark.
 * @property {string} price - The current electricity price in £/MWh.
 * @property {string} emissions - The current grid emissions in g/kWh.
 * @property {string} demand - The total electricity demand in GW.
 * @property {string} generation - The total electricity generation in GW.
 * @property {string} transfers - The amount of electricity transferred via interconnectors in GW.
 */

/**
 * Home component that fetches live data from the energy API and renders the data in multiple formats:
 * - `GridInfo`: Displays live information like time, price, and emissions.
 * - `FuelList`: Lists the generation data for various fuel sources.
 * - `GenerationPieChart`: Shows the percentage breakdown of the electricity generation by fuel type.
 */
const Home: React.FC = () => {
  const [generationMix, setGenerationMix] = useState<GenerationMixItem[]>([]); // State to hold the generation mix data
  const [gridInfo, setGridInfo] = useState<GridInfo | null>(null); // State to hold grid information

  // Define fuel colors for the pie chart and other components
  const fuelColors: { [key: string]: string } = {
    coal: "bg-gray-800",
    gas: "bg-red-600",
    oil: "bg-yellow-600",
    wind: "bg-green-500",
    solar: "bg-yellow-300",
    hydro: "bg-blue-500",
    biomass: "bg-green-700",
    nuclear: "bg-purple-600",
    imports: "bg-pink-500",
    other: "bg-gray-400",
  };

  // Function to fetch the energy-related data using Axios
  const fetchData = async () => {
    try {
      // Fetch generation mix data
      const mixResponse = await axios.get("/api/energy-mix");
      setGenerationMix(mixResponse.data);

      // Fetch emissions data
      const emissionsResponse = await axios.get("/api/emissions");
      const emissionsData = emissionsResponse.data;

      // Fetch pricing data
      const pricingResponse = await axios.get("/api/pricing");
      const pricingData = pricingResponse.data;

      // Fetch demand data
      const demandResponse = await axios.get("/api/demand");
      const demandData = demandResponse.data;

      const latestDemandData = demandData.data; // Access the latest demand data
      const demand = parseFloat(latestDemandData.ND) || 0; // Calculate demand in GW

      // Handle interconnector flows (electricity imports/exports)
      const transfers = [
        latestDemandData.BRITNED_FLOW,
        latestDemandData.IFA_FLOW,
        latestDemandData.NEMO_FLOW,
        latestDemandData.ELECLINK_FLOW,
        latestDemandData.MOYLE_FLOW,
        latestDemandData.NSL_FLOW,
        latestDemandData.VIKING_FLOW,
      ]
        .map((flow) => parseFloat(flow) || 0)
        .reduce((acc, flow) => acc + flow, 0); // Sum the transfers in GW

      // Set the grid information with current time, price, emissions, and generation data
      setGridInfo({
        time: new Date().toLocaleTimeString(),
        price: pricingData?.[0]?.price || "N/A",
        emissions: emissionsData?.[0]?.intensity?.forecast || "N/A",
        demand: demand ? (demand / 1000).toFixed(2) : "N/A",
        generation: (demand / 1000 - transfers / 1000).toFixed(2), // Subtract transfers from demand to get generation
        transfers: transfers ? (transfers / 1000).toFixed(2) : "N/A",
      });
    } catch (error) {
      console.error("Error fetching data", error); // Log any errors that occur during data fetch
    }
  };

  // useEffect hook to fetch the data on initial render and set an interval to refresh the data every 5 minutes
  useEffect(() => {
    fetchData(); // Fetch data initially
    const initialDelay = getNextFiveMinuteMark(); // Get the next 5-minute mark
    const initialTimeout = setTimeout(() => {
      fetchData();
      const interval = setInterval(fetchData, 5 * 60 * 1000); // Fetch new data every 5 minutes
      return () => clearInterval(interval); // Clean up interval on component unmount
    }, initialDelay);

    return () => clearTimeout(initialTimeout); // Clean up initial timeout
  }, []);

  return (
    <>
      {/* Head component to set the page title and meta tags */}
      <Head>
        <title>National Grid - benwjd</title>
        <meta name="description" content="Live data from the National Grid" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Main container for the National Grid dashboard */}
      <div className=" min-h-[100vh] sm:h-[100vh] w-[100vw] p-4 2xl:px-24 grid grid-flow-row grid-col-1 sm:grid-cols-2 items-stretch gap-4  font-roboto overflow-y-scroll">
        {/* Header section with a Dark Mode toggle and GitHub link */}
        <h1 className="items-center justify-between flex flex-row text-2xl font-semibold col-span-full">
          <DarkMode /> Live: National Grid
          <div className="flex flex-row gap-2">
            <PortfolioLink /> <GitLogoLink />
          </div>
        </h1>

        {/* GridInfo component displaying time, price, and emissions */}
        <GridInfoComponent
          data={[
            {
              label: "Time",
              value: roundToLastFiveMinuteMark(new Date()), // Use the current time
            },
            { label: "Price", value: `£${gridInfo?.price}/MWh` },
            { label: "Emissions", value: `${gridInfo?.emissions}g/kWh` },
          ]}
        />

        {/* GridInfo component displaying demand, generation, and transfers */}
        <GridInfoComponent
          data={[
            { label: "Demand", value: `${gridInfo?.demand}GW` },
            { label: "Generation", value: `${gridInfo?.generation}GW` },
            { label: "Transfers", value: `${gridInfo?.transfers}GW` },
          ]}
        />

        {/* Fuel List and Generation Pie Chart */}
        <div className="flex flex-col gap-2 sm:gap-1 xl:gap-4 items-stretch">
          <FuelList
            title="Fossil Fuels"
            fuelTypes={["coal", "gas"]}
            generationMix={generationMix}
            fuelColors={fuelColors}
          />

          <FuelList
            title="Renewables"
            fuelTypes={["wind", "solar", "hydro"]}
            generationMix={generationMix}
            fuelColors={fuelColors}
          />

          <FuelList
            title="Other Sources"
            fuelTypes={["nuclear", "biomass", "imports", "other"]}
            generationMix={generationMix}
            fuelColors={fuelColors}
          />
        </div>

        {/* Generation Pie Chart to display fuel breakdown */}
        <GenerationPieChart
          generationMix={generationMix}
          generationInGW={gridInfo?.generation}
        />
      </div>
    </>
  );
};

export default Home;
