const express = require("express");
const cors = require("cors");
const router = require("./router");
const db = require("./db");
const Error = require("./utils/Error");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//all routes
app.use("/api", router);

//if no route is found
app.use((req, res, next) => {
  const error = new Error("Could not find the route ", 404);
  return next(error);
});

//error handling..........
app.use((error, req, res, next) => {
  res
    .status(error.code || 500)
    .json({ message: error.message, status: error.code });
});

app.listen(PORT, async () => {
  console.log(`server up on port ${PORT}`);
  await db();
});
