const express = require("express");
const { FeedbackModel } = require("../models/feedback.model");
const { auth } = require("../middlewares/auth.middleware");

const feedbackRoute = express.Router();

feedbackRoute.get("/", async (req, res) => {
  const page = req.query.page || 1;
  const limit = 10;
  const skip = page * limit - limit;
  try {
    const feedbacks = await FeedbackModel.find().sort({ updatedAt: -1 }).skip(skip).limit(limit);
    res.header("X-Total-Count", await FeedbackModel.countDocuments());
    if (feedbacks.length === 0) {
      res.json({ msg: "No feedback found" });
      console.log("No feedback");
    }
    res.status(200).json({ feedbacks });
  } catch (error) {
    res.status(400).json({ error });
  }
});

feedbackRoute.post("/add", auth, async (req, res) => {
  const payload = req.body;
  try {
    const feedback = new FeedbackModel(payload);
    await feedback.save();
    res.status(201).json({ msg: "Your feedback has been created" });
  } catch (error) {
    res.status(400).json({ error });
  }
});

module.exports = {
  feedbackRoute,
};
