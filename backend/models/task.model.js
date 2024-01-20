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
    category: {
      type: String,
      enum: ["personal", "work", "assignment"],
      default: "personal",
    },
    userID: {
      type: String,
      required: true,
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
