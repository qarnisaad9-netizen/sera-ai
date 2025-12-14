import express from "express";
import cors from "cors";
import fetch from "node-fetch";

import { skinConcerns } from "./config/skinConcerns.js";
import { nameDictionary } from "./config/nameDictionary.js";

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
// SUGGEST PRODUCTS (LOGIC ONLY)
// ===============================
app.post("/suggest", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.status(400).json({ error: "Message is required" });
    }

    // 1️⃣ Detect skin concern
    let detectedConcern = null;

    for (const key in skinConcerns) {
      const { keywords } = skinConcerns[key];
      if (keywords.some(k => userMessage.toLowerCase().includes(k))) {
        detectedConcern = key;
        break;
      }
    }

    // 2️⃣ Detect product type
    let detectedProductType = null;

    for (const type in nameDictionary) {
      const { synonyms } = nameDictionary[type];
      if (synonyms.some(s => userMessage.toLowerCase().includes(s))) {
        detectedProductType = type;
        break;
      }
    }

    res.json({
      detectedConcern,
      detectedProductType
    });

  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// ===============================
app.listen(PORT, () => {
  console.log(`SERA AI running on port ${PORT}`);
});
