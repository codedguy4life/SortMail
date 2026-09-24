const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const emailAccountRoutes = require("./routes/emailAccountRoutes");
const senderRoutes = require("./routes/senderRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/email-accounts", emailAccountRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/senders", senderRoutes);

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "SortMail backend is running",
  });
});

module.exports = app;
