// pages/api/demand.ts

import { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";
import { parse } from "csv-parse/sync";
import { rateLimiter } from "../../utils/limiter";

/**
 * @constant DEMAND_URL
 * @description This is the URL of the CSV file containing demand data from the UK National Grid ESO.
 * The data includes key metrics such as embedded wind and solar generation.
 * The CSV file is fetched and parsed to extract the demand information.
 */
const DEMAND_URL =
  "https://data.nationalgrideso.com/backend/dataset/7a12172a-939c-404c-b581-a6128b74f588/resource/177f6fa4-ae49-4182-81ea-0c6b35f26ca6/download/demanddataupdate.csv";

/**
 * @function handler
 * @description This function handles API requests to the `/api/demand` endpoint.
 * It fetches the demand data from the National Grid ESO, parses the CSV file, and returns the latest demand record.
 *
 * The function uses the Next.js API handler to process the incoming HTTP request and sends back a JSON response.
 *
 * @param {NextApiRequest} req - The incoming API request object from Next.js.
 * @param {NextApiResponse} res - The response object to send data back to the client.
 *
 * @returns {void} Responds with the latest demand data record in JSON format or an error if fetching/parsing fails.
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
    // Fetch the CSV data from the provided demand URL
    const response = await fetch(DEMAND_URL);

    // Get the raw CSV text from the response
    const csvData = await response.text();

    // Parse the CSV data using the 'csv-parse/sync' library
    // The options specify that we expect columns with headers and we skip empty lines
    const records = parse(csvData, {
      columns: true,
      skip_empty_lines: true,
    });

    // Return the first record of parsed demand data as JSON
    res.status(200).json({ data: records[0] });
  } catch (error) {
    // Log any errors encountered during the fetch or parse operation
    console.error("Error fetching demand data:", error);

    // Send a 500 error response to the client if something goes wrong
    res.status(500).json({ error: "Failed to fetch demand data" });
  }
}
