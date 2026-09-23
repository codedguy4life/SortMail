require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDatabase = require("./config/database");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "SortMail backend is running",
  });
});

const PORT = process.env.PORT || 5000;

connectDatabase();

app.listen(PORT, () => {
  console.log(`SortMail backend running on port ${PORT}`);
});
