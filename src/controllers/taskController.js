
const { randomUUID } = require("node:crypto");
const validateTask = require("../utils/validateTask");

// Temporary in-memory storage
const tasks = [];

function createTask(req, res, next) {
  try {
    const errors = validateTask(req.body);

    if (errors.length) {
      return res.status(400).json({ errors });
    }

    const task = {
      id: randomUUID(),
      title: req.body.title.trim(),
      description: req.body.description || "",
      status: req.body.status || "pending",
      createdAt: new Date().toISOString(),
    };

    tasks.push(task);

    return res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    next(error);
  }
}

function getAllTasks(req, res) {
  res.status(200).json({
    count: tasks.length,
    tasks,
  });
}

function getTaskById(req, res) {
  const task = tasks.find((item) => item.id === req.params.id);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  return res.status(200).json({ task });
}

function updateTask(req, res, next) {
  try {
    const task = tasks.find((item) => item.id === req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const errors = validateTask(req.body, true);

    if (errors.length) {
      return res.status(400).json({ errors });
    }

    const allowedFields = ["title", "description", "status"];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        task[field] =
          field === "title" ? req.body[field].trim() : req.body[field];
      }
    }

    return res.status(200).json({
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    next(error);
  }
}

function deleteTask(req, res) {
  const index = tasks.findIndex(
    (item) => item.id === req.params.id
  );

  if (index === -1) {
    return res.status(404).json({ message: "Task not found" });
  }

  tasks.splice(index, 1);

  return res.status(200).json({
    message: "Task deleted successfully",
  });
}

module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
};
