import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// API login demo
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "admin" && password === "123456") {
    return res.json({ success: true, message: "Đăng nhập thành công" });
  } else {
    return res.json({ success: false, message: "Sai tài khoản hoặc mật khẩu" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
