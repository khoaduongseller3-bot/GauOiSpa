const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { google } = require("googleapis");

const app = express();

// ✅ Cho phép frontend GitHub Pages gọi API
app.use(
  cors({
    origin: "https://khoaduongseller3-bot.github.io", // domain GitHub Pages của bạn
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(bodyParser.json());

// ====== CONFIG GOOGLE SHEETS ======
const SHEET_ID = process.env.SHEET_ID;
const GOOGLE_CREDENTIALS = JSON.parse(process.env.GOOGLE_CREDENTIALS);

const auth = new google.auth.GoogleAuth({
  credentials: GOOGLE_CREDENTIALS,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});
const sheets = google.sheets({ version: "v4", auth });

// ====== API TEST ======
app.get("/", (req, res) => {
  res.send("✅ Backend chạy OK trên Render!");
});

// ====== LOGIN API ======
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Bạn có thể đổi username/password ở đây
  if (username === "admin" && password === "123456") {
    res.json({ status: "ok", message: "Đăng nhập thành công" });
  } else {
    res.status(401).json({ status: "error", message: "Sai tài khoản/mật khẩu" });
  }
});

// ====== API THÊM DỮ LIỆU ======
app.post("/add", async (req, res) => {
  try {
    const {
      name,
      phone,
      service,
      price,
      ktv,
      off,
      overtime,
      bonus,
      tour,
      email,
    } = req.body;

    const now = new Date().toLocaleString("vi-VN");

    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: "Sheet1!A:K",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [
          [now, name, phone, service, price, ktv, off, overtime, bonus, tour, email],
        ],
      },
    });

    res.json({ status: "ok", message: "Lưu dữ liệu thành công" });
  } catch (err) {
    console.error("❌ Lỗi add data:", err.message);
    res.status(500).json({ status: "error", message: err.message });
  }
});

// ====== API LẤY DỮ LIỆU THEO EMAIL ======
app.get("/data/:email", async (req, res) => {
  try {
    const email = req.params.email;

    const result = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: "Sheet1!A:K",
    });

    const rows = result.data.values || [];
    const filtered = rows.filter((row) => row[10] === email); // cột K = Email
    res.json(filtered);
  } catch (err) {
    console.error("❌ Lỗi get data:", err.message);
    res.status(500).json({ status: "error", message: err.message });
  }
});

// ====== RUN SERVER ======
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
