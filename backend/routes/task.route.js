const express = require("express");
const Task = require("../models/task.model");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find();
    if (tasks.length === 0) throw "Please create some tasks first";
    res.status(200).json({ tasks });
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.post("/add", async (req, res) => {
  const payload = req.body;
  try {
    const task = new Task(payload);
    await task.save();
    res.status(201).json({ message: "New task has been created" });
  } catch (error) {
    res.status(400).json({ error });
  }
});

module.exports = router;
