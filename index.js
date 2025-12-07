import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json());

// OpenAI Client
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Test Route
app.get("/", (req, res) => {
  res.send("SERA AI backend is running!");
});

// Ask Route
app.post("/ask", async (req, res) => {
  try {
    const userMessage = req.body.message;

    // Validate input
    if (!userMessage || userMessage.trim() === "") {
      return res.status(400).json({ reply: "الرجاء كتابة رسالة صحيحة." });
    }

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "أنت مساعد ذكي متخصص في العناية بالبشرة والشعر. ردودك تكون متناسقة وواضحة وسهلة الفهم.",
        },
        { role: "user", content: userMessage },
      ],
    });

    res.json({ reply: completion.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ reply: "خطأ غير متوقع." });
  }
});

// Server
app.listen(10000, () => console.log("SERA AI backend running on port 10000"));