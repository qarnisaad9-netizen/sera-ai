import express from "express";
import cors from "cors";

import { storeCategories } from "./config/storeCategories.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ===============================
// ROOT
// ===============================
app.get("/", (req, res) => {
  res.send("SERA AI Backend is running 🔥");
});

// ===============================
// SMART SUGGEST (SAFE SEARCH + BRANDS)
// ===============================
app.post("/suggest", (req, res) => {
  try {
    const userMessage = (req.body.message || "").toLowerCase();

    if (!userMessage) {
      return res.status(400).json({
        error: "Message is required"
      });
    }

    let matchedCategory = null;

    for (const category of storeCategories) {
      if (category.keywords.some(k => userMessage.includes(k))) {
        matchedCategory = category;
        break;
      }
    }

    if (!matchedCategory) {
      return res.json({
        message: "ما قدرت أحدد الفئة بدقة",
        hint: "مثال: أبغى شي لحب الشباب أو للتصبغات"
      });
    }

    const searchUrl = `https://m5azn.sa/search?query=${encodeURIComponent(
      matchedCategory.searchQuery
    )}`;

    res.json({
      storeCategory: matchedCategory.storePath,
      searchUrl,
      recommendedBrands: matchedCategory.recommendedBrands
    });

  } catch (err) {
    res.status(500).json({
      error: "Server error",
      details: err.message
    });
  }
});

// ===============================
app.listen(PORT, () => {
  console.log(`SERA AI running on port ${PORT}`);
});