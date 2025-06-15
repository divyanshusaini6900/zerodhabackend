require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const { HoldingsModel } = require("./model/HoldingsModel");
const { PositionsModel } = require("./model/PositionsModel");
const { OrdersModel } = require("./model/OrdersModel");

const PORT = process.env.PORT || 3002;
const uri = process.env.MONGO_URL;

const app = express();

// Middlewares
app.use(cors({
  origin: "https://symphonious-raindrop-4e76bc.netlify.app/", // Or use "https://your-frontend.netlify.app" in production
}));
app.use(bodyParser.json());

// API Endpoints
app.get("/addPositions", async (req, res) => {
  let tempPositions = [
    {
      product: "CNC",
      name: "EVEREADY",
      qty: 2,
      avg: 316.27,
      price: 312.35,
      net: "+0.58%",
      day: "-1.24%",
      isLoss: true,
    },
    {
      product: "CNC",
      name: "JUBLFOOD",
      qty: 1,
      avg: 3124.75,
      price: 3082.65,
      net: "+10.04%",
      day: "-1.35%",
      isLoss: true,
    },
  ];

  for (const item of tempPositions) {
    await new PositionsModel(item).save();
  }

  res.send("Positions added!");
});

app.get("/allHoldings", async (req, res) => {
  const all = await HoldingsModel.find({});
  res.json(all);
});

app.get("/allPositions", async (req, res) => {
  const all = await PositionsModel.find({});
  res.json(all);
});

app.post("/newOrder", async (req, res) => {
  const newOrder = new OrdersModel(req.body);
  await newOrder.save();
  res.send("Order saved!");
});

// Start server & connect DB
app.listen(PORT, async () => {
  try {
    await mongoose.connect(uri);
    console.log("MongoDB connected");
    console.log(`Server running on port ${PORT}`);
  } catch (err) {
    console.error("DB connection error", err);
  }
});
