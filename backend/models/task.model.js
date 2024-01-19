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
    userID: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["personal", "work", "shopping"],
      default: "personal",
    },
    user: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const TaskModel = mongoose.model("task", taskSchema);

module.exports = {
  TaskModel,
};
