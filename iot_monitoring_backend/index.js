const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Sample data
const devices = [
  { id: 1, name: "Device 1", status: "Online" },
  { id: 2, name: "Device 2", status: "Offline" },
];

// Routes
app.get("/api/devices", (req, res) => {
  res.json(devices);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
