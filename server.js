const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { google } = require("googleapis");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const SHEET_ID = process.env.SHEET_ID;
const GOOGLE_CREDENTIALS = JSON.parse(process.env.GOOGLE_CREDENTIALS);

const auth = new google.auth.GoogleAuth({
  credentials: GOOGLE_CREDENTIALS,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});
const sheets = google.sheets({ version: "v4", auth });

// API test
app.get("/", (req, res) => {
  res.send("✅ Backend chạy OK trên Render!");
});

// 📌 API login (check từ sheet Users)
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Đọc sheet Users
    const result = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: "Users!A:C", // cột A=username, B=password, C=email
    });

    const rows = result.data.values || [];
    const user = rows.find(row => row[0] === username && row[1] === password);

    if (!user) return res.status(401).json({ error: "Sai username hoặc password" });

    res.json({ email: user[2] }); // trả email
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📌 API thêm dữ liệu
app.post("/add", async (req, res) => {
  try {
    const { name, phone, service, price, off, overtime, commission, tour, email } = req.body;
    const now = new Date().toLocaleString("vi-VN");

    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: "Sheet1!A:K",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[
          now, name, phone, service, price,
          email, off, overtime, commission, tour, email
        ]],
      },
    });

    res.json({ status: "ok" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📌 API lấy dữ liệu theo email
app.get("/data/:email", async (req, res) => {
  try {
    const email = req.params.email;

    const result = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: "Sheet1!A:K",
    });

    const rows = result.data.values || [];
    const filtered = rows.filter((row) => row[10] === email);
    res.json(filtered);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
