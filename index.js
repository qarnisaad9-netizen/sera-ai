import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();

// Render يعطيك البورت في المتغيّر PORT
const PORT = process.env.PORT || 3000;

// إعدادات عامة
app.use(cors());
app.use(express.json());

// مبدئياً خليه بدون مفتاح OpenAI عشان نختبر فقط
// بعدين نضيف الذكاء هنا

// مسار التجربة: http://...onrender.com/
app.get("/", (req, res) => {
  res.send("✅ SERA AI backend is running");
});

// (اختياري) مسار دردشة نفعّله لاحقاً
// app.post("/chat", async (req, res) => {
//   try {
//     const { message } = req.body;
//     if (!message) {
//       return res.status(400).json({ error: "message is required" });
//     }
//
//     // هنا بنحط كود OpenAI لاحقاً
//
//     res.json({ reply: "Test reply from SERA AI backend" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Server error" });
//   }
// });

app.listen(PORT, () => {
  console.log(`🚀 Server is listening on port ${PORT}`);
}); 
