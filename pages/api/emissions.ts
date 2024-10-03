// pages/api/emissions.ts

import { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";
import { rateLimiter } from "../../utils/limiter";

/**
 * @constant EMISSIONS_URL
 * @description URL endpoint for the UK's Carbon Intensity API, which provides data on carbon emissions intensity.
 * This endpoint fetches data for specific dates related to the carbon intensity forecast and actual data.
 */
const EMISSIONS_URL = `https://api.carbonintensity.org.uk/intensity/date`;

/**
 * @interface EmissionsData
 * @description Defines the structure for the emissions data response from the Carbon Intensity API.
 * It includes the date range (from and to), forecast and actual intensity values, and an intensity index.
 */
interface EmissionsData {
  from: string;
  to: string;
  intensity: {
    forecast: number;
    actual?: number;
    index: string;
  };
}

/**
 * @interface CarbonIntensityAPIResponse
 * @description Defines the structure of the API response from the Carbon Intensity service.
 * The 'data' field contains an array of EmissionsData objects.
 */
interface CarbonIntensityAPIResponse {
  data: EmissionsData[];
}

/**
 * @function handler
 * @description Handles API requests made to the `/api/emissions` endpoint. It fetches carbon emissions intensity data
 * for the current day from the Carbon Intensity API, then sends this data back in JSON format. If an error occurs during
 * the data fetching process, it logs the error and returns a 500 status code with an error message.
 *
 * @param {NextApiRequest} req - The request object from Next.js API route.
 * @param {NextApiResponse} res - The response object for sending data back to the client.
 *
 * @returns {void} Responds with the carbon intensity data or an error if the fetch fails.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Apply the rate limiter middleware
  await new Promise((resolve, reject) => {
    rateLimiter(req as any, res as any, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      resolve(result);
    });
  });
  try {
    // Get the current date in 'YYYY-MM-DD' format to pass to the Carbon Intensity API
    const date = new Date().toISOString().split("T")[0];

    // Fetch the carbon emissions intensity data for the current date
    const response = await fetch(`${EMISSIONS_URL}/${date}`);

    // Parse the response into the CarbonIntensityAPIResponse structure
    const data = (await response.json()) as CarbonIntensityAPIResponse;

    // Check if the data object is missing or empty
    if (!data.data) {
      throw new Error("Missing emissions data");
    }

    // Return the emissions data back to the client
    res.status(200).json(data.data);
  } catch (error) {
    // Log any errors encountered during the fetch or parse operation
    console.error("Error fetching emissions data:", error);

    // Respond with a 500 error code and error message in case of failure
    res.status(500).json({ error: "Failed to fetch emissions data" });
  }
}
