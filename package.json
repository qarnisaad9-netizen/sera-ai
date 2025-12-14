import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { updateM5aznProducts } from "./scraper/m5azn-playwright.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("✅ SERA AI Backend is Running");
});

app.get("/best-products", async (req, res) => {
  const result = await updateM5aznProducts();
  res.json(result);
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});