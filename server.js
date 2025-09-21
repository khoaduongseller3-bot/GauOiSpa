import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

const SHEET_ID = "13xmBj2DCv2n9ys_8jLYip23Q0Kl5TmspbT-4aDJQijE"; // Google Sheet ID
const API_KEY = "AIzaSyDb5e-iUghYrRxN1-8IFx5b0oYgJ1xPrQo"; // API Key

// Lấy danh sách user từ sheet "Users"
app.get("/users", async (req, res) => {
  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Users?key=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi lấy dữ liệu Users" });
  }
});

// Lưu dữ liệu vào sheet "Sheet1"
app.post("/add", async (req, res) => {
  try {
    const values = [
      [
        req.body.name,
        req.body.phone,
        req.body.service,
        req.body.amount,
        req.body.staff,
        req.body.shift,
        req.body.note,
        req.body.commission,
        req.body.tour,
        req.body.email,
      ],
    ];

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Sheet1!A1:append?valueInputOption=USER_ENTERED&key=${API_KEY}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ values }),
    });

    const result = await response.json();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi ghi dữ liệu" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
