import rateLimit from "express-rate-limit";

/**
 * @description
 * This utility defines a rate limiter middleware using the `express-rate-limit` package.
 * The rate limiter is designed to restrict the number of requests an individual IP address can make
 * to the server within a specified time window. It helps prevent abuse, denial-of-service (DoS) attacks,
 * and excessive API calls, ensuring that the server's resources are not overwhelmed by too many requests
 * from a single client.
 *
 * This specific configuration allows up to 100 requests from an IP address in a 15-minute window.
 * After exceeding this limit, the server responds with a 429 status code and an error message,
 * asking the client to try again later.
 *
 * Usage: This rate limiter can be imported and applied to any Next.js API route to enforce request limits.
 *
 * @constant {rateLimit.Middleware} rateLimiter
 * @property {number} windowMs - The time window in milliseconds during which the requests are counted (15 minutes).
 * @property {number} max - The maximum number of requests allowed per IP in the specified time window (100 requests).
 * @property {string} message - The message sent to the client when the request limit is exceeded.
 */
export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window (expressed in milliseconds)
  max: 100, // Limit each IP to 100 requests per window (15 minutes)
  message: "Too many requests from this IP, please try again later.", // Error message returned when the rate limit is exceeded
});

/**
 * The rate limiter middleware can be applied to any API route in a Next.js application
 * by importing this file and using `rateLimiter` in the route handler. This ensures that
 * API routes are protected from excessive or malicious requests by limiting the number of
 * times a single client can call the API in a specific time frame.
 */
