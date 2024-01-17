const express = require("express");
const { getTasks, addTask } = require("../controllers/task.controller");

const router = express.Router();

router.get("/", getTasks);

router.post("/add", addTask);

module.exports = router;
