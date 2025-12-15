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
const userMessage = (req.body.message || "")
  .toLowerCase()
  .replace(/\s+/g, " ")
  .trim();
    if (!userMessage) {
      return res.status(400).json({
        error: "Message is required"
      });
    }

app.post("/suggest", (req, res) => {
  try {
    const userMessage = (req.body.message || "")
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();

    if (!userMessage) {
      return res.json({
        message: "اكتب طلبك أولاً"
      });
    }

    let detectedCategory = null;
    let detectedSubCategory = null;

    // 🔍 البحث داخل كل الفئات والفئات الفرعية
    for (const categoryKey in storeCategories) {
      const category = storeCategories[categoryKey];

      for (const subKey in category.subcategories) {
        const sub = category.subcategories[subKey];

        if (sub.keywords.some(k => userMessage.includes(k))) {
          detectedCategory = category;
          detectedSubCategory = sub;
          break;
        }
      }

      if (detectedSubCategory) break;
    }

    if (!detectedSubCategory) {
      return res.json({
        message: "ما قدرت أحدد الفئة بدقة، جرّب صيغة مختلفة أو كلمة أوضح."
      });
    }

    // ✅ رد واضح للتاجر
    res.json({
      mainCategory: detectedCategory.label,
      subCategory: detectedSubCategory.label,
      note: "فئة مناسبة للبحث في المخازن الإلكترونية"
    });

  } catch (error) {
    res.status(500).json({
      error: "Server error",
      details: error.message
    });
  }
});
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