const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Cho phép đọc file tĩnh (index.html, script.js...)
app.use(express.static(path.join(__dirname)));

// Route gốc "/"
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Route login (demo)
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Tạm check cứng, sau này bạn thay bằng DB hoặc Google Sheet
  if (username === "admin" && password === "123456") {
    res.json({ success: true, message: "Đăng nhập thành công" });
  } else {
    res.json({ success: false, message: "Sai tài khoản hoặc mật khẩu" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
