// Define the structure for an item in the generation mix.
// This includes information about the fuel type, amount of generation,
// timestamp, and optionally the carbon intensity percentage.
export type GenerationMixItem = {
  fuel: string; // The type of fuel (e.g., wind, gas, coal).
  generation: string; // The generation value, typically in GW or MW.
  time: string; // The timestamp for when the generation data was recorded.
  carbonIntensityPercentage?: number; // Optional carbon intensity percentage.
};

// Define the structure for grid-related information.
// This includes various metrics about the grid such as price, demand, generation, etc.
export type GridInfo = {
  time: string; // The time when the data was recorded.
  price: string; // The current electricity price in £/MWh.
  emissions: string; // The emissions data (in g/kWh).
  demand: string; // The current electricity demand in GW.
  generation: string; // The total generation value in GW.
  transfers: string; // The net transfers via interconnectors in GW.
};

// Define the structure for a fuel source.
// This includes the fuel type, generation amount, and optionally the carbon intensity percentage.
export type FuelSource = {
  fuel: string; // The type of fuel (e.g., solar, hydro, nuclear).
  generation: string; // The amount of generation from this fuel source.
  carbonIntensityPercentage?: number; // Optional carbon intensity percentage.
};
