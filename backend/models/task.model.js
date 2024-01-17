const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    subtasks: {
      type: [String],
    },
    createdAt: {
      type: Date,
      required: true,
    },
    userID: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

const Task = mongoose.model("task", taskSchema);

module.exports = Task;
