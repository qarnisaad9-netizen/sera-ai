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
// SUGGEST (BASED ON SALLA CATEGORIES)
// ===============================
app.post("/suggest", async (req, res) => {
  try {
    const userMessage = (req.body.message || "").toLowerCase();

    if (!userMessage) {
      return res.status(400).json({
        error: "Message is required"
      });
    }

    // 🔍 Match user message with store categories
    let matchedCategory = null;

    for (const category of storeCategories) {
      if (category.keywords.some(keyword => userMessage.includes(keyword))) {
        matchedCategory = category;
        break;
      }
    }

    if (!matchedCategory) {
      return res.json({
        message: "ما قدرت أحدد الفئة بدقة",
        hint: "مثال: أبغى شي لحب الشباب أو للبشرة الجافة"
      });
    }

    res.json({
      storeCategory: matchedCategory.storePath,
      bestSellingUrl: matchedCategory.m5aznBestSelling
    });

  } catch (error) {
    res.status(500).json({
      error: "Server error",
      details: error.message
    });
  }
});

// ===============================
app.listen(PORT, () => {
  console.log(`SERA AI running on port ${PORT}`);
});
