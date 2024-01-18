const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
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
  }
);

const FeedbackModel = mongoose.model("feedback", feedbackSchema);

module.exports = {
  FeedbackModel,
};
