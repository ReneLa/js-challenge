import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import client from "prom-client";

import { errorHandler } from "./middlewares/error-handler.js";
import usersRouter from "./routes/users.js";
import { initializeKeys } from "./utils/user-signing.js";
import { setupSwagger } from "./swagger.js";

dotenv.config();

initializeKeys();

const PORT = process.env.PORT || 4000;
const app = express();

setupSwagger(app);

// Create a Registry
const register = new client.Registry();

// Default Metrics (CPU, Memory, Event Loop Lag)
client.collectDefaultMetrics({ register });

const httpRequestDurationMicroseconds = new client.Histogram({
  name: "http_request_duration_ms",
  help: "Duration of HTTP requests in ms",
  labelNames: ["method", "route", "code"],
  buckets: [50, 100, 200, 300, 400, 500, 1000] // buckets for response time
});
register.registerMetric(httpRequestDurationMicroseconds);

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API server is running. Visit /docs for API documentation.");
});

// /metrics endpoint
app.get("/metrics", async (req, res) => {
  res.setHeader("Content-Type", register.contentType);
  res.send(await register.metrics());
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.use("/users", usersRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API Documentation: http://localhost:${PORT}/docs`);
});
