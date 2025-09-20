const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { google } = require("googleapis");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Lấy biến môi trường từ Render
const SHEET_ID = process.env.SHEET_ID;
const GOOGLE_CREDENTIALS = JSON.parse(process.env.GOOGLE_CREDENTIALS);

// Setup Google Auth
const auth = new google.auth.GoogleAuth({
  credentials: GOOGLE_CREDENTIALS,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});
const sheets = google.sheets({ version: "v4", auth });

// API test
app.get("/", (req, res) => {
  res.send("✅ Backend chạy OK trên Render!");
});

// API thêm dữ liệu
app.post("/add", async (req, res) => {
  try {
    const { name, phone, service, price, ktv, off, overtime, bonus, tour, email } = req.body;
    const now = new Date().toLocaleString("vi-VN");

    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: "Sheet1!A:K",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[now, name, phone, service, price, ktv, off, overtime, bonus, tour, email]],
      },
    });

    res.json({ status: "ok" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API lấy dữ liệu theo email
app.get("/data/:email", async (req, res) => {
  try {
    const email = req.params.email;

    const result = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: "Sheet1!A:K",
    });

    const rows = result.data.values || [];
    const filtered = rows.filter((row) => row[10] === email); // cột 11 là Email
    res.json(filtered);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
