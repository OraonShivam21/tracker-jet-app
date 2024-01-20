const express = require("express");
const connection = require("./connection");
const {taskRoute} = require("./routes/task.route");
require("dotenv").config();
const {userRouter} = require("./routes/user.route")
const {feedbackRoute} = require("./routes/feedback.route")
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use("/user",userRouter);

app.use("/tasks", taskRoute);
app.use("/feedback",feedbackRoute)

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to TrackerJet API" });
});

app.listen(port, async () => {
  try {
    await connection;
    console.log("connected to db");
    console.log("listening on port", port);
  } catch (error) {
    console.error(error);
  }
});
