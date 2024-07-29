const express = require("express");
const mqtt = require("mqtt");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect("mongodb://localhost/iot-surveillance", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Schema and Model
const SensorDataSchema = new mongoose.Schema({
  deviceId: String,
  temperature: Number,
  humidity: Number,
  timestamp: { type: Date, default: Date.now },
});

const SensorData = mongoose.model("SensorData", SensorDataSchema);

// MQTT Client
const client = mqtt.connect("mqtt://broker.hivemq.com");

client.on("connect", () => {
  console.log("Connected to MQTT Broker");
  client.subscribe("iot/sensor");
});

client.on("message", (topic, message) => {
  const data = JSON.parse(message.toString());
  const sensorData = new SensorData(data);
  sensorData.save().then(() => console.log("Data saved to DB"));
});

// Express Routes
app.get("/data", async (req, res) => {
  const data = await SensorData.find().sort({ timestamp: -1 }).limit(10);
  res.json(data);
});

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
