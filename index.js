import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { scrapeM5aznProducts } from "./scraper/m5azn-playwright.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;

/* ===============================
   HOME
================================ */
app.get("/", (req, res) => {
  res.send("SERA AI Backend is running 🚀");
});

/* ===============================
   TEST PLAYWRIGHT
================================ */
app.get("/best-products", async (req, res) => {
  const result = await scrapeM5aznProducts();
  res.json(result);
});

/* ===============================
   START SERVER
================================ */
app.listen(PORT, () => {
  console.log(`SERA AI backend running on port ${PORT}`);
});