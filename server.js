const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(express.static("public")); // ให้เสิร์ฟไฟล์ใน public/

let lockers = []; // จำลองฐานข้อมูลใน memory

// ดูล็อกเกอร์ทั้งหมด
app.get("/api/lockers", (req, res) => {
  res.json(lockers);
});

// เพิ่มล็อกเกอร์ใหม่
app.post("/api/lockers", (req, res) => {
  const { password } = req.body;
  const newLocker = {
    id: Date.now(),
    password,
    files: [],
    locked: true
  };
  lockers.push(newLocker);
  res.json(newLocker);
});

// เปิดล็อกเกอร์
app.post("/api/open", (req, res) => {
  const { id, password } = req.body;
  const locker = lockers.find(l => l.id === id);
  if (!locker) return res.status(404).send("Not found");

  if (!locker.locked || locker.password === password) {
    locker.locked = false;
    res.json({ success: true, files: locker.files });
  } else {
    res.json({ success: false, message: "Wrong password" });
  }
});

// ใส่ไฟล์ (ใช้ลิงก์ URL)
app.post("/api/addFile", (req, res) => {
  const { id, fileUrl } = req.body;
  const locker = lockers.find(l => l.id === id);
  if (!locker) return res.status(404).send("Not found");

  if (!locker.locked) {
    locker.files.push(fileUrl);
    res.json({ success: true, files: locker.files });
  } else {
    res.json({ success: false, message: "Locker is locked" });
  }
});

// สำหรับ deploy บน host (เช่น Render, Railway ใช้ process.env.PORT)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
