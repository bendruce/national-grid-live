// pages/api/grid-info.ts
import { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";
import { rateLimiter } from "../../utils/limiter";

/**
 * @constant {string} API_URL
 * @description The Carbon Intensity API URL used to fetch current grid intensity data.
 * This URL provides access to real-time data on the UK's carbon intensity, including
 * electricity generation mix and carbon emissions.
 */
const API_URL = "https://api.carbonintensity.org.uk/intensity";

/**
 * @function handler
 * @description Handles requests to the `/api/grid-info` endpoint, fetching real-time grid data
 * from the Carbon Intensity API. This includes information on the UK's carbon intensity and
 * electricity generation. If the data fetch is successful, the data is returned in JSON format.
 * If an error occurs during the fetch, the handler responds with a 500 status code and an error message.
 *
 * @param {NextApiRequest} req - The incoming API request object.
 * @param {NextApiResponse} res - The outgoing API response object.
 *
 * @returns {void} Responds with grid data from the Carbon Intensity API or an error message.
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
    // Fetch carbon intensity and generation data from the API
    const response = await fetch(`${API_URL}`);

    // Parse the API response as JSON
    const data = await response.json();

    // Respond with the fetched data
    res.status(200).json(data);
  } catch (error) {
    // Log and handle any errors that occur during the fetch
    console.error("Error fetching data:", error);

    // Respond with a 500 status code and an error message
    res.status(500).json({ error: "Failed to fetch grid data" });
  }
}
