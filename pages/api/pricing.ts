// pages/api/pricing.ts
import { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";
import { rateLimiter } from "../../utils/limiter";

/**
 * @constant {string} PRICING_URL
 * @description The URL for fetching market index pricing data from Elexon.
 * This API provides pricing data related to the UK electricity balancing market.
 */
const PRICING_URL = `https://data.elexon.co.uk/bmrs/api/v1/balancing/pricing/market-index`;

/**
 * @interface PricingData
 * @description Structure representing the pricing data fetched from the API.
 * Each entry includes a start time and the price of electricity.
 */
interface PricingData {
  startTime: string;
  price: number;
}

/**
 * @interface PricingAPIResponse
 * @description Structure of the API response from the pricing endpoint.
 * It contains an array of pricing data.
 */
interface PricingAPIResponse {
  data: PricingData[];
}

/**
 * @function handler
 * @description Handles API requests to the `/api/pricing` endpoint.
 * This function fetches market index pricing data from the Elexon API for the past 24 hours,
 * processes the response, and returns the data in JSON format.
 *
 * @param {NextApiRequest} req - The incoming API request object.
 * @param {NextApiResponse} res - The outgoing API response object.
 *
 * @returns {void} Responds with pricing data or an error message if the fetch fails.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Apply the rate limiter middleware
    await new Promise((resolve, reject) => {
      rateLimiter(req as any, res as any, (result: any) => {
        if (result instanceof Error) {
          return reject(result);
        }
        resolve(result);
      });
    });
    // Get the current date and time, and calculate the timestamp for 24 hours ago
    const now = new Date();
    const to = now.toISOString();
    const from = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(); // 24 hours ago

    // Fetch pricing data from the Elexon API
    const response = await fetch(
      `${PRICING_URL}?from=${from}&to=${to}&dataProviders=APXMIDP`
    );

    // Cast the response to the PricingAPIResponse type
    const data = (await response.json()) as PricingAPIResponse;

    // Check if the data exists, throw an error if missing
    if (!data.data) {
      throw new Error("Missing pricing data");
    }

    // Respond with the pricing data
    res.status(200).json(data.data);
  } catch (error) {
    // Log and respond with an error message if fetching data fails
    console.error("Error fetching pricing data:", error);
    res.status(500).json({ error: "Failed to fetch pricing data" });
  }
}
