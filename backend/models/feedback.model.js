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
    rating: {
      type: Number,
      enum: [1, 2, 3, 4, 5],
      default: 4,
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

const FeedbackModel = mongoose.model("feedback", feedbackSchema);

module.exports = {
  FeedbackModel,
};
