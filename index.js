import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());


// Test Route
app.get("/", (req, res) => {
  res.send("SERA AI backend is running");
});

// Ask Route
app.post("/ask", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage || userMessage.trim().length === 0) {
      return res.status(400).json({
        reply: "الرسالة المطلوبة فارغة.",
      });
    }

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "أجب بطريقة واضحة وسهلة الفهم.",
        },
        {
          role: "user",
          content: userMessage,
        },
      ],
    });

    res.json({ reply: completion.choices[0].message.content });
  } catch (error) {
    console.error("Error in /ask:", error);
    res.status(500).json({
      reply: "حدث خطأ في الخادم.",
    });
  }
});

// Server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`SERA AI backend running on port ${PORT}`);
});