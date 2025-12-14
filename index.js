import express from "express";
import cors from "cors";

import { skinConcerns } from "./config/skinConcerns.js";
import { nameDictionary } from "./config/nameDictionary.js";
import { m5aznLinks } from "./config/m5aznLinks.js";

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
// SUGGEST PRODUCTS
// ===============================
app.post("/suggest", async (req, res) => {
  try {
    const userMessage = (req.body.message || "").toLowerCase();

    if (!userMessage) {
      return res.status(400).json({ error: "Message is required" });
    }

    // 1️⃣ Detect skin concern
    let detectedConcern = null;

    for (const key in skinConcerns) {
      const { keywords } = skinConcerns[key];
      if (keywords.some(k => userMessage.includes(k))) {
        detectedConcern = key;
        break;
      }
    }

    if (!detectedConcern) {
      return res.json({
        message: "ما قدرت أحدد المشكلة بدقة، جرّب توضح أكثر."
      });
    }

    // 2️⃣ Detect product type (optional)
    let detectedProductType = null;

    for (const type in nameDictionary) {
      const { synonyms } = nameDictionary[type];
      if (synonyms.some(s => userMessage.includes(s))) {
        detectedProductType = type;
        break;
      }
    }

    // 3️⃣ Get m5azn best-selling link
    const m5aznData = m5aznLinks[detectedConcern];

    res.json({
      concern: detectedConcern,
      label: m5aznData.label,
      bestSellingUrl: m5aznData.bestSellingUrl,
      suggestedProductTypes: detectedProductType
        ? [detectedProductType]
        : m5aznData.suggestedProductTypes
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
