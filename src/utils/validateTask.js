
const allowedStatuses = ["pending", "in-progress", "completed"];

function validateTask(data, isUpdate = false) {
  const errors = [];

  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return ["Request body must be a JSON object"];
  }

  if (!isUpdate || data.title !== undefined) {
    if (
      typeof data.title !== "string" ||
      data.title.trim().length === 0
    ) {
      errors.push("Title is required and must be a non-empty string");
    }
  }

  if (data.description !== undefined &&
      typeof data.description !== "string") {
    errors.push("Description must be a string");
  }

  if (data.status !== undefined &&
      !allowedStatuses.includes(data.status)) {
    errors.push(
      "Status must be pending, in-progress, or completed"
    );
  }

  return errors;
}

module.exports = validateTask;
