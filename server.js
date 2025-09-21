import express from "express";
import { google } from "googleapis";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const auth = new google.auth.GoogleAuth({
  keyFile: "service-account.json", // file key bạn đã tải về
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

const SPREADSHEET_ID = "13xmBj2DCv2n9ys_8jLYip23Q0Kl5TmspbT-4aDJQjjE"; // thay bằng ID thật

// API login check theo sheet "Users"
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: "Users!A2:C", // Username, Password, Email
    });

    const rows = response.data.values || [];
    const user = rows.find(
      (row) => row[0] === username && row[1] === password
    );

    if (user) {
      res.json({ success: true, email: user[2] });
    } else {
      res.status(401).json({ success: false, message: "Sai tài khoản/mật khẩu" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// test endpoint
app.get("/", (req, res) => {
  res.send("API đang chạy ngon!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server chạy cổng ${PORT}`));
