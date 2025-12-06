const express = require("express");
const cors = require("cors");
require("dotenv").config();
const OpenAI = require("openai");

// إعداد التطبيق
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// التأكد من وجود مفتاح OpenAI
if (!process.env.OPENAI_API_KEY) {
  console.warn("⚠️ OPENAI_API_KEY is not set. AI routes will not work.");
}

// عميل OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// مسار افتراضي للتأكد أن السيرفر شغال
app.get("/", (req, res) => {
  res.send("SERA AI backend is running ✅");
});

// مسار /ping للفحص السريع
app.get("/ping", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/ask", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "message is required" });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: "OPENAI_API_KEY is not configured" });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are SERA AI, an expert skincare and beauty assistant. Respond in Arabic unless the user writes in English.",
        },
        { role: "user", content: message }
      ]
    });

    const reply = completion.choices[0].message.content;

    res.json({ reply });
  } catch (error) {
    console.error("Error in /ask:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
// تشغيل السيرفر
app.listen(PORT, () => {
  console.log(`SERA AI backend listening on port ${PORT}`);
});
