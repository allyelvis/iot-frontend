"use strict";
const r = require("express"),
  i = require("mqtt"),
  u = require("body-parser"),
  s = require("mongoose"),
  m = require("path"),
  e = r();
e.use(u.json());
s.connect("mongodb://localhost/iot-surveillance", {
  useNewUrlParser: !0,
  useUnifiedTopology: !0,
});
const l = new s.Schema({
    deviceId: String,
    temperature: Number,
    humidity: Number,
    timestamp: { type: Date, default: Date.now },
  }),
  a = s.model("SensorData", l),
  n = i.connect("mqtt://broker.hivemq.com");
n.on("connect", () => {
  console.log("Connected to MQTT Broker"), n.subscribe("iot/sensor");
});
n.on("message", (c, t) => {
  const o = JSON.parse(t.toString());
  new a(o).save().then(() => console.log("Data saved to DB"));
});
e.get("/data", async (c, t) => {
  const o = await a.find().sort({ timestamp: -1 }).limit(10);
  t.json(o);
});
e.use(r.static(m.join(__dirname, "public")));
e.listen(3e3, () => {
  console.log("Server running on port 3000");
});
