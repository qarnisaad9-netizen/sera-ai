// ===============================
//      SERA AI BACKEND (NEW)
// ===============================

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import { updateM5aznProducts } from "./scraper/m5azn.js";
import { scrapeM5aznLinks } from "./scraper/m5azn-playwright.js";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ===============================
//        HOME ROUTE
// ===============================
app.get("/", (req, res) => {
  res.send("SERA AI Backend is Running 🔥");
});

// ===============================
//        AI ASK (Using fetch)
// ===============================
app.post("/ask", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage || userMessage.trim().length === 0) {
      return res.status(400).json({
        reply: "الرسالة المطلوبة فارغة.",
      });
    }

    const aiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "أنت مساعد ذكي من SERA AI." },
          { role: "user", content: userMessage },
        ],
      }),
    });

    const data = await aiResponse.json();
    const reply = data.choices?.[0]?.message?.content || "No reply";

    res.json({ reply });
  } catch (error) {
    console.error("Error in /ask:", error);
    res.status(500).json({
      reply: "حدث خطأ في الخادم.",
    });
  }
});

// ===============================
//  UPDATE M5AZN PRODUCTS ROUTE
// ===============================
app.get("/update-m5azn-products", async (req, res) => {
  try {
    const products = await updateM5aznProducts();

    fs.writeFileSync(
      "m5azn-products.json",
      JSON.stringify(products, null, 2),
      "utf8"
    );

    res.json({
      ok: true,
      count: products.length,
      message: "Products updated successfully",
    });
  } catch (error) {
    console.error("Scrape Error:", error);
    res.status(500).json({
      ok: false,
      error: error.message,
    });
  }
});
// ===============================
//   BEST M5AZN PRODUCTS (LINKS)
// ===============================
app.get("/best-products", async (req, res) => {
  try {
    const limit = Number(req.query.limit || 20);
    const products = await scrapeM5aznLinks(limit);

    res.json({
      ok: true,
      count: products.length,
      products
    });
  } catch (error) {
    console.error("Best Products Error:", error);
    res.status(500).json({
      ok: false,
      error: error.message,
    });
  }
});
// ===============================
//       START SERVER
// ===============================
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`SERA AI backend running on port ${PORT}`);
});