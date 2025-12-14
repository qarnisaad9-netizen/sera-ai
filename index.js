import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import { SKIN_CONCERNS } from "./config/skinConcerns.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ===============================
// ROOT
// ===============================
app.get("/", (req, res) => {
  res.send("SERA AI Backend is running ✅");
});

// ===============================
// SUGGEST PRODUCTS
// ===============================
app.post("/suggest", async (req, res) => {
  try {
    const { concern } = req.body;

    if (!concern) {
      return res.status(400).json({ error: "Concern is required" });
    }

    const rule = SKIN_CONCERNS[concern];
    if (!rule) {
      return res.status(400).json({ error: "Concern not supported" });
    }

    const url = `https://m5azn.com${rule.path}?sort=best_selling`;

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    const html = await response.text();

    // استخراج أسماء وروابط المنتجات (خفيف)
    const matches = [
      ...html.matchAll(/href="([^"]+)"[^>]*class="product-name[^"]*"[^>]*>([^<]+)</g)
    ];

    const products = matches
      .slice(0, 20)
      .map(m => {
        const link = m[1];
        const name = m[2].trim();

        const brand =
          rule.brands.find(b =>
            name.toLowerCase().includes(b.toLowerCase())
          ) || "Other";

        const type =
          rule.types.find(t =>
            name.toLowerCase().includes(t)
          ) || "other";

        return { name, brand, type, link };
      })
      .filter(p => rule.brands.includes(p.brand))
      .filter(p => rule.types.includes(p.type))
      .slice(0, 8);

    res.json({
      concern: rule.ar,
      count: products.length,
      products
    });

  } catch (error) {
    res.status(500).json({
      error: "Internal server error",
      details: error.message
    });
  }
});

// ===============================
app.listen(PORT, () => {
  console.log(`SERA AI running on port ${PORT}`);
});