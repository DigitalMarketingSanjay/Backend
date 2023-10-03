const express = require("express");
const cors = require("cors");
const router = require("./router");
const connectDB = require("./connectDB");
const Error = require("./utils/Error");
const mongoose = require("mongoose");

require("dotenv").config();
connectDB();
const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors({ origin: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//all routes
app.use("/api", router);

//if no route is found
app.use((req, res, next) => {
  const error = new Error("Could not find the route ", 404);
  return next(error);
});

app.get("/", (req, res) => {
  res.send("Server Running...");
})

//error handling..........
app.use((error, req, res, next) => {
  res
    .status(error.code || 500)
    .json({ message: error.message, status: error.code });
});

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () =>
    console.log(`Server running on port ${PORT}`)
  );
});
