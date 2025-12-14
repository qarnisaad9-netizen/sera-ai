// ===============================
//      SERA AI BACKEND (CLEAN)
// ===============================

import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

// ===============================
//        HOME ROUTE
// ===============================
app.get("/", (req, res) => {
  res.send("SERA AI Backend is Running ✅");
});

// ===============================
//        HEALTH CHECK
// ===============================
app.get("/health", (req, res) => {
  res.json({
    ok: true,
    status: "healthy",
    time: new Date().toISOString(),
  });
});

// ===============================
//        TEST ROUTE
// ===============================
app.get("/test", (req, res) => {
  res.json({
    ok: true,
    message: "Test route works 🚀",
  });
});

// ===============================
//        START SERVER
// ===============================
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});