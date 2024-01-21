const express = require("express");
const { auth } = require("../middlewares/auth.middleware");
const { TaskModel } = require("../models/task.model");

const taskRoute = express.Router();

taskRoute.use(auth);

taskRoute.get("/", async (req, res) => {
  const category = req.query.category || null;
  try {
    const tasks = category
      ? await TaskModel.find({ userID: req.body.userID, category })
      : await TaskModel.find({ userID: req.body.userID });
    if (tasks.length === 0) throw "Please create some tasks first";
    res.status(200).json({ tasks });
  } catch (error) {
    res.status(400).json({ error: "some error" });
  }
});

taskRoute.post("/add", async (req, res) => {
  const payload = req.body;
  if (req.query.category) payload.category = req.query.category;
  try {
    const task = new TaskModel(payload);
    await task.save();
    res.status(201).json({ msg: "New task has been created" });
  } catch (error) {
    res.status(400).json({ error });
  }
});

taskRoute.patch("/update/:taskID", async (req, res) => {
  const payload = req.body;
  try {
    const taskFound = await TaskModel.findOne({ _id: req.params.taskID });
    console.log(taskFound);
    console.log(payload.userID, taskFound.userID);
    if (payload.userID !== taskFound.userID)
      throw "Unauthorized: You're not authorized to change this task.";
    let status = taskFound.status;
    if (status) taskFound.status = false;
    else taskFound.status = true;
    await TaskModel.findByIdAndUpdate(req.params.taskID, taskFound);
    res.status(201).json({ msg: "The task has been updated successfully" });
  } catch (error) {
    res.status(400).json({ error });
  }
});

taskRoute.delete("/update/:taskID", async (req, res) => {
  try {
    if (req.body.userID !== req.params.taskID)
      throw "Unauthorized: You're not authorized to delete this task.";
    await TaskModel.findByIdAndUpdate(req.params.taskID, payload);
    res.status(201).json({ msg: "The task has been updated successfully" });
  } catch (error) {
    res.status(400).json({ error });
  }
});

module.exports = {
  taskRoute,
};
