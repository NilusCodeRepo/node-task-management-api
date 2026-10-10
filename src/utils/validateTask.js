
const allowedStatuses = ["pending", "in-progress", "completed"];

const allowedFields = ["title", "description", "status"];

function validateTask(data, isUpdate = false) {
  const errors = [];

  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return ["Request body must be a JSON object"];
  }

  // Reject fields that the API does not support.
  const unknownFields = Object.keys(data).filter(
    (field) => !allowedFields.includes(field)
  );

  if (unknownFields.length > 0) {
    errors.push(
      `Unsupported field(s): ${unknownFields.join(", ")}`
    );
  }

  if (!isUpdate || data.title !== undefined) {
    if (
      typeof data.title !== "string" ||
      data.title.trim().length === 0
    ) {
      errors.push("Title is required and must be a non-empty string");
    } else if (data.title.trim().length > 100) {
      errors.push("Title must not exceed 100 characters");
    }
  }

  if (data.description !== undefined) {
    if (typeof data.description !== "string") {
      errors.push("Description must be a string");
    } else if (data.description.length > 1000) {
      errors.push("Description must not exceed 1000 characters");
    }
  }

  if (
    data.status !== undefined &&
    !allowedStatuses.includes(data.status)
  ) {
    errors.push(
      "Status must be pending, in-progress, or completed"
    );
  }

  return errors;
}

module.exports = validateTask;
